import {useState} from 'react';
import {Modal, Button, Form, Col, Row} from 'react-bootstrap';

const ModificarEntidad = ({perfilAbierto, cerrarPerfil, user, entidad}) => {

  const [validated, setValidated] = useState(false);

  const [datosEntidad, setDatosEntidad] = useState({
    nombre: entidad.get("nombre"),
    domicilio: entidad.get("domicilio"),
    cuit: entidad.get("cuit"),
    descripcionEntidad: entidad.get("descripcionEntidad"),
    detalleCaracter: entidad.get("detalleCaracter"),
  });

  const handleChangeEntidad = (e) => {
    setDatosEntidad( prevDatos => (
      {...prevDatos,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
   e.preventDefault();
   e.stopPropagation();
   if (e.target.checkValidity() === false) {
     e.preventDefault();
     e.stopPropagation();
   } else {
     entidad.set("nombre", datosEntidad.nombre)
     entidad.set("domicilio", datosEntidad.domicilio)
     entidad.set("cuit", datosEntidad.cuit)
     entidad.set("descripcionEntidad", datosEntidad.descripcionEntidad)
     entidad.set("detalleCaracter", datosEntidad.detalleCaracter)
     entidad.save()
     cerrarPerfil("entidad")
    }
   setValidated(true);
  }

  return (
    <div
      onClick ={(e) => e.stopPropagation()}
      onKeyDown ={(e) => e.stopPropagation()}
      onFocus = {(e) => e.stopPropagation()}
      onMouseOver = {(e) => e.stopPropagation()}
    >

      <Modal
        show={perfilAbierto}
        onHide={() => cerrarPerfil("entidad")}
        size="lg"
        centered
      >

        <Modal.Header className="perfil-usuario glassmorphism">
          <Modal.Title className="w-100 title-modal">MODIFICAR PERFIL DE ENTIDAD</Modal.Title>
        </Modal.Header>

        <Modal.Body className="perfil-usuario">

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >

            <Form.Group className="mb-3" controlId="nombreEntidad">
              <Form.Label>Ingrese el nombre de la Entidad</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nombre de Entidad"
                name="nombre"
                onChange={handleChangeEntidad}
                defaultValue={entidad.get("nombre")}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un nombre de entidad</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cuit">
              <Form.Label>Ingrese el CUIT de la Entidad</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="CUIT de Entidad"
                name="cuit"
                onChange={handleChangeEntidad}
                defaultValue={entidad.get("cuit")}
                pattern="[0-9]{2}-[0-9]{8}-[0-9]{1}"
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un CUIT con el siguiente formato: xx-xxxxxxxx-x.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="domicilio">
              <Form.Label>Ingrese el domicilio sede de la Entidad</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Domicilio de Entidad"
                name="domicilio"
                onChange={handleChangeEntidad}
                defaultValue={entidad.get("domicilio")}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un domicilio</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcionEntidad">
              <Form.Label>Ingrese la descripción de la Entidad</Form.Label>
              <Form.Control
                as="textarea"
                required
                row={3}
                placeholder="Descripción de Entidad"
                name="descripcionEntidad"
                onChange={handleChangeEntidad}
                defaultValue={entidad.get("descripcionEntidad")}
                maxLength={125}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar una descripción</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="caracterEntidad">
              <Form.Label column sm={5}>Seleccione el Carácter de la Entidad</Form.Label>
              <Col sm={7}>
                <Form.Control
                  as="select"
                  type="select"
                  required
                  onChange={handleChangeEntidad}
                  name="detalleCaracter"
                  value={datosEntidad.detalleCaracter}
                  style={{textAlign: "center"}}
                >
                  <option value={entidad.get("detalleCaracter")}>{entidad.get("detalleCaracter")}</option>
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">Debe seleccionar una opción</Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Button
              variant="light"
              className="btn-cancelar"
              onClick={() => cerrarPerfil("entidad")}
            >Cancelar</Button>

            <Button variant="light" type="submit" className="btn-aceptar">
              Guardar
            </Button>

          </Form>

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModificarEntidad;
