document.addEventListener('DOMContentLoaded', () => {
    const GAME_TIME = 30;
    const STORAGE_KEY = 'hit-adnan-high-score';

    const board = document.getElementById('board');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const timeEl = document.getElementById('time-left');
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('high-score');
    const statusEl = document.getElementById('status');

    let holes = [];
    let score = 0;
    let timeLeft = GAME_TIME;
    let highScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
    let gameActive = false;
    let currentHole = null;
    let countdownTimer = null;
    let popTimer = null;

    function buildBoard() {
        board.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'hole';

            const adnan = document.createElement('button');
            adnan.type = 'button';
            adnan.className = 'adnan';
            adnan.setAttribute('aria-label', 'Hit Adnan');
            adnan.addEventListener('click', () => hitHole(hole));

            hole.appendChild(adnan);
            board.appendChild(hole);
        }

        holes = Array.from(document.querySelectorAll('.hole'));
    }

    function updateScoreboard() {
        scoreEl.textContent = String(score);
        timeEl.textContent = String(timeLeft);
        highScoreEl.textContent = String(highScore);
    }

    function clearPopState() {
        holes.forEach((hole) => {
            hole.classList.remove('up', 'hit');
            hole.dataset.hit = '0';
        });
        currentHole = null;
    }

    function hitHole(hole) {
        if (!gameActive) {
            return;
        }

        if (!hole.classList.contains('up')) {
            return;
        }

        if (hole.dataset.hit === '1') {
            return;
        }

        hole.dataset.hit = '1';
        hole.classList.add('hit');
        score += 1;
        updateScoreboard();
    }

    function randomHole() {
        if (holes.length === 0) {
            return null;
        }

        const available = holes.filter((hole) => hole !== currentHole);
        const source = available.length > 0 ? available : holes;
        const idx = Math.floor(Math.random() * source.length);
        return source[idx];
    }

    function popAdnan() {
        if (!gameActive) {
            return;
        }

        clearPopState();

        const hole = randomHole();
        if (!hole) {
            return;
        }

        currentHole = hole;
        hole.classList.add('up');

        const visibleFor = 450 + Math.random() * 350;
        const nextPop = 420 + Math.random() * 450;

        setTimeout(() => {
            hole.classList.remove('up', 'hit');
            hole.dataset.hit = '0';
            if (currentHole === hole) {
                currentHole = null;
            }
        }, visibleFor);

        popTimer = setTimeout(popAdnan, nextPop);
    }

    function endGame() {
        gameActive = false;
        clearTimeout(popTimer);
        clearInterval(countdownTimer);
        clearPopState();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem(STORAGE_KEY, String(highScore));
            statusEl.textContent = `Time up! New high score: ${score}.`; 
        } else {
            statusEl.textContent = `Time up! You scored ${score}.`; 
        }

        updateScoreboard();
    }

    function startGame() {
        clearTimeout(popTimer);
        clearInterval(countdownTimer);

        score = 0;
        timeLeft = GAME_TIME;
        gameActive = true;
        statusEl.textContent = 'Go! Hit Adnan quickly!';

        updateScoreboard();
        clearPopState();
        popAdnan();

        countdownTimer = setInterval(() => {
            timeLeft -= 1;
            updateScoreboard();

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    buildBoard();
    updateScoreboard();
});
