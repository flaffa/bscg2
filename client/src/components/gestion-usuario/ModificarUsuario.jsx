import {useState} from 'react';
import {useMoralis, useMoralisQuery} from "react-moralis";
import {Modal, Button, Form} from 'react-bootstrap';

const ModificarUsuario = ({perfilAbierto, cerrarPerfil, user}) => {

  const {setUserData} = useMoralis();

  const [validated, setValidated] = useState(false)

  const [datosCliente, setDatosCliente] = useState({
     nombre: user.get("nombre"),
     email: user.get("email"),
   });

   const handleChangeCliente = (e) => {
     setDatosCliente( prevDatos => (
       {...prevDatos,
       [e.target.name]: e.target.value,
     }
     ))
   }

   const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else{
       const {nombre, email} = datosCliente;
       setUserData({
         nombre: nombre,
         email: email,
       })
      cerrarPerfil("usuario")
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
          show={perfilAbierto}
          onHide={() => cerrarPerfil("usuario")}
          size="lg"
          centered
        >
          <Modal.Header className="perfil-usuario glassmorphism">
            <Modal.Title className="w-100 title-modal">MODIFICAR PERFIL DE USUARIO</Modal.Title>
          </Modal.Header>

          <Modal.Body className="perfil-usuario">

            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >

              <Form.Group className="mb-3" controlId="nombre2">
                <Form.Label>Ingrese su nombre de usuario</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Nombre de Usuario"
                  name="nombre"
                  onChange={handleChangeCliente}
                  value={datosCliente.nombre}
                />
                <Form.Control.Feedback type="invalid">Debe ingresar un nombre válido</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email2">
                <Form.Label>Ingrese su email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="ejemplo@email.com"
                  name="email"
                  onChange={handleChangeCliente}
                  value={datosCliente.email}
                />
                <Form.Control.Feedback type="invalid">Debe ingresar un email válido</Form.Control.Feedback>
              </Form.Group>


              <Button
                variant="light"
                className="btn-cancelar"
                onClick={() => cerrarPerfil("usuario")}
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

export default ModificarUsuario;
