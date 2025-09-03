from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from typing import List
from urllib.parse import quote
import os
from app.schemas.CategoriaSchema import CategoriaCreate, CategoriaResponse
from app.models.CategoriaModel import Categoria
from app.models.UsuarioModel import Usuario
from app.config import CATEGORIAS_DIR
from app.auth import get_current_user
from app.permisos import verificar_permiso

router = APIRouter()

@router.post("/", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):

    # Verifica si ya existe la categoría
    existente = db.query(Categoria).filter(Categoria.nombre == categoria.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="La categoría ya existe")

    nueva_categoria = Categoria(nombre=categoria.nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)

    # Crea el directorio físico en disco
    categoria_path = os.path.join(CATEGORIAS_DIR, categoria.nombre)
    os.makedirs(categoria_path, exist_ok=True)

    return nueva_categoria

@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(
    db: Session = Depends(get_db),
    # user: Usuario = Depends(get_current_user)  # ← Usuario autenticado
):
    # verificar_permiso(user.rol, "ver")  # ← Validar permiso para "ver"
    return db.query(Categoria).all()