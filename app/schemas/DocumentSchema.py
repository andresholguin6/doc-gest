from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.CategoriaSchema import CategoriaSimple

class DocumentoBase(BaseModel):
    titulo: str
    contenido: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    

class DocumentoCreate(DocumentoBase):
    pass  # Hereda todo de DocumentoBase, para crear nuevos documentos

class DocumentoRead(DocumentoBase):
    id: int
    ruta_archivo: Optional[str] = None  # <-- Aquí agregamos la ruta del archivo
    fecha_creacion: Optional[datetime] = None  # datetime para hora y fecha
    categoria: Optional[CategoriaSimple] = None

    class Config:
        from_attributes=True # Permite trabajar con objetos ORM (SQLAlchemy) directamente
        