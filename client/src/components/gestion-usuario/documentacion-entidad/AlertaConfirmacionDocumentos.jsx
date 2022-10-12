import {Alert, Button} from 'react-bootstrap';

const AlertaConfirmacionDocumentos = ({accion, showAlertaModificacion, setShowAlertaModificacion, guardarDocumentoModificado, eliminarDocumento, setEstaEliminando}) => {

  return(
    <div className="popup-box box-filter">
      <Alert show={showAlertaModificacion} variant="danger" className="text-center no-bg-box">
        <Alert.Heading>¿Está seguro que quiere realizar cambios?</Alert.Heading>
        <p>Esta acción {accion} el documento ya existente.<br/>Seleccione 'SI' si realmente quiere confirmar los cambios.<br/>Seleccione 'NO' para volver.</p>

        <Button
          className="mx-2"
          variant="outline-danger"
          onClick={accion === "sobreescribirá"
            ? () => setShowAlertaModificacion(false)
            : () => {setShowAlertaModificacion(false); setEstaEliminando({estado: false, documento: null})} }
        >NO</Button>

        <Button
          className="px-3 mx-3"
          variant="outline-success"
          onClick={accion === "sobreescribirá" ? guardarDocumentoModificado : eliminarDocumento}
          // onClick={handleConfirmSubmit}
        >SI</Button>

      </Alert>
    </div>

  )
}

export default AlertaConfirmacionDocumentos;
