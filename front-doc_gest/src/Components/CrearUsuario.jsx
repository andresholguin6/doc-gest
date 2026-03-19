import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { PlusCircle, X } from "lucide-react";

export const CrearUsuario = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [errorRol, setErrorRol] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");
  const [errorUsername, setErrorUsername] = useState("");

  const validarPassword = (pass) => {
    if (pass.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (!pass.match(/[A-Z]/))
      return "La contraseña debe tener al menos una mayúscula";
    if (!pass.match(/[0-9]/))
      return "La contraseña debe tener al menos un número";
    return "";
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Ingresa un correo electrónico válido";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validarEmail(username);
    const passError = validarPassword(password);
    const rolError = !rol ? "Selecciona un rol" : "";

    setErrorUsername(emailError);
    setErrorPassword(passError);
    setErrorRol(rolError);

    if (emailError || passError || rolError) return;

    try {
      await axiosInstance.post("/usuarios/", { username, password, rol });
      setMensajeExito("¡Usuario creado con éxito!");
      setTipoMensaje("exito");
      setMostrarFormulario(false);
      setUsername("");
      setPassword("");
      setRol("");
      onSuccess(); // 👈 dispara el refresco
    } catch (error) {
      if (error.response?.status === 403) {
        setMensajeExito("No tienes permisos para crear usuarios.");
        setTipoMensaje("error");
      } else if (error.response?.status === 400) {
        setMensajeExito(error.response.data.detail);
        setTipoMensaje("error");
      } else if (error.response?.status === 422) {
        setMensajeExito("Datos inválidos, revisa el formulario.");
        setTipoMensaje("error");
      } else {
        setMensajeExito("Error del servidor, intenta de nuevo.");
        setTipoMensaje("error");
      }
      setMostrarFormulario(false);
      setUsername("");
      setPassword("");
      setRol("");
    }
  };

  useEffect(() => {
    if (mensajeExito) {
      const timer = setTimeout(() => {
        setMensajeExito("");
      }, 3000); // Desaparece en 3 segundos

      return () => clearTimeout(timer);
    }
  }, [mensajeExito]);

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          <PlusCircle size={20} />
          Crear usuario
        </button>
      </div>

      {mostrarFormulario && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-gray-600 opacity-90"></div>
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setErrorUsername("");
                setErrorPassword("");
                setErrorRol("");
                setUsername("");
                setPassword("");
                setRol("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h3 className="text-xl font-bold mb-4">Crear nuevo usuario</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* <label className="block mb-1">Username</label> */}
                <input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorUsername(validarEmail(e.target.value));
                  }}
                  className={`w-full border rounded px-3 py-2 ${
                    errorUsername ? "border-red-500" : ""
                  }`}
                />
                <p
                  className={`text-xs mt-1 ${
                    errorUsername ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {errorUsername || "Ingresa un correo electrónico válido"}
                </p>
              </div>

              <div>
                {/* <label className="block mb-1">Contraseña</label> */}
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorPassword(validarPassword(e.target.value));
                  }}
                  className={`w-full border rounded px-3 py-2 ${
                    errorPassword ? "border-red-500" : ""
                  }`}
                />
                <p
                  className={`text-xs mt-1 ${
                    errorPassword ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {errorPassword ||
                    "Mínimo 8 caracteres, una mayúscula y un número"}
                </p>
              </div>

              <div>
                {/* <label className="block mb-1">Rol</label> */}
                <select
                  value={rol}
                  onChange={(e) => {
                    setRol(e.target.value);
                    setErrorRol(e.target.value ? "" : "Selecciona un rol");
                  }}
                  className={`w-full border cursor-pointer rounded px-3 py-2 ${
                    errorRol ? "border-red-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="usuario">Usuario</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                {errorRol && (
                  <p className="text-red-500 text-xs mt-1">{errorRol}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="cursor-pointer bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setErrorUsername("");
                    setErrorPassword("");
                    setErrorRol("");
                    setRol("");
                    setUsername("");
                    setPassword("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 w-max px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300
      ${tipoMensaje === "exito" ? "bg-green-500" : ""}
      ${tipoMensaje === "info" ? "bg-blue-500" : ""}
      ${tipoMensaje === "error" ? "bg-red-50 border border-red-200" : ""} text-red-600`}
        >
          {mensajeExito}
        </div>
      )}
    </div>
  );
};
