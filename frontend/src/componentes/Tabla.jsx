import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Tabla = ({ columnas, datos, onEditar, onEliminar, idKey = 'id' }) => {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl glass bg-white/20">
      <table className="w-full text-left border-collapse">
        <thead className="bg-libreria-madera text-libreria-papel">
          <tr>
            {columnas.map((col, idx) => (
              <th key={idx} className="p-4 font-classic uppercase tracking-wider text-xs">
                {col.label}
              </th>
            ))}
            <th className="p-4 font-classic uppercase tracking-wider text-xs text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-libreria-madera/10 bg-white/10 backdrop-blur-md">
          {datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length + 1} className="p-8 text-center italic text-libreria-madera/50">
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            datos.map((fila, fIdx) => (
              <tr key={fila[idKey] || fIdx} className="table-row-hover">
                {columnas.map((col, cIdx) => (
                  <td key={cIdx} className="p-4 text-sm font-medium text-libreria-madera">
                    {col.render ? col.render(fila[col.key], fila) : fila[col.key]}
                  </td>
                ))}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => onEditar(fila)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all hover:scale-110 active:scale-95 shadow-sm"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onEliminar(fila[idKey])}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all hover:scale-110 active:scale-95 shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;
