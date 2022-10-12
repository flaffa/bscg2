import {useState} from 'react';
import {useMoralis, useMoralisQuery, useMoralisCloudFunction, useMoralisSubscription} from 'react-moralis';
import {Routes, Route, Outlet} from 'react-router-dom';

import HomeAdminContent from './HomeAdminContent';
import GestionarRoles from '../../admin/gestion-roles/GestionarRoles';
import GestionarUsuarios from '../../admin/gestion-usuarios/GestionarUsuarios';
import GestionarEstadosCliente from '../../admin/estados-cliente/GestionarEstadosCliente';
import GestionarDocumentoEstadoPeticionEspecifico from '../../admin/estados-documento-peticion-especifico/GestionarEstadoDocumentoPeticionEspecifico';
import GestionarDocumentoEstadoPeticionMarco from '../../admin/estados-documento-peticion-marco/GestionarEstadoDocumentoPeticionMarco';
import GestionarEstadosDocumentosEntidad from '../../admin/estados-documentos-entidad/GestionarEstadosDocumentosEntidad';
import GestionarTipoDocumentoEntidad from '../../admin/tipo-documentos-entidad/GestionarTipoDocumentoEntidad'
import GestionarTipoDocumentoPeticionMarco from '../../admin/tipo-documentos-peticion-marco/GestionarTipoDocumentoPeticionMarco'
import GestionarTipoDocumentoPeticionEspecifico from '../../admin/tipo-documentos-peticion-especifico/GestionarTipoDocumentoPeticionEspecifico'
import AdministrarDocumentacionEntidad from '../../admin/tareas-convenios/AdministrarDocumentacionEntidad';
import ListadoDocumentacionEntidad from "../../admin/tareas-convenios/ListadoDocumentacionEntidad";
import GestionarPeticionesMarco from "../../admin/tareas-convenios/GestionarPeticionesMarco";
import DetallePeticionMarco from "../../admin/tareas-convenios/DetallePeticionMarco";
import GestionarEstadoPeticionMarco from '../../admin/estados-peticion-marco/GestionarEstadoPeticionMarco'
import GestionarEstadoPeticionEspecifico from '../../admin/estados-peticion-especifico/GestionarEstadoPeticionEspecifico'

const HomeAdmin = () => {

  const {user} = useMoralis();

  const obtenerTipoDocumentos = useMoralisQuery("TipoDocumentoAsociadoEntidad");
  const obtenerEstadosDocumentos = useMoralisQuery("EstadoDocumentoAsociadoEntidad");
  const obtenerEntidades = useMoralisQuery("Entidad");

  return(
    <div className="bg-home-section">

      <Routes>
        <Route exact path="/home" element={<HomeAdminContent user={user} />} />
        <Route exact path="/gestionar-roles" element={<GestionarRoles />}/>
        <Route exact path="/gestionar-usuarios" element={<GestionarUsuarios />}/>
        <Route exact path="/gestionar-estados-clientes" element={<GestionarEstadosCliente />}/>
        <Route exact path="/gestionar-estados-documento-peticion-especifico" element={<GestionarDocumentoEstadoPeticionEspecifico />}/>
        <Route exact path="/gestionar-estados-documento-peticion-marco" element={<GestionarDocumentoEstadoPeticionMarco/>}/>
        <Route exact path="/gestionar-estados-documentacion-entidades" element={<GestionarEstadosDocumentosEntidad />}/>
        <Route exact path="/gestionar-estados-peticion-marco" element={<GestionarEstadoPeticionMarco />}/>
        <Route exact path="/gestionar-estados-peticion-especifico" element={<GestionarEstadoPeticionEspecifico />}/>
        <Route exact path="/gestionar-tipo-documento-entidad" element={<GestionarTipoDocumentoEntidad />}/>
        <Route exact path="/gestionar-tipo-documento-peticion-marco" element={<GestionarTipoDocumentoPeticionMarco />}/>
        <Route exact path="/gestionar-tipo-documento-peticion-especifico" element={<GestionarTipoDocumentoPeticionEspecifico />}/>
        <Route path="/administrar-entidades" element={<AdministrarDocumentacionEntidad />} />
        <Route path="/administrar-peticiones-marco" element={<GestionarPeticionesMarco />} />
        <Route path="/administrar-peticiones-marco/detalle" element={<DetallePeticionMarco />} />
        <Route exact path="/administrar-entidades/documentacion" element={<ListadoDocumentacionEntidad />} />
      </Routes>

      <Outlet />
    </div>
  )
}

export default HomeAdmin;
