import {useState, useEffect} from 'react';
import {Button, ListGroup, Modal, Row, Col, Spinner, Stack, Form, Alert} from 'react-bootstrap';
import {BiCommentError, BiArrowBack} from 'react-icons/bi';
import {GrValidate} from 'react-icons/gr';
import {useLocation} from 'react-router-dom';
import {useMoralisQuery, useMoralisCloudFunction} from 'react-moralis';
import {Moralis} from 'moralis';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const DetallePeticionMarco = () => {

  let navigate = useNavigate();
  const {state: {peticion, atributos}} = useLocation();

  const [validated, setValidated] = useState(false);  //variable para la validacion de forms desde boostrap

  const [documentoSeleccionadoAComentar, setDocumentoSeleccionadoAComentar] = useState();

  //queries para buscar datos
  const obtenerUsuarios = useMoralisCloudFunction("obtenerUsuarios")
  const queryTipoDocumento = useMoralisQuery("TipoDocumentoAsociadoPeticionMarco", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})
  const queryEstadosDocumentos = useMoralisQuery("EstadoDocumentoPeticionMarco", q => q, [], {live: true})
  const queryDocumentos = useMoralisQuery("DocumentosAsociadoPeticionMarco", q => q, [], {live: true})
  const documentosAsociados = queryDocumentos?.data?.filter( doc => doc?.get("peticionAsociada").get("nombre") === atributos.nombre)

  const [comentariosDocumento, setComentariosDocumento] = useState("")
  const handleChange = (e) => {
    setComentariosDocumento(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //obtener estados de documentos
    const estadoEnEsperaDeModificacion = queryEstadosDocumentos.data.find( estado => estado.get("nombre") === 'en espera de modificacion')
    const estadoRegistrado = queryEstadosDocumentos.data.find( estado => estado.get("nombre") === 'registrado')
    //guardar comentarios en documento y cambiar su estado
    documentoSeleccionadoAComentar.set("comentarios", comentariosDocumento)
    documentoSeleccionadoAComentar.set("estadoActual", estadoEnEsperaDeModificacion)
    documentoSeleccionadoAComentar.save()
    //quitar el documento de relacion de estado 'registrado'
    estadoRegistrado.relation("documentosAsociados").remove(documentoSeleccionadoAComentar)
    estadoRegistrado.save()
    //agregar el documento a la relacion de estado 'en espera de modificacion'
    estadoEnEsperaDeModificacion.relation("documentosAsociados").add(documentoSeleccionadoAComentar)
    estadoEnEsperaDeModificacion.save()
    //mandar notificaciones
    let usuarioANotificar = documentoSeleccionadoAComentar?.get("peticionAsociada")?.get("entidadAsociada")?.get("usuarioRelacionado")?.get("email")
    let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + usuarioANotificar + '/events/C5OK4NYD0h';
    axios.post(endpoint,
      { "priority" : "Critical"},
      { headers: {'Content-type': 'application/json'}
    })
    //cerrar modal
   setDocumentoSeleccionadoAComentar(null)
  }

  return(
    <div className="mb-5 pb-5">
      <div className="d-flex justify-content-between">
        <Button className="btn-volver ms-5" variant="none" onClick={() => navigate("/administrador/administrar-peticiones-marco")}> <BiArrowBack /> Volver </Button>

        <h6 className="display-6 title-modal my-5">DETALLE PETICION CONVENIO MARCO </h6>

        <p></p>

      </div>
      <hr/>

      {queryDocumentos.isLoading
        ? <Spinner animation="border" variant="dark" size="lg"/>
        : <div className="p-4">
          <ListGroup className="mx-auto w-50 pb-5">
            { documentosAsociados.map( (doc, index) => {
              return(
                <ListGroup.Item className="py-4" key={index}>
                  <h5 className="fw-bold d-inline">{doc.attributes?.tipoDocumentoAsociado?.attributes?.nombre.toUpperCase()}<br/></h5>
                  <span>
                    Revisar Documento <br/>
                    <BiCommentError
                      onClick={() => setDocumentoSeleccionadoAComentar(doc)}
                    className="menu-link upload-icon"/>
                  </span>
                </ListGroup.Item>
              )})
            }
          </ListGroup>

          {/* <Button variant="none" className="btn-aceptar mb-5" size="lg" onClick={esPosibleValidarPeticion}>VALIDAR PETICION</Button> */}

        </div>
      }

      <Modal show={documentoSeleccionadoAComentar} fullscreen={true} onHide={() => setDocumentoSeleccionadoAComentar(null)}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">{ documentoSeleccionadoAComentar?.get("tipoDocumentoAsociado")?.get("nombre")?.toUpperCase()} DE PETICION MARCO "{atributos?.nombre?.toUpperCase()}"
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Stack direction="horizontal" style={{height: "100%"}} gap={3}>

            <iframe height="100%" width="70%" src={documentoSeleccionadoAComentar?.attributes?.archivoDocumento?._url}></iframe>

            <div
              onClick ={(e) => e.stopPropagation()}
              onKeyDown ={(e) => e.stopPropagation()}
              onFocus = {(e) => e.stopPropagation()}
              onMouseOver = {(e) => e.stopPropagation()}
            >
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label className="title-modal fw-bold">COMENTARIOS SOBRE ESTE DOCUMENTO</Form.Label>
                  <Form.Control as="textarea" rows={15} onChange={handleChange} defaultValue={documentoSeleccionadoAComentar?.attributes?.comentarios} />
                </Form.Group>

                <div className="m-3 text-center">
                  <Button variant="none" className="btn-cancelar"
                    onClick={() => setDocumentoSeleccionadoAComentar(null)}
                  >Cancelar</Button>

                  <Button type="submit" variant="none" className="btn-aceptar"
                  >Comentar</Button>
                </div>

              </Form>
            </div>

          </Stack>
        </Modal.Body>
      </Modal>

    </div>
    )
    }

export default DetallePeticionMarco;
