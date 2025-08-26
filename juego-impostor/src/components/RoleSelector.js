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
    console.log('RoleSelector: playerNames prop changed', playerNames);
    // Initialize with existing names or empty strings
    const totalPlayers = innocentCount + impostorCount;
    if (playerNames && playerNames.length === totalPlayers) {
      console.log('Setting localPlayerNames from props:', playerNames);
      setLocalPlayerNames([...playerNames]);
    } else {
      console.log('Initializing with empty player names');
      const emptyNames = Array(totalPlayers).fill('');
      setLocalPlayerNames(emptyNames);
      onPlayerNamesChange(emptyNames);
    }
  }, [innocentCount, impostorCount, playerNames]);

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

  const renderNameInputs = () => {
    // Initialize with default names if not set
    const names = localPlayerNames.length === innocentCount + impostorCount 
      ? localPlayerNames 
      : Array(innocentCount + impostorCount).fill('');
      
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center mb-4">Ingresa los nombres de los jugadores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: innocentCount + impostorCount }).map((_, index) => (
            <div key={index} className="space-y-1">
              <label className="text-sm text-gray-300">
                Jugador {index + 1} 👤
              </label>
              <input
                type="text"
                value=""
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef] transition-colors"
                placeholder={`Jugador ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRoleSelector = () => (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <label className="block text-lg font-medium mb-2">Cantidad de Inocentes</label>
        <div className="flex items-center justify-center space-x-4">
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

      <div className="space-y-2 text-center">
        <label className="block text-lg font-medium mb-2">Cantidad de Impostores</label>
        <div className="flex items-center justify-center space-x-4">
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

      <div className="pt-6 border-t border-gray-700">
        <p className="text-center text-gray-300 text-lg">
          Total de jugadores: <span className="font-bold text-xl text-white">{innocentCount + impostorCount}</span>
        </p>
        <p className="text-center text-gray-400 mt-2">
          {innocentCount} Inocente{innocentCount !== 1 ? 's' : ''} y {impostorCount} Impostor{impostorCount !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  );
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8">Configura los roles</h2>
      
      <div className="space-y-6 bg-[#2a2a3c] p-8 rounded-lg shadow-lg">
        {showNameInputs ? (
          <div className="space-y-6">
            {renderNameInputs()}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleContinueClick}
                className="w-full max-w-xs py-3 bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold rounded-lg transition-colors"
              >
                Continuar al juego
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {renderRoleSelector()}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleContinueClick}
                className="w-full max-w-xs py-3 bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold rounded-lg transition-colors"
              >
                Ingresar nombres 👤
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
