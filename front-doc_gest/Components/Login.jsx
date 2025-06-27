import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/usuarios/login", form);

            const { access_token } = response.data;

            // Guardamos el token en localStorage
            localStorage.setItem("token", access_token);

            // Redirigimos al home
            navigate("/home");
        } catch (err) {
            setError("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <div className="mt-6 mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Bienvenido de nuevo</h2>
                    <p className="text-sm text-gray-500 mt-1">Por favor, inicia sesión con tu cuenta</p>
                </div>

                {error && <div className="text-red-500 mb-2">{error}</div>}
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <div className="flex relative items-center mb-4 group">
                    <User className="absolute left-3 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-9 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <div className="mb-6 flex relative items-center group">
                    <Lock className="absolute left-3 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors"/>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-9 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex justify-between items-center text-sm mb-6">
                    <a href="#" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}