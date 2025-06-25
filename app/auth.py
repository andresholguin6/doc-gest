import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi import HTTPException, status
from passlib.context import CryptContext

# Cargar variables desde .env
load_dotenv()

# Clave secreta y configuración del token
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


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

'''
Este archivo me permite utilizar la libreria passlib de python que toma las contraseñas
que iran a la bd y las encrypta, y a su vez las verifica, para esp están las dos funciones
y el pwd context, tambien me permite generar tokens de autenticacion y decodificarlos.
'''