import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock, Loader2 } from "lucide-react";
import logo from "../../../assets/logo.png";
import LoginHome from "../../../assets/LoginHome.png";

export const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validación de campos
    let valido = true;
    if (!form.username.trim()) {
      setErrorUsername("El correo es obligatorio");
      valido = false;
    }
    if (!form.password.trim()) {
      setErrorPassword("La contraseña es obligatoria");
      valido = false;
    }
    if (!valido) return;
    setError("");
    setLoading(true);
    setShowSlowMessage(false);

    // Si tarda más de 5 segundos, mostramos el mensaje
    timerRef.current = setTimeout(() => {
      setShowSlowMessage(true);
    }, 5000);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/autenticacion/login`,
        form
      );

      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
        setTipoMensaje("error");
      } else if (err.response?.status === 422) {
        setError("Ingresa un correo y contraseña válidos.");
        setTipoMensaje("error");
      } else {
        setError("Error del servidor, intenta de nuevo.");
        setTipoMensaje("error");
      }
    } finally {
      clearTimeout(timerRef.current);
      setLoading(false);
      setShowSlowMessage(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Desaparece en 3 segundos

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Limpiamos el timer si el componente se desmonta
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className="min-h-screen flex bg-blue-100"
      // style={{
      //   background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      // }}
    >
      {/* Panel izquierdo — solo visible en desktop */}
      <div className="hidden md:flex w-1/2 lg:w-3/5 flex-col items-center justify-center px-8 text-gray-600">
        <h2 className="text-2xl xl:text-5xl font-bold mb-4">
          Gestiona tus documentos
        </h2>
        <p className="text-blue-500 text-lg mb-8 text-center">
          Organiza, visualiza y comparte documentos PDF de forma segura y
          eficiente.
        </p>
        <img
          src={LoginHome}
          alt="Dashboard"
          className="rounded-xl shadow-2xl w-full max-w-2xl opacity-90"
        />
      </div>

      {/* Panel derecho — formulario */}

      <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen flex items-center justify-center bg-blue-100 px-8">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-4 sm:mx-auto"
        >
          <div className=" mb-6 text-center">
            <img src={logo} alt="DocGest" className="w-100 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">
              Inicio de sesión
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Por favor, inicia sesión con tu cuenta
            </p>
          </div>

          {/* {error && <div className="text-red-500 mb-2">{error}</div>} */}

          {showSlowMessage && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">
              <Loader2 className="w-4 h-4 mt-0.5 animate-spin shrink-0" />
              <span>
                El servidor está iniciando, esto puede tardar hasta 60 segundos.
                Por favor espera...
              </span>
            </div>
          )}

          <div className="mb-4">
            {/* <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label> */}
            <div className="flex relative items-center group">
              <User className="absolute left-3 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Usuario"
                type="text"
                name="username"
                value={form.username}
                onChange={(e) => {
                  handleChange(e);
                  setErrorUsername(
                    e.target.value.trim() ? "" : "El correo es obligatorio"
                  );
                }}
                className={`w-full px-9 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errorUsername ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errorUsername && (
              <p className="text-red-500 text-sm mt-1">{errorUsername}</p>
            )}
          </div>

          <div className="mb-6">
            {/* <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label> */}
            <div className="flex relative items-center group">
              <Lock className="absolute left-3 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Contraseña"
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => {
                  handleChange(e);
                  setErrorPassword(
                    e.target.value.trim() ? "" : "La contraseña es obligatoria"
                  );
                }}
                className={`w-full px-9 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errorPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errorPassword && (
              <p className="text-red-500 text-sm mt-1">{errorPassword}</p>
            )}
          </div>
          <div className="flex-col justify-between items-center text-sm mb-6">
            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Regístrate
              </a>
            </p>
            <p className="text-center">
              <a href="#" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center mb-4 bg-blue-600 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>

      {/* Mensaje de eror */}
      {error && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 w-max px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300
      ${tipoMensaje === "exito" ? "bg-green-500" : ""}
      ${tipoMensaje === "info" ? "bg-blue-500" : ""}
      ${
        tipoMensaje === "error" ? "bg-red-50 border border-red-200" : ""
      } text-red-600`}
        >
          {error}
        </div>
      )}
    </div>
  );
};
