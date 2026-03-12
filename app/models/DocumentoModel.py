from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.db.database import Base
from datetime import datetime, timezone
from sqlalchemy.orm import relationship


class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True, nullable=False )
    contenido = Column(String)
    ruta_archivo = Column(String, nullable=True)  # Aquí guardamos la ruta del PDF
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Nueva relación con categoría
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="documentos")
