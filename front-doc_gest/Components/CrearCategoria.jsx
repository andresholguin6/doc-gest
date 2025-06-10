import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";

export const CrearCategoria = () => {

  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/categorias", { nombre });
      setMensaje("Categoría creada con éxito!");
      setMostrarModal(false);
      setNombre("")
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setMensaje("Error al crear categoría");
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
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        onClick={() => setMostrarModal(true)}
      >
        <PlusCircle size={20} />
        Nueva Categoría
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-gray-600 opacity-90"></div>
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Crear Categoría</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
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
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300">{mensaje}</div>
      )}
    </div>
  )
}
