import {useState, useEffect } from 'react';
import {Modal, Button, ListGroup, Spinner} from 'react-bootstrap';
import {useMoralis, useMoralisQuery, useMoralisCloudFunction} from "react-moralis";
import {Moralis} from 'moralis';
import {useLocation} from 'react-router-dom';

import DocumentoEntidad from './DocumentoEntidad';
import ModificarDocumentacion from './ModificarDocumentacion';
import EliminarDocumentacion from './EliminarDocumentacion';
import VisualizarDocumentacion from './VisualizarDocumentacion';

const ModificarDocsEntidad = () => {

  //datos que traemos desde el elemento ProfileOptionsCard a traves del navigateTo()
  const {state: {usuario, nombreEntidad, idEntidad, dataRoles}} = useLocation();
  //data para mandar la notificacion desde ModificarDocumentacion
  const usuarios = useMoralisCloudFunction("obtenerUsuarios");
  const usuariosAdmin = usuarios?.data?.filter( user => user.get("rolAsignado")?.id === dataRoles?.id)

  //consulta a tabla entidad para obtener entidad específica del cliente logeado
  const queryEntidad = useMoralisQuery("Entidad", q => q.equalTo("objectId", idEntidad), [], {live: true})

  //consulta para obtener todos los tipos de documentos cargados en el sistema y que se necesitan que suban los clientes para verificarlos
  const queryTipoDocumento = useMoralisQuery("TipoDocumentoAsociadoEntidad", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})

  //consulta para obtener todos los tipos de estados posibles de los documentos
  const queryEstadosDocumentos = useMoralisQuery("EstadoDocumentoAsociadoEntidad", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})

  //variable de estado para guardar informacion de documentacion relacionada a la entidad, se setea "vacio" hasta esperar que los queries fetcheen sus datos
  const [dataDocumentos, setDataDocumentos] = useState("vacio");
  const [dataEntidad, setDataEntidad] = useState();
  const [estadoRegistrado, setEstadoRegistrado] = useState();

  //seteamos la variable de dataDocumentos
  const obtenerResultadosEntidad = async () => {
    //obtener la entidad del usuario
    const resultadosEntidad = await queryEntidad.fetch();
    setDataEntidad(resultadosEntidad[0]);

    //hacer un query con los documentos de esa entidad para luego chequear su tipo
    const queryDocumentacion = new Moralis.Query("DocumentoAsociadoEntidad");
    queryDocumentacion.equalTo("entidadAsociada", resultadosEntidad[0]);
    const resultadosDocumentacion = await queryDocumentacion.find();

    setDataDocumentos(
      resultadosDocumentacion.map( doc => doc)
    )
  }

  const obtenerEstadoRegistrado = async () => {
    const resultadosEstados = await queryEstadosDocumentos.fetch();
    const estadoRegistrado = resultadosEstados.find( estado => estado.get("nombre") === 'registrado')
    setEstadoRegistrado(estadoRegistrado);
  }

  //variable que muestra/desmuestra el componente de VisualizarDocumentacion al clickear 'visualizar'
  const [estaVisualizando, setEstaVisualizando] = useState({
    estado: false,
    nombre: "",
    documentoURL: "",
  })
  //funcion que setea la visualizacion en true, pasando el nombre (titulo) y url del documento a mostrar
  const abrirDocumento = (url, nombre) => {
    setEstaVisualizando({
      estado: true,
      nombre: nombre,
      documentoURL: url,
    })
  }
  //funcion que setea la visualizacion en false, resetenado la variable estaVisualizando
  const cerrarDocumento = () => {
    setEstaVisualizando({
      estado: false,
      nombre: "",
      documentoURL: "",
    })
  }

  //variable que muestra/desmuestra el componente de ModificarDocumentacion al clickear 'subir archivo'
  const [estaModificandoDocumento, setEstaModificandoDocumento] = useState({
    estado: false,
    entidadAsociada: null,
    tipo: null,
    documentoAsociado: null,
  })

  const handleEstaModificandoDocumento = (entidad, tipo, documento) => {
    setEstaModificandoDocumento({
      estado: true,
      entidadAsociada: entidad,
      tipo: tipo,
      documentoAsociado: documento,
    })
  }

  //variable que muestra/desmuestra el componente de EliminarDocumentacion al clickear 'eliminar'
  const [estaEliminando, setEstaEliminando] = useState({
    estado: false,
    documento: null,
  });

  useEffect( () => {
    obtenerResultadosEntidad();
    obtenerEstadoRegistrado();
  }, [estaModificandoDocumento, estaEliminando])

  return(
    <div className="mb-4">

      <div>
        <h3 className="display-5 title-modal m-4">DOCUMENTACION DE<br/>{nombreEntidad.toUpperCase()}</h3>

        <hr className="mx-auto w-75 my-4"/>

        {
          dataDocumentos === 'vacio'
            ? <Spinner animation="border" />
            : <>
              <ListGroup className="mx-auto w-50">
                {
                  queryTipoDocumento.data?.map( (tipo, index) => {
                    let documento = dataDocumentos.find( doc => ( doc.get("tipoDocumentoAsociado").get("nombre") === tipo.get("nombre") ))
                    return(
                      <ListGroup.Item className="py-4" key={index}>
                        <DocumentoEntidad
                          entidad={dataEntidad}
                          tipo={tipo} //tipo de documento requerido
                          dataDocumento={documento} //el objeto de documento asociado al tipo si es que existe
                          abrirDocumento={abrirDocumento} //funcion para el boton visualizar documento
                          handleEstaModificandoDocumento={handleEstaModificandoDocumento} //funcion para el boton de subir documento
                          setEstaEliminando={setEstaEliminando} //funcion para el boton de eliminar documento
                          estadosDocumentos={queryEstadosDocumentos.data}
                        />
                      </ListGroup.Item>
                    )})
                }
              </ListGroup>

              {estaModificandoDocumento.estado &&
                <ModificarDocumentacion
                  estaModificandoDocumento={estaModificandoDocumento}
                  setEstaModificandoDocumento={setEstaModificandoDocumento}
                  estadoRegistrado={estadoRegistrado}
                  usuariosANotificar={usuariosAdmin}
                />}

              { estaEliminando.estado && <EliminarDocumentacion
                estaEliminando={estaEliminando}
                setEstaEliminando={setEstaEliminando}                                  />}

              {estaVisualizando.estado &&
                <VisualizarDocumentacion
                  estaVisualizando={estaVisualizando}
                  cerrarDocumento={cerrarDocumento}
                />}
            </>
        }

      </div>
    </div>
  )
}

export default ModificarDocsEntidad;
