import { useState } from "react";

import { SideBar } from "./SideBar"
import { DocumentsList } from "./DocumentsList"
import { CargarDocumento } from "./CargarDocumento";
import { Categorias } from "./Categorias";
import { CrearCategoria } from "./CrearCategoria";
import { BarraBusqueda } from "./BarraBusqueda";
import { DashboardAdmUsers } from "./DashboardAdmUsers"
import { getUserFromToken } from "../utils/auth";

export const Home = () => {

  const user = getUserFromToken();
  const [activeTab, setActiveTab] = useState("documentos");

  const renderContent = () => {
    switch (activeTab) {
      case "adminUsuarios":
        if (user?.rol === "superadmin") {
          return <DashboardAdmUsers />;
        }
        return <p>No tienes acceso a esta sección.</p>;

      case "documentos":
      default:
        return (
          <>
            <h1 className="text-2xl font-semibold mb-4">Bienvenido a tu gestor documental</h1>
            <div className="flex justify-between gap-2">
              <BarraBusqueda />
              <div className="flex gap-2">
                <CrearCategoria />
                <CargarDocumento />
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4">Categorías</h1>
            <Categorias />
            {/* <DocumentsList /> */}
          </>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar setActiveTab={setActiveTab} user={user} />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

