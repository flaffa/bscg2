import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearEstadoPeticionEspecifico from "./CrearEstadoPeticionEspecifico";
import ModificarEstadoPeticionEspecifico from "./ModificarEstadoPeticionEspecifico";
import EliminarEstadoPeticionEspecifico from "./EliminarEstadoPeticionEspecifico";

const GestionarEstadosPeticionEspecifico = () => {

    const [estadosActivos, setEstadosActivos] = useState();
    const [estadosInactivos, setEstadosInactivos] = useState();

    const botones = ["Crear Estado Peticion Especifico", "Modificar Estado Peticion Especifico", "Eliminar Estado Peticion Especifico"]

    const estadosPeticionEspecifico = useMoralisQuery("EstadoPeticionEspecifico", q => q, [], { live: true });

    const estadosPeticionEspecificoActivos = () => {
        const estadosDocumetosActivos = estadosPeticionEspecifico.data.filter(estado => !estado.get("FechaFinVigencia"))
        setEstadosActivos(estadosDocumetosActivos)
    }

    const estadosPeticionEspecificoInactivos = () => {
        const estadosDocumetosInactivos = estadosPeticionEspecifico.data.filter(estado => estado.get("FechaFinVigencia"))
        setEstadosInactivos(estadosDocumetosInactivos)
    }

    useEffect(() => {
        estadosPeticionEspecificoActivos()
        estadosPeticionEspecificoInactivos()
    }, [estadosPeticionEspecifico.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearEstadoPeticionEspecifico: false,
        ModificarEstadoPeticionEspecifico: false,
        EliminarEstadoPeticionEspecifico: false,
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
            <h6 className="display-6 title-modal my-5">GESTIÓN DE ESTADOS DE PETICION ESPECIFICO</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Estados Activos</h5>


                {estadosPeticionEspecifico.isLoading
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

                    {estadosPeticionEspecifico.isLoading
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
            {opcionAbierta.CrearEstadoPeticionEspecifico &&
                <CrearEstadoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearEstadoPeticionEspecifico} />}

            {opcionAbierta.EliminarEstadoPeticionEspecifico &&
                <EliminarEstadoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarEstadoPeticionEspecifico} estadosPeticionEspecifico={estadosActivos} />}

            {opcionAbierta.ModificarEstadoPeticionEspecifico &&
                <ModificarEstadoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarEstadoPeticionEspecifico} estadosPeticionEspecifico={estadosActivos} />}

        </div>
    )
}

export default GestionarEstadosPeticionEspecifico
