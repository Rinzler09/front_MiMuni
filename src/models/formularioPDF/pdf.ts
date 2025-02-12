import jsPDF from "jspdf";
import "jspdf-autotable";

// Extender el tipo de tsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generatePDF = async (
  clientInfo: {
    name: string;
    dni: string;
    rtn: string;
  },
  tableData: any[],
  total: string,
  logoUrl: string
) => {
  const doc = new jsPDF();

  // Cargar imagen del logo
  try {
    const imageBase64 = await getImageAsBase64(logoUrl);
    if (imageBase64) {
      // Ajustar posición y tamaño del logo
      doc.addImage(imageBase64, "PNG", 14, 10, 40, 30); // Posición (x: 14, y: 10) y tamaño (ancho: 40, alto: 30)
    }
  } catch (error) {
    console.error("Error al cargar la imagen del logo:", error);
  }

  // Encabezado
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA CONSOLIDADA", 140, 20, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Usuario que emite la factura: admin_admin", 140, 26, {
    align: "right",
  });
  doc.text("Fecha impresión: 09/01/2025", 140, 31, { align: "right" });

  // Información del cliente
  const startY = 50; // Posición inicial
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DEL CLIENTE", 14, startY);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${clientInfo.name}`, 14, startY + 8);
  doc.text(`DNI: ${clientInfo.dni}`, 14, startY + 14);
  doc.text(`RTN / RTM: ${clientInfo.rtn}`, 14, startY + 20);

  // Tabla de datos
  const tableHeaders = [
    [
      "#Factura",
      "DESCRIPCIÓN",
      "CANTIDAD",
      "PRECIO UNIT.",
      "ADULTO MAYOR",
      "DESCUENTOS",
      "AMNISTÍA",
      "PRONTO PAGO",
      "AJUSTE",
      "SUBTOTAL",
    ],
  ];

  doc.autoTable({
    startY: startY + 30, // Ajustar posición de inicio de la tabla
    head: tableHeaders,
    body: tableData,
    theme: "plain", // Cambiar a "plain" para personalización
    styles: {
      fontSize: 8,
      halign: "center",
      valign: "middle",
      lineWidth: 0.2, // Grosor de los bordes
      lineColor: [0, 0, 0], // Color negro para los bordes
    },
    headStyles: {
      fillColor: [0, 53, 44], // Color verde oscuro para encabezado
      textColor: [255, 255, 255], // Texto blanco
      fontStyle: "bold",
      lineWidth: 0.2, // Bordes de encabezado
      lineColor: [0, 0, 0], // Color negro para los bordes del encabezado
    },
    bodyStyles: {
      fillColor: [240, 240, 240], // Color de fondo alternado
      textColor: [0, 0, 0],
      lineWidth: 0.2, // Grosor de los bordes de las filas
      lineColor: [0, 0, 0], // Color negro para los bordes de las filas
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // Alternar fondo blanco
    },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`TOTAL: ${total}`, 200, finalY + 10, { align: "right" });

  // Descargar el PDF
  doc.save("FacturaConsolidada.pdf");
};

const getImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error al convertir la imagen:", error);
    return null;
  }
};
