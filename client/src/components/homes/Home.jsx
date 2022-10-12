import {useState} from 'react';
import {Routes, Route, Outlet} from 'react-router-dom';

import Header from '../landing-page/Header';
import Menu from '../landing-page/Menu';
import Faq from '../landing-page/Faq';
import HomeContent from './HomeContent';
import HomeRegistro from './HomeRegistro';
import HomeCliente from './cliente/HomeCliente';
import HomeAdmin from './admin/HomeAdmin';
import Contacto from '../landing-page/Contacto';
import Footer from '../landing-page/Footer';

const Home = () => {

  const [open, setOpen] = useState(false);

  const handleOpenMenu = () => {
    setOpen(prevState => (!prevState));
  };

  return(
    <div
      className="home-page bg-home-section"
    >

      <Header
        open={open}
        handleOpenMenu={handleOpenMenu}
      />

      <div className="flex-container">
        {open &&
          <Menu
            open={open}
            setOpen={setOpen}
          />
        }

        <div className="home-content" onClick={ () => ( open && setOpen(false) )}>
          <Routes>
            <Route exact path="/" element={<HomeContent />} />
            <Route exact path="/faq" element={<Faq />} />
            <Route exact path="/contacto" element={<Contacto />} />
            <Route path='/cliente/*' element={<HomeCliente />} />
            <Route exact path='/administrador/*' element={<HomeAdmin />} />
          </Routes>

        </div>
      </div>

      <Footer />
      <Outlet />

    </div>
  )
}

export default Home;
