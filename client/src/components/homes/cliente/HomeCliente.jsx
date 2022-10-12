import {useMoralis} from 'react-moralis';
import {Routes, Route, Outlet} from 'react-router-dom';

import HomeClienteContent from './HomeClienteContent';
import ModificarDocsEntidad from '../../gestion-usuario/documentacion-entidad/ModificarDocsEntidad';
import PeticionConvenioMarco from '../../convenios/marco/PeticionConvenioMarco';
import CrearPeticionMarco from '../../convenios/marco/CrearPeticionMarco';
import ModificarPeticionMarco from '../../convenios/marco/ModificarPeticionMarco';
import ConveniosEspecificos from '../../convenios/especifico/ConveniosEspecificos';

const HomeCliente = () => {
  const {user} = useMoralis();

  return(
    <div className="bg-home-section">

      <Routes>
        <Route exact path="/home" element={<HomeClienteContent user={user} />} />
        <Route exact path='/gestion-documentacion' element={<ModificarDocsEntidad />} />
        <Route exact path='convenio-marco' element={<PeticionConvenioMarco />} />
        <Route exact path='convenio-marco/modificar-peticion' element={<ModificarPeticionMarco />} />
        <Route exact path='convenio-marco/crear-peticion' element={<CrearPeticionMarco />} />
        <Route exact path='convenio-especifico' element={<ConveniosEspecificos />} />
      </Routes>

      <Outlet />
    </div>
)
}

export default HomeCliente;
