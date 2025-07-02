import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Token inválido o expirado");
        return null;
    }
}