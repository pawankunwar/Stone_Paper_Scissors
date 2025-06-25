class RockPaperScissorsGame {
    constructor() {
        this.sessionId = null;
        this.gameSession = null;
        this.audioContext = null;
        this.celebrationTimeout = null;
        this.initializeAudio();
        this.initializeEventListeners();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }

        // Enable audio on first click
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    initializeEventListeners() {
        // Name input listeners
        const player1Input = document.getElementById('player1Name');
        const player2Input = document.getElementById('player2Name');
        const startButton = document.getElementById('startGameButton');

        player1Input.addEventListener('input', () => this.checkNames());
        player2Input.addEventListener('input', () => this.checkNames());
        
        player1Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') player2Input.focus();
        });
        
        player2Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !startButton.disabled) this.startGame();
        });

        startButton.addEventListener('click', () => this.startGame());

        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleChoice(e.target));
        });

        // Next buttons
        document.getElementById('player1Next').addEventListener('click', () => this.switchToPlayer2());
        document.getElementById('player2Next').addEventListener('click', () => this.startCountdown());

        // Play again button
        document.getElementById('playAgainButton').addEventListener('click', () => this.startNewRound());

        // Reset button
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());

        // Initial check
        this.checkNames();
    }

    checkNames() {
        const player1Name = document.getElementById('player1Name').value.trim();
        const player2Name = document.getElementById('player2Name').value.trim();
        const startButton = document.getElementById('startGameButton');

        if (player1Name.length > 0 && player2Name.length > 0) {
            startButton.disabled = false;
            startButton.style.opacity = '1';
        } else {
            startButton.disabled = true;
            startButton.style.opacity = '0.6';
        }
    }

    async startGame() {
        const player1Name = document.getElementById('player1Name').value.trim();
        const player2Name = document.getElementById('player2Name').value.trim();

        if (!player1Name || !player2Name) {
            this.showError('Please enter both player names!');
            return;
        }

        try {
            this.showLoading(true);
            
            // Create new game session
            const newGameResponse = await fetch('/api/game/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!newGameResponse.ok) throw new Error('Failed to create game');
            
            const gameSession = await newGameResponse.json();
            this.sessionId = gameSession.sessionId;

            // Initialize players
            const playersResponse = await fetch(`/api/game/${this.sessionId}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player1Name: player1Name,
                    player2Name: player2Name
                })
            });

            if (!playersResponse.ok) throw new Error('Failed to initialize players');
            
            this.gameSession = await playersResponse.json();
            this.updateUI();
            
            this.showLoading(false);
            
        } catch (error) {
            this.showLoading(false);
            this.showError('Failed to start game: ' + error.message);
        }
    }

    async handleChoice(button) {
        const player = button.dataset.player;
        const choice = button.dataset.choice;
        const playerNumber = parseInt(player);

        console.log(`Player ${playerNumber} chose ${choice}`);

        // Visual feedback
        document.querySelectorAll(`[data-player="${player}"]`).forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');

        try {
            const response = await fetch(`/api/game/${this.sessionId}/choice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerNumber: playerNumber,
                    choice: choice
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to make choice: ${errorText}`);
            }
            
            this.gameSession = await response.json();
            console.log('Updated game session after choice:', this.gameSession);
            
            this.updateChoiceDisplay(playerNumber, choice);
            
            if (playerNumber === 1) {
                document.getElementById('player1Next').style.display = 'block';
            } else {
                document.getElementById('player2Next').style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error making choice:', error);
            this.showError('Failed to make choice: ' + error.message);
        }
    }

    switchToPlayer2() {
        document.getElementById('gameStatus').textContent = `${this.gameSession.player2.name}, make your choice!`;
        document.getElementById('player1Panel').classList.add('hidden');
        document.getElementById('player2Panel').classList.remove('hidden');
    }

    startCountdown() {
        document.getElementById('player2Panel').classList.add('hidden');
        document.getElementById('countdownContainer').classList.add('active');
        document.getElementById('gameStatus').textContent = 'Get ready for battle!';

        let count = 3;
        const countdownElement = document.getElementById('countdownNumber');
        const handElement = document.getElementById('handAnimation');
        
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = count;
            countdownElement.style.animation = 'none';
            setTimeout(() => {
                countdownElement.style.animation = 'pulse 1s ease-in-out';
            }, 10);

            // Animate hand
            if (count === 3) handElement.textContent = '✊';
            else if (count === 2) handElement.textContent = '✋';
            else if (count === 1) handElement.textContent = '✌️';

            count--;

            if (count < 0) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                    this.showBattle();
                }, 500);
            }
        }, 1000);
    }

    async showBattle() {
        try {
            console.log('Starting battle with session:', this.sessionId);
            
            // Play the round
            const response = await fetch(`/api/game/${this.sessionId}/play`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to play round: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('Battle result received:', result);
            
            // Hide countdown and show battle screen
            document.getElementById('countdownContainer').classList.remove('active');
            document.getElementById('battleScreen').classList.add('active');
            
            // Update game session to get latest player data
            await this.updateGameSession();
            
            // Display choices and result
            this.displayBattleResult(result);
            
            // Start victory celebration
            setTimeout(() => {
                this.startVictoryCelebration(result);
                if (!result.tie && result.winner) {
                    setTimeout(() => {
                        this.animateMiddleFinger(result);
                    }, 1000);
                }
            }, 500);
            
        } catch (error) {
            console.error('Error in showBattle:', error);
            this.showError('Failed to show battle result: ' + error.message);
        }
    }

    displayBattleResult(result) {
        const player1 = this.gameSession.player1;
        const player2 = this.gameSession.player2;
        
        console.log('Displaying battle result:', result);
        console.log('Player 1:', player1);
        console.log('Player 2:', player2);
        
        document.getElementById('player1BattleName').textContent = player1.name;
        document.getElementById('player1Display').textContent = this.getChoiceEmoji(player1.choice);
        document.getElementById('player1ChoiceText').textContent = this.capitalizeFirst(this.getChoiceName(player1.choice));
        
        document.getElementById('player2BattleName').textContent = player2.name;
        document.getElementById('player2Display').textContent = this.getChoiceEmoji(player2.choice);
        document.getElementById('player2ChoiceText').textContent = this.capitalizeFirst(this.getChoiceName(player2.choice));
        
        document.getElementById('battleResult').textContent = result.message;
    }

    async updateGameSession() {
        try {
            const response = await fetch(`/api/game/${this.sessionId}`);
            if (response.ok) {
                this.gameSession = await response.json();
                this.updateScores();
            }
        } catch (error) {
            console.error('Failed to update game session:', error);
        }
    }

    updateScores() {
        if (this.gameSession) {
            document.getElementById('player1Score').textContent = this.gameSession.player1.score;
            document.getElementById('player2Score').textContent = this.gameSession.player2.score;
        }
    }

    updateChoiceDisplay(playerNumber, choice) {
        const emoji = this.getChoiceEmoji(choice);
        const text = `Selected: ${emoji} ${this.capitalizeFirst(choice)}`;
        
        if (playerNumber === 1) {
            document.getElementById('player1Choice').textContent = text;
        } else {
            document.getElementById('player2Choice').textContent = text;
        }
    }

    updateUI() {
        if (!this.gameSession) return;

        // Update player names
        document.getElementById('player1NameDisplay').textContent = this.gameSession.player1.name;
        document.getElementById('player2NameDisplay').textContent = this.gameSession.player2.name;
        document.getElementById('player1PanelName').textContent = this.gameSession.player1.name;
        document.getElementById('player2PanelName').textContent = this.gameSession.player2.name;
        document.getElementById('player1BattleName').textContent = this.gameSession.player1.name;
        document.getElementById('player2BattleName').textContent = this.gameSession.player2.name;

        // Update scores
        this.updateScores();

        // Show game area
        document.getElementById('nameInputScreen').classList.add('hidden');
        document.getElementById('gameArea').classList.add('active');
        
        // Set initial status
        document.getElementById('gameStatus').textContent = `${this.gameSession.player1.name}, make your choice!`;
    }

    async startNewRound() {
        try {
            this.stopVictoryCelebration();
            
            const response = await fetch(`/api/game/${this.sessionId}/new-round`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to start new round');
            
            this.gameSession = await response.json();
            
            // Reset UI
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            document.getElementById('player1Choice').textContent = 'Choose your weapon!';
            document.getElementById('player2Choice').textContent = 'Choose your weapon!';
            document.getElementById('player1Next').style.display = 'none';
            document.getElementById('player2Next').style.display = 'none';
            document.getElementById('battleScreen').classList.remove('active');
            
            document.getElementById('player1Panel').classList.remove('hidden');
            document.getElementById('player2Panel').classList.add('hidden');
            document.getElementById('gameStatus').textContent = `${this.gameSession.player1.name}, make your choice!`;
            
        } catch (error) {
            this.showError('Failed to start new round: ' + error.message);
        }
    }

    async resetGame() {
        try {
            this.stopVictoryCelebration();
            
            if (this.sessionId) {
                await fetch(`/api/game/${this.sessionId}/reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // Reset UI to initial state
            document.getElementById('gameArea').classList.remove('active');
            document.getElementById('nameInputScreen').classList.remove('hidden');
            
            document.getElementById('player1Name').value = '';
            document.getElementById('player2Name').value = '';
            document.getElementById('startGameButton').disabled = true;
            
            this.sessionId = null;
            this.gameSession = null;
            
        } catch (error) {
            this.showError('Failed to reset game: ' + error.message);
        }
    }

    startVictoryCelebration(result) {
        if (result.tie) return;
        
        const discoLights = document.getElementById('discoLights');
        discoLights.classList.add('active');
        
        const battleScreen = document.getElementById('battleScreen');
        battleScreen.classList.add('victory-celebration');
        
        this.playClappingSound();
        
        this.celebrationTimeout = setTimeout(() => {
            this.stopVictoryCelebration();
        }, 4000);
    }

    stopVictoryCelebration() {
        const discoLights = document.getElementById('discoLights');
        const battleScreen = document.getElementById('battleScreen');
        
        discoLights.classList.remove('active');
        battleScreen.classList.remove('victory-celebration');
        
        if (this.celebrationTimeout) {
            clearTimeout(this.celebrationTimeout);
            this.celebrationTimeout = null;
        }
    }

    playClappingSound() {
        if (!this.audioContext) return;

        const claps = 6;
        const clapInterval = 0.15;

        for (let i = 0; i < claps; i++) {
            setTimeout(() => {
                this.createClapSound();
            }, i * clapInterval * 1000);
        }
    }

    createClapSound() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        noise.start(now);
        noise.stop(now + 0.1);
    }

    animateMiddleFinger(result) {
        if (result.tie || !result.winner) return;
        
        const middleFingerEmoji = document.getElementById('middleFingerEmoji');
        
        // Determine winner and loser elements based on result
        let winnerElement, loserElement;
        
        if (result.winner.name === this.gameSession.player1.name) {
            winnerElement = document.getElementById('player1BattleDisplay');
            loserElement = document.getElementById('player2BattleDisplay');
        } else {
            winnerElement = document.getElementById('player2BattleDisplay');
            loserElement = document.getElementById('player1BattleDisplay');
        }
        
        const winnerRect = winnerElement.getBoundingClientRect();
        const loserRect = loserElement.getBoundingClientRect();
        
        // Position emoji at winner's location (adjusted for 4em size)
        middleFingerEmoji.style.left = (winnerRect.left + winnerRect.width / 2 - 32) + 'px';
        middleFingerEmoji.style.top = (winnerRect.top + winnerRect.height / 2 - 32) + 'px';
        
        // Calculate the path to loser
        const deltaX = (loserRect.left + loserRect.width / 2) - (winnerRect.left + winnerRect.width / 2);
        const deltaY = (loserRect.top + loserRect.height / 2) - (winnerRect.top + winnerRect.height / 2);
        
        // Create custom animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flyToLoser {
                0% {
                    transform: scale(0.5) rotate(-45deg) translate(0, 0);
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                    transform: scale(1.2) rotate(0deg) translate(0, 0);
                }
                80% {
                    opacity: 1;
                    transform: scale(1) rotate(15deg) translate(${deltaX}px, ${deltaY}px);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.8) rotate(45deg) translate(${deltaX}px, ${deltaY}px);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Start animation
        middleFingerEmoji.style.animation = 'flyToLoser 2s ease-in-out forwards';
        middleFingerEmoji.classList.add('flying');
        
        // Clean up
        setTimeout(() => {
            middleFingerEmoji.style.animation = '';
            middleFingerEmoji.classList.remove('flying');
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 2000);
    }

    getChoiceEmoji(choice) {
        if (!choice) return '';
        
        // Handle backend Choice enum structure - choice is returned as string like "ROCK", "PAPER", "SCISSORS"
        const emojis = {
            'ROCK': '🪨',
            'PAPER': '📄',
            'SCISSORS': '✂️',
            'rock': '🪨',
            'paper': '📄',
            'scissors': '✂️'
        };
        
        // If choice is a string (from backend)
        if (typeof choice === 'string') {
            return emojis[choice.toUpperCase()] || emojis[choice.toLowerCase()] || '';
        }
        
        // If choice is an object with emoji property
        if (choice && choice.emoji) {
            return choice.emoji;
        }
        
        // If choice is an object with name property
        if (choice && choice.name) {
            return emojis[choice.name.toUpperCase()] || emojis[choice.name.toLowerCase()] || '';
        }
        
        return '';
    }

    getChoiceName(choice) {
        if (!choice) return '';
        
        // Handle backend Choice enum structure - choice is returned as string like "ROCK", "PAPER", "SCISSORS"
        if (typeof choice === 'string') {
            return choice.toLowerCase();
        }
        
        // Handle object with name property
        if (choice && choice.name) {
            return choice.name.toLowerCase();
        }
        
        return '';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showLoading(show) {
        const startButton = document.getElementById('startGameButton');
        if (show) {
            startButton.innerHTML = '<span class="loading"></span> Starting...';
            startButton.disabled = true;
        } else {
            startButton.innerHTML = '🚀 Start Game!';
            this.checkNames();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const container = document.querySelector('.game-container');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissorsGame();
});
