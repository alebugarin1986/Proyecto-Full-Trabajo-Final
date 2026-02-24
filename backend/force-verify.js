const mongoose = require('mongoose');
require('dotenv').config();

const verifyAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({ isVerified: Boolean }));
    const result = await User.updateMany({}, { isVerified: true, verificationToken: null });
    console.log(`✅ ¡Éxito! Se han verificado ${result.modifiedCount} usuarios.`);
    console.log('Ahora ya puedes iniciar sesión en la aplicación.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyAll();
