import {useState} from 'react';
import {Spinner, Row, Col, Modal, Button} from 'react-bootstrap';
import {MdFileUpload, MdRemoveRedEye} from 'react-icons/md';
import {BiCommentError} from 'react-icons/bi';
import {FaFileDownload} from 'react-icons/fa';
import {useLocation} from 'react-router-dom';
import {useMoralisQuery} from 'react-moralis';
import {useNavigate} from 'react-router-dom';

import SubirNuevaDocumentacion from './SubirNuevaDocumentacion';
import VisualizarDocumentacionPeticion from './VisualizarDocumentacionPeticion';

const ModificarPeticionMarco = () => {

  let navigate = useNavigate();
  const {state: {peticion, atributos}} = useLocation();

  const [validated, setValidated] = useState(false);  //varaible para la validacion de forms desde boostrap

  //queries para buscar datos
  const queryTipoDocumento = useMoralisQuery("TipoDocumentoAsociadoPeticionMarco", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})
  const queryDocumentos = useMoralisQuery("DocumentosAsociadoPeticionMarco", q => q, [], {live: true})
  const documentosAsociados = queryDocumentos?.data?.filter( doc => doc?.get("peticionAsociada").get("nombre") === atributos.nombre)

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

  //estados para mostrar los comentarios del admin relacionados con ese doc
  const [showComentarios, setShowComentarios] = useState({estado: false, documento: null});


  return(
    <div
      className="w-75 mx-auto"
    >

      <h3 className="display-6 title-modal m-4">MODIFICAR PETICION CONVENIO MARCO</h3>

      { !documentosAsociados.length
        ? <Spinner animation="border" />
        : documentosAsociados.map( (doc, index) => {
          return(
            <div key={index}>
              <hr/>
              <h6>DOCUMENTO DE {doc.get("tipoDocumentoAsociado").get("nombre").toUpperCase()}</h6>
              <Row>
                <Col sm={3}>
                  <span>
                    Descargar Modelo <br/>
                    <a href={doc.get("tipoDocumentoAsociado").get("modeloArchivo")._url} download>
                      <FaFileDownload className="menu-link upload-icon" />
                    </a>
                  </span>
                </Col>

                <Col>
                  <span>
                    Visualizar Archivo Subido<br/>
                    <MdRemoveRedEye className="menu-link upload-icon"
                      onClick={() => abrirDocumento(doc.get("archivoDocumento")._url, doc.get("tipoDocumentoAsociado").get("nombre").toUpperCase()) }
                    />
                  </span>
                </Col>

                <Col>
                  <span>
                    Subir Nuevo Archivo <br/>
                    <MdFileUpload className="menu-link upload-icon"
                      onClick={() => {
                        handleEstaModificandoDocumento(doc.get("peticionAsociada").get("entidadAsociada").get("nombre"), doc.get("tipoDocumentoAsociado"), doc)
                      }}
                    />
                  </span>
                </Col>

                <Col>
                  <span>
                    Ver Comentarios <br/>
                    <BiCommentError className="menu-link upload-icon"
                      onClick={() => setShowComentarios({estado: true, documento: doc})}
                    />
                  </span>
                </Col>
              </Row>

              <Modal show={showComentarios.estado} onHide={() => setShowComentarios({estado: false, documento: null})} centered>
                <Modal.Header className="title-modal" closeButton>
                  <h5 className="ms-auto">COMENTARIOS</h5>
                </Modal.Header>
                { !showComentarios?.documento?.attributes?.comentarios
                  ?  <Modal.Body>No hay comentarios para mostrar en este momento.</Modal.Body>
                  :  <Modal.Body>{showComentarios?.documento?.attributes?.comentarios}</Modal.Body>
                }
              </Modal>
            </div>
          )})
      }

      <hr/>

      <div className="pb-5">
        <Button
          variant="none"
          className="btn-cancelar"
          onClick={() => {
            window.scrollTo(0,0)
            navigate("/cliente/convenio-marco")
          }}
        >Salir</Button>
      </div>

      {estaModificandoDocumento.estado &&
        <SubirNuevaDocumentacion
          estaModificandoDocumento={estaModificandoDocumento}
          setEstaModificandoDocumento={setEstaModificandoDocumento}
        />}

      {estaVisualizando.estado &&
        <VisualizarDocumentacionPeticion
          estaVisualizando={estaVisualizando}
          cerrarDocumento={cerrarDocumento}
        />}

    </div>
  )
}

export default ModificarPeticionMarco;
