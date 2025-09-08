import { useEffect, useState } from "react";
import { CategoriaCard } from "../Components/CategoriaCard";
import { X } from "lucide-react";
import { VisorPdf } from "../Components/VisorPdf";

export const Categorias = () => {

    const [categorias, setCategorias] = useState([]);
    const [mostrarDocs, setMostrarDocs] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/categorias")
            .then((res) => res.json())
            .then((data) => setCategorias(data))
            .catch((err) => console.error("Error cargando categorías:", err));

    }, []);

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
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categorias.map((cat) => (
                    <div key={cat.id} onClick={() => documentos(cat)}>
                        <CategoriaCard nombre={cat.nombre} />
                    </div>
                ))}
            </div>

            {mostrarDocs && categoriaSeleccionada && (<div className=" px-4 max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-b-gray-300 flex justify-between items-center relative">
                    <h2 className="text-xl font-semibold text-gray-800">{categoriaSeleccionada.nombre}</h2>
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
                                            {new Date(documento.fecha_creacion).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2">
                                            {/* <a
                                                href={`http://localhost:8000/archivos/${categoriaSeleccionada.nombre}/${documento.ruta_archivo}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver documento
                                            </a> */}
                                            <button
                                                onClick={() =>
                                                    setDocumentoSeleccionado(
                                                        `http://localhost:8000/archivos/${categoriaSeleccionada.nombre}/${documento.ruta_archivo}`
                                                    )
                                                }
                                                className="text-blue-600 hover:underline"
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
                <VisorPdf
                    fileUrl={documentoSeleccionado}
                    open={true}
                    onClose={() => setDocumentoSeleccionado(null)}
                />
            )}
        </>


    )
}
