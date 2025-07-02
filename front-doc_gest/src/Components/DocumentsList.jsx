import { useEffect, useState } from "react";
import axios from "axios";


export const DocumentsList = () => {

    const [documentos, setDocumentos] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/documentos/")
            .then((res) => {
                console.log(res.data)
                setDocumentos(res.data)
            })
            .catch((err) => console.error("Error al cargar documentos", err));
    }, []);

    return (
        <div className=" px-4 max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-b-gray-300">
                <h2 className="text-xl font-semibold text-gray-800">Documentos</h2>
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
                        {documentos.map((doc) => (
                            <tr key={doc.id} className="border-b border-b-gray-300 last:border-none hover:bg-gray-100">
                                <td className="px-2 py-2 truncate">{doc.titulo}</td>
                                <td className="px-2 py-2 ">{new Date(doc.fecha_creacion).toLocaleDateString()}</td>
                                <td className="px-2 py-2">
                                    <a
                                        href={doc.ruta_archivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver documento
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
