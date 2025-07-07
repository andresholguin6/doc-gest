import { useState } from "react";
import { CrearUsuario } from "./CrearUsuario";
import { ListaUsuarios} from "./ListaUsuarios"

export const DashboardAdmUsers = () => {

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Panel de administración</h2>
            <CrearUsuario />
            <ListaUsuarios/>
        </div>
    );
}