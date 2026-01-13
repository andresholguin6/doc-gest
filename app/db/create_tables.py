import sys
import os

'''codigo para solucionar el problema del path, el cual surge por que a veces python no reconoce la ruta raiz
del proyecto
'''
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from app.db.database import Base, engine
from app.models.DocumentoModel import Documento  # Importa todos los modelos que quieras crear

def crear_tablas():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas correctamente.")

if __name__ == "__main__":
    crear_tablas()
    
"""
Script auxiliar para la creación manual de tablas en la base de datos.

Este archivo no forma parte del flujo normal de la aplicación FastAPI.
Se utiliza únicamente para entornos de desarrollo o inicialización manual
de la base de datos, creando las tablas definidas en los modelos ORM
mediante SQLAlchemy.

Para su ejecución debe correrse directamente desde la línea de comandos.

Este archivo no debe ejecutarse ni utilizarse en entornos productivos.
La gestión del esquema de base de datos en producción se realiza
exclusivamente mediante migraciones con Alembic.
"""