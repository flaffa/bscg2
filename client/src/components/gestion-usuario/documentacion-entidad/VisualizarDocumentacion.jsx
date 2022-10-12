import {Modal} from 'react-bootstrap';

const VisualizarDocumentacion = ({estaVisualizando, cerrarDocumento}) => {

  return(
      <Modal
        show={estaVisualizando.estado}
        onHide={cerrarDocumento}
        size="xl"
      >

        <Modal.Header className="glassmorphism perfil-usuario" closeButton>
          <Modal.Title className="w-100 title-modal">{estaVisualizando.nombre}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="perfil-usuario"
          style={{height: "80vh"}}>
          <iframe src={estaVisualizando.documentoURL} title="testPdf" height="100%" width="90%" frameBorder="0"/>
        </Modal.Body>

      </Modal>
  )
}

export default VisualizarDocumentacion;
