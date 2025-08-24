import { GAME_CONFIG, DOM } from './constants.js';
import { ImpostorGame } from './game.js';

export class GameUI {
  constructor() {
    this.game = new ImpostorGame();
    this.domElements = this._cacheDOM();
    this._bindEvents();
    this._checkForSavedGame();
  }

  // Cache DOM elements
  _cacheDOM() {
    return {
      playerInput: document.getElementById('playerInput'),
      startButton: document.getElementById('startButton'),
      resetButton: document.getElementById('resetButton'),
      cardsContainer: document.getElementById('cardsContainer'),
      gameInfo: document.getElementById('gameInfo'),
      roleDisplay: document.getElementById('roleDisplay'),
      playerCount: document.getElementById('playerCount'),
      gameContainer: document.querySelector('.game-container'),
      inputArea: document.querySelector('.input-area')
    };
  }

  // Bind event listeners
  _bindEvents() {
    console.log('Binding event listeners...');
    
    // Debug: Log the DOM elements
    console.log('DOM Elements:', this.domElements);
    
    // Verify start button exists
    if (!this.domElements.startButton) {
      console.error('Start button not found in DOM');
      return;
    }
    
    // Start button
    console.log('Adding click listener to start button');
    this.domElements.startButton.addEventListener('click', (e) => {
      console.log('Start button clicked');
      e.preventDefault();
      this._startGame().catch(error => {
        console.error('Error in _startGame:', error);
        this._showError(error.message || 'Error al iniciar el juego');
      });
    });
    
    // Reset button
    if (this.domElements.resetButton) {
      console.log('Adding click listener to reset button');
      this.domElements.resetButton.addEventListener('click', (e) => {
        console.log('Reset button clicked');
        e.preventDefault();
        this._resetGame();
      });
    } else {
      console.warn('Reset button not found in DOM');
    }
    
    // Load default players if available
    if (GAME_CONFIG.DEFAULT_PLAYERS.length > 0 && this.domElements.playerInput) {
      this.domElements.playerInput.value = GAME_CONFIG.DEFAULT_PLAYERS.join('\n');
      console.log('Loaded default players');
    } else if (!this.domElements.playerInput) {
      console.warn('Player input element not found in DOM');
    }
    
    console.log('Event listeners bound successfully');
  }

  // Check for saved game state
  _checkForSavedGame() {
    const hasSavedGame = this.game.loadGameState();
    if (hasSavedGame) {
      this._showGameScreen();
      this._renderCards();
    }
  }

  // Start a new game
  async _startGame() {
    console.log('Starting new game...');
    
    try {
      // Get player list from input
      const playerList = this._getPlayerList();
      console.log('Player list:', playerList);
      
      if (!playerList || playerList.length < 1) {
        throw new Error('Por favor ingresa al menos un jugador');
      }
      
      // Initialize the game with players
      this.game.initializeGame(playerList);
      console.log('Game initialized with players:', playerList);
      
      // Show game screen and animate cards
      this._showGameScreen();
      await this._animateCardDeal();
      this._updatePlayerCount();
      
      console.log('Game started successfully');
      return true;
    } catch (error) {
      console.error('Error in _startGame:', error);
      this._showError(error.message || 'Error al iniciar el juego');
      throw error; // Re-throw to be caught by the click handler
    }
  }

  // Reset the game
  _resetGame() {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
      this.game.clearGameState();
      this._showInputScreen();
    }
  }

  // Get player list from textarea
  _getPlayerList() {
    console.log('Getting player list...');
    
    if (!this.domElements.playerInput) {
      console.error('Player input element not found');
      throw new Error('Error: No se pudo encontrar el campo de entrada de jugadores');
    }
    
    const input = this.domElements.playerInput.value;
    console.log('Raw input:', input);
    
    if (!input || !input.trim()) {
      console.error('No input provided');
      throw new Error(GAME_CONFIG.MESSAGES.INVALID_INPUT);
    }
    
    const players = input
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
      
    console.log('Parsed players:', players);
    return players;
  }

  // Show game screen and hide input screen
  _showGameScreen() {
    this.domElements.inputArea.classList.add('hidden');
    this.domElements.gameContainer.classList.remove('hidden');
    this.domElements.gameInfo.textContent = GAME_CONFIG.MESSAGES.GAME_STARTED;
  }

  // Show input screen and hide game screen
  _showInputScreen() {
    this.domElements.inputArea.classList.remove('hidden');
    this.domElements.gameContainer.classList.add('hidden');
    this.domElements.cardsContainer.innerHTML = '';
  }

  // Render game cards
  async _renderCards() {
    this.domElements.cardsContainer.innerHTML = '';
    const playerCount = this.game.getPlayerCount();
    
    for (let i = 0; i < playerCount; i++) {
      const card = this._createCard(i);
      this.domElements.cardsContainer.appendChild(card);
      
      // Add slight delay for animation
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Create a card element
  _createCard(playerIndex) {
    const card = document.createElement('div');
    card.className = 'card fade-in';
    
    const role = this.game.getPlayerRole(playerIndex);
    const isImpostor = role.type === 'IMPOSTOR';
    
    card.innerHTML = `
      <div class="card-face card-back">${playerIndex + 1}</div>
      <div class="card-face card-front ${isImpostor ? 'impostor' : ''}">
        <div class="role-type">${role.type}</div>
        <div class="role-details">${role.role}</div>
        ${role.description ? `<div class="role-hint">${role.description}</div>` : ''}
      </div>
    `;
    
    // Add click handler to flip card
    card.addEventListener('click', () => this._handleCardClick(card, playerIndex));
    
    return card;
  }

  // Handle card click
  _handleCardClick(card, playerIndex) {
    if (card.classList.contains('flipped')) {
      return; // Already flipped
    }
    
    card.classList.add('flipped');
    this.game.nextPlayer();
    this._updatePlayerCount();
    
    // If game is over, show reset button
    if (this.game.isGameOver()) {
      this._showGameComplete();
    }
  }

  // Animate card dealing
  async _animateCardDeal() {
    this.domElements.cardsContainer.innerHTML = '';
    const playerCount = this.game.getPlayerCount();
    
    for (let i = 0; i < playerCount; i++) {
      const card = this._createCard(i);
      this.domElements.cardsContainer.appendChild(card);
      await new Promise(resolve => setTimeout(resolve, GAME_CONFIG.CARD_ANIMATION_DELAY));
    }
  }

  // Update player count display
  _updatePlayerCount() {
    const currentPlayer = this.game.getCurrentPlayer();
    const playerIndex = this.game.players.indexOf(currentPlayer) + 1;
    const totalPlayers = this.game.getPlayerCount();
    
    this.domElements.playerCount.textContent = `Jugador ${playerIndex} de ${totalPlayers}`;
  }

  // Show game complete message
  _showGameComplete() {
    const secretPlayer = this.game.getSecretPlayer();
    this.domElements.gameInfo.innerHTML = `
      <h2>¡Juego Terminado!</h2>
      <p>El jugador secreto era: <strong>${secretPlayer}</strong></p>
      <button id="playAgain" class="secondary">Jugar de nuevo</button>
    `;
    
    document.getElementById('playAgain').addEventListener('click', () => {
      this.game.clearGameState();
      this._showInputScreen();
    });
  }

  // Show error message
  _showError(message) {
    alert(message);
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gameUI = new GameUI();
  window.gameUI = gameUI; // Make it accessible from console for debugging
});
