from fastapi import APIRouter
from app.api.v1.endpoints import documentos
from app.api.v1.endpoints import categorias

api_router = APIRouter()

api_router.include_router(documentos.router, prefix="/documentos", tags=["documentos"])
api_router.include_router(categorias.router, prefix="/categorias", tags=["categorias"])
# Puedes incluir más routers aquí si tienes otros endpoints