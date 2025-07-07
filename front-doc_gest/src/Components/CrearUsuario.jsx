import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";

export const CrearUsuario = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("usuario");
    const [mensajeExito, setMensajeExito] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8000/usuarios",  // Reemplaza si tu endpoint es diferente
                { username, password, rol },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMensajeExito("¡Usuario creado con éxito!");
            setMostrarFormulario(false)
        } catch (error) {
            console.error("Error al crear usuario", error);
            setMensajeExito("Hubo un error al crear el usuario");
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
        <div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setMostrarFormulario(true)}
                    className="flex items-center gap-2 top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                    <PlusCircle size={20} />
                    Crear usuario
                </button>
            </div>

            {mostrarFormulario && (
                <div className="fixed inset-0 flex items-center justify-center z-40">
                    <div className="absolute inset-0 bg-gray-600 opacity-90"></div>
                    <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
                        <button
                            onClick={() => setMostrarFormulario(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            <X />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Crear nuevo usuario</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Contraseña</label>
                                <input
                                    type="password"
                                    className="w-full border p-2 rounded"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Rol</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300">{mensajeExito}</div>
            )}
        </div>

    );
};