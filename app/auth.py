import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from fastapi import Depends,HTTPException, status
from passlib.context import CryptContext

from app.db.database import get_db
from app.models.UsuarioModel import Usuario

# Cargar variables desde .env
load_dotenv()

# Clave secreta y configuración del token
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

'''Extraigo el token del header, OAuth2PasswordBearer(tokenUrl="login")-> significa que estoy extrayendolo
de la ruta del login'''
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Crear un token JWT
def crear_token(data: dict, expiracion_minutos: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    datos_a_codificar = data.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=expiracion_minutos)
    datos_a_codificar.update({"exp": expiracion})
    token_jwt = jwt.encode(datos_a_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt


# Verificar y decodificar el token JWT
def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Este contiene los datos originales, como 'sub' o 'rol'
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Obtiene el usuario actual a partir del token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    payload = verificar_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user
'''
Este archivo me permite utilizar la libreria passlib de python que toma las contraseñas
que iran a la bd y las encrypta, y a su vez las verifica, para eso están las dos funciones
y el pwd context, tambien me permite generar tokens de autenticacion y decodificarlos.
'''