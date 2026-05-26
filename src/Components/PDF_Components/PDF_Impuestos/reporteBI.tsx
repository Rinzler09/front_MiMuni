import { Page, Text, View, Document, PDFViewer, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { styles } from '../PDF_Structure/structureBI';
import { Table, TH, TD, TR } from '@ag-media/react-pdf-table';
import { FaDownload } from 'react-icons/fa';
import "../../../style/PDF_Styles/reporteStyle.css";
import { useAuth } from '../../../Auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { toast } from "sonner";

interface facturaBi {
    facturas: string;
    periodo: string;
    descripcion: string;
    precio: number;
    ajuste: number;
    adm: number;
    amnistia: number;
    prontopago: number;
    subtotal: number;
}

export default function ReportBI() {//recibe un objeto llamado data de tipo any

    const navigate = useNavigate();
    const fechaActual = new Date().toLocaleDateString("es-HN"); // se obtiene la fecha Actual
    const horaActual = new Date().toLocaleTimeString();
    const { selectedMunicipality } = useAuth();
    const logoMuni = `src/assets/img/Logos/${selectedMunicipality}.png`;
    const { state } = useLocation();
    const { impuesto, numRecibo, dni } = (state ?? {});


    const tableData: facturaBi[] =
        [
            {
                facturas: "28394",
                periodo: "2017",
                descripcion: "Impuesto Bien Inmueble Periodo 2017",
                precio: 736.32,
                ajuste: 64.68,
                adm: 0,
                amnistia: 0,
                prontopago: 0,
                subtotal: 800.00
            },

            {
                facturas: "28394",
                periodo: "2017",
                descripcion: "Impuesto Bien Inmueble Periodo 2017",
                precio: 736.32,
                ajuste: 64.68,
                adm: 0,
                amnistia: 0,
                prontopago: 0,
                subtotal: 800.00
            }
            ,

            {
                facturas: "28394",
                periodo: "2017",
                descripcion: "Impuesto Bien Inmueble Periodo 2017",
                precio: 736.32,
                ajuste: 64.68,
                adm: 0,
                amnistia: 0,
                prontopago: 0,
                subtotal: 800.00
            }
        ];

    const totalData = [
        {
            label: "Subtotal",
            value: "$1,750.00",
        },
        {
            label: "Tax (10%)",
            value: "$175.00",
        },
        {
            label: "Total",
            value: "$1,925.00",
        },
    ]

    useEffect(() => {
        if (!impuesto) {
            toast.error("Debe seleccionar una factura para poder visualizar el recibo.",);
            navigate("/error-404"); //si no existe una clave catastral seleccionada entonces navega a facturas-bi
        }
    }, []);

    const ReportePDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={[styles.title, styles.textBold]}>RECIBO DE PAGO</Text>
                <View style={styles.header}>
                    <Image src={logoMuni} style={styles.img} />
                    <View>
                        <Text style={[styles.title, styles.textBold]}>{selectedMunicipality}</Text>
                        <Text style={[styles.title2, styles.textBold]}>{impuesto} </Text>
                    </View>
                </View>

                <View style={styles.topData}>
                    <View style={styles.spaceY}>
                        <Text style={[styles.billTo, styles.textBold]}>Datos Personales</Text>
                        <Text>Nombre:</Text>
                        <Text>DNI: {dni}</Text>
                        <Text>Direccion:</Text>
                        <View style={[styles.concepto]}>
                            <Text>Concepto: </Text>
                            {/* <Text>Impuesto de Bienes Inmuebles. Clave Catastral: 24-33-10, Área Terreno: 415.54. 2025 - 2026</Text> */}
                        </View>
                    </View>

                    <View style={[styles.spaceY, styles.date]}>
                        <Text>Fecha de Impresion: {fechaActual} {horaActual}</Text>
                        <Text>N.° de Recibo: {numRecibo}</Text>
                        <Text>N.° de Comprobante: 1117738239812</Text>
                        <Text>Fecha de Emision: 92132138</Text>
                    </View>
                </View>


                <Table style={styles.table}>
                    <TH style={[styles.tableHeader, styles.textBold]}>
                        <TD style={styles.td}>N° Factura</TD>
                        <TD style={styles.td}>Periodo</TD>
                        <TD style={styles.td}>Descripcion</TD>
                        <TD style={styles.td}>Precio Unit.</TD>
                        <TD style={styles.td}>Ajuste</TD>
                        <TD style={styles.td}>Adulto Mayor</TD>
                        <TD style={styles.td}>Amnistia</TD>
                        <TD style={styles.td}>Pronto Pago</TD>
                        <TD style={styles.td}>Subtotal</TD>
                    </TH>
                    {tableData.map((item, index) => (
                        <TR key={index} style={[styles.tableData]}>
                            <TD style={styles.td}>{item.facturas}</TD>
                            <TD style={styles.td}>{item.periodo}</TD>
                            <TD style={styles.td}>{item.descripcion}</TD>
                            <TD style={styles.td}>L.&nbsp;{item.precio} </TD>
                            <TD style={styles.td}> L.&nbsp;{item.ajuste}</TD>
                            <TD style={styles.td}>L.&nbsp;{item.adm}</TD>
                            <TD style={styles.td}>L.&nbsp;{item.amnistia}</TD>
                            <TD style={styles.td}>L.&nbsp;{item.prontopago}</TD>
                            <TD style={styles.td}>L.&nbsp;{item.subtotal}</TD>
                        </TR>
                    ))}
                </Table>

                <View style={styles.totals}>
                    <View
                        style={{
                            minWidth: "256px",
                        }}
                    >
                        {totalData.map((item) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }}
                            >
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.label}
                                </Text>
                                <Text style={item.label === "Total" ? styles.textBold : {}}>
                                    {item.value}
                                </Text>
                            </View>

                        ))}

                    </View>
                </View>
            </Page>
        </Document>
    )
    return (
        <div className='reporte-container'>

            <div className="title">RECIBO POR PAGO DE {impuesto}</div>
            <br />

            <div className='pdf-wrapper'>
                <PDFViewer width="100%" height="100%">
                    <ReportePDF />
                </PDFViewer>
            </div>

            <div className='download-container'>
                <PDFDownloadLink document={<ReportePDF />} fileName='reciboBI.pdf'>
                    {/* <button className='flex items-center bg-blue-600'> */}
                    <button className='download-btn'>
                        <FaDownload /> &nbsp; Descargar PDF
                    </button>
                </PDFDownloadLink>
            </div>

        </div>
    );
}

