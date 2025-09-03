from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.UsuarioSchema import UsuarioCreate, UsuarioResponse, UsuarioLogin, LoginResponse
from app.models.UsuarioModel import Usuario
from app.auth import hash_password, crear_token, verificar_token, verify_password
from app.db.database import get_db
from app.permisos import verificar_permiso
from app.roles import ROLES_PERMISOS

router = APIRouter()

#endpoint para crear un usuario en la bd
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

'''endpoint para autenticar a un usuario con sus credenciales y verificar que permisos tiene
    para acceder a las funcionalidades de la aplicacion
'''
@router.post("/login", response_model=LoginResponse)
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    # Buscar al usuario por username
    usuario_en_db = db.query(Usuario).filter(Usuario.username == usuario.username).first()

    # Si no existe o la contraseña no coincide
    if not usuario_en_db or not verify_password(usuario.password, usuario_en_db.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Crear el token con datos del usuario (puedes incluir más si lo deseas)
    token = crear_token({"sub": usuario_en_db.username, "rol": usuario_en_db.rol})

    # Validar permisos
    # verificar_permiso(usuario_en_db.rol, "login")
    
        # Armar usuario para la respuesta
    usuario_data = {
        "id": usuario_en_db.id,
        "username": usuario_en_db.username,
        "rol": usuario_en_db.rol,
        "permisos": ROLES_PERMISOS.get(usuario_en_db.rol, [])
    }
    
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        usuario=usuario_data
    )

@router.get("/", response_model=List[UsuarioResponse])
def obtener_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()