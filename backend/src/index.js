const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { verifyConnection } = require('./utils/email');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();
verifyConnection();

// Middleware
// Middleware de Seguridad
app.use(helmet()); 
app.use(cookieParser()); // Para leer cookies HttpOnly

// Configuración de CORS para permitir cookies del frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Limitación de peticiones (Rate Limiting) - Deshabilitado en producción (Vercel) por compatibilidad de cabeceras
if (process.env.NODE_ENV !== 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 peticiones por ventana (windowMs)
    message: {
      status: 429,
      message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}


app.use(express.json());

// Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/categories', require('./routes/CategoryRoutes'));
app.use('/api/books', require('./routes/BookRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Bookstore API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;

