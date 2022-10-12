import React from "react";
import {useNavigate} from 'react-router-dom';
import Feature from "../../components/reducedcomponents/Feature";
import "./Whatblockchain.css";

export const Whatblockchain = () => {
 let navigate = useNavigate();

  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  return (
    <div
      className="blockchain__whatblockchain section__margin"
      id="wblockchain"
    >
      <div className="blockchain__whatblockchain-feature">
        <h1 className="h1blockchain blockchain__whatblockchain-div-title">
          ¿Qué es Blockchain?
        </h1>
        <p className="pblockchain blockchain__whatblockchain-div-text">
          Blockchain es un libro mayor compartido e inmutable que facilita el
          proceso de registro de transacciones y de seguimiento de activos en
          una red de negocios. Un activo puede ser tangible (una casa, un auto,
          dinero en efectivo, terrenos) o intangible (propiedad intelectual,
          patentes, derechos de autor, convenios en este caso, etc).
          Prácticamente cualquier cosa de valor puede ser rastreada en una red
          de blockchain, reduciendo riesgos y costos para todos los
          involucrados. 
        </p>
      </div>
      <div className="blockchain__whatblockchain-heading" id="visitafaq">
      <button className="botonfaq" type="button"onClick={() => navigateTo('/faq')}>Visita nuestra FAQ</button></div>
      <div className="blockchain__whatblockchain-heading">
        <h1 className="gradient__text"> Convenios y contratos más seguros</h1>
      </div>
      <div className="blockchain__whatblockchain-container">
        <Feature
          title="Descentralización y distribución"
          text="No posee autoridades centralizadas y su distribución es global."
        />
        <Feature
          title="Seguridad"
          text=" Presenta entre otros backups constantes, identificación usuaria segura y encriptación fuerte."
        />
        <Feature
          title="Transparencia"
          text="Hashs con precedencia histórica trazables, visibilidad de actividad y transparencias, plenamente auditable globalmente."
        />
      </div>
    </div>
  );
};
export default Whatblockchain;