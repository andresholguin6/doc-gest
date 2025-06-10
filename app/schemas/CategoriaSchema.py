from typing import List
from pydantic import BaseModel
from datetime import datetime


#esta clase se crea para poder armar la respuesta y poder ver el json con la categoria y sus respectivos documentos
#ya que importar las clases Response y Read en ambos archivos da conflicto de importacion circular.
class DocumentoSimple(BaseModel):
    id: int
    titulo: str
    contenido: str | None = None
    ruta_archivo: str | None = None
    fecha_creacion: datetime | None = None

class CategoriaBase(BaseModel):
    nombre: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaSimple(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class CategoriaResponse(CategoriaBase):
    id: int
    nombre: str
    documentos: List[DocumentoSimple] = []

    class Config:
        #obligatoriamente se deben activar los atributos de rom en todos los schemas para
        #armar las respuestas json con las relaciones
        from_attributes=True
        
