import { useNavigate } from "react-router-dom";

export const SideBar = ({ setActiveTab, user }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); //Elimina el token
        navigate("/"); // Redirige al login
    };
    return (
        <aside className="w-64 bg-white-600 text-gray-400 h-screen p-4">
            <h2 className="text-xl font-bold mb-6">DocGest</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <a href="#" className="hover:text-blue-300">Inicio</a>
                    </li>
                    <li className="mb-4">
                        <button
                            onClick={() => setActiveTab("documentos")}
                            className="hover:text-blue-300 text-left w-full cursor-pointer"
                        >
                            Documentos
                        </button>
                    </li >
                    {user?.rol === "superadmin" && (
                        <li className="mb-4">
                            <button
                                onClick={() => setActiveTab("adminUsuarios")}
                                className="hover:text-blue-300 text-left w-full cursor-pointer"
                            >
                                Admin usuarios
                            </button>
                        </li>
                    )}
                    <li className="mb-4">
                        <button
                            onClick={handleLogout}
                            className="hover:text-blue-300 text-left w-full cursor-pointer"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}
