import {useState, useEffect} from 'react';
import {Form, Button, Stack, Table, Spinner, ListGroup, Modal, Row, Col} from 'react-bootstrap';
import {useMoralisQuery, useMoralisCloudFunction} from 'react-moralis';
import {useNavigate} from 'react-router-dom';

const AdministrarDocumentacionEntidad = () => {

  const [entidadesNoVerificadas, setEntidadesNoVerificadas] = useState();
  const [entidadSeleccionada, setEntidadSeleccionada] = useState();

  const obtenerEntidades = useMoralisQuery("Entidad", q => q, [], {live: true})
  const obtenerRepresentantes = useMoralisQuery("RepresentanteEntidad", q => q, [], {live: true})
  const obtenerUsuarios = useMoralisCloudFunction("obtenerUsuarios");
  const obtenerEstadosCliente = useMoralisQuery("EstadoCliente", q => q, [], {live: true})

  const filtrarEntidadesClientesNoVerificados = () => {
    const filtrarResultados = obtenerEntidades?.data?.filter( entidad => entidad?.get("usuarioRelacionado")?.get("estadoAsignado")?.get("nombre") === 'cliente no verificado')
    setEntidadesNoVerificadas(filtrarResultados)
  }
  
  useEffect(() => {
      filtrarEntidadesClientesNoVerificados()
      if (entidadSeleccionada) {
        navigateTo()
      }
  }, [obtenerEntidades.data, entidadSeleccionada])

  let navigate = useNavigate();
  const navigateTo = () => {
    window.scrollTo(0,0)
    navigate('documentacion', {state:
      {entidad: entidadSeleccionada, atributosEntidad: entidadSeleccionada.attributes, atributosUsuarioRelacionado: entidadSeleccionada.attributes.usuarioRelacionado.attributes}}
  )}

  return(
    <div>
      <h6 className="display-6 title-modal my-5">ADMINISTRACIÓN DE ENTIDADES</h6>

      <div className="mx-5 my-4 text-center">

        {obtenerEntidades.isLoading
          ? <Spinner animation="border" variant="dark" size="lg"/>
          :
          <>
            <h6>Entidades Sin Verificar</h6>
            {/* <h6>Entidades Sin Verificar <i style={{color: "red"}}>boton de ampliar vista</i></h6> */}
            <Table bordered striped responsive size="sm" className="shadow"  >
              <thead>
                <tr className="title-modal">
                  <th>Nombre</th>
                  <th>Caracter</th>
                  <th>Documentación</th>
                </tr>
              </thead>

              <tbody>
                {entidadesNoVerificadas?.map( (entidad, index) =>
                  <tr key={index}>
                    <td>{entidad?.get("nombre")}</td>
                    <td>{entidad?.get("detalleCaracter")}</td>
                    <td><Button className="btn-aceptar" variant="none"
                      onClick={() => setEntidadSeleccionada(entidad)}
                        >Revisar Documentación</Button></td>
                  </tr>
                )}
              </tbody>

            </Table>
          </>
        }
      </div>

    </div>
  )
}

export default AdministrarDocumentacionEntidad;
