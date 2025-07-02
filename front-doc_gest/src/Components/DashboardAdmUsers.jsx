import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth"; // o de donde estés decodificando el token

export const DashboardAdmUsers = () => {
    // const navigate = useNavigate();
    // const user = getUserFromToken(); // decodifica el token guardado

    // useEffect(() => {
    //     if (!user || user.rol !== "superadmin") {
    //         navigate("/"); // redirige si no es superadmin
    //     }
    // }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Panel de administración</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
                    <p className="text-gray-600 text-sm">Crear y administrar cuentas de usuario.</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Permisos</h3>
                    <p className="text-gray-600 text-sm">Asignar roles y gestionar permisos de acceso.</p>
                </div>
            </div>
        </div>
    );
}