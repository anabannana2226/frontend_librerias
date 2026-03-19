import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Book, Users, LogOut, LayoutDashboard, Library } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Gestor' };
  const inicial = usuario.nombre.charAt(0).toUpperCase();

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const navItems = [
    { label: 'Libros', path: '/libros', icon: <Book size={20} /> },
    { label: 'Autores', path: '/autores', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-libreria-papel text-libreria-madera overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-libreria-madera text-libreria-papel flex flex-col shadow-2xl relative z-30">
        <div className="p-8 border-b border-libreria-oro/10 flex items-center gap-3">
          <Library size={32} className="text-libreria-oro" />
          <h1 className="text-2xl font-classic tracking-widest text-libreria-papel uppercase">Librería A-K</h1>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300
                ${isActive
                  ? 'bg-libreria-oro text-libreria-madera font-bold shadow-lg'
                  : 'hover:bg-white/5 text-libreria-papel/80 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="text-sm font-semibold uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-8 border-t border-libreria-oro/10">
          <button
            onClick={handleCerrarSesion}
            className="flex items-center gap-4 text-libreria-papel/60 hover:text-red-400 transition-colors group w-full px-6 py-2"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold uppercase tracking-widest leading-none">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-libreria-oro/10 flex items-center justify-between px-12 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <LayoutDashboard size={24} className="text-libreria-madera/40" />
            <h2 className="text-lg font-semibold text-libreria-madera/60 tracking-wider font-classic uppercase">Gestión</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Gestor: <span className="text-libreria-madera font-bold capitalize">{usuario.nombre}</span></span>
            <div className="w-10 h-10 rounded-full bg-libreria-madera text-libreria-papel flex items-center justify-center font-classic text-xl border-2 border-libreria-oro/40">{inicial}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-libreria-pergamino/20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
