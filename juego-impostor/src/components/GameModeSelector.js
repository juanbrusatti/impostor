'use client';

import { FaLock } from 'react-icons/fa';

export const GameModeSelector = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Elige el modo de juego</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => onSelectMode('local')}
          className="w-full p-6 rounded-lg bg-[#4cafef] hover:bg-[#3196e8] text-white text-lg font-semibold transition-colors flex flex-col items-center justify-center"
        >
          <span className="text-2xl">🎮</span>
          <span>Multijugador Local</span>
          <span className="text-sm font-normal opacity-80 mt-1">Juega con amigos en un solo dispositivo</span>
        </button>
        
        <button
          onClick={() => onSelectMode('online')}
          className="w-full p-6 rounded-lg bg-[#4cafef] hover:bg-[#3196e8] text-white text-lg font-semibold transition-colors flex flex-col items-center justify-center"
        >
          <span className="text-2xl">🌐</span>
          <span>Multijugador en Línea</span>
          <span className="text-sm font-normal opacity-80 mt-1">Juega con amigos online</span>
        </button>
      </div>
    </div>
  );
};
