import {Accordion} from 'react-bootstrap';

const FaqSection = ({tituloSeccion, eventKey, preguntaNombre, preguntaRespuesta}) => {
  return (
      <Accordion.Item eventKey={eventKey} className="bg-faq">
        <Accordion.Header className="glassmorphism title-modal">
          <strong>{preguntaNombre}</strong>
        </Accordion.Header>
        <Accordion.Body className="glassmorphism rounded-none shadow">
          <p className="text-start">{preguntaRespuesta}</p>
        </Accordion.Body>
      </Accordion.Item>
  )
}

export default FaqSection;
