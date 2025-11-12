# 📘 README.md - Coramind Backend Server

![Node.js](https://img.shields.io/badge/Node.js-20-green) ![Express](https://img.shields.io/badge/Express-Latest-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-orange) ![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🧠 Introducción

**newvalue-server** es el servidor backend del proyecto **Coramind**, una plataforma integral para la gestión de servicios de psicología online. Desarrollado con **Node.js**, **Express** y **Sequelize ORM**, este servidor maneja toda la lógica de negocio relacionada con usuarios, psicólogos, pacientes, sesiones, citas y artículos.

- **Versión:** 1.0.0
- **Puerto por defecto:** 4000
- **Punto de entrada (desarrollo):** `src/index.js`
- **Punto de entrada (producción):** `src/app.js`

---

## 🚀 Características Principales

✅ Gestión completa de usuarios y roles  
✅ Sistema de autenticación con JWT y Google OAuth  
✅ Módulo de psicólogos con especialidades y disponibilidad  
✅ Sistema de citas y sesiones  
✅ Gestión de artículos y categorías  
✅ Integración con Cloudinary para almacenamiento de archivos  
✅ Sistema de notificaciones por correo (Nodemailer)  
✅ Integración con CometChat para mensajería en tiempo real  
✅ Tests automatizados con Jest  
✅ Dockerizado para despliegue rápido  

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 20.x
- **npm** >= 9.x
- **MySQL** 8.0 (o usar Docker)
- **Docker** y **Docker Compose** (opcional, para entorno containerizado)

---

## 🛠️ Instalación

### 1️⃣ Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd server-coramind
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo como `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Autenticación Google
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# JWT
JWT_SECRET=tu_secreto_jwt_seguro

# Frontend
FRONTEND_URL=http://localhost:5173

# Servidor
PORT=4000

# Base de datos
DB_NAME=coramind
DB_USER=root
DB_PASSWORD=123456789
DB_HOST=localhost
DB_PORT=3306

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=coramind.newvalue@gmail.com
SMTP_PASS=tu_contraseña_smtp
ADMIN_EMAIL=coramind.newvalue@gmail.com

# CometChat
COMETCHAT_APP_ID=tu_app_id
COMETCHAT_REGION=tu_region
COMETCHAT_AUTH_KEY=tu_auth_key
COMETCHAT_REST_API_KEY=tu_rest_api_key
```

### 4️⃣ Ejecutar migraciones
```bash
npm run db:migrate
```

### 5️⃣ (Opcional) Poblar la base de datos con datos iniciales
```bash
npm run db:seed
```

---

## 🎯 Uso Local

### Modo desarrollo (con nodemon)
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000` y se recargará automáticamente ante cambios en el código.

### Modo producción
```bash
npm start
```

---

## 🐳 Uso con Docker

El proyecto incluye configuración completa para ejecutarse con **Docker** y **Docker Compose**.

### 1️⃣ Construir y levantar los contenedores
```bash
docker-compose up --build
```

Esto iniciará:
- **Servicio MySQL** en el puerto `3307`
- **Servicio Backend** en el puerto `4000`

### 2️⃣ Detener los contenedores
```bash
docker-compose down
```

### 3️⃣ Ver logs
```bash
docker-compose logs -f backend
```

### Configuración Docker

**Dockerfile:**
- Imagen base: `node:20-alpine`
- Expone el puerto `4000`
- Comando de inicio: `npm start`

**docker-compose.yml:**
- **mysql:** MySQL 8.0 con volumen persistente `mysql_data`
- **backend:** Construido desde Dockerfile, depende de MySQL
- Usa red externa `cm_net`

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon |
| `npm start` | Inicia el servidor en modo producción |
| `npm run db:migrate` | Ejecuta todas las migraciones de Sequelize |
| `npm run db:migrate:undo` | Revierte la última migración |
| `npm run db:seed` | Ejecuta los seeders para poblar la BD |
| `npm test` | Ejecuta los tests con Jest |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura |

---

## 📦 Dependencias Principales

### Frameworks y Core
- **express** - Framework web para Node.js
- **sequelize** - ORM para SQL
- **mysql2** - Driver MySQL
- **pg** / **pg-hstore** - Soporte PostgreSQL

### Seguridad
- **cors** - Manejo de políticas CORS
- **helmet** - Headers de seguridad HTTP
- **express-rate-limit** - Limitación de peticiones
- **express-validator** - Validación de datos
- **bcrypt** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT

### Autenticación y APIs Externas
- **google-auth-library** - OAuth de Google
- **axios** - Cliente HTTP

### Almacenamiento y Email
- **cloudinary** - Almacenamiento de archivos
- **multer** / **multer-storage-cloudinary** - Upload de archivos
- **nodemailer** - Envío de emails

### Utilidades
- **dotenv** - Variables de entorno
- **exceljs** - Manipulación de archivos Excel

### Testing
- **jest** - Framework de testing
- **supertest** - Testing de APIs HTTP

---

## 📁 Estructura del Proyecto
```
server-coramind/
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── check-appointments.js
├── Docker-compose.yml
├── Dockerfile
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
│
└── src/
    ├── app.js                    # Configuración principal de Express
    ├── index.js                  # Punto de entrada desarrollo
    │
    ├── config/                   # Configuraciones
    │   ├── config.cjs            # Config Sequelize
    │   ├── cors.config.js        # Config CORS
    │   ├── database.js           # Conexión BD
    │   └── nodemailer.js         # Config email
    │
    ├── controllers/              # Lógica de negocio
    │   ├── appointment.controller.js
    │   ├── article.controller.js
    │   ├── auth.controller.js
    │   ├── availability.controller.js
    │   ├── chat.controller.js
    │   ├── firstSession.controller.js
    │   ├── patient.controller.js
    │   ├── psychologist.controller.js
    │   ├── session.controller.js
    │   ├── speciality.controller.js
    │   └── user.controller.js
    │
    ├── middleware/               # Middlewares
    │   ├── appointmentMiddleware.js
    │   ├── authMiddleware.js
    │   ├── ownerMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── uploadMiddleware.js
    │   └── validationResultHandler.js
    │
    ├── migrations/               # Migraciones Sequelize
    │   ├── 001-create-role.js
    │   ├── 002-create-user.js
    │   ├── 003-create-patient.js
    │   ├── 004-create-speciality.js
    │   ├── 005-create-psychologist.js
    │   ├── 006-create-psychologist-speciality.js
    │   ├── 007-create-availability.js
    │   ├── 008-create-appointment.js
    │   ├── 009-create-session.js
    │   ├── 010-create-category.js
    │   ├── 011-create-article.js
    │   ├── 012-create-psychologist-lenguage.js
    │   ├── 015-update-availability-table.js
    │   └── 016-add-availability-to-appointment.js
    │
    └── models/                   # Modelos de datos
        ├── AppointmentModel.js
        ├── ArticleModel.js
        ├── associations.js
        ├── AvailabilityModel.js
        ├── CategoryModel.js
        ├── PatientModel.js
        ├── PsychologistModel.js
        ├── RoleModel.js
        ├── SessionModel.js
        ├── SpecialityModel.js
        ├── UserModel.js
        └── index.js
```

---

## 🔧 Tecnologías Utilizadas

- **Node.js 20** (Alpine) - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **Sequelize ORM** - Mapeo objeto-relacional
- **MySQL 8.0** - Base de datos relacional
- **Docker + Docker Compose** - Containerización
- **Google Auth Library** - Autenticación OAuth
- **Cloudinary** - Gestión de archivos multimedia
- **Jest + Supertest** - Framework de testing

---

## ✅ Testing

### Ejecutar tests
```bash
npm test
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

Los reportes de cobertura se generarán en la carpeta `coverage/`.

---

## 📝 Notas Finales

### Consideraciones de Seguridad

- ⚠️ **Nunca subas el archivo `.env`** al repositorio
- 🔒 Usa contraseñas seguras para `JWT_SECRET` y `DB_PASSWORD`
- 🛡️ Configura adecuadamente las políticas CORS en producción
- 🔐 Mantén actualizadas las dependencias para evitar vulnerabilidades

### Migraciones

Las migraciones están numeradas secuencialmente. Para crear una nueva migración:
```bash
npx sequelize-cli migration:generate --name nombre-de-la-migracion
```

### Solución de Problemas Comunes

**Error de conexión a MySQL:**
- Verifica que MySQL esté corriendo
- Comprueba las credenciales en `.env`
- Si usas Docker, asegúrate de que el servicio `mysql` esté activo

**Puerto 4000 ocupado:**
```bash

PORT=4000
```

---

## 👥 Contribución

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📧 Contacto

Para consultas o soporte, contacta a: **coramind.newvalue@gmail.com**

---

## 📄 Licencia

Este proyecto es parte de Coramind © 2025

---

**¡Gracias por usar Coramind Backend Server! 🧠💙**