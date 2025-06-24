from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

'''
Este archivo me permite utilizar la libreria passlib de python que toma las contraseñas
que iran a la bd y las encrypta, y a su vez las verifica, para esp están las dos funciones
y el pwd context.
'''