import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearTipoDocumentoPeticionEspecifico from './CrearTipoDocumentoPeticionEspecifico'
import ModificarTipoDocumentoPeticionEspecifico from './ModificarTipoDocumentoPeticionEspecifico'
import EliminarTipoDocumentoPeticionEspecifico from './EliminarTipoDocumentoPeticionEspecifico'

const GestionarTipoDocumentoPeticionEspecifico = () => {

    const [tipoDocumentoActivos, setTipoDocumentoActivos] = useState();
    const [tipoDocumentoInactivos, setTipoDocumentoInactivos] = useState();

    const botones = ["Crear Tipo Documento Peticion Especifico", "Modificar Tipo Documento Peticion Especifico", "Eliminar Tipo Documento Peticion Especifico"]

    const tipoDocumentoPeticionEspecifico = useMoralisQuery("TipoDocumentoAsociadoPeticionEspecifico", q => q, [], { live: true });

    const tipoDocumentoPeticionEspecificoActivos = () => {
        const tipoDocActivo = tipoDocumentoPeticionEspecifico.data.filter(tipo => !tipo.get("FechaFinVigencia"))
        setTipoDocumentoActivos(tipoDocActivo)
    }

    const tipoDocumentoPeticionEspecificoInactivos = () => {
        const tipoDocInactivo = tipoDocumentoPeticionEspecifico.data.filter(doc => doc.get("FechaFinVigencia"))
        setTipoDocumentoInactivos(tipoDocInactivo)
    }

    useEffect(() => {
        tipoDocumentoPeticionEspecificoActivos()
        tipoDocumentoPeticionEspecificoInactivos()
    }, [tipoDocumentoPeticionEspecifico.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearTipoDocumentoPeticionEspecifico: false,
        ModificarTipoDocumentoPeticionEspecifico: false,
        EliminarTipoDocumentoPeticionEspecifico: false,
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
            <h6 className="display-6 title-modal my-5">GESTI??N DE TIPOS DE DOCUMENTOS PETICION CONVENIO ESPECIFICO</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Tipos de Documentos Activos</h5>

                {tipoDocumentoPeticionEspecifico.isLoading
                    ? <Spinner animation="border" variant="dark" size="lg" />
                    :
                    <table className="table custom-table shadow">
                        <thead>
                            <tr className="title-modal">
                                <th>C??digo</th>
                                <th>Nombre</th>
                                <th>Descripci??n</th>
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

                    {tipoDocumentoPeticionEspecifico.isLoading
                        ? <Spinner animation="border" variant="dark" size="lg" />
                        :
                        <table className="custom-table table shadow">
                            <thead>
                                <tr className="title-modal">
                                    <th>C??digo</th>
                                    <th>Nombre</th>
                                    <th>Descripci??n</th>
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
            {opcionAbierta.CrearTipoDocumentoPeticionEspecifico &&
                <CrearTipoDocumentoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearTipoDocumentoPeticionEspecifico} />}

            {opcionAbierta.EliminarTipoDocumentoPeticionEspecifico &&
                <EliminarTipoDocumentoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarTipoDocumentoPeticionEspecifico} tipoDocumentoPeticionEspecifico={tipoDocumentoActivos} />}

            {opcionAbierta.ModificarTipoDocumentoPeticionEspecifico &&
                <ModificarTipoDocumentoPeticionEspecifico cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarTipoDocumentoPeticionEspecifico} tipoDocumentoPeticionEspecifico={tipoDocumentoActivos} />}

        </div>
    )
}

export default GestionarTipoDocumentoPeticionEspecifico
