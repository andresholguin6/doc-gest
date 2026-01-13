from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool
from dotenv import load_dotenv

import os
import sys

# Agrega el path raíz para que Alembic encuentre tu app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Carga las variables del entorno desde el .env
load_dotenv()

# Alembic config object
config = context.config

# Configura logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.db.database import Base
target_metadata = Base.metadata

# Importa modelos para que se registren en Base.metadata (no para traer Base)
import app.models.CategoriaModel
import app.models.DocumentoModel
import app.models.UsuarioModel # Asegúrate de que este import sea válido


target_metadata = Base.metadata

def run_migrations_offline():
    """Modo offline: genera SQL sin conectarse a la base de datos"""
    url = os.getenv("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Modo online: conecta a la base de datos y aplica migraciones"""
    url = os.getenv("DATABASE_URL")
    connectable = engine_from_config(
        {"sqlalchemy.url": url},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# Decide si ejecutar online u offline
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()