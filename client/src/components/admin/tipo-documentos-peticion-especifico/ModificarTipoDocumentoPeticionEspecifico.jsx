import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useMoralisQuery } from 'react-moralis';

import AlertaCambios from '../AlertaCambios';

const ModificarTipoDocumentoPeticionEspecifico = ({ opcionAbierta, cerrarOpcion, tipoDocumentoPeticionEspecifico }) => {

    const [validated, setValidated] = useState(false);

    const [showAlerta, setShowAlerta] = useState(false);
    const [showAlertaNombreInvalido, setShowAlertaNombreInvalido] = useState(false);

    const [tipoDocumentoData, setTipoDocumentoData] = useState({
        nombre: "",
        descripcion: "",
    })

    const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState({
        nombre: "",
        index: "",
    });

    const handleChangeTipoDocumentoSeleccionado = (e) => {
        const indexSeleccionado = tipoDocumentoPeticionEspecifico.findIndex(doc => doc.get("nombre") === e.target.value);
        setTipoDocumentoSeleccionado(prevState => ({
            nombre: e.target.value,
            index: indexSeleccionado,
        }))
        setTipoDocumentoData({
            nombre: tipoDocumentoPeticionEspecifico[indexSeleccionado].get("nombre"),
            descripcion: tipoDocumentoPeticionEspecifico[indexSeleccionado].get("descripcion"),
        })
    }

    const handleChangeTipoDocumento = (e) => {
        setTipoDocumentoData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const obtenerTipoDocumentoAsociadoPeticionEspecifico = useMoralisQuery("TipoDocumentoAsociadoPeticionEspecifico", q => q, [], { live: true });

    const validarNombre = () => {
        const nombresExistentes = obtenerTipoDocumentoAsociadoPeticionEspecifico.data.find(nombre => nombre.get("nombre") === tipoDocumentoData.nombre && nombre.get("nombre") !== tipoDocumentoSeleccionado.nombre)
        return (nombresExistentes)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            if (validarNombre()) {
                setShowAlertaNombreInvalido(true)
            } else {
                setShowAlerta(true);
            }
            setValidated(true);
        }
    }

    const handleConfirmSubmit = () => {
        const index = tipoDocumentoPeticionEspecifico.findIndex( doc => doc.get("nombre") === tipoDocumentoSeleccionado.nombre)
        tipoDocumentoPeticionEspecifico[index].set("nombre", tipoDocumentoData.nombre);
        tipoDocumentoPeticionEspecifico[index].set("descripcion", tipoDocumentoData.descripcion);
        tipoDocumentoPeticionEspecifico[index].save();
        cerrarOpcion("ModificarTipoDocumentoPeticionEspecifico");
        }

    return (
        <div
        onClick ={(e) => e.stopPropagation()}
        onKeyDown ={(e) => e.stopPropagation()}
        onFocus = {(e) => e.stopPropagation()}
        onMouseOver = {(e) => e.stopPropagation()}
      >
        <Modal
          show={opcionAbierta}
          onHide={() => cerrarOpcion("ModificarTipoDocumentoPeticionEspecifico")}
          centered
        >

          {showAlerta
            ? <AlertaCambios
              handleConfirmSubmit={handleConfirmSubmit}
              showAlerta={showAlerta}
              setShowAlerta={setShowAlerta}/>
            : <>
              <Modal.Header className="perfil-usuario glassmorphism">
                <Modal.Title className="w-100 title-modal">MODIFICAR TIPO DOCUMENTO PETICION CONVENIO ESPECIFICO</Modal.Title>
              </Modal.Header>

              <Modal.Body className="perfil-usuario">

                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >

                  <Form.Group className="mb-3" controlId="tipoDocumentoAModificar">

                    <Form.Select
                      required
                      onChange={handleChangeTipoDocumentoSeleccionado}
                      value={tipoDocumentoSeleccionado.nombre}
                      name="tipoDocumentoAModificar"
                    >
                      <option value="">---Seleccione un Tipo Documento a Modificar---</option>
                      {tipoDocumentoPeticionEspecifico.map( (doc,index) =>
                        <option key={index} value={doc.get("nombre")}
                        >{doc.get("nombre")}</option>
                      )}
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      Debe seleccionar un tipo documento existente
                    </Form.Control.Feedback>

                  </Form.Group>

                  { tipoDocumentoSeleccionado.nombre &&
                    <>
                      <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label column sm={6}>Nombre Tipo Documento</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="nombre"
                          onChange={handleChangeTipoDocumento}
                          value={tipoDocumentoData.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          Debe ingresar un nombre
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="descripcion">
                        <Form.Label column sm={6}>Descripcion Tipo Documento</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="descripcion"
                          onChange={handleChangeTipoDocumento}
                          value={tipoDocumentoData.descripcion}
                        />
                        <Form.Control.Feedback type="invalid">
                          Debe ingresar una descripción
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  }

                  <Button
                    variant="light"
                    className="btn-cancelar"
                    onClick={() => cerrarOpcion("ModificarTipoDocumentoPeticionEspecifico")}
                  >Cancelar</Button>

                  <Button
                    variant="light"
                    type="submit"
                    className="btn-aceptar"
                  >Guardar</Button>

                </Form>

            {/* alerta nombre ya en uso */}
            {showAlertaNombreInvalido &&
              <div className="popup-box box-filter">
                <Alert className="text-center no-bg-box"
                  variant="warning"
                  onClose={() => setShowAlertaNombreInvalido(false)}
                  dismissible>
                  <Alert.Heading>Nombre ya existente!</Alert.Heading>
                  <p>
                    El nombre seleccionado ya esta en uso. Por favor, seleccione un nombre diferente.
                  </p>

                  <Button
                    className="mx-2"
                    variant="outline-danger"
                    onClick={() => setShowAlertaNombreInvalido(false)}
                  >OK</Button>
                </Alert>

              </div>
            }
              </Modal.Body>
            </>
          }
        </Modal>
      </div>

    )
  }
export default ModificarTipoDocumentoPeticionEspecifico
