# 📄 Doc-Gest(Document Management System)

Sistema de gestión documental desarrollado con **FastAPI** en el backend y **React** en el frontend.  
La aplicación permite organizar documentos por categorías, visualizarlos mediante un visor PDF embebido, descargarlos e imprimirlos sin depender del visor nativo del navegador.

---

## 🚀 Características principales

- 📁 Organización de documentos por categorías
- 📄 Visualización de documentos PDF dentro de la aplicación
- ⬇️ Descarga directa de archivos
- 🖨️ Impresión desde el visor embebido
- 🎨 Interfaz moderna y responsiva
- 🔐 Backend desacoplado y preparado para escalabilidad
- 🗂️ Migraciones de base de datos versionadas

---

## 🧱 Arquitectura del proyecto

El proyecto está dividido en dos capas principales:

frontend/   → Aplicación React
backend/    → API REST con FastAPI
⚙️ Backend – Tecnologías utilizadas
🐍 FastAPI
Framework principal para la construcción de la API REST.

Definición de endpoints REST

Validación automática de datos

Alto rendimiento y soporte asíncrono

Documentación automática (Swagger / OpenAPI)

🗄️ PostgreSQL
Base de datos relacional utilizada para el almacenamiento de la información.

Persistencia de categorías y documentos

Integridad referencial

Escalable y robusta para entornos productivos

🧬 SQLAlchemy
ORM utilizado para la interacción con la base de datos PostgreSQL.

Mapeo de tablas a modelos Python

Abstracción de consultas SQL

Manejo de sesiones y transacciones

🔁 Alembic
Herramienta de migraciones para SQLAlchemy.

Versionado del esquema de base de datos

Control de cambios estructurales

Sincronización entre entornos (dev / test / prod)

📦 Pydantic
Librería utilizada para la validación y serialización de datos.

Definición de esquemas (schemas)

Validación de datos de entrada y salida

Tipado fuerte y seguro

FastAPI utiliza Pydantic de forma nativa, pero es una librería independiente.

⚡ Uvicorn
Servidor ASGI para ejecutar la aplicación FastAPI.

Alto rendimiento

Soporte para aplicaciones asíncronas

Ideal para desarrollo y producción

🔐 Variables de entorno
Configuración del proyecto mediante variables de entorno (.env).

Credenciales de base de datos

Tokens y configuraciones sensibles

Separación de entornos (development / production)

🎨 Frontend – Tecnologías utilizadas
⚛️ React
Framework principal para la construcción de la interfaz de usuario.

Componentes reutilizables

Manejo de estado

Consumo de la API REST

🎨 Tailwind CSS
Framework de estilos utilitario para el diseño de la interfaz.

Diseño moderno y responsivo(se está trabajando la parte responsive para visualizarlo en diferentes resoluciones de pantalla)

Desarrollo rápido y consistente

Sin dependencias de componentes externos

📘 react-pdf-viewer
Visor de documentos PDF embebido en la aplicación.

Visualización de PDFs sin abrir pestañas externas

Descarga de documentos desde la aplicación

Impresión directa desde el visor

Soporte para documentos multipágina

Toolbar personalizable

🧪 Pruebas realizadas
Visualización de documentos PDF de una y múltiples páginas

Descarga correcta de documentos

Impresión desde el visor embebido

Manejo de estados de carga (spinner)

Pruebas con documentos de gran tamaño

Validación de rutas y permisos del backend

▶️ Ejecución del proyecto
Backend
Comando para iniciar el entorno virtual uvicorn en una consola:
```
cmd

.\venv\Scripts\activate.bat
```
Comando para iniciar la aplicación fastApi:
```
cmd

uvicorn app.main:app --reload
```
Ruta del proyecto en donde se encuentra en frontend:
```
cmd

C:\Users\Windows 10\Desktop\doc-gest\front-doc_gest>
```
Comandos para iniciar el Frontend
```
cmd

npm install
npm run dev
```
📌 Notas técnicas
El visor PDF no depende del visor nativo del navegador

El backend sirve tanto metadata como archivos físicos

Arquitectura preparada para futuras extensiones:

Autenticación y roles

Control de permisos

Versionado de documentos

Almacenamiento en la nube

🧠 Autor
Desarrollado por Andrés Mauricio Holguín Escobar
Proyecto enfocado en buenas prácticas, arquitectura limpia y escalabilidad.

📄 Licencia
Este proyecto se distribuye bajo licencia MIT.
