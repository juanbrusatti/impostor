'use client';

import { useState, useEffect } from 'react';
import roomService from '@/utils/roomService';

export const RoomManager = ({ onJoinRoom, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Verificar estado de conexión
    const checkConnection = () => {
      if (roomService.isConnected()) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTestConnection = () => {
    console.log('🔍 Probando conexión manualmente...');
    roomService.connect();
    
    // Verificar conexión después de 3 segundos
    setTimeout(() => {
      if (roomService.isConnected()) {
        setConnectionStatus('connected');
        console.log('✅ Conexión exitosa');
      } else {
        setConnectionStatus('disconnected');
        console.log('❌ Conexión fallida');
      }
    }, 3000);
  };

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    setIsCreating(true);
    try {
      // Generar un código de sala aleatorio de 6 caracteres
      const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await onJoinRoom(newRoomCode, playerName, true); // true indica que es el creador
    } catch (error) {
      console.error('Error al crear sala:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) {
      alert('Por favor ingresa el código de la sala y tu nombre');
      return;
    }
    try {
      await onJoinRoom(roomCode.toUpperCase(), playerName, false); // false indica que no es el creador
    } catch (error) {
      console.error('Error al unirse a sala:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Sala Online</h2>
      
      {/* Indicador de estado de conexión */}
      <div className="mb-6 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
          connectionStatus === 'connected' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-white' : 'bg-white'
          }`}></div>
          {connectionStatus === 'connected' ? 'Conectado al servidor' : 'Desconectado del servidor'}
        </div>
        
        <button
          onClick={handleTestConnection}
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
        >
          Probar conexión
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Nombre del jugador */}
        <div>
          <label className="block text-sm font-medium mb-2">Tu nombre</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef]"
            maxLength={20}
          />
        </div>

        {/* Crear sala */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Crear una nueva sala</h3>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full p-4 rounded-lg bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Creando sala...' : 'Crear Sala'}
          </button>
        </div>

        {/* Separador */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-white/60 text-sm">o</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Unirse a sala */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Unirse a una sala existente</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Código de la sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              className="w-full p-3 rounded-lg bg-[#111528] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4cafef] text-center text-lg font-mono"
              maxLength={6}
            />
          </div>
          <button
            onClick={handleJoinRoom}
            className="w-full p-4 rounded-lg bg-[#4cafef] hover:bg-[#3196e8] text-white font-semibold transition-colors"
          >
            Unirse a Sala
          </button>
        </div>

        {/* Botón volver */}
        <button
          onClick={onBack}
          className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};
