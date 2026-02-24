const UserRepository = require('../repositories/UserRepository');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');

class UserService {
  async register(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Si el usuario existe pero no está verificado, actualizamos su token y reenviamos (o intentamos) el email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        existingUser.verificationToken = verificationToken;
        await existingUser.save();
        
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
        
        // Logueamos siempre el enlace en la consola para máxima practicidad en desarrollo
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔗 NUEVO ENLACE DE ACTIVACIÓN PARA:', existingUser.email);
        console.log(verificationUrl);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        try {
          await sendEmail({
            email: existingUser.email,
            subject: 'Verifica tu cuenta en Bookstore',
            html: `<h1>Hola ${existingUser.name}</h1>
                   <p>Tu cuenta ya existe pero no estaba activada. Aquí tienes tu nuevo enlace:</p>
                   <p><a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar mi cuenta</a></p>
                   <br/>
                   <small>Si el botón no funciona, copia y pega este enlace: ${verificationUrl}</small>`
          });
          return { message: 'El usuario ya existía pero no estaba verificado. Se ha enviado un nuevo email.' };
        } catch (error) {
          console.error('❌ Error enviando email real:', error.message);
          return { ...existingUser._doc, emailError: true, message: 'El usuario ya existe. Revisa la consola para el link de activación.' };
        }
      }
      throw new Error('El usuario ya existe y ya está verificado.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await UserRepository.create({
      ...userData,
      verificationToken
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    
    // Logueamos siempre el enlace en la consola para máxima practicidad en desarrollo
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 ENLACE DE ACTIVACIÓN PARA:', user.email);
    console.log(verificationUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verifica tu cuenta en Bookstore',
        html: `<h1>Hola ${user.name}</h1>
               <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
               <p><a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar mi cuenta</a></p>
               <br/>
               <small>Si el botón no funciona, copia y pega este enlace: ${verificationUrl}</small>`
      });
    } catch (error) {
      console.error('❌ Error enviando email real:', error.message);
      return { ...user._doc, emailError: true };
    }

    return user;
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.isVerified) {
      throw new Error('Por favor, verifica tu correo electrónico antes de iniciar sesión');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    };
  }

  async verifyEmail(token) {
    const user = await UserRepository.findByToken(token);
    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return user;
  }

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('No existe un usuario con ese correo electrónico');
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutos)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 ENLACE DE RECUPERACIÓN PARA:', user.email);
    console.log(resetUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      await sendEmail({
        email: user.email,
        subject: 'Recuperar contraseña - Bookstore',
        html: `<h1>Solicitud de cambio de contraseña</h1>
               <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón:</p>
               <p><a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer contraseña</a></p>
               <p>Este enlace expirará en 10 minutos.</p>
               <br/>
               <small>Si no solicitaste esto, ignora este correo.</small>`
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      throw new Error('El correo electrónico no pudo ser enviado.');
    }
  }

  async resetPassword(token, newPassword) {
    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await UserRepository.findByResetToken(resetPasswordToken);

    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return user;
  }
}

module.exports = new UserService();
