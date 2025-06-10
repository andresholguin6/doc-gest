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