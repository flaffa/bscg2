import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useMoralisCloudFunction} from 'react-moralis';
import {useMoralis} from "react-moralis";
import {Offcanvas} from "react-bootstrap";

import MenuAdmin from '../admin/MenuAdmin';
import MenuCliente from './MenuCliente';

import "./Menu.css";

const Menu = ({open, setOpen}) => {

  const {user} = useMoralis();
  const obtenerRoles = useMoralisCloudFunction("obtenerRoles");

  const [openList, setOpenList] = useState();

  const handleClickList = (id) => {
   (id === openList
   ? setOpenList(0)
   : setOpenList(id)
  )};

  const navegacionMenuGeneral = [
    {id: 1, titulo: "FAQ"},
    {id: 2, titulo: "Contacto"},
  ]

  return (
    <Offcanvas className="pony scale-up-tr gradient__bg"
      show={open}
      onHide={() => setOpen(false)}
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title><h1 className="tit">Menu</h1></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ul>
          <li>
            {user ? (
              <Link
                className="menu-link1"
                onClick={() => setOpen(false)}
                to={user.attributes.rolAsignado.get("nombre") + "/home"}
              >
                Home
              </Link>
            ) : (
              <Link onClick={() => setOpen(false)} className="menu-link1" to={"/"}>
                Home
              </Link>
            )}
          </li>

          {user?.attributes.rolAsignado.get("nombre") === "administrador" && (
            <>
              {" "}
              <MenuAdmin
                handleClickList={handleClickList}
                openList={openList}
                setOpen={setOpen}
              />{" "}
            </>
          )}

          {user?.attributes.rolAsignado.get("nombre") === "cliente" && (
            <>
              {" "}
              <MenuCliente
                handleClickList={handleClickList}
                openList={openList}
                setOpen={setOpen}
              />{" "}
            </>
          )}

          <hr />

          {navegacionMenuGeneral.map((text, index) => (
            <li key={text.id}>
              <Link className="menu-link1" to={`/${text.titulo.toLowerCase()}`} onClick={() => setOpen(false)}>
                {text.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Menu;
