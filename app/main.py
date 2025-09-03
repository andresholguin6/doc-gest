from fastapi import FastAPI
from app.api.v1.endpoints import documentos  # importa tu archivo de endpoints
from app.api.v1.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import UPLOAD_DIR
from app.config import CATEGORIAS_DIR

app = FastAPI()

#codigo para permitir los CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Montar el directorio para servir archivos estáticos públicamente
#app.mount("/archivos", StaticFiles(directory=UPLOAD_DIR), name="archivos")

# se monta el directorio de categorías para que se puedan servir los archivos que existan en cada subdirectorio de cada categoría creada.
app.mount("/archivos", StaticFiles(directory=CATEGORIAS_DIR), name="archivos")
app.include_router(api_router)  # registra el router para que FastAPI lo use