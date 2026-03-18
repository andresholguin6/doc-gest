import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { PlusCircle, X } from "lucide-react";

// Recibe la función de refresco
export const CrearCategoria = ({ onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorNombre, setErrorNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }

    try {
      await axiosInstance.post("/categorias/", { nombre });
      setMensaje("Categoría creada con éxito!");
      setMostrarModal(false);
      setNombre("");
      onSuccess(); // Llama al refresco después de crear exitosamente
    } catch (error) {
      if (error.response?.status === 403) {
        setMensaje("No tienes permisos para crear categorías.");
        setTipoMensaje("error");
        setNombre("");
      } else {
        setMensaje("❌ Error al cargar el documento.");
        setTipoMensaje("error");
      }
      setMostrarModal(false);
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
      }, 3000); // Desaparece en 3 segundos

      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="mb-6">
      <button
        className="flex items-center gap-2 px-4 py-2 border-1 rounded border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white cursor-pointer truncate"
        onClick={() => setMostrarModal(true)}
      >
        <PlusCircle size={20} />
        <span className="sm:hidden">Categoría</span>
        <span className="hidden sm:inline">Nueva Categoría</span>
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-gray-600 opacity-90"></div>
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => {
                setMostrarModal(false);
                setErrorNombre("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Crear Categoría</h2>

            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrorNombre(
                    e.target.value.trim() ? "" : "El nombre es obligatorio"
                  );
                }}
                className={`border border-gray-300 rounded-md px-3 py-2 ${
                  errorNombre ? "border-red-500" : ""
                }`}
              />
              {errorNombre && (
                <p className="text-red-500 text-sm">{errorNombre}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setErrorNombre("")
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mensaje de confirmacion de que se creó la categoría */}
      {mensaje && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 w-max px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300
        ${tipoMensaje === "exito" ? "bg-green-500" : ""}
        ${tipoMensaje === "info" ? "bg-blue-500" : ""}
        ${tipoMensaje === "error" ? "bg-red-500" : ""} text-white`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
};
