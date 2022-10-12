import {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useMoralisQuery} from 'react-moralis';

import AlertaCambios from '../AlertaCambios';

const AsignarUsuarioaRol = ({opcionAbierta, cerrarOpcion, usuarios}) => {

  const [validated, setValidated] = useState(false);

  const [showAlerta, setShowAlerta] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    nombre: "",
    nombreRolElegido: "",
  });

  const handleChangeUsuario = (e) => {
    setUsuarioSeleccionado( prevData => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const roles = useMoralisQuery("Roles");

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setShowAlerta(true);
    }
    setValidated(true);
  }

  const handleConfirmSubmit = () => {
    const index = roles.data.findIndex( rol => rol.get("nombre") === usuarioSeleccionado.nombreRolElegido)

    const index2 = usuarios.data.findIndex( user => user.get("nombre") === usuarioSeleccionado.nombre)

    const index3 = roles.data.findIndex( rol => rol.id === usuarios.data[index2].get("rol").id)

    const usuariosAEliminar = roles.data[index3].relation("usuarios");
    usuariosAEliminar.remove(usuarios.data[index2])
    roles.data[index3].save();

    const usuariosRelacionados = roles.data[index].relation("usuarios");
    usuariosRelacionados.add(usuarios.data[index2])

    roles.data[index].save();

    usuarios.data[index2].set("rol", roles.data[index] );
    usuarios.data[index2].save();
    // hacer cloud function esta funcionalidad

    cerrarOpcion("AsignarUsuarioaRol")
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
        onHide={() => cerrarOpcion("AsignarUsuarioaRol")}
        centered
      >

        {showAlerta
          ? <AlertaCambios
            handleConfirmSubmit={handleConfirmSubmit}
            showAlerta={showAlerta}
            setShowAlerta={setShowAlerta}/>
          : <>
            <Modal.Header className="perfil-usuario glassmorphism">
              <Modal.Title className="w-100 title-modal">ASIGNAR USUARIOS A ROL</Modal.Title>
            </Modal.Header>

            <Modal.Body className="perfil-usuario">

              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >

                <Form.Group className="mb-3" controlId="rolaAsignar">

                  <Form.Select
                    required
                    onChange={handleChangeUsuario}
                    name="nombre"
                    value={usuarioSeleccionado.nombre}
                  >
                    <option value="">---Seleccione un Usuario---</option>
                    {usuarios.data.map( (usuario,index) =>
                      usuario.get("nombre") !== undefined &&
                        <option key={index} value={usuario.get("nombre")}
                        >{usuario.get("nombre")}</option>
                    )}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    Debe seleccionar un usuario existente válido
                  </Form.Control.Feedback>

                </Form.Group>

                { usuarioSeleccionado.nombre &&
                  <Form.Group className="mb-3" controlId="rolElegido">
                    <Form.Select
                      required
                      onChange={handleChangeUsuario}
                      value={usuarioSeleccionado.nombreRolElegido}
                      name="nombreRolElegido"
                    >
                      <option value="">---Seleccione un Rol a Asignar---</option>
                      {roles.data.map( (rol,index) =>
                        <option key={index} value={rol.get("nombre")}
                        >{rol.get("nombre")}</option>
                      )}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      Debe seleccionar un rol existente válido
                    </Form.Control.Feedback>

                  </Form.Group>
                }

                <Button
                  variant="light"
                  className="btn-cancelar"
                  onClick={() => cerrarOpcion("AsignarUsuarioaRol")}
                >Cancelar</Button>

                <Button
                  variant="light"
                  type="submit"
                  className="btn-aceptar"
                >Guardar</Button>

              </Form>

            </Modal.Body>
          </>
        }

      </Modal>

    </div>
)
}

export default AsignarUsuarioaRol;
