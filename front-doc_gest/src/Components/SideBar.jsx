import { useNavigate } from "react-router-dom";
import { Home, FileText, Users, LogOut } from "lucide-react";
import logo from "../../../assets/logo.png";

export const SideBar = ({
  setActiveTab,
  user,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token"); //Elimina el token
    localStorage.removeItem("refresh_token"); //Elimina el refresh token
    navigate("/"); // Redirige al login
  };
  return (
    <aside
      className={`
            fixed md:static inset-y-0 left-0 z-30
            w-64 bg-white text-gray-400 h-screen p-4
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
        `}
    >
      <div className="flex justify-between items-center mb-6">
        <img src={logo} alt="DocGest" className="w-90 mx-auto mb-6" />

        {/* Botón cerrar sidebar en móvil */}
        {/* <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-500 text-xl"
        >
          ✕
        </button> */}
      </div>

      {/* Info del usuario */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user.sub?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user.sub}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
          </div>
        </div>
      )}
      {/* Navegación */}
      <nav>
        <ul>
          <li className="mb-2">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <Home size={18} />
              <span>Inicio</span>
            </a>
          </li>
          <li className="mb-2">
            <button
              onClick={() => {
                setActiveTab("documentos");
                setSidebarOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors w-full text-left cursor-pointer"
            >
              <FileText size={18} />
              <span>Documentos</span>
            </button>
          </li>
          {(user?.rol === "superadmin" || user?.rol === "admin") && (
            <li className="mb-2">
              <button
                onClick={() => {
                  setActiveTab("adminUsuarios");
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors w-full text-left cursor-pointer"
              >
                <Users size={18} />
                <span>Admin usuarios</span>
              </button>
            </li>
          )}
          <li className="mb-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
