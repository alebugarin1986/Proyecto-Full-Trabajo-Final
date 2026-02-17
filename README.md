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
