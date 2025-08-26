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
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
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
      if (playerNames.length === 0 || playerNames[0].startsWith('Jugador ')) {
        // If no player names are set or still using default names, use default names
        const defaultNames = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
        setPlayerNames(defaultNames);
      }
      // Make sure we have the latest playerNames in state before starting the game
      setTimeout(() => {
        startGameWithPlayer(randomPlayer);
      }, 0);
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

    // Get current player names or use defaults
    let namesToUse = [...playerNames];
    if (namesToUse.length === 0 || namesToUse[0].startsWith('Jugador ')) {
      // If no player names are set or still using default names, use default names
      namesToUse = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
      setPlayerNames(namesToUse);
    }

    const chosen = list[Math.floor(Math.random() * list.length)];
    console.log('Starting game with player:', chosen, 'and names:', namesToUse);
    
    // Update view and game mode before starting the game
    setView('playing');
    setGameMode('playing');
    
    // Pass the names to startGameWithPlayer
    setTimeout(() => {
      startGameWithPlayer(chosen, namesToUse);
    }, 0);
  };

  const startGameWithPlayer = (player, names = []) => {
    setCurrentPlayer(player);
    
    // Use the provided names or fall back to state/localStorage
    let currentPlayerNames = names.length > 0 ? [...names] : [...playerNames];
    
    if (currentPlayerNames.length === 0 && typeof window !== 'undefined') {
      const savedNames = localStorage.getItem('playerNames');
      if (savedNames) {
        currentPlayerNames = JSON.parse(savedNames);
      }
    }
    
    // If still no names, use default names
    if (currentPlayerNames.length === 0) {
      currentPlayerNames = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
    }
    
    console.log('Using player names:', currentPlayerNames);
  
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
      // For the impostor
      if (role === 'IMPOSTOR') {
        return {
          role,
          name: 'IMPOSTOR',
          playerRole: 'IMPOSTOR',
          isImpostor: true,
          realName: currentPlayerNames[index] || `Jugador ${index + 1}`
        };
      }
      
      // For innocents
      return {
        role,
        name: randomPlayer,  // This is the football player name
        playerRole: 'INOCENTE',
        isImpostor: false,
        realName: currentPlayerNames[index] || `Jugador ${index + 1}`  // This is the actual player's name
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
    
    console.log('Saving player names:', validNames);
    
    // Update player names in state
    setPlayerNames(validNames);
    
    // Store the names in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerNames', JSON.stringify(validNames));
    }
    
    // Force a small delay to ensure state is updated
    setTimeout(() => {
      console.log('Updated playerNames in state:', validNames);
      setView('game-selection');
    }, 0);
  };

const handlePlayerNamesChange = (names) => {
  console.log('Player names changed:', names);
  setPlayerNames(names);
};

