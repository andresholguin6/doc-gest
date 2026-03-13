from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Query,
    logger,
)

from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from typing import List
import os
import shutil
import re
from urllib.parse import quote
from datetime import datetime
from app.models.DocumentoModel import Documento
from app.models.CategoriaModel import Categoria
from fastapi import Request
from app.schemas.DocumentSchema import DocumentoRead
from app.config import CATEGORIAS_DIR
from app.db.database import get_db
from app.models.UsuarioModel import Usuario
from app.auth import get_current_user
from app.permisos import verificar_permiso

router = APIRouter()


# Crear un documento
@router.post("/", response_model=DocumentoRead)
def crear_documento_con_archivo(
    titulo: str = Form(...),
    contenido: str = Form(None),
    archivo: UploadFile = File(...),
    categoria_id: int = Form(...),
    db: Session = Depends(get_db),
    user: Usuario = Depends(get_current_user),  # ← Usuario autenticado
):
    # Solo roles con permiso "crear" pueden subir documentos
    verificar_permiso(user.rol, "crear")

    # Verificar que la categoría exista
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Ruta al directorio de la categoría
    categoria_dir = os.path.join(CATEGORIAS_DIR, categoria.nombre)
    os.makedirs(categoria_dir, exist_ok=True)

    # Limpia el nombre: reemplaza espacios por guiones bajos y elimina caracteres raros
    nombre_archivo = re.sub(r"[^\w\-_\.]", "_", archivo.filename)
    ruta_archivo = os.path.join(categoria_dir, nombre_archivo)

    # Guardar archivo en disco
    try:
        with open(ruta_archivo, "wb") as buffer:
            shutil.copyfileobj(archivo.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al guardar el archivo: {str(e)}"
        )

    # Crear el documento en la base de datos
    try:
        nuevo_documento = Documento(
            titulo=titulo,
            contenido=contenido,
            fecha_creacion=datetime.utcnow(),
            ruta_archivo=nombre_archivo,
            categoria_id=categoria_id,
        )
        db.add(nuevo_documento)
        db.commit()
        db.refresh(nuevo_documento)
    except Exception as e:
        # Si falla la BD, elimina el archivo que ya se guardó en disco
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
        raise HTTPException(
            status_code=500, detail=f"Error al guardar en base de datos: {str(e)}"
        )

    return nuevo_documento


@router.get("/", response_model=List[DocumentoRead])
def obtener_documentos(
    request: Request,
    db: Session = Depends(get_db),
    user: Usuario = Depends(get_current_user) # ← Usuario autenticado
):
    try:
        documentos = db.query(Documento).all()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al obtener documentos: {str(e)}"
        )

    documentos_read = []
    for d in documentos:
        doc = DocumentoRead.from_orm(d)
        if d.ruta_archivo and d.categoria:
            relative_path = os.path.join(d.categoria.nombre, d.ruta_archivo).replace(
                "\\", "/"
            )
            url_segura = quote(relative_path)
            doc.ruta_archivo = f"{request.base_url}archivos/{url_segura}"
            logger.debug(f"Documento ID={d.id} → {doc.ruta_archivo}")
        else:
            doc.ruta_archivo = None
        documentos_read.append(doc)

    return documentos_read


# Obtener un documento
@router.get("/buscar", response_model=List[DocumentoRead])
def buscar_documentos(
    query: str = Query(
        ..., description="Texto a buscar por nombre de archivo o categoría"
    ),
    db: Session = Depends(get_db),
):
    try:
        query_like = f"%{query.lower()}%"
        documentos = (
            db.query(Documento)
            .options(selectinload(Documento.categoria))
            .filter(func.lower(Documento.titulo).like(query_like))
            .all()
        )

        return documentos

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al buscar documentos: {str(e)}"
        )
