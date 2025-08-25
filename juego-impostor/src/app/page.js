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
  // Initialize playerNames with default names based on the initial innocent and impostor counts
  const [playerNames, setPlayerNames] = useState(
    Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`)
  );

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
      // Ensure we have player names before starting the game
      if (playerNames.length === 0) {
        // If no player names are set, use default names
        const defaultNames = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
        setPlayerNames(defaultNames);
      }
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

    // Ensure we have player names
    if (playerNames.length === 0) {
      // If no player names are set, use default names
      const defaultNames = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
      setPlayerNames(defaultNames);
    }

    const chosen = list[Math.floor(Math.random() * list.length)];
    startGameWithPlayer(chosen);
  };

  const startGameWithPlayer = (player) => {
    setCurrentPlayer(player);
  
    // Crear un array con los roles (INOCENTE/IMPOSTOR) para cada jugador
    const rolesArray = [
      ...Array(innocentCount).fill("INOCENTE"),
      ...Array(impostorCount).fill("IMPOSTOR")
    ];
  
    // Mezclar los roles
    const shuffledRoles = shuffle(rolesArray);
  
    // Get a list of all available players from the selected preset or custom list
    let availablePlayers = [];
    if (selectedPreset?.players?.length > 0) {
      availablePlayers = [...selectedPreset.players];
    } else if (playersInput) {
      availablePlayers = playersInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  
    // If no players available, use a default list
    if (availablePlayers.length === 0) {
      availablePlayers = [
        'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Lewandowski',
        'Benzema', 'Salah', 'Haaland', 'De Bruyne', 'Modrić'
      ];
    }

    // Select one random player for all innocent cards
    const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
  
    // Create player objects with roles and player names
    const playersWithRoles = shuffledRoles.map((role, index) => {
      // For the impostor, just use the role
      if (role === 'IMPOSTOR') {
        return {
          role,
          name: playerNames[index] || `Jugador ${index + 1}`,
          playerRole: 'IMPOSTOR',
          isImpostor: true
        };
      }
      
      // For innocents, use the same random player
      return {
        role,
        name: playerNames[index] || `Jugador ${index + 1}`,
        playerRole: randomPlayer,
        isImpostor: false
      };
    });
  
    setRoles(playersWithRoles);
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
    // Ensure we have valid names, otherwise use defaults
    const validNames = names && names.length === innocentCount + impostorCount 
      ? names 
      : Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
    
    setPlayerNames(validNames);
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
            {roles.map((player, i) => (
              <Card 
                key={i} 
                role={player.role} 
                playerName={player.name}
                playerRole={player.playerRole}
              />
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
function Card({ role, playerName, playerRole }) {
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
        <div className="absolute inset-0 backface-hidden rounded-xl bg-[#4cafef] flex items-center justify-center p-2">
          <span className="text-white font-bold text-center break-words">{playerName || '?'}</span>
        </div>

        {/* Frente */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-white text-black font-bold p-3 flex flex-col items-center justify-center text-center">
          <span className="text-sm mb-2">{playerName}</span>
          <span className={`text-lg font-bold ${role === "IMPOSTOR" ? 'text-red-600' : 'text-green-600'}`}>
            {role === "IMPOSTOR" ? "IMPOSTOR" : playerRole || "INOCENTE"}
          </span>
        </div>
      </div>
    </div>
  );
}
