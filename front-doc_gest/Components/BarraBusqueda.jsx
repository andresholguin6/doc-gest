import { useState } from 'react'
import axios from 'axios'

export const BarraBusqueda = () => {

    const [query, setQuery] = useState('')
    const [resultados, setResultados] = useState([])
    const [cargando, setCargando] = useState(false)
    const [buscado, setBuscado] = useState(false)

    const manejarBusqueda = async (e) => {
        e.preventDefault()
        if (query.trim() === '') return

        setCargando(true)
        setBuscado(true)
        try {
            const res = await axios.get('http://localhost:8000/documentos/buscar', {
                params: { query },
            })
            setResultados(res.data)
        } catch (err) {
            console.error('Error al buscar documentos:', err)
            setResultados([])
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={manejarBusqueda} className="flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar documentos..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={cargando}
                >
                    {cargando ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {/* Resultados */}
            <div className="mt-6 space-y-4">
                {buscado && !cargando && resultados.length === 0 ? (
                    <p className="text-gray-500 text-center">No se encontraron documentos.</p>
                ) : (
                    resultados.map((doc) => (
                        <div key={doc.id} className="p-4 border rounded-md bg-white shadow">
                            <h2 className="text-lg font-semibold">{doc.titulo}</h2>
                            <p className="text-sm text-gray-600">{doc.contenido}</p>
                            {doc.categoria && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Categoría: {doc.categoria.nombre}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
