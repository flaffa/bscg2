import {useState, useEffect} from 'react';
import {MdSchedule, MdOutlineEdit} from 'react-icons/md';
import {useMoralis, useMoralisCloudFunction , useMoralisQuery} from "react-moralis";
import {Moralis} from 'moralis';
import {Offcanvas, Button, Stack, Spinner, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import ModificarUsuario from './ModificarUsuario';
import ModificarImagen from './ModificarImagen';
import ModificarEntidad from './ModificarEntidad';
import ModificarRepresentante from './ModificarRepresentante';

import "../landing-page/Menu.css";

const ProfileOptionsCard = ({opcionesAbiertas, cerrarOpciones, setIsLoggedIn}) => {

  const {user, logout, refetchUserData, isUserUpdating} = useMoralis();
  const queryTipoUsuario = useMoralisCloudFunction("obtenerRoles");
  const queryEstadoUsuario = useMoralisQuery("EstadoCliente", q => q, [], {live: true})
  const queryEntidad = useMoralisQuery("Entidad", q => q.equalTo("usuarioRelacionado", user), [],  {live: true} )

  const [perfilAbierto, setPerfilAbierto] = useState({
    usuario: false,
    entidad: false,
    representante: false,
  });

  const abrirPerfil = (e) => {
    const {id} = e.target;
    setPerfilAbierto( prevState => (
      {...prevState,
      [id]: true,
    }));
  }

  const cerrarPerfil = (tipo) => {
    setPerfilAbierto( prevState => (
      {...prevState,
      [tipo]: false,
    }));
  }

  const [hoverIcon, setHoverIcon] = useState(false);

  const onHover = () => {
    setHoverIcon(true);
  }

  const onLeave = () => {
    setHoverIcon(false);
  }

  const [estaModificandoImagen, setEstaModificandoImagen] = useState(false);

  const logOut = async () => {
    setIsLoggedIn(false);
    await logout();
    navigate("/");
  }

  let navigate = useNavigate();
  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path, { state: {
      usuario: user.id,
      nombreEntidad: queryEntidad?.data[0]?.get("nombre"),
      idEntidad: queryEntidad?.data[0]?.id,
      dataRoles: queryTipoUsuario?.data.find( rol => rol.get("nombre") === 'administrador'),
     }
    });
  }

  useEffect( () => {
    refetchUserData()
  },[])

  return (
    <Offcanvas
      show={opcionesAbiertas}
      onHide={cerrarOpciones}
      scroll={false}
      backdrop={true}
      placement="end"
      className="perfil-usuario bg-perfil"
      restoreFocus={false}
    >

      <Offcanvas.Header closeButton>
        <b style={{color: "white"}}>PERFIL DE USUARIO</b>
      </Offcanvas.Header>

      <Offcanvas.Body >

        <Stack gap={2}>
          <div className="hex"
            onClick={() => setEstaModificandoImagen(true)}
          >
            {hoverIcon &&
              <MdOutlineEdit
                style={{fontSize: "40px", color: "white", marginTop: "40px"}}
              />}

            <div
              className="hex-background"
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              <img
                className="foto-perfil"
                src={user?.attributes.imagenPerfil?._url}
                alt="Foto de Perfil"
                style={{height: "150px",
                width: "150px"}}/>
            </div>
          </div>

          <div>
            <h4>{user.get("nombre")}</h4>

            {user?.attributes?.rolAsignado?.get("nombre") === 'administrador' &&
              <h6 className="text-muted">ADMINISTRADOR</h6>}

            {user?.attributes?.estadoAsignado?.get("nombre") === 'cliente no verificado'
              ? <OverlayTrigger placement="bottom" overlay={(<Tooltip id="1">
                Para verificarse debe subir los documentos respectivos a su entidad y esperar su validacion.
              </Tooltip>)}>
                <h6 className="text-muted">{user?.attributes?.estadoAsignado?.get("nombre")?.toUpperCase()}</h6>
              </OverlayTrigger>
              : <h6 className="text-muted">{user?.attributes?.estadoAsignado?.get("nombre")?.toUpperCase()}</h6>
            }

          </div>
        </Stack>

        {user.attributes.rolAsignado.get("nombre") === "cliente"
          &&
          <>
            <hr/>
            { queryEntidad.isLoading
              ? <Spinner animation="border" variant="dark" size="sm"/>
              : <div>
                <h5>{queryEntidad.data[0]?.get("nombre")}</h5>
                <p className="word-overflow">{queryEntidad.data[0]?.get("descripcionEntidad")}</p>
              </div>
            }
          </>
        }

        <hr/>

        <Stack gap={3}>
          <Button className="btn-aceptar" variant="light"
            id="usuario"
            onClick={abrirPerfil}
          >Editar Perfil Usuario</Button>

          {user.attributes.rolAsignado.get("nombre") === "cliente" &&
            <>
              <Button className="btn-aceptar" variant="light"
                id="entidad"
                onClick={abrirPerfil}
              >Editar Perfil Entidad</Button>
              <Button className="btn-aceptar" variant="light"
                id="representante"
                onClick={abrirPerfil}
              >Editar Perfil Representante</Button>
              <Button className="btn-aceptar" variant="light"
                onClick={() => {
                  cerrarOpciones();
                  navigateTo("/cliente/gestion-documentacion")
                }}
              >Ver documentación de Entidad</Button>
            </>
          }

          <Button style={{color: "black"}} className="btn log-out-btn" variant="outline" onClick={() => {
            logOut();
            cerrarOpciones();
          }}>Cerrar Sesión</Button>
        </Stack>

      </Offcanvas.Body>

      {estaModificandoImagen &&
        <ModificarImagen
          setEstaModificandoImagen={setEstaModificandoImagen}
          estaModificandoImagen={estaModificandoImagen}
          user={user}
        />}

      {perfilAbierto.usuario &&
        <ModificarUsuario
          cerrarPerfil={cerrarPerfil}
          perfilAbierto={perfilAbierto.usuario}
          user={user}
        />}

      {perfilAbierto.entidad &&
        <ModificarEntidad
          cerrarPerfil={cerrarPerfil}
          perfilAbierto={perfilAbierto.entidad}
          user={user}
          entidad={queryEntidad.data[0]}
        />}

      {perfilAbierto.representante &&
        <ModificarRepresentante
          cerrarPerfil={cerrarPerfil}
          perfilAbierto={perfilAbierto.representante}
          user={user}
          entidad={queryEntidad.data[0]}
        />}

    </Offcanvas>
  )
}

export default ProfileOptionsCard;
