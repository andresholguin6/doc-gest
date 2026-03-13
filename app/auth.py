from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext

from app.core.config import settings
from app.db.database import get_db
from app.models.UsuarioModel import Usuario

# Clave secreta y configuración del token
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Extrae el token del header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Contexto de cifrado bcrypt para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Recibe una contraseña en texto plano y la convierte en un hash seguro
def hash_password(password: str):
    return pwd_context.hash(password)


# Verifica si una contraseña en texto plano coincide con su hash almacenado
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# Crea un token JWT con expiración
def crear_token(data: dict, expiracion_minutos: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    datos_a_codificar = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(minutes=expiracion_minutos)
    datos_a_codificar.update({"exp": expiracion})
    token_jwt = jwt.encode(datos_a_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt


# Verifica y decodifica el token JWT — necesita manejo de errores
# porque el token puede ser inválido, expirado o manipulado
def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Obtiene el usuario actual a partir del token — necesita manejo de errores
# porque el username puede no existir en la BD o el token puede ser inválido
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Usuario:
    payload = verificar_token(token)
    username = payload.get("sub")

    if username is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(Usuario).filter(Usuario.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user

# Crea un refresh token con mayor duración
def crear_refresh_token(data: dict):
    datos_a_codificar = data.copy()
    expiracion = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    datos_a_codificar.update({"exp": expiracion, "type": "refresh"})
    token_jwt = jwt.encode(datos_a_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt


# Verifica que el token sea un refresh token válido
def verificar_refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Verifica que sea de tipo refresh y no un access token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


"""
Este archivo me permite utilizar la libreria passlib de python que toma las contraseñas
que iran a la bd y las encrypta, y a su vez las verifica, para eso están las dos funciones
y el pwd context, tambien me permite generar tokens de autenticacion y decodificarlos.

"""
