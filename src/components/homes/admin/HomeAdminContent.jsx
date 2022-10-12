import {Card, ListGroup, Row, Col} from 'react-bootstrap';

const HomeAdminContent = ({user}) => {

  return (
    <div>

      <section className="home-title-section" >

        <section className="py-4">
          <div className="p-2 glassmorphism2 fw-bold w-50 mx-auto">
            <h1 className="display-4 fw-bold">BIENVENIDO</h1>
            <h1 className="display-4 fw-bold">ADMINISTRADOR</h1>
            <h1 className="display-4 fw-bold">{user?.get("nombre").toUpperCase()}</h1>
          </div>
        </section>


        {/* <div className="glassmorphism w-50 mx-auto">
          <h3>Resúmen desde tu último acceso</h3>
        </div> */}

        {/*<div className="mx-3">
          <Row>
            <Col>
          <Card>
          <Card.Header className="fw-bold">DOCUMENTACION ENTIDADES</Card.Header>
          <Card.Body>
          <ListGroup variant="flush">
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          </Card.Body>
          </Card>
            </Col>

            <Col>
          <Card>
          <Card.Header className="fw-bold">CONVENIOS MARCO</Card.Header>
          <Card.Body>
          <ListGroup variant="flush">
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          </Card.Body>
          </Card>
            </Col>

            <Col>
          <Card>
          <Card.Header className="fw-bold">CONVENIOS ESPECIFICOS</Card.Header>
          <Card.Body>
          <ListGroup variant="flush">
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          </Card.Body>
          </Card>
            </Col>
          </Row>

        </div>*/}
      </section>
    </div>
  )
}

export default HomeAdminContent;
