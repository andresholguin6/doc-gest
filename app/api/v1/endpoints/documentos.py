from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
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
    
    documentos_read = []
    for d in documentos:
        doc = DocumentoRead.from_orm(d)

        if d.ruta_archivo:  # Asegura que no sea None
            url_segura = quote(str(d.ruta_archivo))
            doc.ruta_archivo = f"{request.base_url}archivos/{url_segura}"
        else:
            doc.ruta_archivo = None

        documentos_read.append(doc)
            
    return documentos_read

#Obtener un documento
@router.get("/archivo/{documento_id}")
def obtener_archivo(documento_id: int, db: Session = Depends(get_db)):
    documento = db.query(Documento).filter(Documento.id == documento_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    if not documento.ruta_archivo or not os.path.isfile(documento.ruta_archivo):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    return FileResponse(documento.ruta_archivo, media_type='application/pdf')