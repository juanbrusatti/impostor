import { io } from 'socket.io-client';

// Servicio de salas online usando Socket.IO
class SocketRoomService {
  constructor() {
    this.socket = null;
    this.currentPlayer = null;
    this.currentRoom = null;
    this.listeners = new Map();
    this.serverUrl = this.getServerUrl();
  }

  // Obtener la URL del servidor dinámicamente
  getServerUrl() {
    // Si estamos en desarrollo, usar localhost
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = '3001';
      
      // Si estamos accediendo desde una IP (no localhost), usar esa IP
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:${port}`;
      }
    }
    
    // Por defecto, usar localhost
    return 'http://localhost:3001';
  }

  // Conectar al servidor
  connect() {
    if (this.socket) return;

    console.log('Conectando a:', this.serverUrl);
    this.socket = io(this.serverUrl, {
      transports: ['polling', 'websocket'], // Intentar polling primero
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      forceNew: true
    });
    
    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor:', this.serverUrl);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del servidor. Razón:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Error del servidor:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconectado después de', attemptNumber, 'intentos');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Error de reconexión:', error);
    });
  }

  // Desconectar del servidor
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Crear una nueva sala
  createRoom(roomCode, hostName) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        this.connect();
      }

      this.socket.emit('createRoom', { roomCode, hostName });

      this.socket.once('roomCreated', (room) => {
        this.currentRoom = room;
        this.currentPlayer = room.players.find(p => p.id === this.socket.id);
        resolve(room);
      });

      this.socket.once('error', (error) => {
        reject(new Error(error.message));
      });
    });
  }

  // Unirse a una sala existente
  joinRoom(roomCode, playerName) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        this.connect();
      }

      this.socket.emit('joinRoom', { roomCode, playerName });

      this.socket.once('roomJoined', (room) => {
        this.currentRoom = room;
        this.currentPlayer = room.players.find(p => p.id === this.socket.id);
        resolve(room);
      });

      this.socket.once('error', (error) => {
        reject(new Error(error.message));
      });
    });
  }

  // Salir de una sala
  leaveRoom() {
    if (this.socket) {
      this.socket.emit('leaveRoom');
    }
    this.currentRoom = null;
    this.currentPlayer = null;
  }

  // Iniciar el juego
  startGame(gameConfig) {
    if (!this.socket || !this.currentRoom) return;

    this.socket.emit('startGame', { gameConfig });
  }

  // Suscribirse a eventos de la sala
  subscribeToRoom(roomCode, callback) {
    if (!this.socket) return;

    // Limpiar listeners anteriores
    this.socket.off('roomUpdated');
    this.socket.off('gameStarted');

    // Suscribirse a nuevos eventos
    this.socket.on('roomUpdated', (room) => {
      if (room.code === roomCode) {
        this.currentRoom = room;
        this.currentPlayer = room.players.find(p => p.id === this.socket.id);
        callback('roomUpdated', room);
      }
    });

    this.socket.on('gameStarted', (gameData) => {
      callback('gameStarted', gameData);
    });
  }

  // Desuscribirse de eventos de la sala
  unsubscribeFromRoom() {
    if (this.socket) {
      this.socket.off('roomUpdated');
      this.socket.off('gameStarted');
    }
  }

  // Obtener sala actual
  getCurrentRoom() {
    return this.currentRoom;
  }

  // Obtener jugador actual
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  // Verificar si está conectado
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Instancia singleton
const socketRoomService = new SocketRoomService();
export default socketRoomService;
