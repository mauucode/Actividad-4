# 🚗 Tesla Copiloto OS - Gestión de Inventario y Tareas

![Status](https://img.shields.io/badge/Status-Terminado-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-success)
![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-blue)

Bienvenido a **Tesla Copiloto OS**. Un sistema Full Stack diseñado para administrar de manera eficiente las operaciones internas de un centro de servicio Tesla. 

El proyecto permite la gestión de tareas del personal y un control riguroso del inventario de refacciones mediante un sistema de autenticación seguro basado en roles.

---

## 📋 Características Principales

* **Gestión Dual:** Administración de las asignaciones del personal y control centralizado del inventario de refacciones.
* **Autenticación Segura:** Login protegido con **JWT (JSON Web Tokens)** y contraseñas encriptadas con **Bcrypt.js**.
* **Base de Datos Híbrida:** * ☁️ **MongoDB Atlas (Mongoose):** Para la gestión de usuarios y el catálogo de productos.
    * 📄 **Persistencia Local (`.json`):** Sistema de archivos ligero para el manejo de tareas.
* **Control de Accesos (RBAC):** Vistas y rutas de inventario protegidas y exclusivas para el rol de administrador.
* **Configuración Inicial (Seed):** Generación automática de un usuario administrador base cuando la base de datos arranca vacía.
* **Automatización y Calidad:** Pruebas unitarias integradas y flujo CI/CD automatizado.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Diseño Responsivo.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MongoDB Atlas y File System Local (`.json`).
* **Seguridad:** `jsonwebtoken`, `bcryptjs`.
* **Testing:** Pruebas unitarias automatizadas con `jest` y `supertest`.
* **DevOps:** CI/CD con GitHub Actions y despliegue en Vercel.

---

## 🚀 Guía de Instalación y Ejecución Local

⚠️ **REQUISITOS PREVIOS:** Asegúrate de tener instalado **Node.js (v18 o superior)**, **Git** y contar con una cuenta activa en **MongoDB Atlas**.

### 1. Clonar el Repositorio
Abre tu terminal y ejecuta:

```bash
git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
cd <NOMBRE_DE_LA_CARPETA_DEL_PROYECTO>
```
### 2. Instalar Dependencias
Descarga todas las librerías necesarias (Express, Mongoose, Jest, etc.) descritas en el package.json:

```bash
npm install
```
### 3. Configurar las Variables de Entorno
Por seguridad, las credenciales no se suben a GitHub. Debes crear un archivo llamado .env en la raíz del proyecto y agregar la siguiente configuración con tus propios datos:

# Conexión a MongoDB Atlas
```bash
MONGO_URI=mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@cluster0.xxxxx.mongodb.net/tesla_os?retryWrites=true&w=majority
```

# Llave secreta para la generación de Tokens JWT
```bash
SECRET_KEY=mi_super_secreto_tesla_2026
```

### 4. Iniciar el Servidor
Una vez configurado todo, levanta la aplicación:

```bash
node server.js
```
---

## 🕹️ Cómo Usar la Aplicación (Accesos Semilla)
El sistema cuenta con una función "Seed". Al arrancar el servidor por primera vez, si detecta que la base de datos de MongoDB está vacía, creará automáticamente un usuario administrador.

Abre tu navegador y ve a: http://localhost:3000

Inicia sesión con las siguientes credenciales generadas por el sistema:

Rol	Usuario	Contraseña	Permisos
Administrador	admin	123	Da acceso total, incluyendo la vista protegida de Inventario.

---


## 🧪 Ejecución de Pruebas Unitarias
Este proyecto incluye un entorno de pruebas configurado con Jest para validar la integridad de las rutas de la API de productos (Inventario) y sus respectivos candados de seguridad.

Para ejecutar los tests automatizados, detén el servidor (Ctrl + C) y corre el siguiente comando:

```bash
npm test
```

---

## ☁️ Despliegue en Producción
Este proyecto se encuentra desplegado de forma continua utilizando Vercel y GitHub Actions. Puedes ver la versión en vivo y funcional aquí:

🔗 https://actividad-4-neon.vercel.app/
