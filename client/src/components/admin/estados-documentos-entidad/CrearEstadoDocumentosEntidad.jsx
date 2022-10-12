import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNewMoralisObject, useMoralisQuery } from 'react-moralis';

const CrearEstadoDocumentosEntidad = ({ opcionAbierta, cerrarOpcion }) => {

  const [validated, setValidated] = useState(false);

  const [showAlertaCodigoInvalido, setShowAlertaCodigoInvalido] = useState(false);
  const [showAlertaNombreInvalido, setShowAlertaNombreInvalido] = useState(false);

  const [estadoData, setEstadoData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
  })

  const handleChangeEstado = (e) => {
    setEstadoData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))

  }

  const nuevoEstado = useNewMoralisObject("EstadoDocumentoAsociadoEntidad");

  const saveObjetoEstado = async () => {
    nuevoEstado.save(estadoData, {
      onSuccess: estado => {
        console.log("Se creo un nuevo estado documentacion entidad: " + estado.id)
      },
      onError: e => console.log(e.message)
    })
  }

  const estadosDocumentosEntidad = useMoralisQuery("EstadoDocumentoAsociadoEntidad", q => q, [], { live: true });

  const validarCodigo = () => {
    const codigosExistentes = estadosDocumentosEntidad.data.find(codigo => codigo.get("codigo") === estadoData.codigo)
    return (codigosExistentes)
  }

  const validarNombre = () => {
    const nombresExistentes = estadosDocumentosEntidad.data.find(nombre => nombre.get("nombre") === estadoData.nombre)
    return (nombresExistentes)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (!validarCodigo()) {
        if (!validarNombre()) {
            saveObjetoEstado();
            cerrarOpcion("CrearEstadoDocumentosEntidad")
          } else {
            setShowAlertaNombreInvalido(true)
          }
      } else {
        setShowAlertaCodigoInvalido(true)
      }
    }
    setValidated(true);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <Modal
        show={opcionAbierta}
        onHide={() => cerrarOpcion("CrearEstadoDocumentosEntidad")}
        centered
      >

        <Modal.Header className="perfil-usuario glassmorphism">
          <Modal.Title className="w-100 title-modal">CREAR ESTADO DOCUMENTACIÓN ENTIDAD</Modal.Title>
        </Modal.Header>

        <Modal.Body className="perfil-usuario">

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >

            <Form.Group className="mb-3" controlId="codEstadoDocumentoEntidad">
              <Form.Label column sm={6}>Código</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                name="codigo"
                onChange={handleChangeEstado}
              />
              <Form.Control.Feedback type="invalid">
                Debe seleccionar un código válido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label column sm={6}>Nombre de Estado</Form.Label>
              <Form.Control
                required
                type="text"
                name="nombre"
                onChange={handleChangeEstado}
              />
              <Form.Control.Feedback type="invalid">
                Debe ingresar un nombre válido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label column sm={6}>Descripcion de Estado</Form.Label>
              <Form.Control
                required
                type="text"
                name="descripcion"
                onChange={handleChangeEstado}
              />
              <Form.Control.Feedback type="invalid">
                Debe ingresar una descripción válida
              </Form.Control.Feedback>
            </Form.Group>


            <Button
              variant="light"
              className="btn-cancelar"
              onClick={() => cerrarOpcion("CrearEstadoDocumentosEntidad")}
            >Cancelar</Button>

            <Button
              variant="light"
              type="submit"
              className="btn-aceptar"
            >Crear</Button>

          </Form>
          {/* alerta codigo invalido */}
          {showAlertaCodigoInvalido &&
            <div className="popup-box box-filter">
              <Alert className="text-center no-bg-box"
                variant="warning"
                onClose={() => setShowAlertaCodigoInvalido(false)}
              dismissible>
                <Alert.Heading>Codigo ya existente!</Alert.Heading>
                <p>
                  El codigo seleccionado ya esta en uso. Por favor, seleccione un codigo diferente.
                </p>

                <Button
                  className="mx-2"
                  variant="outline-danger"
                  onClick={() => setShowAlertaCodigoInvalido(false)}
                >OK</Button>
              </Alert>

            </div>
          }
          {/* alerta nombre ya en uso */}
          {showAlertaNombreInvalido &&
            <div className="popup-box box-filter">
              <Alert className="text-center no-bg-box"
                variant="warning"
                onClose={() => setShowAlertaNombreInvalido(false)}
              dismissible>
                <Alert.Heading>Nombre ya existente!</Alert.Heading>
                <p>
                  El nombre seleccionado ya esta en uso. Por favor, seleccione un nombre diferente.
                </p>

                <Button
                  className="mx-2"
                  variant="outline-danger"
                  onClick={() => setShowAlertaNombreInvalido(false)}
                >OK</Button>
              </Alert>

            </div>
          }
        </Modal.Body>

      </Modal>

    </div>

  )
}

export default CrearEstadoDocumentosEntidad
