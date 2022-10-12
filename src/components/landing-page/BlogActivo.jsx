import React from 'react';
import Article from '../reducedcomponents/Article';
import { Blog01,Blog02, Blog03, Blog04, Blog05 } from '../../assets/import';
import './BlogActivo.css';

const BlogActivo = () => (
  <div className="blockchain__blog section__padding" id="blog">
    <div className="blockchain__blog-heading">
      <h1 className="gradient__text">Convenios Actuales, <br /> Frescos, novedosos e imponiendo tendencias.</h1>
    </div>
    <div className="blockchain__blog-container">
      <div className="blockchain__blog-container_groupA">
        <Article imgUrl={Blog01} date="Nov 11, 2022" text="OPEN-AI: Convenio de inclusión profesional al sector de inteligencias neuronales e imágenes de difusión. Permite el desarrollo integral codo a codo con la UTN en tecnologías y usabilidades nuevas." />
      </div>

      {/*Hasta 140 caracteres.*/}
      <div className="blockchain__blog-container_groupB">
        <Article imgUrl={Blog02} date="Nov 11, 2022" text="NVIDIA: Convenio de capacitación integral en tecnologías de actualidad." />
        <Article imgUrl={Blog03} date="Nov 11, 2022" text="MICROSOFT: Convenio de inclusión de servicios en plataformas oficiales de la universidad." />
        <Article imgUrl={Blog04} date="Nov 11, 2022" text="GOBIERNO DE MENDOZA: Convenio de capacitación integral laboral para trabajadores del Estado."/>
        <Article imgUrl={Blog05} date="Nov 11, 2022" text="BANCO PATAGONIA: Convenio de capacitación integral en tecnologías para sistemas de banca." />
      </div>
    </div>
  </div>
);

export default BlogActivo;