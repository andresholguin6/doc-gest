import { SideBar } from "./SideBar"
import { DocumentsList } from "./DocumentsList"
import { CargarDocumento } from "./CargarDocumento";
import { Categorias } from "./Categorias";
import { CrearCategoria } from "./CrearCategoria";
import { BarraBusqueda } from "./BarraBusqueda";

export const Home = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">Bienvenido a tu gestor documental</h1>
        <div className="flex justify-end gap-2 z-40">
          <div className="self-start z-50">
            <BarraBusqueda />
          </div>
          <CrearCategoria />
          <CargarDocumento />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Categorías</h1>
        <Categorias />
        {/* <DocumentsList /> */}
      </main>
    </div>
  )
}
