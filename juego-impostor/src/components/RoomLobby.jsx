'use client';

import { useState, useEffect } from 'react';

export const RoomLobby = ({ roomCode, players, isHost, onStartGame, onLeaveRoom }) => {
  const [copied, setCopied] = useState(false);
  const [gameStarting, setGameStarting] = useState(false);

  // Limpiar estado cuando el componente se desmonte o cambie
  useEffect(() => {
    return () => {
      setGameStarting(false);
    };
  }, []);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleStartGame = () => {
    setGameStarting(true);
    console.log('🎮 Iniciando juego...');
    onStartGame();
    
    // Resetear el estado después de 5 segundos (más tiempo para debug)
    setTimeout(() => {
      if (gameStarting) {
        console.log('⚠️ Tiempo de espera agotado, reseteando estado');
        setGameStarting(false);
      }
    }, 5000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Sala: {roomCode}</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-[#2a2a3c] px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-300">Código de sala</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-[#4cafef]">{roomCode}</span>
              <button
                onClick={copyRoomCode}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copiar código"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="bg-[#2a2a3c] rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Jugadores ({players.length})
        </h3>
        
        {players.length === 0 ? (
          <p className="text-center text-gray-400">Esperando jugadores...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-[#1e1e2f] rounded-lg"
              >
                <div className="w-8 h-8 bg-[#4cafef] rounded-full flex items-center justify-center text-white font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-400">
                    {player.isHost ? '👑 Anfitrión' : 'Jugador'}
                  </div>
                </div>
                {player.isReady && (
                  <div className="text-green-400">✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={players.length < 2 || gameStarting}
            className="flex-1 p-4 rounded-lg bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameStarting ? 'Iniciando...' : players.length < 2 ? 'Se necesitan al menos 2 jugadores' : 'Iniciar Juego'}
          </button>
        )}
        
        <button
          onClick={onLeaveRoom}
          className="flex-1 p-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          {isHost ? 'Cerrar Sala' : 'Salir de la Sala'}
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 text-center text-sm text-gray-400">
        {isHost ? (
          <p>Comparte el código de la sala con tus amigos para que se unan</p>
        ) : (
          <div>
            <p>Espera a que el anfitrión inicie el juego</p>
            {gameStarting && (
              <p className="text-[#4cafef] font-medium mt-2">🎮 El juego está iniciando...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
