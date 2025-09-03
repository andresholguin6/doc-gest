from pydantic import BaseModel
from typing import List

class UsuarioCreate(BaseModel):
    username: str
    password: str
    rol: str = "usuario"  # valor por defecto
    
    class Config:
        from_attributes=True
        
class UsuarioResponse(BaseModel):
    id: int
    username: str
    rol: str

    class Config:
        from_attributes=True
        
class UsuarioLogin(BaseModel):
    username: str
    password: str
    

class Token(BaseModel):
    access_token: str
    token_type: str
    
class UsuarioConPermisos(BaseModel):
    id: int
    username: str
    rol: str
    permisos: List[str]

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioConPermisos