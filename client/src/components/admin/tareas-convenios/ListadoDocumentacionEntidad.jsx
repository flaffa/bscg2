import {useState, useEffect} from 'react';
import {Button, ListGroup, Modal, Row, Col, Spinner, Stack, Form, Alert} from 'react-bootstrap';
import {BiCommentError, BiArrowBack} from 'react-icons/bi';
import {GrValidate} from 'react-icons/gr';
import {useLocation} from 'react-router-dom';
import {useMoralisQuery, useMoralisCloudFunction} from 'react-moralis';
import {Moralis} from 'moralis';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const ListadoDocumentacionEntidad = () => {

  const {state: {entidad, atributosEntidad, atributosUsuarioRelacionado}} = useLocation();
  let navigate = useNavigate();

  const [documentosAMostrar, setDocumentosAMostrar] = useState();
  const [documentoSeleccionadoAComentar, setDocumentoSeleccionadoAComentar] = useState();
  const [documentoAVerificar, setDocumentoAVerificar] = useState(false);

  const [comentariosDocumento, setComentariosDocumento] = useState("")
  const handleChange = (e) => {
    setComentariosDocumento(e.target.value)
  }

  const [showAlerta, setShowAlerta] = useState(false);
  const [showAlertaValidacionEntidad, setShowAlertaValidacionEntidad] = useState({
    estadoExito: false,
    estadoFracaso: false
  });

  const obtenerDocumentacionEntidad = useMoralisQuery("DocumentoAsociadoEntidad", q => q, [], {live: true})
  const obtenerTiposDocumentacionEntidad = useMoralisQuery("TipoDocumentoAsociadoEntidad", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})
  const obtenerEstadoDocumentacionEntidad = useMoralisQuery("EstadoDocumentoAsociadoEntidad", q => q, [], {live: true})

  const mostrarListadoDocumentos = () => {
    const documentosEntidadSeleccionada = obtenerDocumentacionEntidad.data.filter( docs => docs.get("entidadAsociada")?.id === entidad?.id)
    setDocumentosAMostrar(documentosEntidadSeleccionada)
  }

  useEffect(() => {
      mostrarListadoDocumentos()
  }, [obtenerDocumentacionEntidad.data])

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //obtener estados de docuemntos
    const estadoEnEsperaDeModificacion = obtenerEstadoDocumentacionEntidad.data.find( estado => estado.get("nombre") === 'enEsperaDeModificacion')
    const estadoRegistrado = obtenerEstadoDocumentacionEntidad.data.find( estado => estado.get("nombre") === 'registrado')
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
    let tipoNombre = documentoSeleccionadoAComentar.attributes.tipoDocumentoAsociado.attributes.nombre
    let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + atributosUsuarioRelacionado.email + '/events/n9XKFxMoSE';
    axios.post(endpoint,
      { "priority" : "Critical", tipoDocumento: tipoNombre },
      { headers: {'Content-type': 'application/json'}
    })
    //cerrar modal
   setDocumentoSeleccionadoAComentar(null)
  }

  const validarDocumento = (doc) => {
    const estadoActualDocumento = obtenerEstadoDocumentacionEntidad.data.find( estado => estado.id === doc.attributes.estadoActual.id)

    if (estadoActualDocumento){
    estadoActualDocumento?.relation("documentosAsociados").remove(doc)
    estadoActualDocumento?.save()
    }

    const estadoVerificado = obtenerEstadoDocumentacionEntidad.data.find( estado => estado.get("nombre") === 'verificado')
    estadoVerificado.relation("documentosAsociados").add(doc)
    estadoVerificado.save()

    doc.set("estadoActual", estadoVerificado)
    doc.set("comentarios", "Este documento ha sido revisado y aceptado como válido.")
    doc.save()

    //mandar notificaciones
    let tipoNombre = documentoAVerificar.attributes.tipoDocumentoAsociado.attributes.nombre
    let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + atributosUsuarioRelacionado.email + '/events/7rrPqh2ZUa';
    axios.post(endpoint,
      { "priority" : "Critical", tipoDocumento: tipoNombre },
      { headers: {'Content-type': 'application/json'}
    })

    setShowAlerta(false)
  }

  const esPosibleValidarEntidad = async () => {
    const docsVerificados = documentosAMostrar.filter( doc => doc.attributes.estadoActual.attributes.nombre === "verificado")
    if (obtenerTiposDocumentacionEntidad.data.length !== docsVerificados.length) {
      setShowAlertaValidacionEntidad(prev => ({...prev, estadoFracaso: true}))
    } else {
      const idUsuario = atributosEntidad.usuarioRelacionado.id
      await Moralis.Cloud.run("modificarEstadoUsuario", {idUsuario})
      //mandar notificaciones
      let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + atributosUsuarioRelacionado.email + '/events/vyHxMeAk3V';
      axios.post(endpoint,
        { "priority" : "Critical",},
        { headers: {'Content-type': 'application/json'}
      })
      //msotrar alerta exito
      setShowAlertaValidacionEntidad(prev => ({...prev, estadoExito: true}))
    }
    return
  }

