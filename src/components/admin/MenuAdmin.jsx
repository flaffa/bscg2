import {MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import {Link} from 'react-router-dom';

const MenuAdmin = ({openList, handleClickList, setOpen}) => {
  const navegacionMenuAdmin = [
    {
      seccionTitulo: "Implementación de Convenios",
      seccionElementos: [
        {id: 1.1, titulo: "Administrar Entidades", subTitulos: []},
        {id: 1.2, titulo: "Administrar Peticiones Marco", subTitulos: []},
      ]
  },
  {
    seccionTitulo: "Configuraciones del Sistema",
    seccionElementos: [
      {id: 2.1, titulo: "Gestionar Roles", subTitulos: []},
      {id: 2.2, titulo: "Gestionar Permisos", subTitulos: []},
      {id: 2.3, titulo: "Gestionar Usuarios", subTitulos: []},
      {id: 2.4, titulo: "Gestionar Estados", subTitulos: ["Clientes", "Documentacion Entidades","Documento Peticion Marco", "Documento Peticion Especifico", "Peticion Marco", "Peticion Especifico"]},
      {id: 2.5, titulo: "Gestionar Tipo Documento", subTitulos: ["Entidad", "Peticion Marco", "Peticion Especifico"]}
    ]
  }
  ]

  return (
    <>
      {navegacionMenuAdmin.map( (seccion, index) => {
        return (
          <div key={index}>
            <hr/>
            <h6>{seccion.seccionTitulo}</h6>
            {seccion.seccionElementos.map( (text, index) => {
              if (!text.subTitulos.length) {
                return (
                  <li key={text.id}>
                    <Link onClick={() => setOpen(false)} className="menu-link1" to={`administrador/${text.titulo.toLowerCase().replace(/ /g, '-')}`}>{text.titulo}</Link>
                  </li>
                )
              } else {
                return (
                  <div key={text.titulo}>
                    <li
                      onClick={ () => handleClickList(text.id)}
                    >
                      <a className="menu-link1">{text.titulo}   </a>
                      {openList === text.id ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
                    </li>

                    {openList === text.id  && text.subTitulos.map( (subTitulo, index) =>
                      (
                        <li key={subTitulo}>
                          <ul>
                            <Link onClick={() => setOpen(false)} className="menu-link1" to={`administrador/${text.titulo.toLowerCase().replace(/ /g, '-')}-${subTitulo.toLowerCase().replace(/ /g, '-')}`}>{subTitulo}</Link>
                          </ul>
                        </li>
                      )
                    )}
                  </div>)
              }
            })}
          </div>
        )
      })
      }
    </>
  )
}

export default MenuAdmin;
