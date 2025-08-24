document.addEventListener('DOMContentLoaded', () => {
    const playersInput = document.getElementById('players');
    const startButton = document.getElementById('startButton');
    const cardsContainer = document.getElementById('cards');
    
    let roles = [];

    startButton.addEventListener('click', startGame);

    function startGame() {
        const input = playersInput.value.trim();
        
        // Validar entrada
        if (!input) {
            alert('Por favor ingresa al menos un jugador.');
            return;
        }

        const players = input.split('\n')
            .map(p => p.trim())
            .filter(p => p);
            
        if (players.length === 0) {
            alert('La lista está vacía.');
            return;
        }

        // Seleccionar un jugador al azar
        const chosenPlayer = players[Math.floor(Math.random() * players.length)];
        
        // Crear roles (4 inocentes con chosenPlayer + 1 impostor)
        roles = [
            chosenPlayer, 
            chosenPlayer, 
            chosenPlayer, 
            chosenPlayer, 
            'IMPOSTOR'
        ];
        
        // Mezclar roles
        roles = shuffleArray(roles);

        // Renderizar cartas
        renderCards();
    }

    function renderCards() {
        cardsContainer.innerHTML = '';
        
        roles.forEach((role, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-face card-back">?</div>
                <div class="card-face card-front">${role}</div>
            `;
            
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            
            cardsContainer.appendChild(card);
        });
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});
