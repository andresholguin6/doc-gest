from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Cargar variables del .env
load_dotenv()

# Leer la URL desde el entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el engine de SQLAlchemy
engine = create_engine(DATABASE_URL)

# Intentar conectar
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Conexión exitosa:", result.scalar())
except Exception as e:
    print("❌ Error en la conexión:", e)