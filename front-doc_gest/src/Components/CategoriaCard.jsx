import { Folder } from "lucide-react";

export const CategoriaCard = ({ nombre }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition duration-300 cursor-pointer">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Folder className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">{nombre}</h2>
        </div>
    )
}
