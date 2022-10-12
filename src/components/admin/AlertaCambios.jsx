import {Alert, Button} from 'react-bootstrap';

const AlertaCambios = ({showAlerta, setShowAlerta, handleConfirmSubmit}) => {
  return(
    <div className="popup-box box-filter">
      <Alert show={showAlerta} variant="danger" className="text-center no-bg-box">
        <Alert.Heading>¿Está seguro que quiere realizar cambios?</Alert.Heading>
        <p>Esta acción no tiene vuelta atrás y puede generar consecuencias no planeadas en el sistema.<br/>Seleccione 'SI' si realmente quiere confirmar los cambios.<br/>Seleccione 'NO' para volver.</p>

        <Button
          className="mx-2"
          variant="outline-danger"
          onClick={() => setShowAlerta(false)}
        >NO</Button>
        <Button
          className="px-3 mx-3"
          variant="outline-success"
          onClick={() => {
            setShowAlerta(false)
            handleConfirmSubmit()
          }}
        >SI</Button>
      </Alert>
    </div>

  )
}

export default AlertaCambios;
