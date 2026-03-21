import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../componentes/DashboardLayout';
import Tabla from '../componentes/Tabla';
import Modal from '../componentes/Modal';
import Alerta from '../componentes/Alerta';
import { Plus, BookOpen, Search, Filter } from 'lucide-react';

const API_URL = 'https://apis-react-libreria.onrender.com/api/libros';
const AUTORES_URL = 'https://apis-react-libreria.onrender.com/api/autores';

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: 'info', visible: false });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchLibros();
    fetchAutores();
  }, []);

  const fetchLibros = async () => {
    try {
      const res = await axios.get(API_URL);
      setLibros(res.data);
    } catch (err) {
      mostrarAlerta('Error al cargar libros', 'error');
    }
  };

  const fetchAutores = async () => {
    try {
      const res = await axios.get(AUTORES_URL);
      setAutores(res.data);
    } catch (err) {
      console.error('Error al cargar autores', err);
    }
  };

  const columnas = [
    { key: 'titulo', label: 'Título' },
    { key: 'autor_nombre', label: 'Autor', render: (val, row) => `${row.autor_nombre || 'Desconocido'} ${row.autor_apellido || ''}` },
    { key: 'genero', label: 'Género' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'stock', label: 'Stock', render: (val) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${val < 7 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
        {val} unidades
      </span>
    ) },
    { key: 'precio', label: 'Precio', render: (val) => `$${Number(val).toFixed(2)}` }
  ];

  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({ mensaje, tipo, visible: true });
  };

  const cerrarAlerta = () => setAlerta({ ...alerta, visible: false });

  const abrirNuevoModal = () => {
    setLibroEditando({ titulo: '', autor_id: '', genero: '', stock: 0, precio: 0, isbn: '', fecha_publicacion: '' });
    setModalAbierto(true);
  };

  const abrirEditarModal = (libro) => {
    setLibroEditando({
      ...libro,
      fecha_publicacion: libro.fecha_publicacion ? libro.fecha_publicacion.split('T')[0] : ''
    });
    setModalAbierto(true);
  };

  const guardarLibro = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      console.log('Guardando libro...', libroEditando);
      if (libroEditando.id) {
        await axios.put(`${API_URL}/${libroEditando.id}`, libroEditando);
        mostrarAlerta('Libro actualizado exitosamente', 'exito');
      } else {
        await axios.post(API_URL, libroEditando);
        mostrarAlerta('Libro creado exitosamente', 'exito');
      }
      
      setModalAbierto(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (err) {
      console.error('Error al guardar libro:', err);
      mostrarAlerta(err.response?.data?.mensaje || 'Error al guardar el libro', 'error');
    } finally {
      setCargando(false);
    }
  };

  const eliminarLibro = async (id) => {
    if (window.confirm('¿Seguro?, se borrará de los registros permanentes.')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        mostrarAlerta('Libro eliminado', 'exito');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        mostrarAlerta('Error al eliminar el libro', 'error');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl mb-2 text-libreria-madera tracking-tight drop-shadow-sm">Biblioteca</h1>
            <p className="text-libreria-madera/50 font-medium italic">Gestión de Catálogo de Publicaciones</p>
          </div>
          <button 
            onClick={abrirNuevoModal}
            className="flex items-center gap-2 bg-libreria-madera text-libreria-papel px-6 py-4 rounded-xl font-bold tracking-widest hover:bg-libreria-madera_clara transition-all hover:shadow-xl active:scale-95"
          >
            <Plus size={20} />
            AÑADIR NUEVO LIBRO
          </button>
        </div>

        <div className="flex gap-4 p-6 glass rounded-2xl bg-white/40 border-libreria-oro/20">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-libreria-madera/30" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título, autor o género..." 
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
            datos={libros} 
            onEditar={abrirEditarModal}
            onEliminar={eliminarLibro}
          />
        </div>
      </div>

      <Modal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)}
        titulo={libroEditando?.id ? 'Editar Libro' : 'Nuevo Libro'}
      >
        <form onSubmit={guardarLibro} className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Título del Libro</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              value={libroEditando?.titulo || ''}
              onChange={(e) => setLibroEditando({...libroEditando, titulo: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Autor</label>
            <select 
              required
              className="input-field w-full px-4 py-2 bg-white"
              value={libroEditando?.autor_id || ''}
              onChange={(e) => setLibroEditando({...libroEditando, autor_id: e.target.value})}
            >
              <option value="">Selecciona un autor</option>
              {autores.map(a => (
                <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Género</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              value={libroEditando?.genero || ''}
              onChange={(e) => setLibroEditando({...libroEditando, genero: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">ISBN</label>
            <input 
              required
              className="input-field w-full px-4 py-2"
              placeholder="Ej. 978-3-16-148410-0"
              value={libroEditando?.isbn || ''}
              onChange={(e) => setLibroEditando({...libroEditando, isbn: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Fecha Publicación</label>
            <input 
              required type="date"
              className="input-field w-full px-4 py-2"
              value={libroEditando?.fecha_publicacion || ''}
              onChange={(e) => setLibroEditando({...libroEditando, fecha_publicacion: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Stock</label>
            <input 
              required type="number"
              className="input-field w-full px-4 py-2"
              value={libroEditando?.stock || 0}
              onChange={(e) => setLibroEditando({...libroEditando, stock: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-libreria-madera/60">Precio ($)</label>
            <input 
              required type="number" step="0.01"
              className="input-field w-full px-4 py-2"
              value={libroEditando?.precio || 0}
              onChange={(e) => setLibroEditando({...libroEditando, precio: parseFloat(e.target.value)})}
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
               {cargando ? 'GUARDANDO...' : (libroEditando?.id ? 'GUARDAR CAMBIOS' : 'CREAR LIBRO')}
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

export default Libros;
