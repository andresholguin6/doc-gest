'''
diccionario para definir los permisos que tendran los roles de los usuarios de la app con respecto
a el tratamiento de los documentos.
'''

ROLES_PERMISOS = {
    "usuario": ["ver"],
    "admin": ["ver", "descargar"],
    "impresion": ["ver", "imprimir"],
    "superadmin": ["ver", "descargar", "imprimir"]
}