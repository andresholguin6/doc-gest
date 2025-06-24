from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.UsuarioSchema import UsuarioCreate, UsuarioResponse
from app.models.UsuarioModel import Usuario
from app.auth import hash_password  # usa passlib
from app.db.database import get_db

router = APIRouter()

@router.post("/", response_model=UsuarioResponse,status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # 1) Verificar que no exista
    user_existente = db.query(Usuario).filter(Usuario.username == usuario.username).first()
    if user_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe."
        )

    # 2) Hashear la contraseña
    hashed_password = hash_password(usuario.password)

    # 3) Crear y guardar
    nuevo_usuario = Usuario(
        username=usuario.username,
        hashed_password=hashed_password,
        rol=usuario.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # 4) Devolver sin la contraseña
    return nuevo_usuario