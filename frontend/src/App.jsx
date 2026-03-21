import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Libros from './paginas/Libros';
import Autores from './paginas/Autores';

function App() {
  
  const estaAutenticado = () => {
  const usuario = localStorage.getItem('usuario');
  // Se añade la validación contra el string 'undefined'
  return usuario !== null && usuario !== 'undefined' && usuario !== '';
};

  const RutaProtegida = ({ children }) => {
    return estaAutenticado() ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/libros" 
          element={
            <RutaProtegida>
              <Libros />
            </RutaProtegida>
          } 
        />
        <Route 
          path="/autores" 
          element={
            <RutaProtegida>
              <Autores />
            </RutaProtegida>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
