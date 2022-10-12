import {MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import {Link} from 'react-router-dom';

const MenuCliente = ({openList, handleClickList, setOpen}) => {
  const navegacionMenuCliente = [
  {
    seccionTitulo: "Convenios",
    seccionElementos: [
      // {id: 1.1, titulo: "Convenio Marco", subTitulos: ['Peticiones', 'Seguimiento', 'Historial', 'Documentacion']},
      {id: 1.1, titulo: "Convenio Marco", subTitulos: []},
      {id: 2.1, titulo: "Convenio Especifico", subTitulos: []},
    ]
  }
  ]

  return (
    <>
      {navegacionMenuCliente.map( (seccion, index) => {
        return (
          <div key={index}>
            <hr/>
            <h6>{seccion.seccionTitulo}</h6>
            {seccion.seccionElementos.map( (text, index) => {
              if (!text.subTitulos.length) {
                return (
                  <li key={text.id}>
                    <Link onClick={() => setOpen(false)} className="menu-link1" to={`cliente/${text.titulo.toLowerCase().replace(/ /g, '-')}`}>{text.titulo}</Link>
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
                            <Link onClick={() => setOpen(false)} className="menu-link1" to={`cliente/${text.titulo.toLowerCase().replace(/ /g, '-')}-${subTitulo.toLowerCase().replace(/ /g, '-')}`}>{subTitulo}</Link>
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

export default MenuCliente;
