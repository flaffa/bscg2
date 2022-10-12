import {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';

import AlertaCambios from '../AlertaCambios';

const EliminarEstadoDocumentoPeticionEspecifico = ({opcionAbierta, cerrarOpcion, estadoDocumentoPeticionEspecifico}) => {

    const [validated, setValidated] = useState(false);

    const [showAlerta, setShowAlerta] = useState(false);

    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

    const handleChange = (e) => {
      setEstadoSeleccionado(e.target.value);
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

    const handleConfirmSubmit = () => {
      const index = estadoDocumentoPeticionEspecifico.findIndex( estado => estado.get("nombre") === estadoSeleccionado)
      const fecha = new Date();
      estadoDocumentoPeticionEspecifico[index].set("FechaFinVigencia", fecha);
      estadoDocumentoPeticionEspecifico[index].save();
      cerrarOpcion("EliminarEstadoDocumentoPeticionEspecifico")
    }

  return (
    <div
    onClick ={(e) => e.stopPropagation()}
    onKeyDown ={(e) => e.stopPropagation()}
    onFocus = {(e) => e.stopPropagation()}
    onMouseOver = {(e) => e.stopPropagation()}
  >

    <Modal
      show={opcionAbierta}
      onHide={() => cerrarOpcion("EliminarEstadoDocumentoPeticionEspecifico")}
      centered
    >

      {showAlerta
        ? <AlertaCambios
          handleConfirmSubmit={handleConfirmSubmit}
          showAlerta={showAlerta}
          setShowAlerta={setShowAlerta}/>
        : <>
          <Modal.Header className="perfil-usuario glassmorphism">
            <Modal.Title className="w-100 title-modal">ELIMINAR ESTADO DOCUMENTO PETICION CONVENIO ESPECIFICO</Modal.Title>
          </Modal.Header>

          <Modal.Body className="perfil-usuario">

            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Form.Group className="mb-3" controlId="estadoAEliminar">

                <Form.Select
                  required
                  onChange={handleChange}
                  value={estadoSeleccionado}
                  name="estadoAEliminar"
                >
                  <option value="">---Seleccione un Estado a Eliminar---</option>
                  {estadoDocumentoPeticionEspecifico.map( (estado,index) =>
                    <option key={index} value={estado.get("nombre")}
                    >{estado.get("nombre")}</option>
                  )}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  Debe seleccionar un estado existente
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="light"
                className="btn-cancelar"
                onClick={() => cerrarOpcion("EliminarEstadoDocumentoPeticionEspecifico")}
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

export default EliminarEstadoDocumentoPeticionEspecifico
