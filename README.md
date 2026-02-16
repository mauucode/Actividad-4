🚗 Tesla Copiloto OS - Gestión de Inventario y Tareas

Un sistema Full Stack diseñado para administrar de manera eficiente las operaciones internas de un centro de servicio Tesla. Permite la gestión de tareas del personal y un control riguroso del inventario de refacciones mediante un sistema de autenticación seguro basado en roles.

🛠️ Tecnologías Utilizadas
Frontend: HTML5, CSS3, JavaScript (Vanilla), Diseño Responsivo.

Backend: Node.js, Express.js.

Base de Datos: MongoDB Atlas (Mongoose) para usuarios/productos y sistema de archivos local (.json) para tareas.

Seguridad: Autenticación con JWT (JSON Web Tokens) y encriptación de contraseñas con Bcrypt.js.

Testing: Pruebas unitarias automatizadas con Jest y Supertest.

DevOps: CI/CD con GitHub Actions y despliegue en Vercel.

🚀 Requisitos Previos
Asegúrate de tener instalado lo siguiente en tu entorno local antes de ejecutar el proyecto:

Node.js (v18 o superior recomendado)

Git

Una cuenta en MongoDB Atlas para la base de datos en la nube.

💻 Instrucciones de Instalación y Ejecución Local
Sigue estos pasos para correr el proyecto en tu computadora:

1. Clonar el repositorio
Abre tu terminal y ejecuta:

Bash
git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>
2. Instalar las dependencias
Descarga todas las librerías necesarias (Express, Mongoose, Jest, etc.):

Bash
npm install
3. Configurar las Variables de Entorno
Por seguridad, las credenciales no se suben a GitHub. Debes crear un archivo llamado .env en la raíz del proyecto y agregar la siguiente configuración con tus propios datos:

Fragmento de código
# Conexión a MongoDB Atlas
MONGO_URI=mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@cluster0.xxxxx.mongodb.net/tesla_os?retryWrites=true&w=majority

# Llave secreta para la generación de Tokens JWT
SECRET_KEY=mi_super_secreto_tesla_2026
4. Iniciar el servidor
Levanta la aplicación ejecutando:

Bash
node server.js
El servidor te confirmará la conexión a MongoDB y la aplicación estará disponible en tu navegador en: http://localhost:3000

👑 Accesos del Sistema (Semilla)
El sistema cuenta con una función "Seed" que detecta si la base de datos de MongoDB está vacía. Al arrancar el servidor por primera vez, creará automáticamente un usuario administrador para que puedas acceder al sistema:

Usuario: admin

Contraseña: 123

Rol: admin (Da acceso a la vista protegida de Inventario)

🧪 Ejecución de Pruebas Unitarias
Este proyecto incluye un entorno de pruebas configurado con Jest para validar la integridad de las rutas de la API de productos (Inventario) y sus candados de seguridad.

Para ejecutar el test automatizado, detén el servidor (Ctrl + C) y corre el siguiente comando:

Bash
npm test
☁️ Despliegue en Producción
Este proyecto se encuentra desplegado de forma continua utilizando Vercel y GitHub Actions. Puedes ver la versión en vivo y funcional aquí:

🔗 Ver Proyecto en Vivo
