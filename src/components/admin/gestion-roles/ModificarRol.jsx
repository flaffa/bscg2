import {useState} from 'react';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import { useMoralisCloudFunction } from 'react-moralis';
import {Moralis} from 'moralis';

import AlertaCambios from '../AlertaCambios';

const ModificarRol = ({opcionAbierta, cerrarOpcion, roles}) => {

  const [validated, setValidated] = useState(false);

  const [showAlerta, setShowAlerta] = useState(false);
  const [showAlertaNombreInvalido, setShowAlertaNombreInvalido] = useState(false);

  const [rolSeleccionado, setRolSeleccionado] = useState({
    name: "",
    index: "",
  });

  const [rolData, setRolData] = useState({
    nombre: "",
    descripcion: "",
  })

  const handleChangeRol = (e) => {
    const indexSeleccionado = roles.findIndex( rol => rol.get("nombre") === e.target.value);
    setRolSeleccionado( prevState => ({
      name: e.target.value,
      index: indexSeleccionado,
    }))
    setRolData({
      nombre: roles[indexSeleccionado].get("nombre"),
      descripcion: roles[indexSeleccionado].get("descripcion"),
    })
  }

  const handleChangeData = (e) => {
    setRolData( prevData => ({
       ...prevData,
        [e.target.name]: e.target.value
    }))
  }

    const rolesNombre = useMoralisCloudFunction("obtenerRoles")
    const validarNombreRoles = () => {
      const nombresExistentes = rolesNombre.data.find(nombre => nombre.get("nombre") === rolData.nombre && nombre.get("nombre") !== rolSeleccionado.name)
      return (nombresExistentes)
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (validarNombreRoles()){
        setShowAlertaNombreInvalido(true)
      }else{
        setShowAlerta(true);
    }
    setValidated(true);
  }}

  const saveObjetoRol = async () => {
    const {name} = rolSeleccionado;
    const {nombre, descripcion} = rolData;
    await Moralis.Cloud.run("modificarRol", {nombre, name, descripcion});
  }

  const handleConfirmSubmit = () => {
    saveObjetoRol();
    cerrarOpcion("ModificarRol");
  }

  return(
    <div
      onClick ={(e) => e.stopPropagation()}
      onKeyDown ={(e) => e.stopPropagation()}
      onFocus = {(e) => e.stopPropagation()}
      onMouseOver = {(e) => e.stopPropagation()}
    >
      <Modal
        show={opcionAbierta}
        onHide={() => cerrarOpcion("ModificarRol")}
        centered
      >

        {showAlerta
          ? <AlertaCambios
            handleConfirmSubmit={handleConfirmSubmit}
            showAlerta={showAlerta}
            setShowAlerta={setShowAlerta}/>
          : <>
            <Modal.Header className="perfil-usuario glassmorphism">
              <Modal.Title className="w-100 title-modal">MODIFICAR ROL</Modal.Title>
            </Modal.Header>

            <Modal.Body className="perfil-usuario">

              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >

                <Form.Group className="mb-3" controlId="rolAModificar">

                  <Form.Select
                    required
                    onChange={handleChangeRol}
                    name="rolAModificar"
                    value={rolSeleccionado.name}
                  >
                    <option value="">---Seleccione un Rol a Modificar---</option>
                    {roles.map( (rol,index) =>
                      <option key={index} value={rol.get("nombre")}
                      >{rol.get("nombre")}</option>
                    )}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    Debe seleccionar un rol existente válido
                  </Form.Control.Feedback>

                </Form.Group>

                { rolSeleccionado.name &&
                  <>
                    <Form.Group className="mb-3" controlId="nombre">
                      <Form.Label column sm={6}>Modificar Nombre de Rol</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="nombre"
                        value={rolData.nombre}
                        onChange={handleChangeData}
                      />
                      <Form.Control.Feedback type="invalid">
                        Debe seleccionar un nombre válido
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="descripcion">
                      <Form.Label column sm={6}>Modificar Descripcion de Rol</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="descripcion"
                        value={rolData.descripcion}
                        onChange={handleChangeData}
                      />
                      <Form.Control.Feedback type="invalid">
                        Debe seleccionar una descripción válida
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                }

                <Button
                  variant="light"
                  className="btn-cancelar"
                  onClick={() => cerrarOpcion("ModificarRol")}
                >Cancelar</Button>

                <Button
                  variant="light"
                  type="submit"
                  className="btn-aceptar"
                >Guardar</Button>

              </Form>
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
          </>
        }
      </Modal>
    </div>

  )
}

export default ModificarRol;
