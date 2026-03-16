import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Instancia de axios con la URL base
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el servidor responde 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_URL}/autenticacion/refresh`, {
          refresh_token,
        });

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        // Reintenta la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Si falla el refresh, limpia los tokens y redirige al login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

/*
Este archivo configura una instancia global de axios para toda la aplicación.

Tiene dos interceptores:
- Request: agrega automáticamente el token JWT en el header Authorization
  de cada petición, sin necesidad de hacerlo manualmente en cada componente.

- Response: maneja los errores 401 (No autorizado). Si el access token expiró,
  intenta renovarlo automáticamente usando el refresh token. Si el refresh
  también falla, limpia los tokens del localStorage y redirige al usuario
  al login.

Todos los componentes deben importar esta instancia en lugar del axios original.
*/