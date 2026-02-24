const axios = require('axios');

const API_URL = 'http://localhost:5001/api/users';

const testCases = [
  {
    name: '❌ Contraseña corta (menos de 8 caracteres)',
    data: {
      name: 'Test User',
      email: 'test_short@example.com',
      password: 'Ab1!',
      confirmPassword: 'Ab1!'
    },
    expectedError: 'La contraseña debe tener al menos 8 caracteres'
  },
  {
    name: '❌ Sin mayúscula',
    data: {
      name: 'Test User',
      email: 'test_noupper@example.com',
      password: 'password123!',
      confirmPassword: 'password123!'
    },
    expectedError: 'La contraseña debe tener al menos una letra mayúscula'
  },
  {
    name: '❌ Sin símbolo',
    data: {
      name: 'Test User',
      email: 'test_nosymbol@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    },
    expectedError: 'La contraseña debe tener al menos un símbolo'
  },
  {
    name: '❌ Contraseñas no coinciden',
    data: {
      name: 'Test User',
      email: 'test_mismatch@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123?'
    },
    expectedError: 'Las contraseñas no coinciden'
  },
  {
    name: '✅ Registro Válido (Simulado)',
    data: {
      name: 'Test User',
      email: `test_valid_${Date.now()}@example.com`,
      password: 'Password2026!',
      confirmPassword: 'Password2026!'
    },
    expectedSuccess: true
  }
];

async function runTests() {
  console.log('🚀 Iniciando Pruebas Automatizadas de Validación de Contraseña...\n');
  
  for (const test of testCases) {
    try {
      const response = await axios.post(`${API_URL}/register`, test.data);
      if (test.expectedSuccess) {
        console.log(`✅ PASÓ: ${test.name}`);
      } else {
        console.log(`❌ FALLÓ: ${test.name} (Se esperaba un error pero la petición tuvo éxito)`);
      }
    } catch (error) {
      const serverMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message;
      
      if (test.expectedError && serverMsg === test.expectedError) {
        console.log(`✅ PASÓ: ${test.name} -> Error correcto: "${serverMsg}"`);
      } else if (test.expectedError) {
        console.log(`❌ FALLÓ: ${test.name} -> Se esperaba "${test.expectedError}" pero se recibió "${serverMsg}"`);
      } else {
        console.log(`❌ FALLÓ: ${test.name} -> Error inesperado: ${serverMsg}`);
      }
    }
  }
  console.log('\n✨ Pruebas finalizadas.');
}

runTests();
