// Game configurations
export const GAME_CONFIG = {
  MIN_PLAYERS: 5,
  MAX_PLAYERS: 10,
  INNOCENT_COUNT: 4, // Number of innocent players (will have the same player)
  IMPOSTOR_COUNT: 1, // Number of impostors
  
  // UI Messages
  MESSAGES: {
    NOT_ENOUGH_PLAYERS: (min) => `¡Se necesitan al menos ${min} jugadores para comenzar!`,
    TOO_MANY_PLAYERS: (max) => `El número máximo de jugadores es ${max}.`,
    INVALID_INPUT: 'Por favor ingresa al menos un jugador.',
    GAME_STARTED: '¡El juego ha comenzado! Haz clic en las cartas para revelar los roles.',
    
    // Role descriptions
    ROLE_DESCRIPTIONS: {
      INNOCENT: 'Eres un Inocente. Tu objetivo es descubrir al impostor sin revelar directamente el nombre del jugador.',
      IMPOSTOR: '¡Eres el Impostor! No sabes quién es el jugador secreto. Intenta descubrirlo sin que te atrapen.'
    }
  },
  
  // Visual settings
  CARD_ANIMATION_DELAY: 100, // ms between card animations
  
  // Default player list (can be overridden by user input)
  DEFAULT_PLAYERS: [
    'Lionel Messi',
    'Cristiano Ronaldo',
    'Kylian Mbappé',
    'Neymar Jr',
    'Robert Lewandowski',
    'Kevin De Bruyne',
    'Erling Haaland',
    'Karim Benzema',
    'Mohamed Salah',
    'Vinicius Junior'
  ]
};

// DOM Elements
export const DOM = {
  // Input elements
  PLAYER_INPUT: 'playerInput',
  START_BUTTON: 'startButton',
  RESET_BUTTON: 'resetButton',
  CARDS_CONTAINER: 'cardsContainer',
  GAME_INFO: 'gameInfo',
  ROLE_DISPLAY: 'roleDisplay',
  
  // Class names
  CLASSES: {
    HIDDEN: 'hidden',
    FLIPPED: 'flipped',
    IMPOSTOR: 'impostor',
    CARD: 'card',
    CARD_FRONT: 'card-front',
    CARD_BACK: 'card-back'
  }
};

// Game state keys
export const GAME_STATE = {
  ROLES: 'game_roles',
  CURRENT_PLAYER: 'current_player_index'
};

// Local storage keys
export const STORAGE_KEYS = {
  PLAYER_LIST: 'impostor_game_players',
  GAME_STATE: 'impostor_game_state'
};
