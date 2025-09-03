from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.orm import joinedload, selectinload
from typing import List
import os
import shutil
import re
from urllib.parse import quote
from datetime import datetime
from app.db.database import SessionLocal
from app.models.DocumentoModel import Documento
from app.models.CategoriaModel import Categoria
from fastapi import Request
from app.schemas.DocumentSchema import DocumentoCreate, DocumentoRead
from app.config import UPLOAD_DIR
from app.config import CATEGORIAS_DIR
from app.db.database import get_db

router = APIRouter()

#Crear un documento
@router.post("/", response_model=DocumentoRead)
def crear_documento_con_archivo(
    titulo: str = Form(...),
    contenido: str = Form(None),
    archivo: UploadFile = File(...),
    categoria_id: int = Form(...),
    db: Session = Depends(get_db)
):
    # Asegúrate de que el directorio exista
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Verificar que la categoría exista
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # Ruta al directorio de la categoría
    categoria_dir = os.path.join(CATEGORIAS_DIR, categoria.nombre)
    os.makedirs(categoria_dir, exist_ok=True)

    # Limpia el nombre: reemplaza espacios por guiones bajos y elimina caracteres raros
    nombre_archivo = re.sub(r"[^\w\-_\.]", "_", archivo.filename)

    # Guardar archivo en disco
    ruta_archivo = os.path.join(categoria_dir, nombre_archivo)
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # Crear el documento con la ruta del archivo
    nuevo_documento = Documento(
        titulo=titulo,
        contenido=contenido,
        fecha_creacion=datetime.utcnow(),
        ruta_archivo=nombre_archivo,
        categoria_id=categoria_id
    )

    db.add(nuevo_documento)
    db.commit()
    db.refresh(nuevo_documento)

    return (nuevo_documento)

# Obtener todos los documentos
@router.get("/", response_model=List[DocumentoRead])
def obtener_documentos(request: Request, db: Session = Depends(get_db)):
    documentos = db.query(Documento).all()
    
    #arreglo que devuelve los documentos con la ruta publica
    documentos_read = []
    for d in documentos:
        doc = DocumentoRead.from_orm(d)

        if d.ruta_archivo and d.categoria:  # Asegura que no sea None, se arma la ruta para acceder a los archivos por categoría
            relative_path = os.path.join(d.categoria.nombre, d.ruta_archivo).replace("\\", "/")
            url_segura = quote(relative_path)
            doc.ruta_archivo = f"{request.base_url}archivos/{url_segura}"
            # DEBUG: imprime en consola la ruta generada
            print(f"[DEBUG] Documento ID={d.id} → {doc.ruta_archivo}")
        else:
            doc.ruta_archivo = None

        documentos_read.append(doc)
            
    return documentos_read

#Obtener un documento

@router.get("/buscar", response_model=List[DocumentoRead])
def buscar_documentos(
    query: str = Query(..., description="Texto a buscar por nombre de archivo o categoría"),
    db: Session = Depends(get_db)
    
):
    query_like = f"%{query.lower()}%"

    documentos = (
        db.query(Documento)
        .options(selectinload(Documento.categoria))  # Carga la categoría si la necesitas en el schema
        .filter(func.lower(Documento.titulo).like(query_like))
        .all()
    )

    return documentos