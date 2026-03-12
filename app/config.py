import os
from app.core.config import settings

# Directorio donde se almacenan los documentos PDF organizados por categorías
CATEGORIAS_DIR = settings.CATEGORIAS_DIR
os.makedirs(CATEGORIAS_DIR, exist_ok=True)

# En el futuro se pueden agregar más directorios aquí
# TEMP_DIR = settings.TEMP_DIR
# os.makedirs(TEMP_DIR, exist_ok=True)