import os
from fastapi import FastAPI
from app.api.v1.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import Settings
from app.config import UPLOAD_DIR
from app.config import CATEGORIAS_DIR

# entrada a la aplicación
app = FastAPI()

#codigo para permitir los CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Clase customizada para controlar CORS y caché en archivos estáticos
class CORSMount(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"

        # Control de caché dinámico según entorno:
        # En dev → deshabilita caché para no tener problemas con archivos antiguos.
        # En prod → habilita caché para rendimiento.
        if Settings.ENV == "development":
            response.headers["Cache-Control"] = "no-store"
        else:
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"

        return response

# Montar el directorio para servir archivos estáticos públicamente

# se monta el directorio de categorías para que se puedan servir los archivos que existan en cada subdirectorio de cada categoría creada.
app.mount("/archivos", StaticFiles(directory=CATEGORIAS_DIR), name="archivos")
app.include_router(api_router)  # registra el router para que FastAPI lo use