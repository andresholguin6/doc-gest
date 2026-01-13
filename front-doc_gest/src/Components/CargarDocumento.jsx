
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Upload } from "lucide-react";
import { ScanButton } from "./EscanearDocumento";

export const CargarDocumento = () => {
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");


  useEffect(() => {
    const ObtenerCategorias = async () => {
      try {
        const res = await fetch("http://localhost:8000/categorias/");
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };

    ObtenerCategorias();
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("contenido", contenido);
    formData.append("archivo", archivo);
    formData.append("categoria_id", categoriaId);

    try {
      const response = await fetch("http://localhost:8000/documentos/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMensajeExito("📄 ¡Documento cargado con éxito!");
        setTipoMensaje("exito"); // bg toast color verde
        setShowModal(false);
        setTitulo("");
        setContenido("");
        setArchivo(null);
        setCategoriaId("");
        // Opcional: refrescar lista
      } else {
        throw new Error("Error al subir el documento");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        setMensajeExito("");
      }, 3000); // Desaparece en 3 segundos

      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  return (
    <div className="">
      {/* Botón para abrir el modal */}
      <button
        onClick={() => setShowModal(true)}
        className=" flex items-center gap-2 top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
      >
        <Upload size={20} />
        Cargar Documento
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center ">
          {/* Fondo oscuro con opacidad */}
          <div className="absolute inset-0 bg-gray-600 opacity-90"></div>
          {/* Contenido del modal que recibe los datos de creacion de documento */}
          <div className="relative z-50 bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

            <button
              onClick={() => {
                setShowModal(false);
                setTitulo("");
                setContenido("");
                setCategoriaId("");
                setArchivo(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Nuevo Documento</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <div>
                <label className="block font-semibold mb-4">Categoría</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar archivo
                </label>

                <div className="flex items-center space-x-4">
                  {/* Botón personalizado que dispara el input */}
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200">
                    Elegir archivo
                    <input
                      type="file"
                      onChange={(e) => setArchivo(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {/* Mostrar el nombre del archivo seleccionado */}
                  {archivo && (
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {archivo.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <ScanButton
                setArchivo={setArchivo}
                onSuccess={(msg, tipo) => {
                  setMensajeExito(msg);
                  setTipoMensaje(tipo);
                }}
              />
              <button
                onClick={handleUpload}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Cargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300
      ${tipoMensaje === "exito" ? "bg-green-500" : ""}
      ${tipoMensaje === "info" ? "bg-blue-500" : ""}
      ${tipoMensaje === "error" ? "bg-red-500" : ""}text-white`}>{mensajeExito}</div>
      )}
    </div>
  );
}
