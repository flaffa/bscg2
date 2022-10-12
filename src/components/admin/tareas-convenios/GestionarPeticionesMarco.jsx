import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Alert, Spinner, Row, Col, ListGroup} from 'react-bootstrap';
import {MdOutlineEdit} from 'react-icons/md'
import {useMoralis, useMoralisQuery} from 'react-moralis';
import {BiCommentError} from 'react-icons/bi';
import axios from 'axios';

const GestionarPeticionesMarco = () => {

  //queries para obtener data
  // const {user} = useMoralis();
  const queryEstadoPeticion = useMoralisQuery("EstadoPeticionMarco", q => q, [], {live: true})
  const queryPeticion = useMoralisQuery("PeticionMarco", q => q, [], {live: true})

  //variables de filtrado de peticiones activas e historicas (inactivas)
  const [peticionesActivas, setPeticionesActivas] = useState();
  const [peticionesInactivas, setPeticionesInactivas] = useState();

  const peticionesMarcoActivas = () => {
    const peticionesActivas = queryPeticion.data.filter(peticion => peticion?.get("estadoActual")?.get("nombre") !== "dada de baja")
    setPeticionesActivas(peticionesActivas)
  }

  const peticionesMarcoInactivas = () => {
    const peticionesInactivas = queryPeticion.data.filter(peticion => peticion?.get("estadoActual")?.get("nombre") === "dada de baja")
    setPeticionesInactivas(peticionesInactivas)
  }

  useEffect(() => {
    peticionesMarcoActivas()
    peticionesMarcoInactivas()
  }, [queryPeticion.data])

  let navigate = useNavigate();
  const navigateTo = (path, peticion, atributos) => {
    window.scrollTo(0,0)
    navigate(path, {state: {peticion: peticion, atributos: atributos}})
  }

  return (
    <div>
      <h1 className="display-3 title-modal m-4">Peticiones Convenios Marco</h1>
      <hr className="w-75 mx-auto mb-4"/>

      { queryPeticion.data?.length <= 0
        ? <Spinner animation="border" variant="dark" size="lg" />
        : <div>
          <ListGroup className="mx-auto w-75">
            <h1>Peticiones Activas</h1>
            { peticionesActivas?.length <= 0
              ? <Alert variant="secondary">
                No hay peticiones activas para mostrar en este momento.
              </Alert>
              : peticionesActivas?.map( (peticion, index) => {
                return(
                  <ListGroup.Item className="py-4" key={index}>
                    <Row>
                      <Col>
                        <h6>Entidad Asociada:</h6>
                        <p>{peticion.get("entidadAsociada").get("nombre")}</p>
                      </Col>
                      <Col>
                        <h6>Nombre:</h6>
                        <p>{peticion.get("nombre")}</p>
                      </Col>

                      <Col>
                        <h6>Descripcion:</h6>
                        <p>{peticion.get("descripcion")}</p>
                      </Col>

                      <Col>
                        <Button variant="none" className="btn-aceptar"
                          onClick={() => navigateTo("detalle", peticion, peticion.attributes)}
                        >
                          Detalle de Petición
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )})
            }

            {/* <hr className="w-100 mx-auto"/>
              <h1>Peticiones Inactivas</h1>
              { peticionesInactivas.length <= 0
              ? <Alert variant="secondary">No hay peticiones inactivas para mostrar en este momento.</Alert>
              : peticionesInactivas.map( (peticion, index) => {
                return(
              <ListGroup.Item className="py-4" key={index}>
              <Row>
              <Col>
              <h6>Nombre:</h6>
              <p>{peticion.get("nombre")}</p>
              </Col>

              <Col>
              <h6>Descripcion:</h6>
              <p>{peticion.get("descripcion")}</p>
              </Col>

              <Col>
              <h6>Fecha Fin Vigencia</h6>
              <p>{peticion.get("fechaFinVigencia").toLocaleString()}</p>
              </Col>
              </Row>
              </ListGroup.Item>
                )})
            } */}
          </ListGroup>
        </div>
      }
    </div>
  )
}

export default GestionarPeticionesMarco;
