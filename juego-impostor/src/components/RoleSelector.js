'use client';

import { useState, useEffect } from 'react';

export const RoleSelector = ({ 
  innocentCount, 
  impostorCount, 
  onInnocentChange, 
  onImpostorChange,
  playerNames = [],
  onPlayerNamesChange = () => {},
  onContinue 
}) => {
  const [showNameInputs, setShowNameInputs] = useState(false);
  const [localPlayerNames, setLocalPlayerNames] = useState(Array(innocentCount + impostorCount).fill(''));

  useEffect(() => {
    // Initialize with existing names or empty strings
    if (playerNames && playerNames.length === innocentCount + impostorCount) {
      setLocalPlayerNames([...playerNames]);
    } else {
      setLocalPlayerNames(Array(innocentCount + impostorCount).fill(''));
    }
  }, [innocentCount + impostorCount, playerNames]);

  const handleNameChange = (index, value) => {
    const newNames = [...localPlayerNames];
    newNames[index] = value;
    setLocalPlayerNames(newNames);
    onPlayerNamesChange(newNames);
  };

  const handleContinueClick = () => {
    if (showNameInputs) {
      if (localPlayerNames.every(name => name.trim() !== '')) {
        onContinue();
      } else {
        alert('Por favor, completa todos los nombres de los jugadores');
      }
    } else {
      setShowNameInputs(true);
    }
  };

  const renderNameInputs = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Ingresa los nombres de los jugadores</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: innocentCount + impostorCount }).map((_, index) => (
          <div key={index} className="space-y-1">
            <label className="text-sm text-gray-300">
              Jugador {index + 1} 👤
            </label>
            <input
              type="text"
              value={localPlayerNames[index] || ''}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-full p-2 rounded bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef]"
              placeholder={`Jugador ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoleSelector = () => (
    <div>
      <div className="space-y-2">
        <label className="block text-lg font-medium">Cantidad de Inocentes</label>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onInnocentChange(Math.max(1, innocentCount - 1))}
            className="px-4 py-2 bg-[#4cafef] rounded-lg hover:bg-[#3196e8] transition-colors"
          >
            -
          </button>
          <span className="text-xl min-w-[40px] text-center">{innocentCount}</span>
          <button 
            onClick={() => onInnocentChange(innocentCount + 1)}
            className="px-4 py-2 bg-[#4cafef] rounded-lg hover:bg-[#3196e8] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <label className="block text-lg font-medium">Cantidad de Impostores</label>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onImpostorChange(Math.max(1, impostorCount - 1))}
            className="px-4 py-2 bg-[#ff4d4d] rounded-lg hover:bg-[#e83f3f] transition-colors"
          >
            -
          </button>
          <span className="text-xl min-w-[40px] text-center">{impostorCount}</span>
          <button 
            onClick={() => onImpostorChange(impostorCount + 1)}
            className="px-4 py-2 bg-[#ff4d4d] rounded-lg hover:bg-[#e83f3f] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="pt-6">
        <p className="text-center text-gray-300">
          Total de jugadores: <span className="font-bold">{innocentCount + impostorCount}</span>
        </p>
        <p className="text-sm text-center text-gray-400 mt-1">
          {innocentCount} Inocente{innocentCount !== 1 ? 's' : ''} y {impostorCount} Impostor{impostorCount !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  );
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Configura los roles</h2>
      
      <div className="space-y-6 bg-[#2a2a3c] p-6 rounded-lg">
        {showNameInputs ? renderNameInputs() : renderRoleSelector()}
        
        <button
          onClick={handleContinueClick}
          className="w-full py-3 bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold rounded-lg transition-colors mt-6"
        >
          {showNameInputs ? 'Continuar al juego' : 'Siguiente: Ingresar jugadores'}
        </button>
        
        {showNameInputs && (
          <button
            onClick={() => setShowNameInputs(false)}
            className="w-full py-2 text-[#4cafef] hover:underline mt-2"
          >
            ← Volver a ajustar roles
          </button>
        )}
      </div>
    </div>
  );
};
