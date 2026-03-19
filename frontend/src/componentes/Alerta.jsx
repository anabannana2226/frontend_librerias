import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Alerta = ({ mensaje, tipo = 'info', onCerrar, visible }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onCerrar();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onCerrar]);

  const config = {
    exito: {
      color: 'bg-green-100 border-green-500 text-green-800',
      icono: <CheckCircle className="text-green-500" />
    },
    error: {
      color: 'bg-red-100 border-red-500 text-red-800',
      icono: <AlertCircle className="text-red-500" />
    },
    info: {
      color: 'bg-blue-100 border-blue-500 text-blue-800',
      icono: <Info className="text-blue-500" />
    }
  };

  const { color, icono } = config[tipo] || config.info;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`fixed top-4 right-4 z-[9999] flex items-center p-4 rounded-xl border-l-4 shadow-xl ${color} max-w-sm w-full`}
        >
          <div className="mr-3">{icono}</div>
          <div className="flex-1 text-sm font-medium">{mensaje}</div>
          <button 
            onClick={onCerrar}
            className="ml-4 p-1 hover:bg-black/5 rounded-full"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alerta;
