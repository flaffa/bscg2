import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useMoralisCloudFunction } from 'react-moralis';
import {Moralis} from 'moralis';

const CrearRol = ({ opcionAbierta, cerrarOpcion }) => {

  const [validated, setValidated] = useState(false);
  const [showAlertaCodigoInvalido, setShowAlertaCodigoInvalido] = useState(false);
  const [showAlertaNombreInvalido, setShowAlertaNombreInvalido] = useState(false);

  const [rolData, setRolData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
  })

  const handleChangeRol = (e) => {
    setRolData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const saveObjetoRol = async () => {
    await Moralis.Cloud.run("crearRol", rolData);
 }

 const roles = useMoralisCloudFunction("obtenerRoles")

 const validarCodigo = () => {
   const codigosExistentes = roles.data.find(codigo => codigo.get("codigo") === rolData.codigo)
   return (codigosExistentes)
 }

 const validarNombre = () => {
   const nombresExistentes = roles.data.find(nombre => nombre.get("nombre") === rolData.nombre)
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
           saveObjetoRol();
           cerrarOpcion("CrearRol")
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
        onHide={() => cerrarOpcion("CrearRol")}
        centered
      >

        <Modal.Header className="perfil-usuario glassmorphism">
          <Modal.Title className="w-100 title-modal">CREAR ROL</Modal.Title>
        </Modal.Header>

        <Modal.Body className="perfil-usuario">

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group className="mb-3" controlId="codigo">
              <Form.Label column sm={6}>Código de Rol</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                name="codigo"
                onChange={handleChangeRol}
              />
              <Form.Control.Feedback type="invalid">
                Debe seleccionar un código válido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label column sm={6}>Nombre de Rol</Form.Label>
              <Form.Control
                required
                type="text"
                name="nombre"
                onChange={handleChangeRol}
              />
              <Form.Control.Feedback type="invalid">
                Debe seleccionar un nombre válido
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label column sm={6}>Descripcion de Rol</Form.Label>
              <Form.Control
                required
                type="text"
                name="descripcion"
                onChange={handleChangeRol}
              />
              <Form.Control.Feedback type="invalid">
                Debe ingresar una descripción válida
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="light"
              className="btn-cancelar"
              onClick={() => cerrarOpcion("CrearRol")}
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

export default CrearRol;
