import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearEstadoPeticionMarco from "./CrearEstadoPeticionMarco";
import ModificarEstadoPeticionMarco from "./ModificarEstadoPeticionMarco";
import EliminarEstadoPeticionMarco from "./EliminarEstadoPeticionMarco";

const GestionarEstadosPeticionMarco = () => {

    const [estadosActivos, setEstadosActivos] = useState();
    const [estadosInactivos, setEstadosInactivos] = useState();

    const botones = ["Crear Estado Peticion Marco", "Modificar Estado Peticion Marco", "Eliminar Estado Peticion Marco"]

    const estadosPeticionMarco = useMoralisQuery("EstadoPeticionMarco", q => q, [], { live: true });

    const estadosPeticionMarcoActivos = () => {
        const estadosDocumetosActivos = estadosPeticionMarco.data.filter(estado => !estado.get("FechaFinVigencia"))
        setEstadosActivos(estadosDocumetosActivos)
    }

    const estadosPeticionMarcoInactivos = () => {
        const estadosDocumetosInactivos = estadosPeticionMarco.data.filter(estado => estado.get("FechaFinVigencia"))
        setEstadosInactivos(estadosDocumetosInactivos)
    }

    useEffect(() => {
        estadosPeticionMarcoActivos()
        estadosPeticionMarcoInactivos()
    }, [estadosPeticionMarco.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearEstadoPeticionMarco: false,
        ModificarEstadoPeticionMarco: false,
        EliminarEstadoPeticionMarco: false,
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
            <h6 className="display-6 title-modal my-5">GESTIÓN DE ESTADOS DE PETICION MARCO</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Estados Activos</h5>


                {estadosPeticionMarco.isLoading
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

                    {estadosPeticionMarco.isLoading
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
            {opcionAbierta.CrearEstadoPeticionMarco &&
                <CrearEstadoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearEstadoPeticionMarco} />}

            {opcionAbierta.EliminarEstadoPeticionMarco &&
                <EliminarEstadoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarEstadoPeticionMarco} estadosPeticionMarco={estadosActivos} />}

            {opcionAbierta.ModificarEstadoPeticionMarco &&
                <ModificarEstadoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarEstadoPeticionMarco} estadosPeticionMarco={estadosActivos} />}

        </div>
    )
}

export default GestionarEstadosPeticionMarco
