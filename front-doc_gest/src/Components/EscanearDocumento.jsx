import React from "react";

export const ScanButton = () => {
  const handleScan = async () => {
    // Implementar la funcionalidad de escaneo.
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
