🚗 Tesla Copiloto OS - Gestión de Inventario y Tareas

Sistema Full Stack diseñado para administrar de manera eficiente las operaciones internas de un centro de servicio Tesla.

Permite la gestión de tareas del personal y un control riguroso del inventario de refacciones mediante un sistema de autenticación seguro basado en roles.

🛠️ Tecnologías Utilizadas
🎨 Frontend

HTML5

CSS3

JavaScript (Vanilla)

Diseño Responsivo

⚙️ Backend

Node.js

Express.js

🗄️ Base de Datos

MongoDB Atlas (Mongoose) → Usuarios / Productos

Sistema de archivos local (.json) → Tareas

🔐 Seguridad

Autenticación con JWT (JSON Web Tokens)

Encriptación de contraseñas con Bcrypt.js

🧪 Testing

Jest

Supertest

🚀 DevOps

CI/CD con GitHub Actions

Despliegue en Vercel

🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente:

Node.js (v18 o superior recomendado)

Git

Una cuenta en MongoDB Atlas

💻 Instalación y Ejecución Local
1️⃣ Clonar el repositorio
git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto y agrega la siguiente configuración con tus propios datos:

# Conexión a MongoDB Atlas
MONGO_URI=mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@cluster0.xxxxx.mongodb.net/tesla_os?retryWrites=true&w=majority

# Llave secreta para la generación de Tokens JWT
SECRET_KEY=mi_super_secreto_tesla_2026

4️⃣ Iniciar el servidor
node server.js


Si todo está correcto, la aplicación estará disponible en tu navegador en:

http://localhost:3000

👑 Accesos del Sistema (Seed Automático)

El sistema cuenta con una función Seed que detecta si la base de datos de MongoDB está vacía.

Al arrancar el servidor por primera vez, creará automáticamente un usuario administrador para que puedas acceder al sistema:

Usuario: admin

Contraseña: 123

Rol: admin

Este usuario tiene acceso a la vista protegida de Inventario.

🧪 Ejecución de Pruebas Unitarias

Este proyecto incluye un entorno de pruebas configurado con Jest para validar la integridad de las rutas de la API de productos (Inventario) y sus candados de seguridad.

Para ejecutar los tests automatizados:

Detén el servidor (Ctrl + C)

Ejecuta:

npm test


Las pruebas validan:

Rutas de la API de productos

Protección por autenticación

Restricción por roles

☁️ Despliegue en Producción

Este proyecto se encuentra desplegado de forma continua utilizando:

GitHub Actions para integración continua

Vercel para despliegue automático

🔗 Versión en vivo y funcional:

<AQUI_COLOCA_TU_LINK_DE_VERCEL>

📌 Características Principales

✔️ Sistema de autenticación con roles (Admin / Empleado)
✔️ CRUD completo de inventario
✔️ Gestión de tareas persistidas en JSON
✔️ Seguridad con JWT y Bcrypt
✔️ Testing automatizado
✔️ CI/CD configurado

📂 Estructura del Proyecto
/data
  ├── tareas.json
  └── users.json

/models
/routes
/middleware
/tests
server.js
package.json

🏁 Estado del Proyecto

✅ Funcional
✅ Seguro
✅ Testeado
✅ Desplegado
