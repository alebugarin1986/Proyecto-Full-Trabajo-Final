# Bookstore - Backend API

Esta es la API para el proyecto final **Bookstore**, un catálogo de libros robusto desarrollado con una arquitectura en capas (Routes -> Controllers -> Services -> Repositories).

## 🚀 Tecnologías Utilizadas

- **Node.js & Express**: Servidor y ruteo.
- **MongoDB & Mongoose**: Persistencia de datos y modelado.
- **JWT (JsonWebToken)**: Seguridad y autenticación persistente.
- **Bcryptjs**: Seguridad en contraseñas (Hashing).
- **Nodemailer**: Sistema de envío de correos para verificación de cuentas.
- **Express Validator**: Middleware para validación y sanitización de datos.
- **CORS**: Configuración de seguridad para acceso desde el cliente.

## 🛠️ Instalación y Configuración

1. **Clonar/Entrar al directorio**:
   ```bash
   cd backend
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz de `/backend`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=tu_secreto_super_seguro
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_app_password_de_google
   FRONTEND_URL=http://localhost:5174
   NODE_ENV=development
   ```

## 🏃 Ejecución

- **Desarrollo**: `npm run dev` (usa nodemon)
- **Producción**: `npm start`

---

## 📑 Documentación de Endpoints

### 1. Autenticación (`/api/users`)

| Método | Endpoint         | Descripción                                              | Requisito                     |
| :----- | :--------------- | :------------------------------------------------------- | :---------------------------- |
| `POST` | `/register`      | Registra un nuevo usuario y envía email de verificación. | Body: `name, email, password` |
| `POST` | `/login`         | Inicia sesión y devuelve el Token JWT.                   | Body: `email, password`       |
| `GET`  | `/verify/:token` | Activa la cuenta mediante el token enviado por correo.   | Token en URL                  |

### 2. Libros (`/api/books`)

| Método   | Endpoint | Descripción                                         | Requisito                                                  |
| :------- | :------- | :-------------------------------------------------- | :--------------------------------------------------------- |
| `GET`    | `/`      | Lista todos los libros con sus categorías pobladas. | Ninguno                                                    |
| `GET`    | `/:id`   | Obtiene el detalle completo de un libro.            | ID en URL                                                  |
| `POST`   | `/`      | Crea un libro. **(Protegido por JWT)**.             | Body: `title, author, category (ID), image?, description?` |
| `PUT`    | `/:id`   | Edita un libro existente. **(Solo el dueño)**.      | Body: datos a actualizar                                   |
| `DELETE` | `/:id`   | Elimina un libro. **(Solo el dueño)**.              | ID en URL                                                  |

### 3. Categorías (`/api/categories`)

| Método | Endpoint | Descripción                                | Requisito    |
| :----- | :------- | :----------------------------------------- | :----------- |
| `GET`  | `/`      | Lista todas las categorías disponibles.    | Ninguno      |
| `POST` | `/`      | Crea una nueva categoría. **(Protegido)**. | Body: `name` |

#### 💡 Nota Especial: Creación de Categorías "On-the-fly"

En la aplicación Bookstore, hemos integrado la creación de categorías dentro del flujo de creación de libros. El cliente puede detectar si se desea añadir una categoría inexistente, enviarla a `POST /api/categories` y luego usar ese nuevo ID para el libro.

---

## 📦 Estructura del Proyecto

- `src/models`: Esquemas de Mongoose.
- `src/routes`: Definición de rutas Express.
- `src/controllers`: Lógica de manejo de peticiones.
- `src/services`: Lógica de negocio reusable.
- `src/repositories`: Acceso directo a la base de datos (Patrón Repository).
- `src/middleware`: Auth y manejo de errores.
- `src/utils`: Utilidades como el envío de emails.
