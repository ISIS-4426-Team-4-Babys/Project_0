# 📋 Task Management Application

Una aplicación web completa de gestión de tareas la cual incluye autenticación y manejo de usuarios, gestión de tareas por categorías y creación de tareas a través de una interfaz intuitiva y moderna.

## 👥 Integrantes del Equipo

- Nicolas Rozo Fajardo - n.rozo@uniandes.edu.co
- Manuela Pachecho Malagón - m.pachechom2@uniandes.edu.co
- Juan Andrés Ariza Gacharná - ja.arizag@uniandes.edu.co
- Nathalia Quiroga Alfaro - n.quiroga@uniandes.edu.co

## ✨ Características Principales

- **🔐 Autenticación de usuarios** - Sistema completo de registro, login y gestión de usuarios.
- **📁 Gestión de categorías** - Organiza tus tareas por categorías personalizadas.
- **✅ CRUD completo de tareas** - Crear, leer, actualizar y eliminar tareas.
- **🔧 Panel de administración** - Gestión de base de datos con Adminer.
- **🧪 API Testing** - Colecciones completas de Postman incluidas.

## 🏗️ Arquitectura del Proyecto

La aplicación está compuesta por los siguientes servicios:

- **Frontend**: Interfaz de usuario desarrollada con Next.js.
- **Backend**: API RESTful con endpoints para gestión de usuarios, categorías y tareas desarrollada en Go con el framework Gin.
- **Base de Datos**: Sistema de persistencia de datos.
- **Adminer**: Interfaz web para administración de base de datos.

## 🚀 Inicio Rápido

### Prerrequisitos


Antes de ejecutar la aplicación, asegurese de contar con las siguientes dependencias en su dispositivo:

- Docker
- Docker Compose
- Git

### Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ISIS-4426-Team-4-Babys/Project_0.git
   cd Project_0
   ```

2. **Ejecutar la aplicación**
   ```bash
   docker compose up --build
   ```

3. **Acceder a los servicios**
   
   Una vez que todos los contenedores estén ejecutándose, podrás acceder a:
   
   | Servicio | URL | Descripción |
   |----------|-----|-------------|
   | Frontend | http://localhost:3000 | Interfaz principal de la aplicación |
   | Backend API | http://localhost:8080 | Endpoints de la API REST |
   | Adminer | http://localhost:8081 | Panel de administración de BD |

> **💡 Tip**: Puede acceder al administrado de la base de datos usando las credenciales definidas en las variables de entorno de la base de datos.

## 👥 Usuarios de Prueba

Para facilitar las pruebas, la aplicación incluye usuarios preconfigurados:

| Usuario | Contraseña | Descripción |
|---------|------------|-------------|
| `NepoBaby` | `Nepo123Baby` | Usuario de prueba 1 |
| `ErizoPetizo` | `Erizo123Petizo` | Usuario de prueba 2 |

> **💡 Tip**: Puedes crear usuarios adicionales desde el frontend o utilizando los endpoints de la API. 

## 🧪 Testing con Postman

### Configuración

El proyecto incluye colecciones completas de Postman para testing de la API:

1. **Ubicación**: Las colecciones se encuentran en la carpeta `/collections`.
2. **Importar coleccionesy entorno**: Abre Postman e importa todos los archivos `.json`.
3. **Seleccionar entorno**: En Postman, selecciona el environment `.ToDo App` antes de ejecutar las pruebas.

### Orden Recomendado de Ejecución

Para obtener mejores resultados en las pruebas, ejecuta las colecciones en el siguiente orden:

1. **👤 Usuarios** - Crear usuarios, login y pruebas de autenticación.
2. **📁 Categorías** - CRUD de categorías (sin DELETE).
3. **✅ Tareas** - CRUD de tareas (sin DELETE).
4. **🗑️ Eliminar Tareas** - Casos de DELETE para tareas.
5. **🗑️ Eliminar Categorías** - Casos de DELETE para categorías.

> **⚠️ Importante**: Este orden asegura que las relaciones entre entidades se mantengan correctas durante las pruebas.

### Contenido de las Colecciones

- **Casos de éxito** - Flujos normales de la aplicación
- **Casos de error** - Validación de manejo de errores
- **Autenticación** - Pruebas de seguridad y tokens
- **Validaciones** - Tests de integridad de datos

## 📁 Estructura del Proyecto

```
📦 Project_0
├── 📁 backend/           # Código del backend/API
├── 📁 collections/       # Colecciones de Postman
├── 📁 database/          # Definición de la base de datos
├── 📁 frontend/          # Código del frontend
├── 📄 docker-compose.yml
├── 📄 README.md
└── 📄 .gitignore
└── 📄 LICENSE
```

## 🎥 Demostración

El proyecto incluye una demostración en video que muestra todas las funcionalidades del mismo. Puede consultar el video en el siguiente enlace. 
