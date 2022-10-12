import React from 'react';
import Article from '../reducedcomponents/Article';
import { Blog01,Blog02, Blog03, Blog04, Blog05 } from '../../assets/import';
import './Blog.css';

let urlito = 'https://imagenes.elpais.com/resizer/q6EwC1H_yCUAtHjldOSC30FtMgI=/1960x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/DP3AEVZXKGUHGILDSUZN5MURQI.jpg';

const Blog = () => (
  <div className="blockchain__blog section__padding" id="blog">
    <div className="blockchain__blog-heading">
      <h1 className="gradient__text">Convenios Históricos, <br /> Que te encantarán tanto como a nosotros.</h1>
    </div>
    <div className="blockchain__blog-container">
      <div className="blockchain__blog-container_groupA">
        <Article imgUrl={Blog01} date="Ene 23, 2021" text="LABORATORIOS CASASCO: Convenio de inclusión profesional al sector de Big Data, y mapeo global de rastreadores estadísticos y predictores de ventas. Permite el desarrollo integral de herramientas para solventar problemáticas modernas de manejo de datos con la UTN." />
      </div>

      {/*Hasta 140 caracteres.*/}
      <div className="blockchain__blog-container_groupB">
        <Article imgUrl={Blog02} date="Dic 02, 2013" text="EDENOR S.A: Convenio de capacitación integral en tecnologías de actualidad." />
        <Article imgUrl={Blog03} date="Sep 12, 2018" text="ARSAT S.A: Convenio de integración en ingenierías mecánicas afines para desarrollo de proyectos en conjunto con ARSAT." />
        <Article imgUrl={Blog04} date="Oct 31, 2021" text="VIALIDAD MENDOZA: Convenio de integración de sistemas inteligentes para obtención de diversas métricas relevantes en sistemas viales." />
        <Article imgUrl={Blog05} date="Nov 01, 2019" text="MUNICIPALIDAD DE MENDOZA: Convenio de capacitación integral en tecnologías referentes a Blockchain para implementación de sistemas multifuncionales. " />
      </div>
    </div>
  </div>
);

export default Blog;
