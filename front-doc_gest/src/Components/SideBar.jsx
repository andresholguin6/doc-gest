import { useNavigate } from "react-router-dom";

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
        <h2 className="text-xl font-bold text-gray-800">DocGest</h2>
        {/* Botón cerrar sidebar en móvil */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="hover:text-blue-300">
              Inicio
            </a>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                setActiveTab("documentos");
                setSidebarOpen(false);
              }}
              className="hover:text-blue-300 text-left w-full cursor-pointer"
            >
              Documentos
            </button>
          </li>
          {user?.rol === "superadmin" && (
            <li className="mb-4">
              <button
                onClick={() => {
                  setActiveTab("adminUsuarios");
                  setSidebarOpen(false);
                }}
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
  );
};
