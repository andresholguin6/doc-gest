import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SideBar } from "./SideBar";
import { CargarDocumento } from "./CargarDocumento";
import { Categorias } from "./Categorias";
import { CrearCategoria } from "./CrearCategoria";
import { BarraBusqueda } from "./BarraBusqueda";
import { DashboardAdmUsers } from "./DashboardAdmUsers";
import { getUserFromToken } from "../utils/auth";

export const Home = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // controla si el sidebar está abierto en móvil
  const [activeTab, setActiveTab] = useState("documentos");
  const [refreshKey, setRefreshKey] = useState(0); // Estado contador para forzar refresco
  const handleRefresh = () => setRefreshKey((prev) => prev + 1); // Incrementa el contador al crear algo

    // Si no hay token redirige al login
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/");
      }
    }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "adminUsuarios":
        if (user?.rol === "superadmin" || user?.rol === "admin") {
          return <DashboardAdmUsers />;
        }
        return <p>No tienes acceso a esta sección.</p>;

      case "documentos":
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
              Bienvenido a tu gestor documental
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-2 mb-4">
              <BarraBusqueda />
              <div className="flex gap-2 shrink-0 justify-center sm:justify-center mt-4 sm:mt-0">
                <CrearCategoria onSuccess={handleRefresh} />
                {/* onSuccess={handleRefresh}Pasa la función de refresco a CrearCategoria */}
                <CargarDocumento
                  onSuccess={handleRefresh}
                  refreshKey={refreshKey}
                />
                {/* onSuccess={handleRefresh} Pasa la función de refresco a CargarDocumento */}
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4">Categorías</h1>
            <Categorias refreshKey={refreshKey} />
            {/* refreshKey={refreshKey} Pasa el contador a Categorias para que sepa cuándo refrescar */}
            {/* <DocumentsList /> */}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Overlay oscuro cuando sidebar está abierto en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SideBar
        setActiveTab={setActiveTab}
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 bg-slate-50 overflow-auto">
        {/* Botón hamburguesa visible solo en móvil */}
        <div className="md:hidden p-4 bg-white flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600"
          >
            ☰
          </button>
          <span className="font-bold text-gray-800">DocGest</span>
        </div>
        <div className="p-4 md:p-6">{renderContent()}</div>
      </main>
    </div>
  );
};
