import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import AlertaCambios from '../AlertaCambios';

const EliminarTipoDocumentoPeticionMarco = ({opcionAbierta, cerrarOpcion, tipoDocumentoPeticionMarco}) => {

    const [validated, setValidated] = useState(false);

    const [showAlerta, setShowAlerta] = useState(false);

    const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState("");

    const handleChange = (e) => {
        setTipoDocumentoSeleccionado(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            setShowAlerta(true)
        }
        setValidated(true);
    }

    const handleConfirmSubmit = () => {
        const index = tipoDocumentoPeticionMarco.findIndex(doc => doc.get("nombre") === tipoDocumentoSeleccionado)
        const fecha = new Date();
        tipoDocumentoPeticionMarco[index].set("FechaFinVigencia", fecha);
        tipoDocumentoPeticionMarco[index].save();
        cerrarOpcion("EliminarTipoDocumentoPeticionMarco")
    }
    return (
       <div
             onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseOver={(e) => e.stopPropagation()}
        >

            <Modal
                show={opcionAbierta}
                onHide={() => cerrarOpcion("EliminarTipoDocumentoPeticionMarco")}
                centered
            >

                {showAlerta
                    ? <AlertaCambios
                        handleConfirmSubmit={handleConfirmSubmit}
                        showAlerta={showAlerta}
                        setShowAlerta={setShowAlerta} />
                    : <>
                        <Modal.Header className="perfil-usuario glassmorphism">
                            <Modal.Title className="w-100 title-modal">ELIMINAR TIPO DOCUMENTO PETICION CONVENIO MARCO</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="perfil-usuario">

                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmit}
                            >
                                <Form.Group className="mb-3" controlId="tipoDocumentoAEliminar">

                                    <Form.Select
                                        required
                                        onChange={handleChange}
                                        value={tipoDocumentoSeleccionado}
                                        name="tipoDocumentoAEliminar"
                                    >
                                        <option value="">---Seleccione un Tipo Documento a Eliminar---</option>
                                        {tipoDocumentoPeticionMarco.map((doc, index) =>
                                            <option key={index} value={doc.get("nombre")}
                                            >{doc.get("nombre")}</option>
                                        )}
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        Debe seleccionar un tipo documento existente
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    variant="light"
                                    className="btn-cancelar"
                                    onClick={() => cerrarOpcion("EliminarTipoDocumentoPeticionMarco")}
                                >Cancelar</Button>

                                <Button
                                    variant="light"
                                    className="btn-aceptar"
                                    type="submit"
                                >Eliminar</Button>

                            </Form>

                        </Modal.Body>
                    </>}

            </Modal>

        </div>

    )
}
export default EliminarTipoDocumentoPeticionMarco
