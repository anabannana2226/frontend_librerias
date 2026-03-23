import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await axios.post('https://api-libreria-2m5i.onrender.com/api/usuarios/registro', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || 'Error al registrar usuario. Asegúrate de que el servidor esté encendido.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-libreria-madera">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none scale-105"
        style={{ backgroundImage: `url('/biblioteca_bg.png')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-libreria-madera via-transparent to-libreria-madera opacity-90 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="relative z-10 w-full max-w-lg p-10 bg-libreria-papel rounded-3xl shadow-2xl border border-libreria-oro/30"
      >
        <div className="text-center mb-8">
          <BookOpen size={48} className="text-libreria-madera mx-auto mb-4" />
          <h1 className="text-3xl font-classic tracking-wider text-libreria-madera">Nueva Credencial</h1>
          <p className="text-libreria-madera_clara mt-2 italic text-sm">Regístrate para acceder al catálogo</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/60 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/40" size={18} />
              <input 
                required type="text"
                className="input-field w-full pl-10 pr-4 py-2"
                placeholder="Ej. Gabriel García"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/60 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/40" size={18} />
              <input 
                required type="email"
                className="input-field w-full pl-10 pr-4 py-2"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/60 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/40" size={18} />
                <input 
                  required type="password"
                  className="input-field w-full pl-10 pr-4 py-2"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/60 ml-1">Confirmar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/40" size={18} />
                <input 
                  required type="password"
                  className="input-field w-full pl-10 pr-4 py-2"
                  placeholder="••••••••"
                  value={formData.confirmarPassword}
                  onChange={(e) => setFormData({...formData, confirmarPassword: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={cargando}
            className={`w-full bg-libreria-madera text-libreria-papel py-4 rounded-xl font-bold tracking-widest hover:bg-libreria-madera_clara transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${cargando ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'REGISTRANDO...' : (
              <>
                <UserPlus size={20} />
                CREAR CUENTA
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-libreria-oro/10">
          <p className="text-sm text-libreria-madera/60 lowercase italic">
            ¿Ya eres socio? <Link to="/" className="text-libreria-madera font-bold hover:underline not-italic uppercase tracking-wider ml-1">Inicia Sesión</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Registro;
