import { useState, useEffect } from 'react';
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearEstadoDocumentoPeticionMarco from './CrearEstadoDocumentoPeticionMarco'
import ModificarEstadoDocumentoPeticionMarco from './ModificarEstadoDocumentoPeticionMarco'
import EliminarEstadoDocumentoPeticionMarco from './EliminarEstadoDocumentoPeticionMarco'

const GestionarDocumentoEstadoPeticionMarco = () => {

    const [estadosActivos, setEstadosActivos] = useState();
    const [estadosInactivos, setEstadosInactivos] = useState();

    const botones = ["Crear Estado Documento Peticion Marco", "Modificar Estado Documento Peticion Marco", "Eliminar Estado Documento Peticion Marco"]

    const estadoDocumentoPeticionMarco = useMoralisQuery("EstadoDocumentoPeticionMarco", q => q, [], { live: true });

    const estadoDocumentoPeticionMarcoActivos = () => {
        const estadoDocumentoActivos = estadoDocumentoPeticionMarco.data.filter(estado => !estado.get("FechaFinVigencia"))
        setEstadosActivos(estadoDocumentoActivos)
      }

      const estadoDocumentoPeticionMarcoInactivos = () => {
        const estadoDocumentoInactivos = estadoDocumentoPeticionMarco.data.filter(estado => estado.get("FechaFinVigencia"))
        setEstadosInactivos(estadoDocumentoInactivos)
      }

      useEffect(() => {
        estadoDocumentoPeticionMarcoActivos()
        estadoDocumentoPeticionMarcoInactivos()
      }, [estadoDocumentoPeticionMarco.data])

      const [opcionAbierta, setOpcionAbierta] = useState({
        CrearEstadoDocumentoPeticionMarco: false,
        EliminarEstadoDocumentoPeticionMarco: false,
        ModificarEstadoDocumentoPeticionMarco: false,
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
        <h6 className="display-6 title-modal my-5">GESTIÓN DE ESTADOS DE DOCUMENTOS PETICION CONVENIO MARCO</h6>

        <div className="mx-5 my-4 text-center">

          <h5 className="title-modal my-2">Estados Documentos Activos</h5>
          {estadoDocumentoPeticionMarco.isLoading
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
                    <td>{estado.get("codigo")}</td>
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
          <h5 className="title-modal my-2">Estados Documentos Inactivos</h5>
          {estadoDocumentoPeticionMarco.isLoading
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
                    <td>{estado.get("codigo")}</td>
                    <td>{estado.get("nombre")}</td>
                    <td>{estado.get("descripcion")}</td>
                  </tr>
                )}
              </tbody>

            </table>
          }
        </div>

        {opcionAbierta.CrearEstadoDocumentoPeticionMarco &&
          <CrearEstadoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearEstadoDocumentoPeticionMarco} />}

        {opcionAbierta.EliminarEstadoDocumentoPeticionMarco &&
          <EliminarEstadoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarEstadoDocumentoPeticionMarco} estadoDocumentoPeticionMarco={estadosActivos} />}

        {opcionAbierta.ModificarEstadoDocumentoPeticionMarco &&
          <ModificarEstadoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarEstadoDocumentoPeticionMarco} estadoDocumentoPeticionMarco={estadosActivos} />}

      </div>
    )
}

export default GestionarDocumentoEstadoPeticionMarco
