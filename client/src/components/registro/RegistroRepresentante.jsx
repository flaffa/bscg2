import {useState} from 'react';
import {useMoralis, useNewMoralisObject} from "react-moralis";
import {Moralis} from 'moralis';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const RegistroRepresentante = ({setIsRegistered, setKey}) => {

  const {user, setUserData} = useMoralis();

  const obtenerEntidad = async () => {
    const queryEntidad = new Moralis.Query("Entidad");
    queryEntidad.equalTo("objectId", user.get("entidadRelacionada").id)
    const resultadoQueryEntidad = await queryEntidad.find()
    return resultadoQueryEntidad[0]
  }

  const {save} = useNewMoralisObject("RepresentanteEntidad");

  const [validated, setValidated] = useState(false);

  const [datosRepresentante, setDatosRepresentante] = useState({
     nombre: "",
     email: "",
     cuil: "",
   });

   const handleChange = (e) => {
     setDatosRepresentante( prevDatos => (
       {...prevDatos,
       [e.target.name]: e.target.value,
     }
     ))
   }

   let navigate = useNavigate();
   const navigateTo = (path) => {
     window.scrollTo(0, 0);
     navigate(path);
   }

   const saveObjetoRepresentanteEntidad = async () => {
     const entidadResultante = await obtenerEntidad();
     save(datosRepresentante, {
       onSuccess: (representante) => {
         console.log("Creado el representante" + representante.id);
         representante.set("entidadRepresentada", entidadResultante);
         representante.save();
         entidadResultante.set("RepresentanteAsociado", representante)
         entidadResultante.save();
         setIsRegistered(true);
         user.set("isRegistered", true)
         user.save()
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
      saveObjetoRepresentanteEntidad();
     }
    setValidated(true);
    navigateTo('/cliente/home');
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
            <Form.Label>Ingrese el nombre del Representante</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre de Representante"
              name="nombre"
              onChange={handleChange}
              defaultValue={datosRepresentante.nombre}
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
              onChange={handleChange}
              defaultValue={datosRepresentante.email}
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
              onChange={handleChange}
              defaultValue={datosRepresentante.cuil}
              pattern="[0-9]{2}-[0-9]{8}-[0-9]{1}"
            />
            <Form.Control.Feedback type="invalid">Debe ingresar un CUIL con el siguiente formato: xx-xxxxxxxx-x.</Form.Control.Feedback>
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

export default RegistroRepresentante;
