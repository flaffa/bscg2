import {useState} from 'react';
import {useMoralis, useNewMoralisObject} from "react-moralis";
import {Form, Button} from 'react-bootstrap';

const RegistroEmpresa = ({setIsRegistered, setKey}) => {

  const {user, setUserData} = useMoralis();
  const {save} = useNewMoralisObject("Entidad");

  const [validated, setValidated] = useState(false);

  const [datosEntidad, setDatosEntidad] = useState({
     nombre: "",
     descripcionEntidad: "",
     detalleCaracter: "",
     cuit: "",
     domicilio: "",
     usuarioRelacionado: user,
   });

   const handleChange = (e) => {
     setDatosEntidad( prevDatos => (
       {...prevDatos,
       [e.target.name]: e.target.value,
     }
     ))
   }

   const saveObjetoEntidad = async () => {
     save(datosEntidad, {
       onSuccess: (entidad) => {
         console.log("Creado el objeto entidad con su nombre y su descripcion" + entidad.id);
         setUserData({
          entidadRelacionada: entidad,
         })
       },
       onError: (error) => {
         console.log(error.message);
       },
     });
   };

   const handleSubmit = (e) => {
     e.preventDefault();
     e.stopPropagation();
     if (e.currentTarget.checkValidity() === false) {
       e.preventDefault();
       e.stopPropagation();
     }else{
      saveObjetoEntidad();
      setKey("registroRepresentante");
     }
    setValidated(true);
   }

  return(
    <div className="pu-inner border-30">
      <div className="pu-body border-30"
        onClick ={(e) => e.stopPropagation()}
        onKeyDown ={(e) => e.stopPropagation()}
        onFocus = {(e) => e.stopPropagation()}
        onMouseOver = {(e) => e.stopPropagation()}
      >

        <Form
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
        >

          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Ingrese el nombre de la Entidad</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre de Entidad"
              name="nombre"
              onChange={handleChange}
              defaultValue={datosEntidad.nombre}
            />
            <Form.Control.Feedback type="invalid">Debe ingresar un nombre</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="cuit">
            <Form.Label>Ingrese el CUIT de la Entidad</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="CUIT de Entidad"
              name="cuit"
              onChange={handleChange}
              defaultValue={datosEntidad.cuit}
              pattern="[0-9]{2}-[0-9]{8}-[0-9]{1}"
            />
            <Form.Control.Feedback type="invalid">Debe ingresar un CUIT con el siguiente formato: xx-xxxxxxxx-x.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="domicilio">
            <Form.Label>Ingrese el domicilio sede de la Entidad</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Domiclio de Entidad"
              name="domicilio"
              onChange={handleChange}
              defaultValue={datosEntidad.domicilio}
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
              onChange={handleChange}
              defaultValue={datosEntidad.descripcionEntidad}
              maxLength={125}
            />
            <Form.Control.Feedback type="invalid">Debe ingresar una descripción</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="caracterEntidad">
            <Form.Label>Seleccione el Carácter de la Entidad</Form.Label>
            <Form.Control
              as="select"
              type="select"
              required
              onChange={handleChange}
              name="detalleCaracter"
              value={datosEntidad.detalleCaracter}
              style={{textAlign: "center"}}
            >
              <option value="">---Seleccionar---</option>
              <option value="Público">Público</option>
              <option value="Privado">Privado</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">Debe seleccionar una opción</Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="light"
            className="btn-aceptar"
          >
            Finalizar Registro
          </Button>

        </Form>

      </div>
    </div>

    )
}

export default RegistroEmpresa;
