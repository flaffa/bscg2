import {useState} from 'react';
import {Tab, Tabs, Modal} from 'react-bootstrap';

import RegistroUsuario from './RegistroUsuario';
import RegistroEmpresa from './RegistroEmpresa';
import RegistroRepresentante from './RegistroRepresentante';

const Registro = ({isRegistered, setIsRegistered}) => {

  const [key, setKey] = useState("registroUsuario");
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
      <div
        onClick ={(e) => e.stopPropagation()}
        onKeyDown ={(e) => e.stopPropagation()}
        onFocus = {(e) => e.stopPropagation()}
        onMouseOver = {(e) => e.stopPropagation()}
      >
        <Modal
          show={!isRegistered}
          backdrop="static"
          keyboard={false}
          size="lg"
          centered
        >

          <Modal.Body className="perfil-usuario glassmorphism">

            <Tabs
              id="controlled-tab-registro"
              activeKey={key}
              className="mb-3"
              fill
              style={{display: "flex", flexDirection: "row"}}
            >

              <Tab
                eventKey="registroUsuario"
                title="REGISTRO DE USUARIO"
                disabled
              >
                <RegistroUsuario
                  setKey={setKey}
                />
              </Tab>

              <Tab
                eventKey="registroEntidad"
                title="REGISTRO DE ENTIDAD"
                disabled
              >
                <RegistroEmpresa
                  setIsRegistered={setIsRegistered}
                  setKey={setKey}
                />
              </Tab>

              <Tab
                eventKey="registroRepresentante"
                title="REGISTRO DE REPRESENTANTE"
                disabled
              >
                <RegistroRepresentante
                  setIsRegistered={setIsRegistered}
                  setKey={setKey}
                />
              </Tab>

            </Tabs>

          </Modal.Body>
        </Modal>
      </div>
  )

}

export default Registro;
