from typing import Literal
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    ENV: Literal["development", "production"] = "development"  # <- Nuevo campo para controlar el entorno

    class Config:
        env_file = ".env"  # indica el archivo .env que debe cargar

settings = Settings()

"""
Archivo de configuración global de la aplicación.

Este módulo centraliza la carga de variables de entorno utilizando Pydantic,
permitiendo definir de forma segura la configuración sensible del sistema
(claves secretas, conexión a base de datos y entorno de ejecución).

Según el valor del entorno (development o production), otros módulos del sistema
ajustan su comportamiento (seguridad, caché, base de datos, etc.).

Las variables se cargan desde el archivo .env para evitar valores hardcodeados
y facilitar el despliegue en distintos entornos.
"""