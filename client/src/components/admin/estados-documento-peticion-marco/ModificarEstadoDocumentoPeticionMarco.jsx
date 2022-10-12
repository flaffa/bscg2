import {useState} from 'react';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import {useMoralisQuery } from 'react-moralis';

import AlertaCambios from '../AlertaCambios';


const ModificarEstadoDocumentoPeticionMarco = ({opcionAbierta, cerrarOpcion, estadoDocumentoPeticionMarco}) => {

  const [validated, setValidated] = useState(false);

  const [showAlerta, setShowAlerta] = useState(false);
  const [showAlertaNombreInvalido, setShowAlertaNombreInvalido] = useState(false);

  const [estadoData, setEstadoData] = useState({
    nombre: "",
    descripcion: "",
  })

  const [estadoSeleccionado, setEstadoSeleccionado] = useState({
    nombre: "",
    index: "",
  });

  const handleChangeEstadoSeleccionado = (e) => {
    const indexSeleccionado = estadoDocumentoPeticionMarco.findIndex( estado => estado.get("nombre") === e.target.value);
    setEstadoSeleccionado( prevState => ({
      nombre: e.target.value,
      index: indexSeleccionado,
    }))
    setEstadoData({
      nombre: estadoDocumentoPeticionMarco[indexSeleccionado].get("nombre"),
      descripcion: estadoDocumentoPeticionMarco[indexSeleccionado].get("descripcion"),
    })
  }

  const handleChangeEstado = (e) => {
      setEstadoData( prevData => ({
         ...prevData,
          [e.target.name]: e.target.value,
      }))
    }

    const obtenerEstadoDocumentoPeticionMarco = useMoralisQuery("EstadoDocumentoPeticionMarco", q => q, [], { live: true });

    const validarNombre = () => {
        const nombresExistentes = obtenerEstadoDocumentoPeticionMarco.data.find(nombre => nombre.get("nombre") === estadoData.nombre && nombre.get("nombre") !== estadoSeleccionado.nombre)
        return (nombresExistentes)
    }
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (validarNombre()){
        setShowAlertaNombreInvalido(true)
      }else{
      setShowAlerta(true);
    }
    setValidated(true);
  }}

  const handleConfirmSubmit = () => {
    const index = estadoDocumentoPeticionMarco.findIndex( estado => estado.get("nombre") === estadoSeleccionado.nombre)
    estadoDocumentoPeticionMarco[index].set("nombre", estadoData.nombre);
    estadoDocumentoPeticionMarco[index].set("descripcion", estadoData.descripcion);
    estadoDocumentoPeticionMarco[index].save();
    cerrarOpcion("ModificarEstadoDocumentoPeticionMarco");
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
      onHide={() => cerrarOpcion("ModificarEstadoDocumentoPeticionMarco")}
      centered
    >

      {showAlerta
        ? <AlertaCambios
          handleConfirmSubmit={handleConfirmSubmit}
          showAlerta={showAlerta}
          setShowAlerta={setShowAlerta}/>
        : <>
          <Modal.Header className="perfil-usuario glassmorphism">
            <Modal.Title className="w-100 title-modal">MODIFICAR ESTADO DCCUMENTO PETICION CONVENIO MARCO</Modal.Title>
          </Modal.Header>

          <Modal.Body className="perfil-usuario">

            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >

              <Form.Group className="mb-3" controlId="estadoAModificar">

                <Form.Select
                  required
                  onChange={handleChangeEstadoSeleccionado}
                  value={estadoSeleccionado.nombre}
                  name="estadoAModificar"
                >
                  <option value="">---Seleccione un Estado a Modificar---</option>
                  {estadoDocumentoPeticionMarco.map( (estado,index) =>
                    <option key={index} value={estado.get("nombre")}
                    >{estado.get("nombre")}</option>
                  )}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  Debe seleccionar un estado existente válido
                </Form.Control.Feedback>

              </Form.Group>

              { estadoSeleccionado.nombre &&
                <>
                  <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label column sm={6}>Nombre de Estado</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="nombre"
                      onChange={handleChangeEstado}
                      value={estadoData.nombre}
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
                      value={estadoData.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debe ingresar una descripción válida
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              }

              <Button
                variant="light"
                className="btn-cancelar"
                onClick={() => cerrarOpcion("ModificarEstadoDocumentoPeticionMarco")}
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

export default ModificarEstadoDocumentoPeticionMarco
