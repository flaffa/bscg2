import {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import { useMoralisCloudFunction } from 'react-moralis';
import {Moralis} from 'moralis';

import AlertaCambios from '../AlertaCambios';

const EliminarRol = ({opcionAbierta, cerrarOpcion, roles}) => {

  const [validated, setValidated] = useState(false);

  const [showAlerta, setShowAlerta] = useState(false);

  const [rolSeleccionado, setRolSeleccionado] = useState("");

  const handleChange = (e) => {
    setRolSeleccionado(e.target.value);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setShowAlerta(true)
    }
    setValidated(true);
  }

  const fecha = new Date();

  const saveObjetoRol = async () => {
    await Moralis.Cloud.run("eliminarRol", {date: fecha, rol: rolSeleccionado});
  }
  const handleConfirmSubmit = () => {
    saveObjetoRol();
    cerrarOpcion("EliminarRol")
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
        onHide={() => cerrarOpcion("EliminarRol")}
        centered
      >

        {showAlerta
          ? <AlertaCambios
            handleConfirmSubmit={handleConfirmSubmit}
            showAlerta={showAlerta}
            setShowAlerta={setShowAlerta}/>
          : <>
            <Modal.Header className="perfil-usuario glassmorphism">
              <Modal.Title className="w-100 title-modal">ELIMINAR ROL</Modal.Title>
            </Modal.Header>

            <Modal.Body className="perfil-usuario">

              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <Form.Group className="mb-3" controlId="rolAEliminar">

                  <Form.Select
                    required
                    onChange={handleChange}
                    name="rolAEliminar"
                    value={rolSeleccionado}
                  >
                    <option value="">---Seleccione un Rol a Eliminar---</option>
                    {roles.map( (rol,index) =>
                      <option key={index} value={rol.get("nombre")}
                      >{rol.get("nombre")}</option>
                    )}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    Debe seleccionar un rol existente válido
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="light"
                  className="btn-cancelar"
                  onClick={() => cerrarOpcion("EliminarRol")}
                >Cancelar</Button>

                <Button
                  variant="light"
                  className="btn-aceptar"
                  type="submit"
                >Eliminar</Button>

              </Form>

            </Modal.Body>
          </> }

      </Modal>

    </div>

  )
}

export default EliminarRol;
