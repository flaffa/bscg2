import React from 'react';
import './Feature.css';

const Feature = ({ title, text }) => (
  <div className="blockchain__features-container__feature">
    <div className="blockchain__features-container__feature-title">
      <div />
      <h1>{title}</h1>
    </div>
    <div className="blockchain__features-container_feature-text">
      <p>{text}</p>
    </div>
  </div>
);

export default Feature;