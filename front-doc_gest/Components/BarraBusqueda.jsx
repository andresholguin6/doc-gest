import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export const BarraBusqueda = () => {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [buscado, setBuscado] = useState(false);

    const resultadosRef = useRef(null);
    const debounceTimeout = useRef(null); // 👈 para guardar el timer

    // 🔑 useEffect con debounce manual para cargar la busqueda automaticamente letra por letra
    useEffect(() => {
        // Si el campo está vacío, limpiar todo
        if (query.trim() === '') {
            setResultados([]);
            setBuscado(false);
            return;
        }

        // Limpiar cualquier timer anterior
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Crear un nuevo timer
        debounceTimeout.current = setTimeout(() => {
            const buscar = async () => {
                setCargando(true);
                try {
                    const res = await axios.get('http://localhost:8000/documentos/buscar', {
                        params: { query },
                    });
                    setResultados(res.data);
                    setBuscado(true);
                } catch (err) {
                    console.error('Error:', err);
                    setResultados([]);
                } finally {
                    setCargando(false);
                }
            };

            buscar();
        }, 500); // ⏱️ Espera 500 ms después de que el usuario deje de escribir

        // Cleanup: si se desmonta o cambia query antes de que pase el tiempo
        return () => clearTimeout(debounceTimeout.current);
    }, [query]);

    // ✅ Click fuera para cerrar la lista
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (resultadosRef.current && !resultadosRef.current.contains(e.target)) {
                setBuscado(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-100 mx-auto">
            <div className="flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar documentos..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
                />
            </div>

            {/* Resultados */}
            {buscado && (
                <div ref={resultadosRef} className="absolute w-100 space-y-4 rounded-md">
                    {!cargando && resultados.length === 0 ? (
                        <div className="p-4 rounded-md bg-white shadow">
                            <p className="text-gray-500 text-center">No se encontraron documentos.</p>
                        </div>
                    ) : (
                        <table className="table-auto w-full border border-gray-300 bg-white shadow rounded-md">
                            <tbody>
                                {resultados.map((doc) => (
                                    <tr key={doc.id} className="last:border-b-0 hover:bg-gray-100">
                                        <td className="px-4 py-2 font-semibold text-gray-800">{doc.titulo}</td>
                                        <td className="px-4 py-2 text-gray-600">{doc.contenido}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {cargando && (
                        <div className="p-4 rounded-md bg-white shadow">
                            <p className="text-gray-500 text-center">Buscando...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};