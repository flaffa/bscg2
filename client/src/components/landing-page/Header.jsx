import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {FiMenu} from "react-icons/fi";
import {FaUserCircle} from 'react-icons/fa';
import {Container, Nav, Navbar} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useMoralis} from 'react-moralis';
//notificaciones
import NotificationCenter from 'react-notification-center-component';

import ProfileOptionsCard from '../gestion-usuario/ProfileOptionsCard';
import MoralisLogIn from '../registro/MoralisLogIn';

const Header = ({open, handleOpenMenu}) => {

  const [opcionesAbiertas, setOpcionesAbiertas] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const {user, account, logout} = useMoralis();

  const toggleAbrirOpciones = () => {
    setOpcionesAbiertas(prevState => (!prevState));
  }

  let navigate = useNavigate();
  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      logout();
      navigate("/");
    }
  }, [account])

  return (
    <div>
      <Navbar className='gradient__header'>

        <Nav.Link>
          <Navbar.Brand style={{marginLeft: "40px"}}>
            <img src="/bscg-logo.png"  style={{width: "10rem", height:"6rem" }} onClick={() => navigateTo('/')}/>
          </Navbar.Brand>

          <FiMenu
            className="me-auto hamburguesa"
            style={{fontSize: "30px", marginRight: "3px", marginLeft: "3px", cursor: "pointer"}}
            onClick={handleOpenMenu}
          />
        </Nav.Link>

        <Nav className="ms-auto d-flex align-items-center p-2">

          { user &&
            <NotificationCenter appId="w4lA9Ob5at" subscriberId={user.attributes.email} />
          }

          <Nav.Link>
            <MoralisLogIn
              setIsLoggedIn={setIsLoggedIn}
              isRegistered={isRegistered}
              setIsRegistered={setIsRegistered}
              toggleAbrirOpciones={toggleAbrirOpciones}
            />

            {opcionesAbiertas && <ProfileOptionsCard
              opcionesAbiertas={opcionesAbiertas}
              cerrarOpciones={toggleAbrirOpciones}
              setIsLoggedIn={setIsLoggedIn} />}

          </Nav.Link>
        </Nav>

      </Navbar>
    </div>

  )
}

export default Header;
