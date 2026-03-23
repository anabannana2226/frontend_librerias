import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../componentes/DashboardLayout';
import Tabla from '../componentes/Tabla';
import Modal from '../componentes/Modal';
import Alerta from '../componentes/Alerta';
import { Plus, Users, Search, Filter } from 'lucide-react';

const API_URL = 'https://api-libreria-2m5i.onrender.com/api/autores';

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorEditando, setAutorEditando] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: 'info', visible: false });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    try {
      const res = await axios.get(API_URL);
      setAutores(res.data);
    } catch (err) {
      mostrarAlerta('Error al cargar autores', 'error');
    }
  };

  const columnas = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'nacionalidad', label: 'Nacionalidad' },
    { key: 'biografia', label: 'Biografía', render: (val) => (
      <span className="italic text-libreria-madera/70 truncate block max-w-[200px]">{val || 'Sin biografía'}</span>
    ) },
    { key: 'fecha_nacimiento', label: 'Nacimiento', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' }
  ];

  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ mensaje, tipo, visible: true });
  };

  const cerrarAlerta = () => setAlerta({ ...alerta, visible: false });

  const abrirNuevoModal = () => {
    setAutorEditando({ nombre: '', apellido: '', nacionalidad: '', biografia: '', fecha_nacimiento: '' });
    setModalAbierto(true);
  };

  const abrirEditarModal = (autor) => {
    setAutorEditando({
      ...autor,
      fecha_nacimiento: autor.fecha_nacimiento ? autor.fecha_nacimiento.split('T')[0] : ''
    });
    setModalAbierto(true);
  };

  const guardarAutor = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      console.log('Guardando autor...', autorEditando);
      if (autorEditando.id) {
        await axios.put(`${API_URL}/${autorEditando.id}`, autorEditando);
        mostrarAlerta('Autor actualizado exitosamente', 'exito');
      } else {
        await axios.post(API_URL, autorEditando);
        mostrarAlerta('Autor registrado exitosamente', 'exito');
      }
      
      setModalAbierto(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error('Error al guardar autor:', err);
      mostrarAlerta(err.response?.data?.mensaje || 'Error al guardar el autor', 'error');
    } finally {
      setCargando(false);
    }
  };

  const eliminarAutor = async (id) => {
    if (window.confirm('¿Confirmar retiro del autor del sistema?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        mostrarAlerta('Autor eliminado', 'exito');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        mostrarAlerta('Error al eliminar el autor. Verifique que no tenga libros asociados.', 'error');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl mb-2 text-libreria-madera tracking-tight drop-shadow-sm">Autores</h1>
            <p className="text-libreria-madera/50 font-medium italic">Gestión de Perfiles de Autores Destacados</p>
          </div>
          <button 
            onClick={abrirNuevoModal}
            className="flex items-center gap-2 bg-libreria-madera text-libreria-papel px-6 py-4 rounded-xl font-bold tracking-widest hover:bg-libreria-madera_clara transition-all hover:shadow-xl active:scale-95"
          >
            <Plus size={20} />
            REGISTRAR AUTOR
          </button>
        </div>

        <div className="flex gap-4 p-6 glass rounded-2xl bg-white/40 border-libreria-oro/20">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-libreria-madera/30" size={18} />
            <input 
              type="text" 
              placeholder="Buscar autores por nombre, nacionalidad..." 
              className="w-full pl-12 pr-4 py-3 bg-white/50 border-none outline-none focus:bg-white transition-all rounded-xl shadow-sm"
            />
          </div>
          <button className="px-6 flex items-center gap-2 bg-white/50 rounded-xl hover:bg-white transition-colors border-none font-semibold text-sm">
            <Filter size={18} /> FILTRAR
          </button>
        </div>

        <div className="animate-in fade-in duration-1000">
           <Tabla 
            columnas={columnas} 
            datos={autores} 
            onEditar={abrirEditarModal}
            onEliminar={eliminarAutor}
          />
        </div>
      </div>

      <Modal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)}
        titulo={autorEditando?.id ? 'Editar Perfil del Autor' : 'Nuevo Registro de Autor'}
      >
        <form onSubmit={guardarAutor} className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Nombre</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              value={autorEditando?.nombre || ''}
              onChange={(e) => setAutorEditando({...autorEditando, nombre: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Apellido</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              value={autorEditando?.apellido || ''}
              onChange={(e) => setAutorEditando({...autorEditando, apellido: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Nacionalidad</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              value={autorEditando?.nacionalidad || ''}
              onChange={(e) => setAutorEditando({...autorEditando, nacionalidad: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Fecha de Nacimiento</label>
            <input 
              required type="date"
              className="input-field w-full px-4 py-2"
              value={autorEditando?.fecha_nacimiento || ''}
              onChange={(e) => setAutorEditando({...autorEditando, fecha_nacimiento: e.target.value})}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Biografía</label>
            <textarea 
              required
              className="input-field w-full min-h-[100px] px-4 py-2"
              value={autorEditando?.biografia || ''}
              onChange={(e) => setAutorEditando({...autorEditando, biografia: e.target.value})}
              placeholder="Breve biografía del autor..."
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-8 pt-6 border-t border-libreria-oro/10">
            <button 
              type="button"
              onClick={() => setModalAbierto(false)}
              className="px-6 py-3 font-bold uppercase tracking-widest text-sm text-libreria-madera/40 hover:text-libreria-madera transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={cargando}
              className="bg-libreria-madera text-libreria-papel px-10 py-3 rounded-xl font-bold tracking-widest hover:bg-libreria-madera_clara transition-all hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
               {cargando ? 'GUARDANDO...' : (autorEditando?.id ? 'ACTUALIZAR PERFIL' : 'REGISTRAR AUTOR')}
            </button>
          </div>
        </form>
      </Modal>

      <Alerta 
        mensaje={alerta.mensaje} 
        tipo={alerta.tipo} 
        visible={alerta.visible} 
        onCerrar={cerrarAlerta} 
      />
    </DashboardLayout>
  );
};

export default Autores;
