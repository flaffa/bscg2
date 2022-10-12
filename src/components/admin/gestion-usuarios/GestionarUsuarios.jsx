 import {useState} from 'react';
import {Button, Stack, Table, Spinner} from 'react-bootstrap';
import {useMoralisCloudFunction} from 'react-moralis';

import AsignarUsuarioaRol from './AsignarUsuarioaRol';

const GestionarUsuarios = () => {

  const botones = ["Asignar Usuario a Rol"]
  //, "Crear Usuario", "Dar de Baja Usuario", "Modificar Usuario"

  const obtenerUsuarios = useMoralisCloudFunction("obtenerUsuarios")

  const [opcionAbierta, setOpcionAbierta] = useState({
    // CrearUsuarios: false,
    // DardeBajaUsuario: false,
    // ModificarUsuario: false,
    AsignarUsuarioaRol: false,
  });

  const abrirOpcion = (nombre) => {
    nombre = nombre.replace(/\s/g, '')
    setOpcionAbierta( prevState => ({
        ...prevState,
        [nombre]: true,
      }))
  }

  const cerrarOpcion = (nombre) => {
    setOpcionAbierta( prevState => ({
      ...prevState,
      [nombre]: false,
    }))
  }

  return(
    <div>
      <h6 className="display-6 title-modal my-5">GESTIÓN DE USUARIOS</h6>

      <div className="mx-5 my-4 text-center">

        {obtenerUsuarios.isFetching
          ? <Spinner animation="border" variant="dark" size="lg"/>
          :
          <Table bordered striped responsive size="sm" className="shadow"  >
            <thead>
              <tr className="title-modal">
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Creación</th>
                <th>Fecha de Última Modificación</th>
              </tr>
            </thead>

            <tbody>
              {obtenerUsuarios.data?.map( (usuario, index) =>
                index !== 0 &&
                  <tr key={index}>
                    <td>{usuario.id}</td>
                    <td>{usuario.get("nombre")}</td>
                    <td>{usuario.get("email")}</td>
                    <td>{usuario.get("rol") === undefined
                      ? "No Definido"
                      : usuario.get("rol").get("nombre")
                    }
                    </td>
                    <td>{usuario.createdAt.toLocaleString()}</td>
                    <td>{usuario.updatedAt.toLocaleString()}</td>
                  </tr>
              )}
            </tbody>

          </Table>
        }
      </div>

      <Stack gap={3} direction="horizontal" className="d-flex align-items-center mx-5 mt-5">
        {botones.map( (elemento, index) => {
          return(
            <div key={index} className="w-100">
              <Button
                className="m-2 btn-aceptar w-25"
                variant="none"
                onClick={() => abrirOpcion(elemento)}
              >{elemento}</Button>
            </div>
          )
        })}
      </Stack>

      { opcionAbierta.AsignarUsuarioaRol &&
        <AsignarUsuarioaRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.AsignarUsuarioaRol} usuarios={obtenerUsuarios}/> }

      {/*
        { opcionAbierta.CrearRol &&
        <CrearRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearRol}/> }

        { opcionAbierta.EliminarRol &&
        <EliminarRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarRol} roles={roles}/> }

        { opcionAbierta.ModificarRol &&
        <ModificarRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarRol} roles={roles}/> }
      */}

    </div>
  )
}

export default GestionarUsuarios;
