"use client";

import { useState } from "react";
import CardFullScreen from "@/components/CardFullScreen";
import VotingScreen from "@/components/VotingScreen";
import { PresetSelector } from "@/components/PresetSelector";
import { GameModeSelector } from "@/components/GameModeSelector";
import { RoleSelector } from "@/components/RoleSelector";
import { getPresetById } from "@/data/playerPresets";

/** 
 *
 * - CardFullScreen: Muestra una carta en pantalla completa
 * - VotingScreen: Muestra una pantalla de votación
 * - PresetSelector: Muestra un selector de preajustes
 * - GameModeSelector: Muestra un selector de modo de juego
 * - RoleSelector: Muestra un selector de roles
 * - Home: Es el componente principal de la página de inicio
 * 
 * Cada uno de estos componentes tiene su propio estado y comportamiento.
 * 
 * - showVoting: indica si se muestra el componente de votación (VotingScreen) o no.
 * - preset: el preset seleccionado por el usuario. Si no se selecciona ninguno, es null.
 * - numPlayers: el número de jugadores seleccionado por el usuario. Si no se selecciona
 *   ninguno, es null.
 * - gameMode: el modo de juego seleccionado por el usuario. Si no se selecciona ninguno,
 *   es null.
 * - roles: los roles de los jugadores, junto con su nombre y foto. Si no se han
 *   seleccionado roles, es un array vacío.
 * - selectedImpostor: el nombre del jugador impostor seleccionado por el usuario. Si
 *   no se ha seleccionado ninguno, es null.
 * - currentPlayer: el nombre del jugador actual que está siendo revelado.
 * - innocentCount: el número de jugadores inocentes seleccionado por el usuario.
 * - impostorCount: el número de jugadores impostores seleccionado por el usuario.
 * - playerNames: los nombres de los jugadores seleccionados por el usuario.
 * - currentCardIndex: el índice de la carta actual que está siendo revelada.
 * - revealedCards: un array con los índices de las cartas que ya han sido reveladas.
 * - isShuffling: un booleano que indica si se está mezclando el orden de las cartas.
 * - shuffleKey: una clave que se usa para forzar la re-renderización de las cartas.
 */

export default function Home() {
  const [showVoting, setShowVoting] = useState(false);
  // Determinar el nombre del impostor (después de inicializar roles)
  const [view, setView] = useState("mode-selection"); // 'mode-selection' | 'role-selection' | 'game-selection' | 'custom-list' | 'playing'
  const [gameMode, setGameMode] = useState("selection"); // 'selection' | 'custom' | 'playing'
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [playersInput, setPlayersInput] = useState("");
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [innocentCount, setInnocentCount] = useState(4);
  // Estado para navegación de cartas en modo pantalla completa
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealedCards, setRevealedCards] = useState([]);
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
      setView('custom-list'); // Go directly to custom list view
    } else {
      setView('game-selection');
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

  // Cuando se revela una carta (swipe)
  const handleCardReveal = (index) => {
    setRevealedCards((prev) => {
      if (!prev.includes(index)) {
        return [...prev, index];
      }
      return prev;
    });
  };

  // Navegar a la siguiente carta
  const handleNextCard = () => {
    if (currentCardIndex + 1 < roles.length) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Fin del juego, volver a selección o mostrar resultado
      setView('game-selection');
      setGameMode('selection');
      setCurrentCardIndex(0);
      setRevealedCards([]);
    }
  };

  const startGameWithPlayer = (player, names = []) => {
    setCurrentPlayer(player);
  setCurrentCardIndex(0);
  setRevealedCards([]); // Reset revealed cards when starting a new game
    
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

  // Reinicia el juego con nuevos roles y jugador aleatorio, sin volver atrás
  const restartGame = () => {
    // Recalcular roles y jugador aleatorio
    const rolesArray = [
      ...Array(innocentCount).fill("INOCENTE"),
      ...Array(impostorCount).fill("IMPOSTOR")
    ];
    const shuffledRoles = shuffle(rolesArray);
    let availablePlayers = [];
    if (selectedPreset?.players?.length > 0) {
      availablePlayers = [...selectedPreset.players];
    } else if (playersInput) {
      availablePlayers = playersInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (availablePlayers.length === 0) {
      availablePlayers = [
        'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Lewandowski',
        'Benzema', 'Salah', 'Haaland', 'De Bruyne', 'Modrić'
      ];
    }
    const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    let currentPlayerNames = playerNames;
    if (typeof window !== 'undefined') {
      const savedNames = localStorage.getItem('playerNames');
      if (savedNames) {
        currentPlayerNames = JSON.parse(savedNames);
      }
    }
    if (!currentPlayerNames || currentPlayerNames.length === 0) {
      currentPlayerNames = Array(innocentCount + impostorCount).fill('').map((_, i) => `Jugador ${i + 1}`);
    }
    const playersWithRoles = shuffledRoles.map((role, index) => {
      if (role === 'IMPOSTOR') {
        return {
          role,
          name: 'IMPOSTOR',
          playerRole: 'IMPOSTOR',
          isImpostor: true,
          realName: currentPlayerNames[index] || `Jugador ${index + 1}`
        };
      }
      return {
        role,
        name: randomPlayer,
        playerRole: 'INOCENTE',
        isImpostor: false,
        realName: currentPlayerNames[index] || `Jugador ${index + 1}`
      };
    });
    setRoles(playersWithRoles);
    setCurrentCardIndex(0);
    setRevealedCards([]);
    // Mantener la vista en playing
    setGameMode('playing');
  }

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
      <div className="min-h-screen bg-[#1e1e2f] text-white p-4 flex flex-col">
        <header className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">¿Quién es el impostor?</h1>
          <p className="text-sm sm:text-base text-gray-300">Toca una carta para ver el rol</p>
        </header>
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

    {view === 'custom-list' && (
      <div className="w-full max-w-lg mt-8">
        <button
          onClick={() => setView('game-selection')}
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Personalizar Lista</h2>
        <p className="opacity-80 mb-6 text-center">
          Escribí <b>futbolistas</b> (uno por línea).
          <br />
        </p>
        
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

    {gameMode === 'playing' && roles.length > 0 && (
      <>
        {!showVoting ? (
          <CardFullScreen
            key={currentCardIndex}
            index={currentCardIndex}
            total={roles.length}
            role={roles[currentCardIndex].role}
            playerName={roles[currentCardIndex].name}
            playerRealName={roles[currentCardIndex].realName}
            onReveal={handleCardReveal}
            onNext={handleNextCard}
            onRestart={() => {
              restartGame();
              setShowVoting(false);
            }}
            showVoteButton={revealedCards.length === roles.length}
            onVote={() => setShowVoting(true)}
          />
        ) : (
          (() => {
            const impostorRole = roles.find(r => r.role === "IMPOSTOR");
            const impostorName = impostorRole ? impostorRole.realName : "";
            return (
              <VotingScreen
                players={roles.map(r => r.realName)}
                impostorName={impostorName}
                onFinish={() => {
                  setShowVoting(false);
                  setView('game-selection');
                  setGameMode('selection');
                }}
                onRestart={() => {
                  restartGame();
                  setShowVoting(false);
                }}
              />
            );
          })()
        )}
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
function Card({ index, role, playerName, playerRole, playerRealName, onFlip }) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    const newFlipped = !flipped;
    setFlipped(newFlipped);
    if (newFlipped && onFlip) {
      onFlip(index);
    }
  };

  return (
    <div
      className="w-28 h-44 sm:w-32 sm:h-48 perspective cursor-pointer select-none"
      onClick={handleClick}
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
