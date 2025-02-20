const menuScreen = document.getElementById('landing-page');
        const gameArea = document.getElementById('game-container');
        const board = document.getElementById('gameboard');
        const timeCounter = document.getElementById('timer');
        const moveCounter = document.getElementById('score');
        const messageDisplay = document.getElementById('message');

        let iconSets = {
            fruits: ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🥝'],
            emojis: ['😀', '😂', '😎', '😍', '🤩', '😡', '😭', '😱'],
            animals: ['🐶', '🐱', '🐭', '🐰', '🦁', '🐯', '🐸', '🐵'],
            flags: ['🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇯🇵', '🇨🇳', '🇷🇺']
        };

        let activeSet = [];
        let gameCards = [];
        let openCards = [];
        let matchedPairs = [];
        let moves = 0;
        let timeElapsed = 30;
        let gameTimer;
        let score = 0;

        function shuffleArray(arr) {
            const newArr = arr.slice();
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        }

        function startGame(category) {
            menuScreen.style.display = 'none';
            gameArea.style.display = 'flex';

            activeSet = [...iconSets[category], ...iconSets[category]];
            resetGame();
            setupBoard();
            startTimer();
        }

        function resetGame() {
            board.innerHTML = '';
            moves = 0;
            timeElapsed = 30;
            score = 0;
            matchedPairs = [];
            openCards = [];
            clearInterval(gameTimer);
            updateDisplay();
        }

        function updateDisplay() {
            timeCounter.textContent = `Time: ${timeElapsed}`;
            moveCounter.textContent = `Score: ${score}`;
        }

        function setupBoard() {
            const shuffledIcons = shuffleArray(activeSet);
            gameCards = shuffledIcons.map(icon => createCard(icon));
            gameCards.forEach(card => board.appendChild(card));
        }

        function createCard(icon) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">❓</div>
                    <div class="card-back">${icon}</div>
                </div>
            `;
            card.addEventListener('click', () => flipCard(card));
            return card;
        }

        function flipCard(card) {
            if (openCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.classList.add('flipped');
                openCards.push(card);
                if (openCards.length === 2) {
                    moves++;
                    setTimeout(checkMatch, 1000);
                }
            }
        }

        function checkMatch() {
            const [card1, card2] = openCards;
            const icon1 = card1.querySelector('.card-back').textContent;
            const icon2 = card2.querySelector('.card-back').textContent;

            if (icon1 === icon2) {
                openCards.forEach(card => card.classList.add('matched'));
                matchedPairs.push(...openCards);
                openCards = [];
                score += 10;
                updateDisplay();
                checkWin();
            } else {
                setTimeout(() => {
                    openCards.forEach(card => card.classList.remove('flipped'));
                    openCards = [];
                }, 1000);
            }
        }

        function checkWin() {
            if (matchedPairs.length === gameCards.length) {
                clearInterval(gameTimer);
                messageDisplay.textContent = `Victory! Score: ${score}, Time left: ${timeElapsed} sec`;
            }
        }

        function startTimer() {
            gameTimer = setInterval(() => {
                timeElapsed--;
                updateDisplay();
                if (timeElapsed <= 0) {
                    clearInterval(gameTimer);
                    messageDisplay.textContent = `Game Over! Score: ${score}`;
                }
            },1000);
        }