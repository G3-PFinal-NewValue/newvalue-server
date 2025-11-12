# 🧠 Proyecto Cora Mind - Backend

API REST para plataforma de gestión de citas para psicólogos y pacientes.

## 📋 Descripción

Backend desarrollado con Node.js y Express con base de datos relacional MySQL, que proporciona la API para la gestión de perfiles de psicólogos, pacientes, citas y administración del sistema.

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Passport** - Autenticación con Google OAuth
- **Bcrypt** - Encriptación de contraseñas
- **Dotenv** - Variables de entorno

## 📦 Requisitos Previos

- Node.js v18+ 
- MySQL 8.0+
- npm 

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <https://github.com/G3-PFinal-NewValue/newvalue-server.git>
cd newvalue-server
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=nombre_base_datos
DB_TEST=nombre_base_datos_test

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret

# Servidor
PORT=4000
NODE_ENV=development

# URLs
CLIENT_URL=http://localhost:5173
```

4. **Crear la base de datos**
```bash
mysql workbench
CREATE DATABASE coramind;

```

5. **Ejecutar migraciones**
```bash
npx sequelize-cli db:migrate
```

6. **Ejecutar seeders (opcional)**
```bash
npx sequelize-cli db:seed:all
```

## 🎯 Uso

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

### Ejecutar tests
```bash
npm test
```

## 📁 Estructura del Proyecto
```
server/
├── src/
│   ├── config/          # Configuración de DB y servicios
│   ├── controllers/     # Controladores de rutas
│   ├── middlewares/     # Middlewares (auth, validación)
│   ├── migrations/      # Migraciones de DB
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Definición de rutas
│   ├── seeders/         # Seeds de datos iniciales
│   ├── services/        # Lógica de negocio
│   ├── test/            # Testing 
│   ├── utils/           # Utilidades y helpers
│   ├── validators/      # Validaciones de datos
│   ├── app.js           # Punto de entrada de los endpoints
│   └── index.js         # Punto de entrada del servidor
├── .env                 # Variables de entorno (no subir a git)
├── .env.example         # Ejemplo de Variables de entorno 
├── .sequelizerc         # Configuración de Sequelize CLI
├── Docker-compose       # Imagens Docker
├── Dockerfile           # Instrucciones de Docker
├── jest.config.js       # Configuración de Jest
├── package-lock.json    # Lock de dependencias
├── package.json
└── README.md
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. Incluye soporte para:

- Registro y login con email/password
- Login con Google OAuth
- Creación de contraseña
- Roles de usuario (admin, psicólogo, paciente)

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Login con Google
- `POST /api/auth/set-password` - Crear contraseña

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Psicólogos
- `GET /api/psychologists` - Listar psicólogos
- `GET /api/psychologists/:id` - Obtener perfil
- `PUT /api/psychologists/:id` - Actualizar perfil

### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Cancelar cita

## 📖 Documentación

### 📡 Documentación de la API

La documentación completa en **Postman** de todos los endpoints, parámetros, respuestas y ejemplos está disponible en:

**[📄 Ver Documentación de la API](https://www.postman.com/michelle-4752952/cora-mind/collection/lutv0u2/cora-mind?action=share&creator=46421386)**


### 🗄️ Base de Datos

El diagrama de entidad-relación (ERD) y la documentación completa de las tablas, relaciones y campos está disponible en:

**[📊 Ver Diagramas de Base de Datos](link)**


#### Principales Tablas

- `user` - Usuarios del sistema
- `role` - Roles de usuario
- `psychologist` - Perfiles de psicólogos
- `patient` - Perfiles de pacientes
- `appointment` - Citas programadas
- `language` - Idiomas disponibles del Psicólogo
- `psychologist_language` - Relación psicólogo-idiomas
- `speciality` - Especializaciones del Psicólogo
- `psychologist_speciality` - Relación psicólogo-especializaciones

## 🗃️ Migraciones y Seeders

### Crear nueva migración
```bash
npx sequelize-cli migration:generate --name nombre-migracion
```

### Crear nuevo seeder
```bash
npx sequelize-cli seed:generate --name nombre-seeder
```

### Revertir última migración
```bash
npx sequelize-cli db:migrate:undo
```

### Revertir todos los seeders
```bash
npx sequelize-cli db:seed:undo:all
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor en modo desarrollo con nodemon
- `npm start` - Inicia servidor en modo producción
- `npm test` - Ejecuta tests
- `npm run db:migrate` - Ejecuta migraciones pendientes
- `npm run db:seed` - Ejecuta todos los seeders

## 🐛 Debugging

Para activar logs detallados de Sequelize, establece en `.env`:
```env
NODE_ENV=development
```

## 📝 Convenciones de Código

- Usar ES Modules (`import/export`)
- Nombres de archivos en PascalCase para modelos
- Nombres de archivos en camelCase para el resto
- Usar async/await en lugar de callbacks
- Validaciones con express-validator

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- **** - [Tu GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- A todos los que contribuyeron al proyecto
