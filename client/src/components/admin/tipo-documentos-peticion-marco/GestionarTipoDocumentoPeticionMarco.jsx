import { useEffect, useState } from 'react'
import { Button, Stack, Spinner } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import CrearTipoDocumentoPeticionMarco from './CrearTipoDocumentoPeticionMarco'
import ModificarTipoDocumentoPeticionMarco from './ModificarTipoDocumentoPeticionMarco'
import EliminarTipoDocumentoPeticionMarco from './EliminarTipoDocumentoPeticionMarco'

const GestionarTipoDocumentoPeticionMarco = () => {

    const [tipoDocumentoActivos, setTipoDocumentoActivos] = useState();
    const [tipoDocumentoInactivos, setTipoDocumentoInactivos] = useState();

    const botones = ["Crear Tipo Documento Peticion Marco", "Modificar Tipo Documento Peticion Marco", "Eliminar Tipo Documento Peticion Marco"]

    const tipoDocumentoPeticionMarco = useMoralisQuery("TipoDocumentoAsociadoPeticionMarco", q => q, [], { live: true });

    const tipoDocumentoPeticionMarcoActivos = () => {
        const tipoDocActivo = tipoDocumentoPeticionMarco.data.filter(tipo => !tipo.get("FechaFinVigencia"))
        setTipoDocumentoActivos(tipoDocActivo)
    }

    const tipoDocumentoPeticionMarcoInactivos = () => {
        const tipoDocInactivo = tipoDocumentoPeticionMarco.data.filter(doc => doc.get("FechaFinVigencia"))
        setTipoDocumentoInactivos(tipoDocInactivo)
    }

    useEffect(() => {
        tipoDocumentoPeticionMarcoActivos()
        tipoDocumentoPeticionMarcoInactivos()
    }, [tipoDocumentoPeticionMarco.data])

    const [opcionAbierta, setOpcionAbierta] = useState({
        CrearTipoDocumentoPeticionMarco: false,
        ModificarTipoDocumentoPeticionMarco: false,
        EliminarTipoDocumentoPeticionMarco: false,
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
            <h6 className="display-6 title-modal my-5">GESTIÓN DE TIPOS DE DOCUMENTOS PETICION CONVENIO MARCO</h6>

            <div className="mx-5 my-4 text-center">

                <h5 className="title-modal my-2">Tipos de Documentos Activos</h5>

                {tipoDocumentoPeticionMarco.isLoading
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

                    {tipoDocumentoPeticionMarco.isLoading
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
            {opcionAbierta.CrearTipoDocumentoPeticionMarco &&
                <CrearTipoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.CrearTipoDocumentoPeticionMarco} />}

            {opcionAbierta.EliminarTipoDocumentoPeticionMarco &&
                <EliminarTipoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.EliminarTipoDocumentoPeticionMarco} tipoDocumentoPeticionMarco={tipoDocumentoActivos} />}

            {opcionAbierta.ModificarTipoDocumentoPeticionMarco &&
                <ModificarTipoDocumentoPeticionMarco cerrarOpcion={cerrarOpcion} opcionAbierta={opcionAbierta.ModificarTipoDocumentoPeticionMarco} tipoDocumentoPeticionMarco={tipoDocumentoActivos} />}

        </div>
    )
}

export default GestionarTipoDocumentoPeticionMarco
