import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { recibos } from '../../../services/recibos';
import { useAuth } from '../../../Auth/AuthContext';
import "../../../style/PDF_Styles/reporteStyle.css";
import Spinner from 'react-bootstrap/Spinner';

type ImpuestoKey = 'BI' | 'IP' | 'SP' | 'IC' | 'PP' | 'OT';

type locationParams = {
    impuesto: ImpuestoKey;
    numRecibo: string;
    municipalidad: string;
};

const Recibos: React.FC = () => {
    const { state } = useLocation();
    const { token } = useAuth();
    const { impuesto, numRecibo, municipalidad }: locationParams = (state ?? {});
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const impuestosKeys: Record<ImpuestoKey, string> = { // se define el diccionario para el tipo de Impuesto y se usa Record ya que es el tipado estandar para diccionarios 
        BI: 'Bienes Inmuebles',
        IP: 'Impuesto Vecinal',
        SP: 'Servicios Publicos',
        IC: 'Impuesto Industria, C y S',
        PP: 'Plan de Pago',
        OT: 'Servicios Varios'
    }

    useEffect(() => {
        const getRecibo = async () => { //aqui recibo un PDF en formato 
            const respuesta = await recibos(numRecibo, municipalidad, token);
            const url = URL.createObjectURL(respuesta?.data);
            setPdfUrl(url);
        }

        getRecibo();
    }, [numRecibo, municipalidad, token]);



    return (
        <div className='reporte-container'>

            <div className='title'>RECIBO POR PAGO DE {(impuestosKeys[impuesto]).toUpperCase()}</div>
            <br />

            <div className='pdf-wrapper'>
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="100%"
                    />
                ) : (<Spinner style={{ marginTop: "80px" }} animation="border" />)}
            </div>

        </div>
    );
};

export default Recibos;
