import React from 'react';
import './Article.css';

const Article = ({ imgUrl, date, text }) => (
  <div className="blockchain__blog-container_article">
    <div className="blockchain__blog-container_article-image">
      <img src={imgUrl} alt="blog_image" />
    </div>
    <div className="blockchain__blog-container_article-content">
      <div>
        <p>{date}</p>
        <h3>{text}</h3>
      </div>
      <p>Mira el convenio</p>
    </div>
  </div>
);

export default Article;