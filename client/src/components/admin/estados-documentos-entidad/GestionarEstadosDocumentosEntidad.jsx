import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearEstadoDocumentosEntidad from "./CrearEstadoDocumentosEntidad";
import ModificarEstadoDocumentosEntidad from "./ModificarEstadoDocumentosEntidad";
import EliminarEstadoDocumentosEntidad from "./EliminarEstadoDocumentosEntidad";

const GestionarEstadosDocumentosEntidad = () => {

    const [estadosActivos, setEstadosActivos] = useState();
    const [estadosInactivos, setEstadosInactivos] = useState();

    const botones = ["Crear Estado Documentos Entidad", "Modificar Estado Documentos Entidad", "Eliminar Estado Documentos Entidad"]

    const estadosDocumentosEntidad = useMoralisQuery("EstadoDocumentoAsociadoEntidad", q => q, [], { live: true });

    const estadosDocumentosEntidadActivos = () => {
        const estadosDocumetosActivos = estadosDocumentosEntidad.data.filter(estado => !estado.get("FechaFinVigencia"))
        setEstadosActivos(estadosDocumetosActivos)
    }

    const estadosDocumentosEntidadInactivos = () => {
        const estadosDocumetosInactivos = estadosDocumentosEntidad.data.filter(estado => estado.get("FechaFinVigencia"))
        setEstadosInactivos(estadosDocumetosInactivos)
    }

    useEffect(() => {
        estadosDocumentosEntidadActivos()
        estadosDocumentosEntidadInactivos()
    }, [estadosDocumentosEntidad.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearEstadoDocumentosEntidad: false,
        ModificarEstadoDocumentosEntidad: false,
        EliminarEstadoDocumentosEntidad: false,
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
            <h6 className="display-6 title-modal my-5">GESTIÓN DE ESTADOS DE DOCUMENTACIÓN ENTIDAD</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Estados Activos</h5>


                {estadosDocumentosEntidad.isLoading
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

            <div>
                <div className="mx-5 my-4 text-center">

                    <h5 className="title-modal my-2">Estados Inactivos</h5>

                    {estadosDocumentosEntidad.isLoading
                        ? <Spinner animation="border" variant="dark" size="lg" />
                        :
                        <table className="custom-table table shadow">
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
            </div>
            {opcionAbierta.CrearEstadoDocumentosEntidad &&
                <CrearEstadoDocumentosEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearEstadoDocumentosEntidad} />}

            {opcionAbierta.EliminarEstadoDocumentosEntidad &&
                <EliminarEstadoDocumentosEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarEstadoDocumentosEntidad} estadosDocumentosEntidad={estadosActivos} />}

            {opcionAbierta.ModificarEstadoDocumentosEntidad &&
                <ModificarEstadoDocumentosEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarEstadoDocumentosEntidad} estadosDocumentosEntidad={estadosActivos} />}

        </div>
    )
}

export default GestionarEstadosDocumentosEntidad
