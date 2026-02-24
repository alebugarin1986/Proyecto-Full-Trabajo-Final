const nodemailer = require('nodemailer');

let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;

  // Si existen credenciales reales en el .env, las usamos
  if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
    const isGmail = process.env.EMAIL_HOST?.includes('gmail');
    
    const config = isGmail ? {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
    } : {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
    };

    transporter = nodemailer.createTransport(config);
    return transporter;
  } else {
    // FORMA PRÁCTICA: Si no hay cuenta configurada, creamos una de prueba en Ethereal automáticamente
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 MODO DE PRUEBA: Usando cuenta temporal de Ethereal:', testAccount.user);
    return transporter;
  }
};

const verifyConnection = async () => {
  try {
    const transport = await createTransporter();
    await transport.verify();
    console.log('✅ Conexión SMTP verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión SMTP:', error.message);
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      console.warn('⚠️  CONSEJO: Verifica que tu EMAIL_PASS sea una "Contraseña de Aplicación" si usas Gmail.');
    }
    return false;
  }
};

const sendEmail = async (options) => {
  const transport = await createTransporter();

  const mailOptions = {
    from: `"Bookstore" <${process.env.EMAIL_USER || 'no-reply@bookstore.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transport.sendMail(mailOptions);
  
  if (nodemailer.getTestMessageUrl(info)) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📩 EMAIL DE VERIFICACIÓN ENVIADO (PRUEBA)');
    console.log('URL para ver el email:', nodemailer.getTestMessageUrl(info));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
};

module.exports = { sendEmail, verifyConnection };
