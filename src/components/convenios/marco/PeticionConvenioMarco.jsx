import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Alert, Spinner, Row, Col, ListGroup} from 'react-bootstrap';
import {MdOutlineEdit} from 'react-icons/md'
import {useMoralis, useMoralisQuery} from 'react-moralis';

import ModificarPeticionMarco from './ModificarPeticionMarco';

const PeticionesConveniosMarco = () => {

  //variable de mostrado de alerta de confirmacion de baja de peticion
  const [showAlertaBaja, setShowAlertaBaja] = useState({estado: false, peticionSeleccionada: null});
  //variable de mostrado de alerta de imposible crear peticion si ya hay una activa
  const [showAlerta, setShowAlerta] = useState(false);

  //queries para obtener data
  const {user} = useMoralis();
  const queryEstadoCliente = useMoralisQuery("EstadoCliente", q => q, [], {live: true})
  const queryEstadoPeticion = useMoralisQuery("EstadoPeticionMarco", q => q, [], {live: true})
  const queryPeticion = useMoralisQuery("PeticionMarco", q => q.equalTo("entidadAsociada", user?.get("entidadRelacionada")), [], {live: true})

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
  }, [queryPeticion.data, queryEstadoPeticion.data])

  let navigate = useNavigate();
  const navigateTo = (path, peticion, atributos) => {
    window.scrollTo(0,0)
    navigate(path, {state: {peticion: peticion, atributos: atributos}})
  }

  const esPosibleCrear = () => {
    if(peticionesActivas.length){
      setShowAlerta(true)
    } else {
      navigateTo("crear-peticion")
    }
  }

  const finalizarVigencia = () => {
    const estadoDadoDeBaja = queryEstadoPeticion?.data?.find( estado => estado.get("nombre") === 'dada de baja')
    const fecha = new Date();
    showAlertaBaja.peticionSeleccionada.set("fechaFinVigencia", fecha);
    showAlertaBaja.peticionSeleccionada.set("estadoActual", estadoDadoDeBaja)
    showAlertaBaja.peticionSeleccionada.save();
    setShowAlertaBaja({estado: false, peticionSeleccionada: null})
  }

  return (
    <div>
      <h1 className="display-3 title-modal m-4">Convenios Marco</h1>

      {queryEstadoCliente.isLoading
        ? <Spinner animation="border" variant="dark" size="lg"/>
        : user?.get("estadoAsignado")?.get("nombre") !== 'cliente activo'
          ?
            <Alert variant="secondary" className='m-5'>
              <Alert.Heading>No está verificado</Alert.Heading>
              <p className='p-3'>
                Para poder realizar convenios debe verificarse, para hacerlo debe subir la documentacion respectiva a su Entidad y esperar su validacion.
              </p>
            </Alert>
          :
          <div>
            <Button variant="none" className='btn-aceptar my-2' onClick={esPosibleCrear}>Crear Petición</Button>
            <hr className="w-75 mx-auto mb-4"/>

            { queryPeticion.data?.length <= 0
              ?
                <Alert variant="secondary" className='m-5'>
                  <Alert.Heading>No hay peticiones para mostrar. Para crear una peticion seleccione 'Crear Petición'.</Alert.Heading>
                </Alert>
              : <div>
                <ListGroup className="mx-auto w-75">
                  <h1>Peticiones Activas</h1>
                  { peticionesActivas?.length <= 0
                    ? <Alert variant="secondary">
                      No hay peticiones activas en este momento. Para crear una peticion seleccione 'Crear Petición'.
                    </Alert>
                    : peticionesActivas?.map( (peticion, index) => {
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
                              <Button variant="none" className="btn-aceptar mx-2" onClick={() => navigateTo("modificar-peticion", peticion, peticion.attributes)}>
                                Modificar
                              </Button>
                              <Button variant="none" className="btn-aceptar mx-2" onClick={() => setShowAlertaBaja({estado: true, peticionSeleccionada: peticion})}>
                                Dar de Baja
                              </Button>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )})
                  }

                  <hr className="w-100 mx-auto"/>
                  <h1>Peticiones Inactivas</h1>
                  { peticionesInactivas.length <= 0
                    ? <Alert variant="secondary">No hay peticiones inactivas.</Alert>
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
                  }
                </ListGroup>
              </div>
            }
          </div>
      }

      { showAlertaBaja.estado &&
        <div className="popup-box box-filter">
          <Alert show={showAlertaBaja.estado} variant="danger" className="text-center no-bg-box">
            <Alert.Heading>¿Está seguro que quiere dar de baja esta petición?</Alert.Heading>
            <p>Esta acción no tiene vuelta atrás.<br/> Si desea continuar con la baja selecciones 'SI'.<br/> Para volver atrás seleccione 'NO'.</p>

            <Button
              className="mx-2"
              variant="outline-danger"
              onClick={() => setShowAlertaBaja({estado: false, peticionSeleccionada: null})}
            >NO</Button>

            <Button
              className="px-3 mx-3"
              variant="outline-success"
              onClick={finalizarVigencia}
            >SI</Button>
          </Alert>
        </div>
      }

      { showAlerta &&
        <div className="popup-box box-filter">
          <Alert show={showAlerta} variant="danger" className="text-center no-bg-box">
            <Alert.Heading>No es posible crear una peticion</Alert.Heading>
            <p>Solo puede tener una peticion activa a la vez. Puede modificar su peticion activa, o puede darla de baja y crear una nueva.</p>
            <Button
              className="mx-2"
              variant="outline-secondary"
              onClick={() => setShowAlerta(false)}
            >OK</Button>
          </Alert>
        </div>
      }

    </div>
  )
}

export default PeticionesConveniosMarco;
