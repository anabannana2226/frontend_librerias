import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, User, BookOpen, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/usuarios/login', { email, password });

      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/libros');
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas o servidor desconectado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-libreria-madera">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none scale-105"
        style={{ backgroundImage: `url('/biblioteca_bg.png')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-libreria-madera via-transparent to-libreria-madera opacity-90 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-10 bg-libreria-papel rounded-3xl shadow-2xl border border-libreria-oro/40"
      >
        <div className="flex flex-col items-center mb-8">
          <BookOpen size={64} className="text-libreria-madera mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-classic tracking-wider text-libreria-madera">Librería A-K</h1>
          <p className="text-libreria-madera_clara mt-2 italic text-sm">Donde las historias cobran vida</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/70 ml-1">Usuario o Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/50" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-libreria-oro/20 rounded-xl focus:ring-2 focus:ring-libreria-oro outline-none transition-all placeholder:text-libreria-madera/30"
                placeholder="admin@libreria.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-libreria-madera/70 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-libreria-madera/50" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-libreria-oro/20 rounded-xl focus:ring-2 focus:ring-libreria-oro outline-none transition-all placeholder:text-libreria-madera/30"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-libreria-madera text-libreria-papel py-4 rounded-xl flex items-center justify-center gap-3 font-semibold tracking-wider hover:bg-libreria-madera_clara hover:shadow-xl active:scale-95 transition-all transition-duration-300"
          >
            {cargando ? 'ENTRANDO...' : (
              <>
                <LogIn size={20} />
                INICIAR SESIÓN
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-libreria-oro/10">
          <p className="text-sm text-libreria-madera/50 mb-4 tracking-widest uppercase text-[10px]">Gestión • Biblioteca</p>
          <p className="text-sm text-libreria-madera/60 lowercase italic">
            ¿Aún no tienes cuenta? <Link to="/registro" className="text-libreria-madera font-bold hover:underline not-italic uppercase tracking-wider ml-1">Regístrate</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
