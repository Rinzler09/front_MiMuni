import React, { useState, useEffect } from "react";//Importacioon de libreria de React y sus hooks useState y useEffect
import "../../style/UserInfoStyles/historialFacturas.css";//Importacion del estilo historialFacturas.css
import { GrPowerReset } from "react-icons/gr";//Importancion de icono de refrescar desde la libreria react-icons
import { LiaFileInvoiceSolid } from "react-icons/lia";//Importacion de icono de factura desde la libreria react-icons
/* Se define la interface facturas con su tipo de dato */

interface Facturas {//Esta la funcion de interface que nos ayuda para poder definir un tipo de dato
  id: number; // Idenficador unico para cada factura
  descripcion: string;// Descripcion de la factura 
  subtotal: number;//subtotal de la factura
  valortotal: number;//valor total de la factura
  fechapago: string;//fecha de pago de la factura
  periodo: number;//Periodo de la factura
  estado: string;//estado de la factura
}


const HistorialPagos: React.FC = () => {

  /*Se use el hook de useState para el arreglo de Facturas*/
  const [factura, setFactura] = useState<Facturas[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);//Estado para la paginacion actual, con el estado de hook useState
  const registrosPorPagina = 5;//Esta contante utiliza el numero de registro por paginacion

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;

  // Manejador de paginacion Milton Paz
  const pagsTotales = Math.ceil(factura.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  }

  /* REALIZADO POR MARLEY */
  const [selectedOption, setSelectedOption] = useState(""); // Track selected dropdown option

  


 
  const handleRefreshClick = () => {
    //En esta parte tendra que implementar la logica para refrescar las facturas
  };

 
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Update selected option
  };

  
  return (
    <div className="historialFacturas">
      <h2 className="title">HISTORIAL DE FACTURACION</h2>
      
      {/* Date Range Filter */}
      <div className="historial-facturacion-container">
       
        <div className="date-range-container">
          <div className="date-range-filter">
            <select className="selectInvoice" onChange={handleOptionChange}>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Tipo de factura
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                BI-Bienes Inmuebles
              </option>
             
            </select>

            <input type="date" defaultValue="dd-mm-yyyy" className="date-input"/>{/**Fecha Inicial*/}
            
            <input type="date" defaultValue="yyy-mm-dd" className="date-inputs"/>
            
            <button className="buttonReset"  title="Buscar Facturas"
              onClick={handleRefreshClick}><GrPowerReset /></button>
              
            <button className="buttonInvoices"  title="Descargar PDF"><LiaFileInvoiceSolid /></button>
          </div>
        </div>
      </div>

      {/* Tabla de Facturas - Realizado por Milton Paz*/}
     
      <table className="details-table">
        <thead>
          <tr>
            <th>N°FACTURA</th>
            <th>DESCRIPCION</th>
            <th>SUBTOTAL</th>
            <th>VALORTOTAL</th>
            <th>FECHAPAGO</th>
            <th>PERIODO</th>
            <th>ESTADO</th>

          </tr>
        </thead>
        <tbody>
          {/* {registrosActuales.map((registro, indice) => (
            <tr key={indice}>

              <td>{registro.id}</td>
              <td>{registro.descripcion}</td>
              <td>{registro.tipopago}</td>
              <td>{registro.subtotal}</td>
              <td>{registro.valortotal}</td>
              <td>{new Date(registro.fechapago).toLocaleDateString()}</td>
              <td>{registro.periodo}</td>
              <td>{registro.estado}</td>

            </tr>

          ))} */}
        </tbody>
      </table>
      <br />
      <nav>
        <ul className="pagination">
          {[...Array(pagsTotales).keys()].map((page) => (
            <li
              key={page}
              className={`page-item ${paginaActual === page + 1 ? 'active' : ''}`}
              onClick={() => handleCambioPag(page + 1)}
            >
              <a className="page-link" href="#!">
                {page + 1}
              </a>
            </li>
          ))

          }
        </ul>
      </nav>    
      
    </div>
  );
};

export default HistorialPagos;
