from pydantic import BaseModel, field_validator
from typing import List


class UsuarioCreate(BaseModel):
    username: str
    password: str
    rol: str = "usuario"  # valor por defecto

    # Valida que la contraseña cumpla los requisitos mínimos de seguridad
    # antes de que llegue al endpoint — si no cumple, Pydantic rechaza
    # la petición automáticamente con un error 422
    @field_validator("password")
    @classmethod
    def password_seguro(cls, v):
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not any(c.isupper() for c in v):
            raise ValueError("La contraseña debe tener al menos una mayúscula")
        if not any(c.isdigit() for c in v):
            raise ValueError("La contraseña debe tener al menos un número")
        return v

    class Config:
        from_attributes = True


class UsuarioResponse(BaseModel):
    id: int
    username: str
    rol: str

    class Config:
        from_attributes = True


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
    refresh_token: str
    token_type: str
    usuario: UsuarioConPermisos
