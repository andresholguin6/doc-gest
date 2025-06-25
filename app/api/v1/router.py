from fastapi import APIRouter
from app.api.v1.endpoints import documentos
from app.api.v1.endpoints import categorias
from app.api.v1.endpoints import usuarios

api_router = APIRouter()

api_router.include_router(documentos.router, prefix="/documentos", tags=["documentos"])
api_router.include_router(categorias.router, prefix="/categorias", tags=["categorias"])
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["usuarios"])
api_router.include_router(usuarios.router, prefix="/autenticacion", tags=["Autenticacion"])
# Puedes incluir más routers aquí si tienes otros endpoints