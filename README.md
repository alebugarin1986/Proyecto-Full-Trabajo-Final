# Proyecto Final Full Stack - Bookstore

¡Bienvenido a **Bookstore**! Este es un proyecto integrador que consiste en una aplicación de catálogo de libros con un backend robusto en Node.js/Express y un frontend dinámico en React (Vite).

## Estructura del Proyecto

El repositorio está dividido en dos partes principales:

- **`/backend`**: Servidor API REST con arquitectura en capas.
- **`/frontend`**: Aplicación web SPA moderna.

## Características Principales

1.  **CRUD Real**: Gestión completa de libros y sus categorías.
2.  **Arquitectura en Capas**:
    - Routes -> Controllers -> Services -> Repositories.
3.  **Seguridad**:
    - Hashing de contraseñas con Bcrypt.
    - Autenticación persistente con JWT (Bearer Token).
4.  **Verificación por Email**: Registro de usuarios con envío de token de activación vía Nodemailer.
5.  **Relaciones de Datos**: Libros relacionados con categorías y usuarios (usando `ref` y `populate` de Mongoose).
6.  **UI Premium**: Diseño responsivo y moderno con Glassmorphism.

## Seguridad Incorporada 🛡️

Para garantizar la integridad de los datos y la protección contra ataques comunes, se han implementado las siguientes medidas:

- **Helmet.js**: Configuración automática de cabeceras HTTP seguras para proteger contra ataques como XSS, Clickjacking y Sniffing de MIME.
- **Express Rate Limit**: Protección contra ataques de fuerza bruta y denegación de servicio (DoS) limitando el número de peticiones por IP (máximo 100 peticiones cada 15 minutos).
- **Hashing con Bcrypt**: Las contraseñas nunca se almacenan en texto plano; se utiliza un algoritmo de hashing fuerte con salting.
- **JWT (JSON Web Tokens) en Cookies HttpOnly**: Autenticación segura donde el token no es accesible mediante JavaScript (previniendo ataques XSS), almacenado en cookies cifradas y de solo lectura por el servidor.
- **Verificación de Email**: Asegura que el usuario tenga acceso real al correo proporcionado antes de activar su cuenta.
- **Recuperación de Contraseña**: Flujo seguro de restablecimiento de contraseña mediante tokens temporales enviados por correo electrónico.
- **Validación de Datos**: Uso de `express-validator` para sanear y validar todas las entradas del middleware antes de llegar a la base de datos.

## Cómo empezar

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd LibroHub
```

### 2. Configurar el Backend

Sigue las instrucciones detalladas en [backend/README.md](./backend/README.md).

### 3. Configurar el Frontend

Sigue las instrucciones detalladas en [frontend/README.md](./frontend/README.md).

## Documentación de la API

Puedes importar el archivo `postman_collection.json` incluido en la raíz de este proyecto en tu Postman para probar todos los endpoints disponibles.

---

**Autor:** Alejandro
**Institución:** Diplo. Full Stack
