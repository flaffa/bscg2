import {useState} from 'react';
import {useMoralisQuery} from "react-moralis";
import {Modal, Button, Form} from 'react-bootstrap';

const ModificarRepresentante = ({cerrarPerfil, perfilAbierto, user, entidad}) => {

  const [validated, setValidated] = useState(false);

  const representante = useMoralisQuery("RepresentanteEntidad", q => q.equalTo("entidadRepresentada", entidad) )

  const [datosRepresentante, setDatosRepresentante] = useState({
     nombre: representante.data[0]?.get("nombre"),
     email: representante.data[0]?.get("email"),
     cuil: representante.data[0]?.get("cuil"),
   });

   const handleChangeRepresentante = (e) => {
     setDatosRepresentante( prevDatos => (
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
     representante.data[0]?.set("nombre", datosRepresentante.nombre)
     representante.data[0]?.set("email", datosRepresentante.email)
     representante.data[0]?.set("cuil", datosRepresentante.cuil)
     representante.data[0]?.save()
     cerrarPerfil("representante")
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
        onHide={() => cerrarPerfil("representante")}
        size="lg"
        centered
      >

        <Modal.Header className="perfil-usuario glassmorphism">
          <Modal.Title className="w-100 title-modal">MODIFICAR PERFIL DE REPRESENTANTE</Modal.Title>
        </Modal.Header>

        <Modal.Body className="perfil-usuario">

          <Form
            onSubmit={handleSubmit}
            noValidate
            validated={validated}
          >

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Ingrese el nombre del Representante</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nombre de Representante"
                name="nombre"
                onChange={handleChangeRepresentante}
                defaultValue={representante.data[0]?.get("nombre")}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un nombre</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Ingrese el Email del Representante</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="ejemplo@email.com"
                name="email"
                onChange={handleChangeRepresentante}
                defaultValue={representante.data[0]?.get("email")}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un email válido</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cuil">
              <Form.Label>Ingrese el CUIL del Representante</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="CUIL de Representante"
                name="cuil"
                onChange={handleChangeRepresentante}
                defaultValue={representante.data[0]?.get("cuil")}
                pattern="[0-9]{2}-[0-9]{8}-[0-9]{1}"
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un CUIL con el siguiente formato: xx-xxxxxxxx-x.</Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="light"
              className="btn-cancelar"
              onClick={() => cerrarPerfil("representante")}
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

export default ModificarRepresentante;
