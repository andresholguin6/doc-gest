import os

# Directorio donde se almacenan los PDFs
UPLOAD_DIR = r"C:\Users\andres.holguin\Desktop\prueba_doc-gest"
CATEGORIAS_DIR = r"C:\Users\andres.holguin\Desktop\categorias"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Asegura que la carpeta exista
os.makedirs(CATEGORIAS_DIR, exist_ok=True)  # Asegura que la carpeta exista