return(
  <div className="mb-5 pb-5">
    <div className="d-flex justify-content-between">
      <Button className="btn-volver ms-5" variant="none" onClick={() => navigate("/administrador/administrar-entidades")}> <BiArrowBack /> Volver </Button>

      <h6 className="display-6 title-modal my-5">DOCUMENTACION DE ENTIDAD <br/> "{atributosEntidad?.nombre?.toUpperCase()}" </h6>

      <p></p>

    </div>
    <hr/>

    {obtenerTiposDocumentacionEntidad.isLoading || obtenerDocumentacionEntidad.isLoading
      ? <Spinner animation="border" variant="dark" size="lg"/>
      : <div className="p-4">
        <ListGroup className="mx-auto w-50 pb-5">
          { documentosAMostrar?.length <= 0
            ? <Alert variant="secondary">No hay documentos que revisar relacionados a esta entidad en este momento.</Alert>

            : obtenerTiposDocumentacionEntidad.data.map( (tipoDocumento, index) => {
              const docAListar = documentosAMostrar.find( doc => doc.get("tipoDocumentoAsociado").id === tipoDocumento.id)
              if (!docAListar) {
                return (
                  <ListGroup.Item className="py-4" key={index}>
                    <h5 className="fw-bold d-inline">{tipoDocumento?.get("nombre")?.toUpperCase()}</h5>
                    <Alert variant="secondary">No hay un documento de este tipo para revisar en este momento.</Alert>
                  </ListGroup.Item>
                )
              } else if (docAListar.attributes.estadoActual.attributes.nombre === "verificado") {
                return (
                  <ListGroup.Item className="py-4" key={index}>
                    <h5 className="fw-bold d-inline">{tipoDocumento?.get("nombre")?.toUpperCase()}</h5>
                    <Alert variant="success">Este documento ya está validado.</Alert>
                  </ListGroup.Item>
                )
              } else {
                return(
                  <ListGroup.Item className="py-4" key={index}>
                    <h5 className="fw-bold d-inline">{tipoDocumento?.get("nombre")?.toUpperCase()}</h5>
                    <Row>
                      <Col>
                        <span>
                          Revisar Documento <br/>
                          <BiCommentError
                            onClick={() => setDocumentoSeleccionadoAComentar(docAListar)}
                          className="menu-link upload-icon"/>
                        </span>
                      </Col>

                      <Col>
                        <span>
                          Validar Documento <br/>
                          <GrValidate
                            className="menu-link upload-icon"
                            onClick={() => {
                              setDocumentoAVerificar(docAListar)
                              setShowAlerta(true)
                            }}
                          className="menu-link upload-icon" />
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
            })
          }

        </ListGroup>

        <Button variant="none" className="btn-aceptar mb-5" size="lg" onClick={esPosibleValidarEntidad}>VALIDAR ENTIDAD</Button>

      </div>
    }

    <Modal show={documentoSeleccionadoAComentar} fullscreen={true} onHide={() => setDocumentoSeleccionadoAComentar(null)}>
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">{ documentoSeleccionadoAComentar?.attributes?.tipoDocumentoAsociado?.attributes?.nombre?.toUpperCase()} DE ENTIDAD "{atributosEntidad?.nombre?.toUpperCase()}"
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

    { showAlerta &&
      <div className="popup-box box-filter">
        <Alert show={showAlerta} variant="danger" className="text-center no-bg-box">
          <Alert.Heading>¿Está seguro que el documento cumple los requisitos de validación?</Alert.Heading>
          <p>
            Esta accion validará el documento y le permitirá a la entidad la creación de convenios. <br/>
            ¿Está seguro que está correcto?<br/><br/>
            Presione 'SI' para validar el documento.<br/>
            Presione 'NO' para volver y revisar el documento.
          </p>
          <Button
            className="mx-2"
            variant="outline-danger"
            onClick={() => setShowAlerta(false)}
          >NO</Button>
          <Button
            className="px-3 mx-3"
            variant="outline-success"
            onClick={() => validarDocumento(documentoAVerificar)}
          >SI</Button>
        </Alert>
      </div>}

    { showAlertaValidacionEntidad.estadoExito &&
      <div className="popup-box box-filter">
        <Alert show={showAlertaValidacionEntidad.estadoExito} variant="success" className="text-center no-bg-box">
          <Alert.Heading>Entidad Validada Con Éxito!</Alert.Heading>
          <Button
            className="mx-2"
            variant="outline-success"
            onClick={() => {
              setShowAlertaValidacionEntidad( prev => ({
                ...prev,
                estadoExito: false,
              }))
              navigate("/administrador/administrar-entidades")
              window.scrollTo(0, 0);
            }}
          >OK</Button>
        </Alert>
      </div>}

    { showAlertaValidacionEntidad.estadoFracaso &&
      <div className="popup-box box-filter">
        <Alert show={showAlertaValidacionEntidad.estadoFracaso} variant="danger" className="text-center no-bg-box">
          <Alert.Heading>No es posible validar esta entidad.</Alert.Heading>
          <p>Para validar una entidad primero se deben revisar y validar todos sus documentos.</p>
          <Button
            className="mx-2"
            variant="outline-danger"
            onClick={() => {
              setShowAlertaValidacionEntidad( prev => ({
                ...prev,
                estadoFracaso: false,
              }))
            }}
          >OK</Button>
        </Alert>
      </div>}

  </div>
)
}

export default ListadoDocumentacionEntidad
