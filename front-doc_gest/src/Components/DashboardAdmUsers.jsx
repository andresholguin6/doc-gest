import { useState } from "react";
import { CrearUsuario } from "./CrearUsuario";
import { ListaUsuarios} from "./ListaUsuarios"

export const DashboardAdmUsers = () => {

    const [refreshKey, setRefreshKey] = useState(0); // contador de refresco
    const handleRefresh = () => setRefreshKey(prev => prev + 1); // incrementa al crear usuario
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Panel de administración</h2>
            <CrearUsuario onSuccess={handleRefresh} /> {/* pasa el callback */}
            <ListaUsuarios refreshKey={refreshKey}/> {/* pasa el contador */}
        </div>
    );
}