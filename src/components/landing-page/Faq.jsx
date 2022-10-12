import {Accordion} from 'react-bootstrap';

import FaqSection from './FaqSection';
import preguntasFrecuentes from '../../data/faq.js';

const Faq = () => {

  return(
    <div className=" bg-landing-page">
    <div className="mx-5 px-5">
      <h2 className="mb-4 title-modal2 display-4">Preguntas Frecuentes</h2>
      <hr/>
      <Accordion>
        {preguntasFrecuentes.map( (seccion, index) =>
          <div className="p-4" key={index}>
            <h4 className="text-start title-modal2 display-6">{seccion.seccion}</h4>
            {seccion.datos.map( (pregunta, indexPregunta) =>
              <FaqSection
                key={index + "-" + indexPregunta}
                eventKey={index + "-" + indexPregunta}
                preguntaNombre={pregunta.pregunta}
                preguntaRespuesta={pregunta.respuesta}
              />
            )}
          </div>
        )}
      </Accordion>
    </div>
    </div>
  )
}

export default Faq;
