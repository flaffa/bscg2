import {useState} from 'react';
import {Button, Spinner, Form, Row, Col, Alert} from 'react-bootstrap';
import {useMoralis, useMoralisQuery, useNewMoralisObject, useMoralisFile, useMoralisCloudFunction} from 'react-moralis';
//import {MdFileUpload} from 'react-icons/md';
import {FaFileDownload} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const PeticionMarco = () => {

  let navigate = useNavigate();
  const {user} = useMoralis();
  const {moralisFile, saveFile} = useMoralisFile();
  const nuevoDocumentoAsociadoPeticion = useNewMoralisObject("DocumentosAsociadoPeticionMarco") //creacion de un nuevo objeto de documento de PeticionMarco
  const nuevaPeticion = useNewMoralisObject("PeticionMarco") //creacion de un nuevo objeto PeticionMarco

  //queries para obtener data
  const queryTipoDocumento = useMoralisQuery("TipoDocumentoAsociadoPeticionMarco", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})
  const queryDocumentosAsociados = useMoralisQuery("DocumentosAsociadosPeticionMarco", q => q, [], {live: true})
  const queryEstadosDocumentosAsociados = useMoralisQuery("EstadoDocumentoPeticionMarco", q => q.doesNotExist("FechaFinVigencia"), [], {live: true})
  const queryEstadosPeticiones = useMoralisQuery("EstadoPeticionMarco", q => q.equalTo("nombre", "registrada"), [], {live: true})
  //queries para obtener data para NotificationCenter
  const queryEntidades = useMoralisQuery("Entidad", q => q, [])
  const queryRoles = useMoralisCloudFunction("obtenerRoles");
  const dataRoles = queryRoles?.data?.find( rol => rol.get("nombre") === 'administrador');
  const queryUsuarios = useMoralisCloudFunction("obtenerUsuarios");
  const usuariosAdmin = queryUsuarios?.data?.filter( user => user.get("rolAsignado")?.id === dataRoles?.id)

  const [validated, setValidated] = useState(false);  //varaible para la validacion de forms desde boostrap
  const [showAlertaExito, setShowAlertaExito] = useState(false);  //variable para mostrar alerta de exito de creacion
  const [showAlertaError, setShowAlertaError] = useState(false);  //variable para mostrar alerta de error de creacion

  //datos para guardar de lo puesto en la form
  const [datosPeticion, setDatosPeticion] = useState({
    nombre: "",
    descripcion: "",
    entidadAsociada: user?.get("entidadRelacionada")
  });

  const [documentos, setDocumentos] = useState({
    objetodeconvenio: null,
    planeamientoyjurisdiccion: null,
    derechosyobligaciones: null,
  })

  //funciones de cambio y submit de la form
  const handleChangePeticion = (e) => {
    setDatosPeticion( prevDatos => (
      {...prevDatos,
      [e.target.name]: e.target.value,
    }))
  }

  const handleChangeDocumentoPeticion = async (e) => {
    let moralisFile = await saveFile(e.target.files[0].name, e.target.files[0]);
    setDocumentos( prevDatos => (
      {...prevDatos,
      [e.target.name]: moralisFile,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      nuevaPeticion.save(datosPeticion,
      {
        onSuccess: (peticion) => {
          queryTipoDocumento.data?.map( (tipo, index) => {
            let doc = Object.entries(documentos).find( item => item[0] === tipo.get("nombre").replace(/\s/g, ''))
            nuevoDocumentoAsociadoPeticion.save({
              archivoDocumento: doc[1],
              nombreDocumento: doc[1]._name.split('_')[1],
              tipoDocumentoAsociado: tipo,
              peticionAsociada: peticion,
            },
          { onSuccess: doc => {
              peticion.relation("documentosAsociados").add(doc)
              peticion.set("estadoActual", queryEstadosPeticiones?.data[0])
              peticion.save()
            }
          })
        })
        //mandar notificaciones
        usuariosAdmin.map( admin => {
          let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + admin.get("email") + '/events/Nya4WznDVD';
          axios.post(endpoint,
            { "priority" : "Critical", entidadNombre: user.get("entidadRelacionada").get("nombre") },
            { headers: {'Content-type': 'application/json'}
          })
        })
        //mostrar alerta de exito
        setShowAlertaExito(true);
        },
        onError: (error) => {
          console.log(error.message);
          setShowAlertaError(true)
        },
      });
    }
    setValidated(true);
  }

  return (
    <div>

      <h3 className="display-6 title-modal m-4">PETICION CONVENIO MARCO</h3>

      <hr className="mx-auto w-75 my-4"/>

      { queryTipoDocumento.isLoading
        ? <Spinner animation="border" />
        :
        <div
          className="w-75 mx-auto"
          onClick ={(e) => e.stopPropagation()}
          onKeyDown ={(e) => e.stopPropagation()}
          onFocus = {(e) => e.stopPropagation()}
          onMouseOver = {(e) => e.stopPropagation()}
        >

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >

            <Form.Group as={Row} className="mb-3" controlId="nombreEntidad">
              <Form.Label column sm={5}>Ingrese un nombre para identificar al Convenio Marco:</Form.Label>
              <Col sm={7}>
                <Form.Control
                  required
                  type="text"
                  placeholder="Nombre de Convenio Marco"
                  name="nombre"
                  onChange={handleChangePeticion}
                />
                <Form.Control.Feedback type="invalid">Debe ingresar un nombre.</Form.Control.Feedback>
              </Col>
            </Form.Group>


            <Form.Group as={Row} className="mb-3" controlId="domicilio">
              <Form.Label column sm={5}>Ingrese una descripcion para el Convenio Marco:</Form.Label>
              <Col sm={7}>
                <Form.Control
                  as="textarea"
                  required
                  row={7}
                  placeholder="Descripcion de Convenio Marco"
                  name="descripcion"
                  maxLength={220}
                  onChange={handleChangePeticion}
                />
                <Form.Control.Feedback type="invalid">Debe ingresar una descripcion.</Form.Control.Feedback>
              </Col>
            </Form.Group>

            { queryTipoDocumento.data?.map( (tipo, index) => {
              return(
                <div key={index}>
                  <hr/>
                  <Form.Group as={Row} className="mb-3 align-items-center" controlId="documentacionEntidad">

                    <h6>DOCUMENTO DE {tipo.get("nombre").toUpperCase()}</h6>

                    <Col sm={3}>
                      <span>
                        Descargar Modelo: <br/>
                        <a href={tipo.get("modeloArchivo")._url} download>
                          <FaFileDownload className="menu-link upload-icon" />
                        </a>
                      </span>
                    </Col>

                    <Col>
                      <Form.Label>Subir Documento Completado:</Form.Label>
                      <Form.Control
                        required
                        type="file"
                        multiple={false}
                        name={tipo.get("nombre").replace(/\s/g, '')}
                        onChange={handleChangeDocumentoPeticion}
                      />
                      <Form.Control.Feedback type="invalid">Debe seleccionar un documento.</Form.Control.Feedback>
                    </Col>
                  </Form.Group>
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
              >Cancelar</Button>

              <Button variant="none" type="submit" className="btn-aceptar">
                Crear Peticion
              </Button>
            </div>

          </Form>
        </div>
      }

      { showAlertaExito &&
        <div className="popup-box box-filter">
          <Alert show={showAlertaExito} variant="success" className="text-center no-bg-box">
            <Alert.Heading>Peticion Creada!</Alert.Heading>
            <p>Se ha creado su peticion de Convenio Marco exitosamente.</p>
            <Button
              className="mx-2"
              variant="outline-success"
              onClick={() => {
                setShowAlertaExito(false)
                window.scrollTo(0,0)
                navigate("/cliente/convenio-marco")
              }}
            >OK</Button>
          </Alert>
        </div>
      }

      { showAlertaError &&
        <div className="popup-box box-filter">
          <Alert show={showAlertaError} variant="warning" className="text-center no-bg-box">
            <Alert.Heading>Error al Crear Peticion</Alert.Heading>
            <p>Su peticion no ha podido ser procesada, por favor intente nuevamente más tarde.</p>
            <Button
              className="mx-2"
              variant="outline-success"
              onClick={() => {
                setShowAlertaError(false)
              }}
            >OK</Button>
          </Alert>
        </div>
      }

    </div>
  )
}

export default PeticionMarco;
