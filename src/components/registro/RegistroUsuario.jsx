import {useState} from 'react';
import {useMoralis, useMoralisFile, useMoralisCloudFunction, useMoralisQuery} from "react-moralis";
import {Moralis} from 'moralis';
import {Form, Spinner, Button} from 'react-bootstrap';

const RegistroUsuario = ({setKey}) => {

  const {user, setUserData} = useMoralis();
  const qRol = useMoralisCloudFunction("obtenerRoles");
  const qEstadosCliente = useMoralisQuery("EstadoCliente", q => q, [], {live: true})
  const {moralisFile, saveFile, isUploading} = useMoralisFile();

  const [validated, setValidated] = useState(false);

  const [datosCliente, setDatosCliente] = useState({
     nombre: "",
     email: "",
   });

   const handleChange = (e) => {
     setDatosCliente( prevDatos => (
       {...prevDatos,
       [e.target.name]: e.target.value,
     }
     ))
   }

   const handleChangePhoto = (e) => {
     let moralisFile = saveFile(e.target.files[0].name, e.target.files[0]);
   }

   const handleSubmit = async (e) => {
     e.preventDefault();
     e.stopPropagation();
     if (e.currentTarget.checkValidity() === false) {
       e.preventDefault();
       e.stopPropagation();
    } else{
    const {nombre, email, entidadRelacionada} = datosCliente;
    //guardado de datos del cliente
    setUserData({
      nombre: nombre,
      email: email,
    })
    const rolCliente = qRol.data.find( rol => rol.get("nombre") === 'cliente')
    const estadoNoVerificado = qEstadosCliente.data.find( estado => estado.get("nombre") === 'cliente no verificado')
    //guardado usuario en relacion del rol
    await Moralis.Cloud.run("guardarUsuarioEnRol", {user: user.id})
    //guardado de pointers del cliente
    user.set("imagenPerfil", moralisFile);
    user.set("estadoAsignado", estadoNoVerificado)
    user.set("rolAsignado", rolCliente)
    user.save();
    //gaurdado usuario en la relacion del estado
    estadoNoVerificado.relation("clientesAsociados").add(user);
    estadoNoVerificado.save()
    //cambio de pestaña a registrar entidad
    setKey("registroEntidad");
  }
    setValidated(true);
  }

  return(

      <div>
        <div
          onClick ={(e) => e.stopPropagation()}
          onKeyDown ={(e) => e.stopPropagation()}
          onFocus = {(e) => e.stopPropagation()}
          onMouseOver = {(e) => e.stopPropagation()}
        >

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Ingrese su nombre de Usuario</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nombre de Usuario"
                name="nombre"
                onChange={handleChange}
                defaultValue={datosCliente.nombre}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un nombre</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Ingrese su Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="ejemplo@email.com"
                name="email"
                onChange={handleChange}
                defaultValue={datosCliente.email}
              />
              <Form.Control.Feedback type="invalid">Debe ingresar un email válido</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="imagenPerfil">
              <Form.Label>Seleccione una Foto de Perfil</Form.Label>
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

            {isUploading
              ?
                <Button variant="light">
                  <Spinner animation="border" variant="dark" size="sm"/>
                </Button>
              :
              <Button
                type="submit"
                variant="light"
                className="btn-aceptar"
              >
                Registrar
              </Button>
            }

          </Form>

        </div>
      </div>

    )
}

export default RegistroUsuario;
