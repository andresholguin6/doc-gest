from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.db.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    contenido = Column(String)
    ruta_archivo = Column(String, nullable=True)  # Aquí guardamos la ruta del PDF
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

     # Nueva relación con categoría
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="documentos")