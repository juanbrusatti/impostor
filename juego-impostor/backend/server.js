const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  allowUpgrades: true
});

// Almacenamiento de salas en memoria del servidor
const rooms = new Map();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor del juego del impostor funcionando' });
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id, 'desde:', socket.handshake.address);

  // Crear una nueva sala
  socket.on('createRoom', ({ roomCode, hostName }) => {
    console.log('Intentando crear sala:', roomCode, 'por:', hostName);
    try {
      if (rooms.has(roomCode)) {
        console.log('Error: Sala ya existe:', roomCode);
        socket.emit('error', { message: 'La sala ya existe' });
        return;
      }

      const room = {
        id: roomCode,
        code: roomCode,
        host: hostName,
        players: [
          {
            id: socket.id,
            name: hostName,
            isHost: true,
            isReady: true
          }
        ],
        gameState: 'waiting',
        gameData: null
      };

      rooms.set(roomCode, room);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.playerId = socket.id;

      console.log(`Sala creada: ${roomCode} por ${hostName}`);
      socket.emit('roomCreated', room);
      socket.emit('roomUpdated', room);
    } catch (error) {
      console.error('Error al crear sala:', error);
      socket.emit('error', { message: error.message });
    }
  });

  // Unirse a una sala existente
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    console.log('Intentando unirse a sala:', roomCode, 'por:', playerName);
    try {
      const room = rooms.get(roomCode);
      if (!room) {
        console.log('Error: Sala no encontrada:', roomCode);
        socket.emit('error', { message: 'Sala no encontrada' });
        return;
      }

      if (room.gameState !== 'waiting') {
        console.log('Error: Juego ya comenzado en sala:', roomCode);
        socket.emit('error', { message: 'El juego ya ha comenzado' });
        return;
      }

      const newPlayer = {
        id: socket.id,
        name: playerName,
        isHost: false,
        isReady: true
      };

      room.players.push(newPlayer);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.playerId = socket.id;

      console.log(`${playerName} se unió a la sala ${roomCode}`);
      socket.emit('roomJoined', room);
      io.to(roomCode).emit('roomUpdated', room);
    } catch (error) {
      console.error('Error al unirse a sala:', error);
      socket.emit('error', { message: error.message });
    }
  });

  // Iniciar el juego
  socket.on('startGame', ({ gameConfig }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || !room.players.find(p => p.id === socket.id)?.isHost) {
      socket.emit('error', { message: 'No tienes permisos para iniciar el juego' });
      return;
    }

    room.gameState = 'playing';
    room.gameData = {
      ...gameConfig,
      roles: generateRoles(room.players.length, gameConfig.innocentCount, gameConfig.impostorCount),
      currentPlayerIndex: 0
    };

    console.log(`Juego iniciado en sala ${room.code}`);
    io.to(room.code).emit('gameStarted', room.gameData);
  });

  // Desconexión de un jugador
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        
        if (room.players.length === 0) {
          // Eliminar sala si no quedan jugadores
          rooms.delete(socket.roomCode);
          console.log(`Sala ${socket.roomCode} eliminada`);
        } else {
          // Si el host se fue, hacer host al siguiente jugador
          if (room.players[0].isHost === false) {
            room.players[0].isHost = true;
            room.host = room.players[0].name;
          }
          
          io.to(socket.roomCode).emit('roomUpdated', room);
          console.log(`Jugador removido de sala ${socket.roomCode}`);
        }
      }
    }
  });
});

// Función para generar roles
function generateRoles(totalPlayers, innocentCount, impostorCount) {
  const roles = [
    ...Array(innocentCount).fill('INOCENTE'),
    ...Array(impostorCount).fill('IMPOSTOR')
  ];
  
  // Mezclar los roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return roles;
}

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces

server.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Sitio web: http://localhost:${PORT}`);
  console.log(`Red local: http://192.168.100.13:${PORT}`);
});
