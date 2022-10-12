import {Row, Col, Container, Card, Stack, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import {FaInstagram, FaFacebook, FaEnvelope, FaAtlas, FaExternalLinkAlt} from "react-icons/fa";
import {useNavigate} from 'react-router-dom';

import InfoContacto from './InfoContacto';
import "./Whatblockchain.css";

const Footer = () => {
  const anio = new Date().getFullYear();

  let navigate = useNavigate();

  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  return (
    <div className="blockchain__whatblockchain" style={{color: "white"}}>
      <Container>
        <Row>
          <Col>
            <Card className="glassmorphism gradient__bg">
              <Card.Body className="text-center">
                <img alt="logoSEU" src='/logoSEU.png' style={{width: "50%", height: "50%"}}/>
                <p className="text-muted" style={{marginTop: "13px"}}>Copyright © BSCG {anio}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <InfoContacto />
          </Col>

          <Col>
            <Card className="glassmorphism gradient__bg">
              <Card.Title className="text-center card-title gradient__text">
                CONTACTO
              </Card.Title>
              <Card.Body className="text-center">
                <Row className="footer-row">
                  <Col>
                    <Stack>
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip id="email-icon">
                              secretaria.extension@frm.utn.edu.ar
                            </Tooltip>
                          )}>
                          <Button variant="none" as="a" className="btn-tooltip-footer"
                            href="mailto:secretaria.extension@frm.utn.edu.ar"
                          >
                            <FaEnvelope className="footer-icon menu-link"/>
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <p>E-mail</p>
                    </Stack>
                  </Col>

                  <Col>
                    <Stack>
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip id="web-icon">
                              Sección de Contacto
                            </Tooltip>
                          )}>
                          <Button variant="none" className="btn-tooltip-footer">
                            <FaAtlas className="footer-icon menu-link" onClick={() => navigateTo('/contacto')}/>
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <p>Contacto</p>
                    </Stack>
                  </Col>

                  <Col>
                    <Stack>
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip id="web-icon">
                              www.frm.utn.edu.ar/extension1
                            </Tooltip>
                          )}>
                          <Button variant="none" className="btn-tooltip-footer">
                            <FaExternalLinkAlt
                              className="footer-icon menu-link"
                              onClick={() => window.open("http://www.frm.utn.edu.ar/extension1/", "_blank")}
                            />
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <p>Sitio Web</p>
                    </Stack>
                  </Col>
                </Row>

                <Row className="footer-row">
                  <Col className="text-center">
                    <Stack >
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip id="web-icon">
                              www.instagram.com/seu.frm.utn
                            </Tooltip>
                          )}>
                          <Button variant="none" className="btn-tooltip-footer">
                            <FaInstagram
                              className="footer-icon menu-link"
                              onClick={() => window.open("https://www.instagram.com/seu.frm.utn", "_blank")}
                            />
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <p>Instagram</p>
                    </Stack>
                  </Col>

                  <Col className="text-center">
                    <Stack>
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip id="web-icon">
                              www.facebook.com/seufrmutn
                            </Tooltip>
                          )}>
                          <Button variant="none" className="btn-tooltip-footer">
                            <FaFacebook
                              className="footer-icon menu-link"
                              onClick={() => window.open("https://www.facebook.com/seufrmutn", "_blank")}
                            />
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <p>Facebook</p>
                    </Stack>
                  </Col>
                </Row>

              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  )
}

export default Footer;
