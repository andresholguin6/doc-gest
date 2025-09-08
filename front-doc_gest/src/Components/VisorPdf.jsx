
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X, Download, Printer } from "lucide-react";


// Worker de pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();


export function VisorPdf({ fileUrl, open, onClose }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // nombre del archivo
    link.click();
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = fileUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  if (!open) return null; // No renderiza nada si el modal está cerrado

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-90">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-lg flex flex-col">
        {/* Barra superior */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Visor de Documento</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200"
              title="Descargar"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-black"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenedor PDF scrollable */}
        <div className="flex justify-center items-start w-full h-full overflow-y-auto bg-gray-500">
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-4 shadow-md mx-auto"
                width={Math.min(window.innerWidth * 0.9, 900)} // 👈 90% del ancho, máx 900px
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
