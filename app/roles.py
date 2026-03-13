'''
diccionario para definir los permisos que tendran los roles de los usuarios de la app con respecto
a el tratamiento de los documentos.
'''

ROLES_PERMISOS = {
    "usuario": ["ver"],
    "editor": ["ver", "crear"],
    "admin": ["ver", "crear", "descargar", "imprimir", "gestionar_usuarios"],
    "superadmin": ["ver", "crear", "descargar", "imprimir", "gestionar_usuarios", "gestionar_roles"]
}