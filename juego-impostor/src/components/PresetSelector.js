'use client';

import { useState } from 'react';
import { playerPresets } from '@/data/playerPresets';

const PresetCard = ({ preset, isSelected, onClick }) => {
  return (
    <div 
      className={`p-6 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{preset.name}</h3>
      <p className="text-gray-600 text-sm">
        {preset.players.length > 0 
          ? `${preset.players.length} jugadores precargados` 
          : 'Agrega tus propios jugadores'}
      </p>
    </div>
  );
};

export const PresetSelector = ({ onSelectPreset, onContinue }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSelect = (presetId) => {
    setSelectedPreset(presetId);
    onSelectPreset(presetId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Elige un modo de juego</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.values(playerPresets).map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isSelected={selectedPreset === preset.id}
            onClick={() => handleSelect(preset.id)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          disabled={!selectedPreset}
          className={`px-8 py-3 rounded-full font-medium text-white ${
            selectedPreset 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-300 cursor-not-allowed'
          } transition-colors`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
