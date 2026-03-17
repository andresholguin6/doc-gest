import React from "react";
import { useEffect, useState } from "react";
import { CategoriaCard } from "../Components/CategoriaCard";
import { X, FileText } from "lucide-react";
import { VisorPdfRv } from "../Components/VisorPdfRv";
import axiosInstance from "../utils/axios";
import { getUserFromToken } from "../utils/auth";

// Recibe el contador como prop
export const Categorias = ({ refreshKey }) => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarDocs, setMostrarDocs] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/categorias/")
      .then((res) => {
        setCategorias(res.data);
        if (categoriaSeleccionada) {
          const actualizada = res.data.find(
            (c) => c.id === categoriaSeleccionada.id
          );
          if (actualizada) setCategoriaSeleccionada(actualizada);
        }
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, [refreshKey]); // Se vuelve a ejecutar cada vez que refreshKey cambia

  const documentos = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setMostrarDocs(true);
  };

  const cerrarDocumentos = () => {
    setMostrarDocs(false);
    setCategoriaSeleccionada(null);
  };

  return (
    <>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categorias.map((cat) => (
          <React.Fragment key={cat.id}>
            <div>
              <div onClick={() => documentos(cat)}>
                <CategoriaCard nombre={cat.nombre} />
              </div>

              {/* Lista debajo de cada categoría — solo visible en móvil */}
              {mostrarDocs && categoriaSeleccionada?.id === cat.id && (
                <div className="sm:col-span-full mt-6 bg-white shadow-md rounded-lg overflow-hidden md:hidden">
                  <div className="p-3 border-b border-gray-300 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {cat.nombre}
                    </h2>
                    <button
                      onClick={cerrarDocumentos}
                      className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <table className="w-full table-fixed text-center text-xs">
                    <thead className="text-gray-600 border-b border-gray-300">
                      <tr>
                        <th className="w-1/3 px-2 py-2">Título</th>
                        <th className="w-1/3 px-2 py-2">Fecha</th>
                        <th className="w-1/3 px-2 py-2">Ver</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {cat.documentos.length > 0 ? (
                        cat.documentos.map((documento) => (
                          <tr
                            key={documento.id}
                            className="border-b border-gray-300 last:border-none hover:bg-gray-100"
                          >
                            <td className="px-2 py-2 truncate">
                              {documento.titulo}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              {new Date(
                                documento.fecha_creacion
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-2 py-2">
                              <button
                                onClick={() =>
                                  setDocumentoSeleccionado(
                                    `${import.meta.env.VITE_API_URL}/archivos/${
                                      cat.nombre
                                    }/${documento.ruta_archivo}`
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                <FileText size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-4 text-gray-500">
                            Sin documentos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Lista debajo de la grilla — solo visible en desktop */}
      {mostrarDocs && categoriaSeleccionada && (
        <div className="hidden md:block px-4 max-w-4xl mx-auto mt-4 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-b-gray-300 flex justify-between items-center relative">
            <h2 className="text-xl font-semibold text-gray-800">
              {categoriaSeleccionada.nombre}
            </h2>
            <button
              onClick={cerrarDocumentos}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <X />
            </button>
          </div>
          <div className="">
            <table className="w-full table-fixed text-center text-sm">
              <thead className="text-gray-600 border-b border-b-gray-300">
                <tr>
                  <th className="w-1/3 px-2 py-2">Título</th>
                  <th className="w-1/3 px-2 py-2">Fecha de creación</th>
                  <th className="w-1/3 px-2 py-2">Enlace</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {categoriaSeleccionada.documentos.length > 0 ? (
                  categoriaSeleccionada.documentos.map((documento) => (
                    <tr
                      key={documento.id}
                      className="border-b border-b-gray-300 last:border-none hover:bg-gray-100"
                    >
                      <td className="px-2 py-2 truncate">{documento.titulo}</td>
                      <td className="px-2 py-2">
                        {new Date(
                          documento.fecha_creacion
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() =>
                            setDocumentoSeleccionado(
                              `${import.meta.env.VITE_API_URL}/archivos/${
                                categoriaSeleccionada.nombre
                              }/${documento.ruta_archivo}`
                            )
                          }
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          Ver documento
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-gray-500">
                      No hay documentos en esta categoría.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* 👇 si hay documento seleccionado, muestra visor */}
      {documentoSeleccionado && (
        <VisorPdfRv
          fileUrl={documentoSeleccionado}
          open={true}
          onClose={() => setDocumentoSeleccionado(null)}
          user={getUserFromToken()}
        />
      )}
    </>
  );
};
