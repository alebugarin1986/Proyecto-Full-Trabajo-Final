const UserService = require('../services/UserService');

const UserController = {
  register: async (req, res, next) => {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({
        message: user.message || 'Usuario registrado. Por favor, revisa tu email para verificar tu cuenta.',
        userId: user._id,
        emailError: user.emailError
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await UserService.login(email, password);
      
      // Establecer cookie HttpOnly
      res.cookie('token', data.token, {
        httpOnly: true,
        secure: true, // Siempre true en producción para permitir sameSite: 'none'
        sameSite: 'none', // Permite envío de cookies entre diferentes dominios (Vercel)
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
      });


      // Enviamos todos los datos excepto el token, ya que ahora va en la cookie
      const { token, ...userWithoutToken } = data;
      res.json(userWithoutToken);
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  },

  getMe: async (req, res) => {
    // req.user ya viene poblado por el middleware 'protect'
    res.json(req.user);
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      await UserService.forgotPassword(email);
      res.json({ message: 'Se ha enviado un enlace de recuperación a tu email.' });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await UserService.resetPassword(token, password);
      res.json({ message: 'Contraseña actualizada con éxito. Ya puedes iniciar sesión.' });
    } catch (error) {
      next(error);
    }
  },

  verify: async (req, res, next) => {
    try {
      const { token } = req.params;
      await UserService.verifyEmail(token);
      res.json({ message: 'Email verificado con éxito. Ya puedes iniciar sesión.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
