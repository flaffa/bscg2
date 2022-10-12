import { useState, useEffect } from 'react';
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisCloudFunction } from 'react-moralis';

import CrearRol from './CrearRol';
import ModificarRol from './ModificarRol';
import EliminarRol from './EliminarRol';

const GestionarRoles = () => {

  const [rolesActivos, setRolesActivos] = useState();
  const [rolesInactivos, setRolesInactivos] = useState();

  const botones = ["Crear Rol", "Modificar Rol", "Eliminar Rol"]

  const roles = useMoralisCloudFunction("obtenerRoles",  { autoFetch: false })

  const rolesBuscarActivos = () => {
    const rolActivo = roles?.data?.filter(rol => !rol.get("fechaFinVigencia") && rol.get("nombre") !== "coreservices")
    setRolesActivos(rolActivo)
  }

  const rolesBuscarInactivos = () => {
    const rolInactivo = roles?.data?.filter(rol => rol.get("fechaFinVigencia"))
    setRolesInactivos(rolInactivo)
  }

  const [opcionAbierta, setOpcionAbierta] = useState({
    CrearRol: false,
    EliminarRol: false,
    ModificarRol: false,
  });

  const abrirOpcion = (nombre) => {
    nombre = nombre.replace(/\s/g, '')
    setOpcionAbierta(prevState => ({
      ...prevState,
      [nombre]: true,
    }))
  }

  const cerrarOpcion = (nombre) => {
    setOpcionAbierta(prevState => ({
      ...prevState,
      [nombre]: false,
    }))
  }

  const cloudCall = async () => {
    await roles.fetch();
  };

  useEffect(() => {
    cloudCall()
    rolesBuscarActivos()
    rolesBuscarInactivos()
  }, [roles.data])

  return(
    <div>
      <h6 className="display-6 title-modal my-5">GESTIÓN DE ROLES</h6>

      <div className="mx-5 my-4 text-center">

        <h5 className="title-modal my-2">Roles Activos</h5>

        {roles.isLoading
          ? <Spinner animation="border" variant="dark" size="lg" />
          :
          <table className="table custom-table shadow">
            <thead>
              <tr className="title-modal">
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Permisos Asociados</th>
              </tr>
            </thead>

            <tbody>
              {rolesActivos && rolesActivos.map((rol, index) =>
                <tr key={index}>
                  <td>{rol.get("codigo")}</td>
                  <td>{rol.get("nombre")}</td>
                  <td>{rol.get("descripcion")}</td>
                  <td><Button>Ver Permisos Asociados</Button></td>
                </tr>
              )}
            </tbody>

          </table>
        }
      </div>

      <Stack gap={3} direction="horizontal" className="d-flex align-items-center mx-5 mt-5">
        {botones.map((elemento, index) => {
          return (
            <div key={index} className="w-100">
              <Button
                className="m-2 btn-aceptar w-75"
                variant="none"
                onClick={() => abrirOpcion(elemento)}
              >{elemento}</Button>
            </div>
          )
        })}
      </Stack>

      <div className="mx-5 my-4 text-center">

        <h5 className="title-modal my-2">Roles Inactivos</h5>

        {roles.isLoading
          ? <Spinner animation="border" variant="dark" size="lg" />
          :
          <table className="table custom-table shadow">
            <thead>
              <tr className="title-modal">
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Permisos Asociados</th>
              </tr>
            </thead>

            <tbody>
              {rolesInactivos && rolesInactivos.map((rol, index) =>
                <tr key={index}>
                  <td>{rol.get("codigo")}</td>
                  <td>{rol.get("nombre")}</td>
                  <td>{rol.get("descripcion")}</td>
                  <td><Button>Ver Permisos Asociados</Button></td>
                </tr>
              )}
            </tbody>

          </table>
        }
      </div>


      {opcionAbierta.CrearRol &&
        <CrearRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearRol} />}

      {opcionAbierta.EliminarRol &&
        <EliminarRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarRol} roles={rolesActivos} />}

      {opcionAbierta.ModificarRol &&
        <ModificarRol cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarRol} roles={rolesActivos} />}
      
    </div>
  )
}

export default GestionarRoles;
