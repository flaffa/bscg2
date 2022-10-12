import {useState} from 'react';
import {OverlayTrigger, Tooltip, Spinner, Row, Col, Alert, Modal} from 'react-bootstrap';
import {MdFileUpload, MdInfoOutline, MdRemoveRedEye, MdDeleteForever} from 'react-icons/md';
import {BiCommentError} from 'react-icons/bi';

const DocumentoEntidad = ({entidad, tipo, dataDocumento, abrirDocumento, handleEstaModificandoDocumento, setEstaEliminando}) => {
  //estados para mostrar alertas cuando no hay documento subido de ese tipo
  const [showAlerta, setShowAlerta] = useState(false);

  //estados para mostrar los comentarios del admin relacionados con ese doc
  const [showComentarios, setShowComentarios] = useState(false);

  return(
    <div>
      <h5 className="fw-bold d-inline">{tipo.get("nombre").toUpperCase()}</h5>
      <MdInfoOutline className="d-inline m-1 menu-link upload-icon"/>

      <Row>
        <Col>
          <span>
            Visualizar <br/>
            <MdRemoveRedEye className="menu-link upload-icon"
              onClick={() => {
                dataDocumento
                  ? abrirDocumento(dataDocumento.get("archivoDocumento")._url, tipo.get("nombre").toUpperCase() )
                  : setShowAlerta(true)
              }}
            />
          </span>
        </Col>

        {(!dataDocumento || dataDocumento.get("estadoActual").get("nombre") !== 'verificado') &&
          <Col>
            <OverlayTrigger placement="right" overlay={(<Tooltip id="1">
              Aqui puede subir los documentos asociados a {tipo.get("nombre")} de su entidad
            </Tooltip>)}>
              <span>
                Subir Archivo <br/>
                <MdFileUpload
                  className="menu-link upload-icon"
                  onClick={() => {
                    handleEstaModificandoDocumento(entidad, tipo, dataDocumento)
                  }}
                />
              </span>
            </OverlayTrigger>
          </Col>
        }

        {(!dataDocumento || dataDocumento.get("estadoActual").get("nombre") === 'registrado') &&
          <Col>
            <span>
              Eliminar <br/>
              <MdDeleteForever
                onClick={() => {
                  dataDocumento
                    ? setEstaEliminando({
                      estado: true,
                      documento: dataDocumento,
                    })
                    : setShowAlerta(true)
                }}
                className="menu-link upload-icon"
              />
            </span>
          </Col>
        }

        <Col>
          <span>
            Comentarios <br/>
            <BiCommentError className="menu-link upload-icon"
              onClick={() => {
                  dataDocumento
                    ? setShowComentarios(true)
                    : setShowAlerta(true)
              }}
            />
          </span>
        </Col>

      </Row>

      <Modal show={showAlerta} onHide={() => setShowAlerta(false)} centered>
        <Modal.Header style={{color: 'maroon'}} closeButton>
          <h5 className="ms-auto">NO HAY DOCUMENTO ASOCIADO</h5>
        </Modal.Header>
        <Modal.Body>Por favor suba un documento haciendo click en <b>'Subir Archivo'.</b></Modal.Body>
      </Modal>

      <Modal show={showComentarios} onHide={() => setShowComentarios(false)} centered>
        <Modal.Header className="title-modal" closeButton>
          <h5 className="ms-auto">COMENTARIOS</h5>
        </Modal.Header>
        { !dataDocumento?.get("comentarios")
          ?  <Modal.Body>No hay comentarios para mostrar en este momento.</Modal.Body>
          :  <Modal.Body>{dataDocumento.get("comentarios")}</Modal.Body>
        }
      </Modal>

    </div>
  )
}

export default DocumentoEntidad;
