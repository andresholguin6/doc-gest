import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { X } from "lucide-react";

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

export function VisorPdfRv({ fileUrl, onClose }) {

    // Inicializamos el plugin toolbar
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative bg-white w-11/12 h-5/6 rounded shadow-lg flex flex-col">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-black hover:bg-gray-200 px-3 py-1 rounded"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* 🔧 Toolbar personalizada */}
                <div className="border-b p-2 bg-gray-100">
                    <Toolbar>
                        {(slots) => {
                            // 🔥 Quitamos el botón de abrir archivo
                            const {
                                CurrentPageInput,
                                Download,
                                Print,
                                ZoomIn,
                                ZoomOut,
                                GoToNextPage,
                                GoToPreviousPage,
                            } = slots;

                            return (
                                <div className="flex items-center space-x-2">
                                    <GoToPreviousPage />
                                    <CurrentPageInput />
                                    <GoToNextPage />
                                    <ZoomOut />
                                    <ZoomIn />
                                    <Download />
                                    <Print />
                                </div>
                            );
                        }}
                    </Toolbar>
                </div>

                {/* El visor ocupa todo el espacio */}
                <div className="flex-1 overflow-hidden">
                    <Worker workerUrl={workerUrl}>
                        <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                    </Worker>
                </div>
            </div>
        </div>
    );
}