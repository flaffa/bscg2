import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearTipoDocumentoEntidad from './CrearTipoDocumentoEntidad'
import ModificarTipoDocumentoEntidad from './ModificarTipoDocumentoEntidad'
import EliminarTipoDocumentoEntidad from './EliminarTipoDocumentoEntidad'

const GestionarTipoDocumentoEntidad = () => {

    const [tipoDocumentoActivos, setTipoDocumentoActivos] = useState();
    const [tipoDocumentoInactivos, setTipoDocumentoInactivos] = useState();

    const botones = ["Crear Tipo Documento Entidad", "Modificar Tipo Documento Entidad", "Eliminar Tipo Documento Entidad"]

    const tipoDocumentoEntidad = useMoralisQuery("TipoDocumentoAsociadoEntidad", q => q, [], { live: true });

    const tipoDocumentosEntidadActivos = () => {
        const tipoDocActivo = tipoDocumentoEntidad.data.filter(tipo => !tipo.get("FechaFinVigencia"))
        setTipoDocumentoActivos(tipoDocActivo)
    }

    const tipoDocumentosEntidadInactivos = () => {
        const tipoDocInactivo = tipoDocumentoEntidad.data.filter(doc => doc.get("FechaFinVigencia"))
        setTipoDocumentoInactivos(tipoDocInactivo)
    }

    useEffect(() => {
        tipoDocumentosEntidadActivos()
        tipoDocumentosEntidadInactivos()
    }, [tipoDocumentoEntidad.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearTipoDocumentoEntidad: false,
        ModificarTipoDocumentoEntidad: false,
        EliminarTipoDocumentoEntidad: false,
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
            <h6 className="display-6 title-modal my-5">GESTIÓN DE TIPOS DE DOCUMENTOS ENTIDAD</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Tipos de Documentos Activos</h5>

                {tipoDocumentoEntidad.isLoading
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
                            {tipoDocumentoActivos && tipoDocumentoActivos.map((doc, index) =>
                                <tr key={index}>
                                    <td>{doc.get("codigo")}</td>
                                    <td>{doc.get("nombre")}</td>
                                    <td>{doc.get("descripcion")}</td>
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

                    <h5 className="title-modal my-2">Tipos de Documentos Inactivos</h5>

                    {tipoDocumentoEntidad.isLoading
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
                                {tipoDocumentoInactivos && tipoDocumentoInactivos.map((doc, index) =>
                                    <tr key={index}>
                                        <td>{doc.get("codigo")}</td>
                                        <td>{doc.get("nombre")}</td>
                                        <td>{doc.get("descripcion")}</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    }
                </div>
            </div>
            {opcionAbierta.CrearTipoDocumentoEntidad &&
                <CrearTipoDocumentoEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearTipoDocumentoEntidad} />}

            {opcionAbierta.EliminarTipoDocumentoEntidad &&
                <EliminarTipoDocumentoEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarTipoDocumentoEntidad} tipoDocumentoEntidad={tipoDocumentoActivos} />}

            {opcionAbierta.ModificarTipoDocumentoEntidad &&
                <ModificarTipoDocumentoEntidad cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarTipoDocumentoEntidad} tipoDocumentoEntidad={tipoDocumentoActivos} />}

        </div>
    )
}

export default GestionarTipoDocumentoEntidad
