import {useState} from 'react';
import {Form, Button, Modal, Alert} from 'react-bootstrap';
import emailjs from 'emailjs-com';

const Contacto = () => {

  const [validated, setValidated] = useState(false);

  const [showMensaje, setShowMensaje] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
       e.preventDefault();
       e.stopPropagation();
   } else {
     emailjs.sendForm(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, "#form-contacto", process.env.REACT_APP_USER_ID)
     setShowMensaje(true);
  }
  setValidated(true);
  }

  return (
    <div className="mb-4 bg-landing-page">

      <h1 className="py-4 display-4 title-modal2">Página de Contacto</h1>
      <hr className="mx-auto w-75 mb-5"/>

      {showMensaje &&
        <Alert className="mx-auto w-50" variant="success" onClose={() => setShowMensaje(false)} dismissible >
          MENSAJE ENVIADO CON ÉXITO
        </Alert>
      }

      <div className="px-3 py-2 glassmorphism w-50 mx-auto my-0"
        onClick ={(e) => e.stopPropagation()}
        onKeyDown ={(e) => e.stopPropagation()}
        onFocus = {(e) => e.stopPropagation()}
        onMouseOver = {(e) => e.stopPropagation()}
      >
        <h3 className="display-6 title-modal2">Enviá tu consulta!</h3>

        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          id="form-contacto"
          className="p-4 title-modal2"
        >

          <Form.Group className="mb-3" controlId="nombreContacto">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              required
              type="text"
              name="nombre"
            />
            <Form.Control.Feedback type="invalid">Este campo es obligatorio, por favor ingrese un nombre válido</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="emailContacto">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              required
              type="email"
              name="emailContacto"
            />
            <Form.Control.Feedback type="invalid">Este campo es obligatorio, por favor ingrese un email válido</Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3" controlId="mensajeContacto">
            <Form.Label>Mensaje:</Form.Label>
            <Form.Control
              as="textarea"
              required
              row={3}
              name="mensaje"
              maxLength={500}
            />
            <Form.Control.Feedback type="invalid">Este campo es obligatorio, por favor escriba su mensaje</Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="none"
            className="btn-aceptar"
          >ENVIAR</Button>

        </Form>
      </div>

    </div>
  )
}

export default Contacto;
