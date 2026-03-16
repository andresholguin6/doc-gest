from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.UsuarioModel import Usuario
from app.schemas.UsuarioSchema import (
    UsuarioLogin,
    LoginResponse,
    Token
)
from app.auth import (
    crear_token,
    crear_refresh_token,
    verificar_refresh_token,
    verify_password,
)
from app.roles import ROLES_PERMISOS

router = APIRouter()


# Endpoint para autenticar un usuario y devolver los tokens
@router.post("/login", response_model=LoginResponse)
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    # Buscar al usuario por username
    usuario_en_db = (
        db.query(Usuario).filter(Usuario.username == usuario.username).first()
    )

    # Si no existe o la contraseña no coincide
    if not usuario_en_db or not verify_password(
        usuario.password, usuario_en_db.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas"
        )

    # Crear access token y refresh token
    access_token = crear_token(
        {"sub": usuario_en_db.username, "rol": usuario_en_db.rol}
    )
    refresh_token = crear_refresh_token(
        {"sub": usuario_en_db.username, "rol": usuario_en_db.rol}
    )

    # Armar usuario para la respuesta
    usuario_data = {
        "id": usuario_en_db.id,
        "username": usuario_en_db.username,
        "rol": usuario_en_db.rol,
        "permisos": ROLES_PERMISOS.get(usuario_en_db.rol, []),
    }

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        usuario=usuario_data,
    )


# Endpoint para renovar el access token usando el refresh token
@router.post("/renovar_token", response_model=Token, summary="Renovar Token")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    payload = verificar_refresh_token(refresh_token)
    username = payload.get("sub")
    rol = payload.get("rol")

    if username is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    nuevo_access_token = crear_token({"sub": username, "rol": rol})

    return Token(access_token=nuevo_access_token, token_type="bearer")
