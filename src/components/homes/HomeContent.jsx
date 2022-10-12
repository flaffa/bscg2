import {Button, Card, Stack} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import MoralisLogIn from '../registro/MoralisLogIn';
import Whatblockchain from '../landing-page/Whatblockchain';
import CabezaHome from '../landing-page/CabezaHome';
import Features from '../landing-page/Features';
import Blog from '../landing-page/Blog';
import BlogActivo from '../landing-page/BlogActivo';

const HomeContent = () => {

  let navigate = useNavigate();

  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  return(
    <div className="bg-landing-page">

      <section className="home-title-section gradient__bg">
        <CabezaHome/>
      </section>

      <div>
        <Whatblockchain/>
        <Features/>
        <Blog/>
        <BlogActivo/>
      </div>

    </div>
  )
}

export default HomeContent;
