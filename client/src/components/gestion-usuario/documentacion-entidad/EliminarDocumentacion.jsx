import {useState} from 'react';

import AlertaConfirmacionDocumentos from './AlertaConfirmacionDocumentos';

const EliminarDocumentacion = ({estaEliminando: {estado, documento}, setEstaEliminando}) => {

  const [showAlertaModificacion, setShowAlertaModificacion] = useState(true);

  const eliminarDocumento = () => {
    documento.destroy();
    setEstaEliminando({estado: false, documento: null});
  }

   return(
       <AlertaConfirmacionDocumentos
         accion="eliminará"
         showAlertaModificacion={showAlertaModificacion}
         setShowAlertaModificacion={setShowAlertaModificacion}
         setEstaEliminando={setEstaEliminando}
         eliminarDocumento={eliminarDocumento}
       />
   )
}

export default EliminarDocumentacion;
