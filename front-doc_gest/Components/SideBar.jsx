
export const SideBar = () => {
    return (
        <aside className="w-64 bg-white-600 text-gray-400 h-screen p-4">
            <h2 className="text-xl font-bold mb-6">DocGest</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <a href="#" className="hover:text-blue-300">Inicio</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-blue-300">Documentos</a>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}
