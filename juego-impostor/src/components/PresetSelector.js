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

export const PresetSelector = ({ onSelectPreset, onContinue, onBack }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSelect = (presetId) => {
    setSelectedPreset(presetId);
    onSelectPreset(presetId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">Elige una categoria de futbolistas</h2>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>
      
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
