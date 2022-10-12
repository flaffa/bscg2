import {useEffect} from 'react';
import {FaUserCircle, FaBell} from 'react-icons/fa';
import {useMoralis, useMoralisCloudFunction} from "react-moralis";
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

import Registro from './Registro';

function MoralisLogIn({toggleAbrirOpciones, setIsLoggedIn, setIsRegistered, isRegistered}) {

  const {authenticate, isAuthenticated, user} = useMoralis();
  const obtenerRoles = useMoralisCloudFunction("obtenerRoles");
  const {ethereum} = window;

  useEffect(() => {
    if (!ethereum) {
      alert("Para conectarse debe activar la extension de MetaMask");
    }
  }, []);

  let navigate = useNavigate();
  const navigateTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  }

  const login = async () => {
      if (!isAuthenticated) {
      await authenticate({signingMessage: "Acepta Iniciar Sesión en el Sistema?"})
      // onSuccess: () => alert("Conexión Exitosa") })
          .then(function (user) {
          setIsLoggedIn(true);
          testRegistro(user.attributes.isRegistered);
          navigateTo(`${user.attributes.rolAsignado.get("nombre")}/home`);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const testRegistro = async (estadoRegistro) => {
      if(!estadoRegistro){
        console.log(`Usuario no esta registrado`)
        setIsRegistered(false)
      } else {
        console.log(`Usuario ya esta registrado`)
        console.log(estadoRegistro)
      }
    }

  return (
    <div>

      {!isRegistered &&
        <Registro
          setIsRegistered={setIsRegistered}
          isRegistered={isRegistered}
        />
      }

      { isAuthenticated
        ?
          <div>
            <FaUserCircle
              className="user-btn"
              onClick={toggleAbrirOpciones}
              style={{fontSize: "35px"}}
            />
          </div>
        :
        <Button
          variant="outline"
          className="log-in-btn"
          onClick={login}
        >
          Conectar Wallet
        </Button>
      }

    </div>
  );
}

export default MoralisLogIn;
