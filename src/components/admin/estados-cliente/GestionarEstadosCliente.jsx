import { useState, useEffect} from 'react';
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearEstadoCliente from './CrearEstadoCliente';
import ModificarEstadoCliente from './ModificarEstadoCliente';
import EliminarEstadoCliente from './EliminarEstadoCliente';

const GestionarEstadosCliente = () => {

  const [estadosActivos, setEstadosActivos] = useState();
  const [estadosInactivos, setEstadosInactivos] = useState();

  const botones = ["Crear Estado Cliente", "Modificar Estado Cliente", "Eliminar Estado Cliente"]

  const estadosCliente = useMoralisQuery("EstadoCliente", q => q, [], { live: true });

 const estadosClientesActivos = () => {
   const estadosClienteActivos = estadosCliente.data.filter(estado => !estado.get("FechaFinVigencia"))
   setEstadosActivos(estadosClienteActivos)
 }

 const estadosClientesInactivos = () => {
   const estadosClienteInactivos = estadosCliente.data.filter(estado => estado.get("FechaFinVigencia"))
   setEstadosInactivos(estadosClienteInactivos)
 }

 useEffect(() => {
   estadosClientesActivos()
   estadosClientesInactivos()
 }, [estadosCliente.data])

  const [opcionAbierta, setOpcionAbierta] = useState({
    CrearEstadoCliente: false,
    EliminarEstadoCliente: false,
    ModificarEstadoCliente: false,
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

  return (
    <div>
      <h6 className="display-6 title-modal my-5">GESTIÓN DE ESTADOS DE CLIENTES</h6>

      <div className="mx-5 my-4 text-center">

        <h5 className="title-modal my-2">Estados Cliente Activos</h5>
        {estadosCliente.isLoading
          ? <Spinner animation="border" variant="dark" size="lg" />
          :
          <table className="table custom-table shadow">
            <thead>
              <tr className="title-modal">
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>

            <tbody>
              {estadosActivos && estadosActivos.map((estado, index) =>
                <tr key={index}>
                  <td>{estado.get("codEstadoCliente")}</td>
                  <td>{estado.get("nombre")}</td>
                  <td>{estado.get("descripcion")}</td>
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

      <hr />

      <div className="mx-5 my-4 text-center">
        <h5 className="title-modal my-2">Estados Cliente Inactivos</h5>
        {estadosCliente.isLoading
          ? <Spinner animation="border" variant="dark" size="lg" />
          :
          <table className="table custom-table shadow">
            <thead>
              <tr className="title-modal">
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>

            <tbody>
              {estadosInactivos && estadosInactivos.map((estado, index) =>
                <tr key={index}>
                  <td>{estado.get("codEstadoCliente")}</td>
                  <td>{estado.get("nombre")}</td>
                  <td>{estado.get("descripcion")}</td>
                </tr>
              )}
            </tbody>

          </table>
        }
      </div>

      {opcionAbierta.CrearEstadoCliente &&
        <CrearEstadoCliente cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearEstadoCliente} />}

      {opcionAbierta.EliminarEstadoCliente &&
        <EliminarEstadoCliente cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarEstadoCliente} estadosCliente={estadosActivos} />}

      {opcionAbierta.ModificarEstadoCliente &&
        <ModificarEstadoCliente cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarEstadoCliente} estadosCliente={estadosActivos} />}

    </div>
  )
}

export default GestionarEstadosCliente;
