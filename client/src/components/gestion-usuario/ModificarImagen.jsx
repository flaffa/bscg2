import {useState} from 'react';
import {useMoralisFile } from "react-moralis";
import {Modal, Form, Spinner, Button} from 'react-bootstrap';

const ModificarImagen = ({estaModificandoImagen, setEstaModificandoImagen, user}) => {

  const {moralisFile, saveFile, isUploading} = useMoralisFile();

  const [validated, setValidated] = useState(false)

   const handleChangePhoto = (e) => {
     let moralisFile = saveFile(e.target.files[0].name, e.target.files[0]);
   }

   const handleSubmit = (e) => {
     e.preventDefault();
     e.stopPropagation();
     if (e.target.checkValidity() === false) {
       e.preventDefault();
       e.stopPropagation();
     } else {
       user.set("imagenPerfil", moralisFile);
       user.save();
       setEstaModificandoImagen(false)
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
          show={estaModificandoImagen}
          onHide={() => setEstaModificandoImagen(false)}
          size="lg"
          centered
        >

          <Modal.Header className="perfil-usuario glassmorphism">
            <Modal.Title className="w-100 title-modal">MODIFICAR FOTO DE PERFIL</Modal.Title>
          </Modal.Header>

          <Modal.Body className="perfil-usuario">

            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >

              <Form.Group className="mb-3" controlId="imagenPerfil">
                <Form.Label>Seleccione una foto de perfil</Form.Label>
                <Form.Control
                  required
                  type="file"
                  accept="image/*"
                  multiple={false}
                  name="imagenPerfil"
                  onChange={handleChangePhoto}
                />
                <Form.Control.Feedback type="invalid">Debe seleccionar una foto de perfil</Form.Control.Feedback>
              </Form.Group>


              <Button
                variant="light"
                className="btn-cancelar"
                onClick={() => setEstaModificandoImagen(false)}
              >Cancelar</Button>

              {isUploading
                ?
                  <Button variant="light" className="btn-aceptar">
                    <Spinner animation="border" variant="dark" size="sm"/>
                  </Button>
                :
                <Button variant="light" type="submit" className="btn-aceptar">
                  Guardar
                </Button>
              }

            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
}

export default ModificarImagen;
