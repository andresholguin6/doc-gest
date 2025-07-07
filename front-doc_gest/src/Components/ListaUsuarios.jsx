import { useEffect, useState } from "react";
import axios from "axios";

export const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuarios(response.data);
            } catch (err) {
                console.error("Error al obtener usuarios", err);
                setError("No se pudieron cargar los usuarios.");
            }
        };

        fetchUsuarios();
    }, []);

    return (
        <div className="px-4 max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-b-gray-300">
                <h2 className="text-xl font-semibold text-gray-800">Usuarios Registrados</h2>
            </div>

            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <table className="w-full table-fixed text-center text-sm">
                <thead className="text-gray-600 border-b-gray-300">
                    <tr className="bg-gray-200">
                        <th className="w-1/2 p-2">Nombre</th>
                        <th className=" w-1/2 p-2">Rol</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b border-b-gray-300 last:border-none hover:bg-gray-100">
                            <td className="p-2">{usuario.username}</td>
                            <td className="p-2 capitalize">{usuario.rol}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};