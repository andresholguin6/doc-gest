from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    rol = Column(String, default="usuario")  # Opcional: puedes poner 'admin', 'usuario', etc.