from fastapi import HTTPException
from .roles import ROLES_PERMISOS

'''
funcion que valida que el usuario con un rol determina pueda
'''
def verificar_permiso(rol: str, permiso: str):
    permisos = ROLES_PERMISOS.get(rol, [])
    if permiso not in permisos:
        raise HTTPException(
            status_code=403,
            detail=f"No tienes permiso para '{permiso}'"
        )