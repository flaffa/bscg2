import React from "react";
import people from '../../assets/people.png';
import blockchain from '../../assets/blockchain.png';
import {useNavigate} from 'react-router-dom';
import "./CabezaHome.css";

const CabezaHome = () => {
  
  let navigate = useNavigate();
  
  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  return (
  <div className="blockchain__header section__padding" id="home">
  <div className="blockchain__header-content">
<h1 className="gradient__text">
¡Tus convenios más seguros, un bloque a la vez!
</h1>
<p>Presentamos la solución más segura en la implementación de convenios:
 Mediante el uso de tecnologías Blockchain y la utilización de firma digital,
 permitimos la presentación, gestión de documentación y convenios de manera digital
 adaptada al marco legal contemporáneo.
 </p>
<div className="blockchain__header-content__input">
  {/* <input type="email" placeholder="Tu cuenta de correo"/>
  <button type="button">Enlistate</button> */}
  <button className="botoncontactanos" type="button" onClick={() => navigateTo('/contacto')}>Contactanos</button>
</div>
<div className="blockchain__header-content__gente">
<img src={people} alt="personas"/>
<p> Más de 1600 personas ya se enlistaron en novedades!</p>
</div>
  </div>
  <div className="blockchain__header-image">
<img src={blockchain} alt="ciudad blockchain"/>
</div>
  </div>
  )
};
export default CabezaHome;
