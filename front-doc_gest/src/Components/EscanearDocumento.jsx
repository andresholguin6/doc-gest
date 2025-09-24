import React from "react";

export const ScanButton = ({ setArchivo, onSuccess }) => {
  const handleScan = async () => {
    try {
      // 1. Llamar al servicio local de escaneo
      const response = await fetch("http://localhost:5000/scan", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error en el servicio local de escaneo");
      }

      // 2. Obtener el PDF como Blob
      const blob = await response.blob();
      const file = new File([blob], "scan.pdf", { type: "application/pdf" });

      // 3. Guardamos en el mismo estado que usa el input file
      setArchivo(file);

      // 4. Avisar al modal que el escaneo fue exitoso
      if (onSuccess) {
        onSuccess("📄 Documento escaneado con éxito!", "info");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <button
      onClick={handleScan}
      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Escanear
    </button>
  );
};
