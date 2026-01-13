
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


#crear conexion a la bd
engine = create_engine(settings.DATABASE_URL)

# Crear clase para las sesiones (cada sesión será una conexión con la BD)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para los modelos de la base de datos
Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
"""
Configuración de la base de datos de la aplicación.

Este módulo define el motor de conexión a la base de datos utilizando SQLAlchemy,
la clase base para los modelos ORM y la gestión de sesiones.

También expone la dependencia get_db, utilizada por FastAPI para inyectar
una sesión de base de datos por request, asegurando su correcta apertura y cierre.
"""