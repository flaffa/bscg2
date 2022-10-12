import {useState} from 'react';
import {useNewMoralisObject, useMoralisFile} from "react-moralis";
import {Moralis} from 'moralis';
import {Form, Spinner, Button, Modal} from 'react-bootstrap';
import axios from 'axios';

import AlertaConfirmacionDocumentos from './AlertaConfirmacionDocumentos';

const ModificarDocumentacion = ({estaModificandoDocumento: {estado, entidadAsociada, tipo, documentoAsociado}, setEstaModificandoDocumento, estadoRegistrado, usuariosANotificar}) => {

  const [validated, setValidated] = useState(false);
  const [showAlertaModificacion, setShowAlertaModificacion] = useState(false);

  const {moralisFile, saveFile, isUploading} = useMoralisFile();

  const {save} = useNewMoralisObject("DocumentoAsociadoEntidad")

  const handleChangeDocumento = (e) => {
    let moralisFile = saveFile(e.target.files[0].name, e.target.files[0]);
  }

  const cerrarModal = () => {
    setEstaModificandoDocumento({
      estado: false,
      entidadAsociada: null,
      tipo: null,
      documentoAsociado: null,
    })
  }

  const guardarDocumentoModificado = () => {
    documentoAsociado.set("nombreDocumento", moralisFile._name.split('_')[1])
    documentoAsociado.set("archivoDocumento", moralisFile)
    documentoAsociado.save();
    //mandar notificaciones
    usuariosANotificar.map( admin => {
      let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + admin.get("email") + '/events/odD6VGYZgK';
      axios.post(endpoint, { "priority" : "Critical", entidadNombre: entidadAsociada.get("nombre"), tipoDocumento: tipo.get("nombre") }, {
          headers: {'Content-type': 'application/json'}
      })
    })
    cerrarModal();
  }

  const crearNuevoDocumento = () => {
    save({
      entidadAsociada: entidadAsociada,
      archivoDocumento: moralisFile,
      tipoDocumentoAsociado: tipo,
      nombreDocumento: moralisFile._name.split('_')[1],
      estadoActual: estadoRegistrado,
    },
    {
    onSuccess: documento => {
        const relacionEstado = estadoRegistrado.relation("documentosAsociados")
        relacionEstado.add(documento)
        // estadoRegistrado.relation("documentosAsociados").add(nuevoDocumento.object)
        estadoRegistrado.save()
        const relacionEntidad = entidadAsociada.relation("documentosAsociados")
        relacionEntidad.add(documento)
        entidadAsociada.save()
      }
    }
    )
    //mandar notificaciones
    usuariosANotificar.map( admin => {
      let endpoint = 'https://api.ravenhub.io/company/w4lA9Ob5at/subscribers/' + admin.get("email") + '/events/4vLt8DPn41';
      axios.post(endpoint, { "priority" : "Critical", entidadNombre: entidadAsociada.get("nombre"), tipoDocumento: tipo.get("nombre") }, {
          headers: {'Content-type': 'application/json'}
      })
    })
    cerrarModal();
  }

   const handleSubmit = async (e) => {
     e.preventDefault();
     e.stopPropagation();
      if (e.target.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
      } else {
        documentoAsociado
          ? setShowAlertaModificacion(true)
          : crearNuevoDocumento()
      }
    setValidated(true);
  }

    return(
      <div
        onClick ={(e) => e.stopPropagation()}
        onKeyDown ={(e) => e.stopPropagation()}
        onFocus = {(e) => e.stopPropagation()}
        onMouseOver = {(e) => e.stopPropagation()}
      >

        <Modal
          show={estado}
          onHide={() => setEstaModificandoDocumento({
            estado: false,
            entidadAsociada: null,
            tipo: null,
            documentoAsociado: null,
          })}
          size="lg"
          centered
        >

          {showAlertaModificacion
            ? <AlertaConfirmacionDocumentos
              accion="sobreescribirá"
              guardarDocumentoModificado={guardarDocumentoModificado}
              showAlertaModificacion={showAlertaModificacion}
              setShowAlertaModificacion={setShowAlertaModificacion}
              />
            : <>
              <Modal.Header className="glassmorphism perfil-usuario">
                <Modal.Title className="w-100 title-modal">{tipo.get("nombre").toUpperCase()}</Modal.Title>
              </Modal.Header>

              <Modal.Body className="perfil-usuario">

                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >

                  <Form.Group className="mb-3" controlId="documentacionEntidad">
                    <Form.Label column sm={6}>Seleccione un documento</Form.Label>
                    <Form.Control
                      required
                      type="file"
                      multiple={false}
                      name="documentacionEntidad"
                      onChange={handleChangeDocumento}
                    />
                    <Form.Control.Feedback type="invalid">Debe seleccionar un documento</Form.Control.Feedback>

                  </Form.Group>

                  <Button
                    variant="light"
                    className="btn-cancelar"
                    onClick={() => setEstaModificandoDocumento({
                      estado: false,
                      entidadAsociada: null,
                      tipo: null,
                      documentoAsociado: null,
                    })}
                  >Cancelar</Button>

                  {isUploading
                    ?
                      <Button variant="light" className="btn-aceptar">
                        <Spinner animation="border" variant="dark" size="sm"/>
                      </Button>
                    :
                    <Button variant="light" className="btn-aceptar" type="submit">
                      Guardar
                    </Button>
                  }

                </Form>

              </Modal.Body>
            </> }
        </Modal>

      </div>
    )
}

export default ModificarDocumentacion;
