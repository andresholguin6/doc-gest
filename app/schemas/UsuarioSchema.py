from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    username: str
    password: str
    rol: str = "usuario"  # valor por defecto
    
    class Config:
        orm_mode = True
        
class UsuarioResponse(BaseModel):
    id: int
    username: str
    rol: str

    class Config:
        orm_mode = True
        
class UsuarioLogin(BaseModel):
    username: str
    password: str
    

class Token(BaseModel):
    access_token: str
    token_type: str