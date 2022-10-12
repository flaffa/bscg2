import React from 'react';
import './Features.css';
import Feature from '../reducedcomponents/Feature';


const featuresData = [
  {
    title: 'Convenios Marco',
    text: 'Permiten definir lazos y su carácter entre empresas y personas físicas con la UTN. Una vez aprobados se pueden instaurar convenios específicos en la relación.',
  },
  {
    title: 'Convenios Específicos',
    text: 'Permiten definir convenios específicos una vez instauradas las relaciones a través de convenios marco.',
  },
  {
    title: 'Firma digital garantizada',
    text: ' El sistema facilita la implementación de convenios bajo el resguardo de firma digital asociada. Estableciendo así garantes legales para ambas partes, capaces de concretar convenios sin firmas físicas.',
  },
  {
    title: 'Trazabilidad garantizada',
    text: 'Convenios sustentados en la IPFS y Blockchain, permiten la imposibilidad de discrepancia de información y su trazabilidad inmediata con estampas de tiempo e históricos relevantes inmutables.',
  },
];

const Features = () => (
  <div className="blockchain__features section__padding" id="features">
    <div className="blockchain__features-heading">
      <h1 className="gradient__text">El futuro es ahora:  Gestiona convenios Marco con la UTN y comienza a realizar convenios específicos.</h1>
      {/* <p>Ingresa con tu wallet para comenzar</p> */}
    </div>
    <div className="blockchain__features-container">
      {featuresData.map((item, index) => (
        <Feature title={item.title} text={item.text} key={item.title + index} />
      ))}
    </div>
  </div>
);
export default Features;