import React, { useState } from "react";

const PdfViewer: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const handleLoadPdf = () => {
    // Simula cargar un PDF desde un servidor o la carpeta "public"
    const testPdfUrl = "/test.pdf"; // Ruta relativa al archivo PDF
    setPdfUrl(testPdfUrl);
  };

  const handleDownloadPdf = () => {
    const testPdfUrl = "/test.pdf"; // Ruta relativa al archivo PDF
    const link = document.createElement("a");
    link.href = testPdfUrl;
    link.download = "test.pdf"; // Nombre del archivo descargado
    link.click();
  };

  return (
    <div>
      <h1>Visor y Descargador de PDF</h1>
      <button onClick={handleLoadPdf}>Cargar PDF</button>
      <button onClick={handleDownloadPdf}>Descargar PDF</button>

      {pdfUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Vista previa del PDF:</h2>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
