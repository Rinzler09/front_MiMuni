// src/components/EditarPerfil.tsx
import { FC, ReactNode, useState } from 'react';// se utiliza en el hook useState para manejar el estado del componente 
import CambioContrasenaUsuario from './EditarPefil_Tabs/RestablecerContraseñeaSesion'//Es la importacion del componente que se encarga de cambiar la contraseña
import '../../style/UserInfoStyles/editar.css'// Implementacion del estilo para el componente de editar perfil

type TabKey =  'contrasena' | 'informacion'  ;// En este apartado creamos un alias para darle un unico valor en este caso tenemos contraña

interface Tab {//En este apartado definimos la funcion interface para poder modelar una pestaña de un componente de tabs
  key: TabKey; // Es un atributo unico en donde facilmente podemos encontrar un elemento en tabs
  label: string; //Definimos la parte de label, para que usuario vea el texto descriptivo
  icon: ReactNode;// Definimos icono con ReactNode, para que sea un contenedor y de esta manera podamos personalizar nuestros iconos 
  content: ReactNode; // Esta definido para una cierta parte de poder renderizar un componente 
}

const tabs: Tab[] = [//En este apartado creamos una funcion de arreglo en donde va tener todo el contenido,
  {
    key: 'contrasena',//En esta parte tenemos un identificador que es unico, gracias que ya lo tenemos declarado en la parte de la interface
    label: 'Contraseña',//En esta linea de codigo, tenemos, que el contenido del label se visualizara en la cabecera de la pestaña
    icon: 'fa-key',// En esta parte tenemos el nombre del icono
    content: <CambioContrasenaUsuario/> //En esta parte tenemos el contenido que se va renderizar en la pestaña de EditarPerfil, en este caso es el componente de CambioContraseñaUsuario
  }, 
  {key: 'informacion', label: 'Informacion Personal', icon: 'fa-key', content: "test" },
  
]

const EditarPerfil: FC = () => {

  const [activeTab, setActiveTab] = useState<TabKey>('contrasena' );//tenemos declarado un estado local los cuales son activeTab y 
  // el segundo es setActiveTab, esto nos ayudara manejar los estados de las pestañas 
  //En este apartado estamos usando un hook que es useState que añade estado a los componentes, que este caso es (activeTab y setActiveTab).
  // tenemos TabKey que eso indique que el hook sera generico, donde 'contrasena' tendra un valor inicial.

  return (
    //En esta primera etiqueta del div tenemos la clase personalizada que viene de UserInfoStyles/editar.css
    //tenemos el mx-auto es para centrar el conteniddo que signifca ,margin-left:auto y margin-right:auto;
    //tenemos el my-5 esto nos ayudar para darle el margen, margin-top: 3rem; y margin-bottom: 3rem;
    <div className="editar-perfil-container mx-auto my-5">
      <ul className="nav nav-tabs">{/**La className="nav nav-tabs" pertenece de bootstrap (nav) se agrega para un componente de navegacion*/}
        {/**Tambien tenemos nav-tabs que se complemente ambas parte ya que le da un toque de borde superior para simular la interfaz de tabs basica*/}

        {tabs.map((tab) => (//En este apartado tenemos tabs.map que esto nos ayuda recorrer todo el arreglo de tabs
        //Ya que la funcionalidad map es permitir recorrer el arreglo principal que en este caso es tabs
          <li className="nav-item" key={tab.key}> {/**Cuando se renderiza listas de elementos con metodos .map(), 
          el atributo key cumple su unico valor, que es obtener el valor unico del arreglo principal*/}

            <button className={`nav-link ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              
              {/**En este apartado estamos utilizando una etiqueta de button*/}
              {/**Estamos usando una nav-link una clase de Boostrap que estamos aplicando un enlace dentro de navegacion */}
              {/**al momento de expresion booleana de activeTab === tab.key estamos diciendole, si la pestaña actual seleccionada con estado (activeTab) coincide con la clase 
               * de esta pestaña (tab.key) se cambia el color de fondo del boton.
               */}
              {/**Tenemos el onClick esto nos dice que si al momento de darle click al boton ese evento para ver si tiene una unica expresion 
               * que es setActiveTab(tab.key) se ejecutara al hacerle click, esto nos ayudara al actualizar el estado que viene del useState 
               * 
               */}
          
              <i className={`fa ${tab.icon} me-2`} />{/**En este apartado tenemos una etiqueta i para poder marcar una seleccion de texto
               * tambien tenemos una clase que tiene boostrap pero tambien tenemos template literal para poder conectar clases 
               * tenemos fa esto es una clase de base de Font Awesome para darle un poco de estilo al icono y letra, tambien tenemos ${tab.icon} esto nos ayuda,
               * para poder nombrar la clase del icono como un ejemplo de fa-key, y me-2 se expresa de esta manera 
               * margin
               * end(extremo)
               * -2 y esto equivale a 0.5rem y unido es margin-end: 0.5rem;
              */}
              {tab.label} {/**Interpolacion de texto, es una cadena de texto que equivale Contraseña o Informacion que renderiza el nombre*/}
            </button>
          
          </li>))}
          
      </ul>

       
      
      <div className="tab-content border-top ">{/**En este espaciado tenemos una clase que es de boostrap que marca una area para mostrar los contenido de cada pestaña
       * tambien tenemos el borde-top que tambien es una clase de boostrap esto sirve para poder darle un borde superior a la pestada activa
      */}
        {tabs.map((tab) => (
         //el tabs.map nos ayuda a recorrer el arreglo principal que es el tabs que tiene todo el contenido en la, key, label, icon y content para obtener el contenido
         //tenemos el activeTabe que esto sabemos que tiene el estado de la pestada activada que es la clave actual esto nos dice que si coincide es un true al contrario
         //si no es (false) nos retorna un null, no se mostrara el contenido.
            <div  key={tab.key} className={`tab-pane ${activeTab === tab.key ? 'active' : ''} py-4`}>
              {/**En este apartado tenemos el identificador unico que es el key como clave estable en este ejemplo es ('contraseña'| 'informacion')
               * en la parte de ClassName tenemos tab-pane esta es una clase de boostrap que ayuda definir un panel en la pestaña activa para agregar el contenido del 
               * componente.
               * Tenemos una expresion booleana ya que esto comprueba si la pestaña actual (tab.key) conincide con el estado actual que es el activeTab
               * Despues de eso vamos con el operador condicional ternario ? para incluir la clase active para que que aplique el estilo de ese panel activo si no devuelve false
               * 
                */}


                 {/**Este tap.content, significa que inserta el valor de la propiedad que viene de content que es todo el tabs*/}
              {/**Este tap.content, significa que inserta el valor de la propiedad que viene de content que es todo el tabs*/}
                {tab.content}
            </div>
          ) )} {/**en este caso tenemos que si la condicion actual no demuestra nada sera un null y no se mostrara pestaña*/}
      </div>
    </div>
  )
}

export default EditarPerfil
