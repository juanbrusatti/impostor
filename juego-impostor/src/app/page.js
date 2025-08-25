"use client";

import { useState } from "react";
import { PresetSelector } from "@/components/PresetSelector";
import { GameModeSelector } from "@/components/GameModeSelector";
import { RoleSelector } from "@/components/RoleSelector";
import { getPresetById } from "@/data/playerPresets";

export default function Home() {
  const [view, setView] = useState("mode-selection"); // 'mode-selection' | 'role-selection' | 'game-selection' | 'custom' | 'playing'
  const [gameMode, setGameMode] = useState("selection"); // 'selection' | 'custom' | 'playing'
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [playersInput, setPlayersInput] = useState("");
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [innocentCount, setInnocentCount] = useState(4);
  const [impostorCount, setImpostorCount] = useState(1);
  const [playerNames, setPlayerNames] = useState([]);

  const handleSelectPreset = (presetId) => {
    const preset = getPresetById(presetId);
    setSelectedPreset(preset);
    
    if (preset.id === 'custom') {
      setGameMode('custom');
    }
  };

  const handleContinueFromPreset = () => {
    if (selectedPreset && selectedPreset.players.length > 0) {
      const randomPlayer = selectedPreset.players[
        Math.floor(Math.random() * selectedPreset.players.length)
      ];
      startGameWithPlayer(randomPlayer);
    }
  };

  const startGame = () => {
    const list = playersInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (list.length === 0) {
      alert("Ingresá al menos un futbolista (uno por línea).");
      return;
    }

    const chosen = list[Math.floor(Math.random() * list.length)];
    startGameWithPlayer(chosen);
  };

  const startGameWithPlayer = (player) => {
    setCurrentPlayer(player);
    
    // Mantener la lógica original del juego
    const innocents = Array(innocentCount).fill(player);
    const impostors = Array(impostorCount).fill("IMPOSTOR");
    setRoles(shuffle([...innocents, ...impostors]));
    
    // Los nombres de los jugadores se guardan pero no se usan para revelar quién es el impostor
    // Se mantienen para futuras mejoras o para mostrar estadísticas
    
    setGameMode('playing');
  };

  const resetGame = () => {
    setView('mode-selection');
    setGameMode('selection');
    setSelectedPreset(null);
    setPlayersInput("");
    setRoles([]);
    setCurrentPlayer("");
  };

  const handleSelectGameMode = (mode) => {
    if (mode === 'local') {
      setView('role-selection');
    }
    // For 'online', we don't need to do anything as the button is disabled
  };

  const handleBackToModeSelection = () => {
    setView('mode-selection');
  };

  const handleBackToGameSelection = () => {
    setView('role-selection');
    setGameMode('selection');
  };

  const handleRoleSelectionContinue = (names) => {
    setPlayerNames(names);
    setView('game-selection');
  };

  const handlePlayerNamesChange = (names) => {
    setPlayerNames(names);
  };

  return (
    <main className="min-h-screen bg-[#1e1e2f] text-white flex flex-col items-center p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Juego del Impostor ⚽</h1>
      
      {view === 'mode-selection' && (
        <GameModeSelector onSelectMode={handleSelectGameMode} />
      )}

      {view === 'role-selection' && (
        <div className="w-full max-w-2xl mx-auto">
          <button
            onClick={handleBackToModeSelection}
            className="mb-6 text-[#4cafef] hover:underline flex items-center"
          >
            ← Volver a selección de modo
          </button>
          <RoleSelector
            innocentCount={innocentCount}
            impostorCount={impostorCount}
            onInnocentChange={setInnocentCount}
            onImpostorChange={setImpostorCount}
            playerNames={playerNames}
            onPlayerNamesChange={handlePlayerNamesChange}
            onContinue={handleRoleSelectionContinue}
          />
        </div>
      )}

      {view === 'game-selection' && gameMode === 'selection' && (
        <>
          <div className="w-full max-w-2xl mb-6">
            <div className="flex justify-center">
              <div className="bg-[#2a2a3c] px-6 py-3 rounded-lg inline-flex items-center gap-4">
                <span className="text-green-400 font-medium">{innocentCount} INOCENTE{innocentCount !== 1 ? 'S' : ''}</span>
                <span className="text-gray-400">|</span>
                <span className="text-red-400 font-medium">{impostorCount} IMPOSTOR{impostorCount !== 1 ? 'ES' : ''}</span>
              </div>
            </div>
          </div>
          
          <p className="opacity-80 mb-8 text-center max-w-2xl">
            Elige una categoría de futbolistas para jugar o personaliza tu propia lista.
            El juego elegirá un jugador al azar y creará <b>{innocentCount + impostorCount} cartas</b>.
          </p>
          <PresetSelector 
            onSelectPreset={handleSelectPreset}
            onContinue={handleContinueFromPreset}
            onBack={handleBackToModeSelection}
          />
        </>
      )}

      {view !== 'mode-selection' && gameMode === 'custom' && (
        <div className="w-full max-w-lg mt-4">
          <p className="opacity-80 mb-4 text-center">
            Escribí <b>futbolistas</b> (uno por línea).
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-300 mb-1">Inocentes</label>
              <input
                type="number"
                min="1"
                max="10"
                value={innocentCount}
                onChange={(e) => setInnocentCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 p-2 rounded bg-[#111528] border border-white/10 text-center"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-300 mb-1">Impostores</label>
              <input
                type="number"
                min="1"
                max="3"
                value={impostorCount}
                onChange={(e) => setImpostorCount(Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 p-2 rounded bg-[#111528] border border-white/10 text-center"
              />
            </div>
          </div>
          <textarea
            className="w-full h-36 p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef]"
            placeholder={`Ej:\nMessi\nCristiano Ronaldo\nMbappé\nNeymar\nMaradona`}
            value={playersInput}
            onChange={(e) => setPlayersInput(e.target.value)}
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={startGame}
              className="flex-1 bg-[#4cafef] hover:bg-[#3196e8] px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Comenzar
            </button>
          </div>
        </div>
      )}

      {view !== 'mode-selection' && gameMode === 'playing' && (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {roles.map((role, i) => (
              <Card key={`${role}-${i}`} role={role} />
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                if (selectedPreset?.players?.length > 0) {
                  // If using a preset, select a new random player from the preset
                  const newPlayer = selectedPreset.players[
                    Math.floor(Math.random() * selectedPreset.players.length)
                  ];
                  startGameWithPlayer(newPlayer);
                } else {
                  // If in custom mode, select a new random player from the input
                  const players = playersInput
                    .split("\n")
                    .map(s => s.trim())
                    .filter(Boolean);
                  if (players.length > 0) {
                    const newPlayer = players[Math.floor(Math.random() * players.length)];
                    startGameWithPlayer(newPlayer);
                  }
                }
              }}
              className="bg-[#4cafef] hover:bg-[#3196e8] px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Mezclar de nuevo
            </button>
            <button
              onClick={() => {
                setView('game-selection');
                setGameMode('selection');
              }}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </>
      )}
    </main>
  );
}

/* ---- Helpers ---- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- Componente Carta ---- */
function Card({ role }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-28 h-44 sm:w-32 sm:h-48 perspective cursor-pointer select-none"
      onClick={() => setFlipped((f) => !f)}
      title="Tocar para dar vuelta"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Dorso */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-[#4cafef] flex items-center justify-center text-4xl font-bold">
          ?
        </div>

        {/* Frente */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-white text-black font-bold p-3 flex items-center justify-center text-center">
          {role === "IMPOSTOR" ? (
            <span className="text-red-600">IMPOSTOR</span>
          ) : (
            role
          )}
        </div>
      </div>
    </div>
  );
}