return (
  <main className="min-h-screen bg-[#1e1e2f] text-white flex flex-col items-center p-6">
    {view === 'mode-selection' && (
      <div className="w-full max-w-md mx-auto mt-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Juego del Impostor ⚽</h1>
        <h3 className="text-lg mb-6 text-center opacity-80">By: Delay 🐢</h3>
        <GameModeSelector onSelectMode={handleSelectGameMode} />
      </div>
    )}

    {view === 'role-selection' && (
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Configuración de Jugadores</h1>
        <RoleSelector 
          innocentCount={innocentCount}
          impostorCount={impostorCount}
          onInnocentChange={setInnocentCount}
          onImpostorChange={setImpostorCount}
          onContinue={() => handleRoleSelectionContinue(playerNames)}
          playerNames={playerNames}
          onPlayerNamesChange={setPlayerNames}
        />
      </div>
    )}

    {view === 'game-selection' && (
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Juego del Impostor</h1>
        
        <div className="w-full max-w-2xl mb-8 mx-auto">
          <div className="flex justify-center">
            <div className="bg-[#2a2a3c] px-6 py-3 rounded-lg inline-flex items-center gap-4">
              <span className="text-green-400 font-medium">{innocentCount} INOCENTE{innocentCount !== 1 ? 'S' : ''}</span>
              <span className="text-gray-400">|</span>
              <span className="text-red-400 font-medium">{impostorCount} IMPOSTOR{impostorCount !== 1 ? 'ES' : ''}</span>
            </div>
          </div>
        </div>
        
        <p className="opacity-80 mb-8 text-center max-w-2xl mx-auto">
          Elige una categoría de futbolistas para jugar o personaliza tu propia lista.
          El juego elegirá un jugador al azar y creará <b>{innocentCount + impostorCount} cartas</b>.
        </p>
        
        <PresetSelector 
          onSelectPreset={handleSelectPreset}
          onContinue={handleContinueFromPreset}
          onBack={handleBackToModeSelection}
        />
      </div>
    )}

    {gameMode === 'custom' && view !== 'mode-selection' && view !== 'game-selection' && (
      <div className="w-full max-w-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Personalizar Lista</h2>
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
              onChange={(e) => setInnocentCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
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
          className="w-full h-40 p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef]"
          placeholder={`Ej:\nMessi\nCristiano Ronaldo\nMbappé\nNeymar\nMaradona`}
          value={playersInput}
          onChange={(e) => setPlayersInput(e.target.value)}
          rows={6}
        />
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={startGame}
            className="flex-1 bg-[#4cafef] hover:bg-[#3196e8] px-6 py-3 rounded-lg font-semibold transition-colors"
            disabled={!playersInput.trim()}
          >
            Comenzar Juego
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setView('game-selection')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Volver a la selección
          </button>
        </div>
      </div>
    )}

    {gameMode === 'playing' && (
      <div className="fixed inset-0 bg-[#1e1e2f] flex flex-col items-center justify-center p-4 z-50">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">¡A Jugar!</h2>
          {/* Contenedor con scroll si hay más de 8 cartas */}
          <div 
            className={`relative flex flex-wrap justify-center gap-4 md:gap-6 px-4 max-w-6xl mx-auto transition-all duration-300 ${roles.length > 8 ? 'overflow-y-auto' : ''}`}
            style={roles.length > 8 ? { maxHeight: '60vh' } : {}}
            key={shuffleKey}
          >
            {roles.map((player, i) => {
              const total = roles.length;
              const angle = (i / total) * Math.PI * 2;
              const radius = isShuffling ? 0 : 100; // Radius of the circle
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div 
                  key={i}
                  className={`transition-all duration-500 ${isShuffling ? 'opacity-100' : 'opacity-100'}`}
                  style={{
                    transform: isShuffling 
                      ? 'translate(0, 0) scale(1.2)' 
                      : 'translate(0, 0) scale(1)',
                    zIndex: isShuffling ? 10 : 1,
                    position: 'relative',
                    transition: 'all 0.5s ease-in-out'
                  }}
                >
                  <Card 
                    role={player.role}
                    playerName={player.role === 'IMPOSTOR' ? 'IMPOSTOR' : player.name}
                    playerRole={player.playerRole}
                    playerRealName={player.realName || `Jugador ${i + 1}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={async () => {
                // Start the shuffle animation
                setIsShuffling(true);
                
                // Wait for cards to gather in the center
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Change the key to force re-render of cards with new positions
                setShuffleKey(prev => prev + 1);
                
                // Wait a bit before starting the shuffle
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Perform the actual shuffle logic
                if (selectedPreset?.players?.length > 0) {
                  const randomPlayer = selectedPreset.players[
                    Math.floor(Math.random() * selectedPreset.players.length)
                  ];
                  startGameWithPlayer(randomPlayer);
                } else if (playersInput) {
                  const players = playersInput
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean);
                  if (players.length > 0) {
                    const newPlayer = players[Math.floor(Math.random() * players.length)];
                    startGameWithPlayer(newPlayer);
                  }
                }
                
                // Wait for cards to return to their positions
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Reset shuffle state after animation completes
                setIsShuffling(false);
              }}
              className={`bg-[#4cafef] hover:bg-[#3196e8] px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${isShuffling ? 'animate-pulse' : ''}`}
              disabled={isShuffling}
            >
              Mezclar de nuevo
            </button>
            <button
              onClick={() => {
                setView('game-selection');
                setGameMode('selection');
              }}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </div>
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
function Card({ role, playerName, playerRole, playerRealName }) {
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
        {/* Back of card - Show player's real name */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-[#4cafef] flex items-center justify-center p-2">
          <span className="text-white font-bold text-center break-words text-lg">
            {playerRealName || '?'}
          </span>
        </div>

        {/* Front of card - Show role/football player */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-white text-black font-bold p-3 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-gray-600 mb-1">
            {playerRealName || 'Jugador'}
          </span>
          <div className="w-full h-px bg-gray-200 my-1"></div>
          <span className="text-lg font-bold">
            {role === "IMPOSTOR" ? (
              <span className="text-red-600">IMPOSTOR</span>
            ) : (
              <span className="text-green-600">{playerName || "INOCENTE"}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
