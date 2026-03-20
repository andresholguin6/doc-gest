import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock, CheckCircle, XCircle } from "lucide-react";
import logo from "../../../assets/logo.png";

export const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmarPassword: "",
    rol: "",
  });
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmar, setErrorConfirmar] = useState("");
  const [errorRol, setErrorRol] = useState("");
  const [estado, setEstado] = useState("formulario");
  const [errorServidor, setErrorServidor] = useState("");
  const navigate = useNavigate();

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Ingresa un correo electrónico válido";
    return "";
  };

  const validarPassword = (pass) => {
    if (pass.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (!pass.match(/[A-Z]/)) return "Debe tener al menos una mayúscula";
    if (!pass.match(/[0-9]/)) return "Debe tener al menos un número";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailError = validarEmail(form.username);
    const passError = validarPassword(form.password);
    const confirmarError =
      form.password !== form.confirmarPassword
        ? "Las contraseñas no coinciden"
        : "";
    const rolError = !form.rol ? "Selecciona un tipo de cuenta" : "";

    setErrorUsername(emailError);
    setErrorPassword(passError);
    setErrorConfirmar(confirmarError);
    setErrorRol(rolError);

    if (emailError || passError || confirmarError || rolError) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/autenticacion/registro`,
        {
          username: form.username,
          password: form.password,
          rol: form.rol,
        }
      );
      setEstado("exito");
    } catch (err) {
      if (err.response?.status === 400) {
        setErrorServidor(err.response.data.detail);
      } else {
        setErrorServidor("Error del servidor, intenta de nuevo.");
      }
      setEstado("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-blue-100">
      {/* Estado éxito */}
      {estado === "exito" && (
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Cuenta creada!
          </h2>
          <p className="text-gray-500 mb-6">
            Tu cuenta fue creada exitosamente. Ya puedes iniciar sesión.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ir al login
          </button>
        </div>
      )}

      {/* Estado error */}
      {estado === "error" && (
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error al crear cuenta
          </h2>
          <p className="text-gray-500 mb-6">{errorServidor}</p>
          <button
            onClick={() => setEstado("formulario")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Estado formulario */}
      {estado === "formulario" && (
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md my-4">
          <div className="text-center mb-6">
            <img src={logo} alt="DocGest" className="w-48 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
            <p className="text-sm text-gray-500">
              Ingresa tus datos para registrarte
            </p>
          </div>

          <form onSubmit={handleRegister} noValidate>
            {/* Email */}
            <div className="mb-4">
              {/* <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label> */}
              <div className="flex relative items-center group">
                <User className="absolute left-3 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  placeholder="Correo electrónico"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={(e) => {
                    handleChange(e);
                    setErrorUsername(validarEmail(e.target.value));
                  }}
                  className={`w-full px-9 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errorUsername ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <p
                className={`text-xs mt-1 ${
                  errorUsername ? "text-red-500" : "text-gray-400"
                }`}
              >
                {errorUsername || "Ingresa un correo electrónico válido"}
              </p>
            </div>

            {/* Contraseña */}
            <div className="mb-4">
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
                    setErrorPassword(validarPassword(e.target.value));
                  }}
                  className={`w-full px-9 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errorPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <p
                className={`text-xs mt-1 ${
                  errorPassword ? "text-red-500" : "text-gray-400"
                }`}
              >
                {errorPassword ||
                  "Mínimo 8 caracteres, una mayúscula y un número"}
              </p>
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-6">
              {/* <label className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label> */}
              <div className="flex relative items-center group">
                <Lock className="absolute left-3 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  placeholder="Confirmar Contraseña"
                  type="password"
                  name="confirmarPassword"
                  value={form.confirmarPassword}
                  onChange={(e) => {
                    handleChange(e);
                    setErrorConfirmar(
                      e.target.value !== form.password
                        ? "Las contraseñas no coinciden"
                        : ""
                    );
                  }}
                  className={`w-full px-9 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errorConfirmar ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errorConfirmar && (
                <p className="text-red-500 text-xs mt-1">{errorConfirmar}</p>
              )}
            </div>

            {/* Rol */}
            <div className="mb-6">
              {/* <label className="block text-sm font-medium text-gray-700">
                Tipo de cuenta
              </label> */}
              <select
                name="rol"
                value={form.rol}
                onChange={(e) => {
                  handleChange(e);
                  setErrorRol(
                    e.target.value ? "" : "Selecciona un tipo de cuenta"
                  );
                }}
                className={`w-full px-3 py-2 mt-1 cursor-pointer border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errorRol ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled hidden>
                  Selecciona un tipo de cuenta
                </option>
                <option value="usuario">Usuario(consultar)</option>
                <option value="superadmin">
                  Administrador(consultar, crear, gestionar)
                </option>
              </select>
              {errorRol && (
                <p className="text-red-500 text-xs mt-1">{errorRol}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Crear cuenta
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};
