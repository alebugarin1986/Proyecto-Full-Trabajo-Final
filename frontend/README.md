# Bookstore - Frontend Client

Este es el cliente web para el proyecto **Bookstore**, una Single Page Application (SPA) moderna desarrollada con React y Vite, enfocada en una experiencia de usuario fluida y estética.

## 🎨 Diseño y UX

- **Aesthetica Premium**: Uso de Glassmorphism, desenfoques de fondo y paleta de colores oscuros.
- **Iconografía**: Set de iconos de Lucide-React para una navegación intuitiva.
- **Animaciones**: Transiciones suaves y micro-interacciones mediante Framer Motion para mejorar el engagement del usuario.

## 🚀 Tecnologías Utilizadas

- **React (Vite)**: Motor de la aplicación.
- **React Router Dom**: Manejo de rutas y navegación.
- **Axios**: Comunicación asíncrona con la API REST.
- **React Hook Form**: Gestión técnica de formularios y validaciones.
- **Lucide React**: Biblioteca de iconos.
- **CSS3 (Custom Properties)**: Sistema de diseño basado en variables y flexbox/grid.

## ✨ Características Principales

1. **Gestión de Libros**: CRUD completo donde los usuarios pueden organizar su biblioteca personal.
2. **Búsqueda Avanzada**: Barra de búsqueda en tiempo real que filtra por **título o autor**.
3. **Categorías Dinámicas**: Creación de nuevas categorías integrada directamente en el formulario de nuevos libros para un flujo de trabajo sin interrupciones.
4. **Sistema de Auth**:
   - Registro con validación.
   - Verificación de cuenta via Email.
   - Login seguro con persistencia de sesión.
5. **Responsividad Total**: Diseño adaptativo que funciona perfectamente desde móviles (320px) hasta monitores UltraWide.

## 🛠️ Instalación y Configuración

1. **Entrar al directorio**:
   ```bash
   cd frontend
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz de `/frontend`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

El proyecto estará disponible en `http://localhost:5174`.

---

**Nota**: Asegúrate de que el backend esté corriendo en el puerto configurado para que la comunicación sea exitosa.
