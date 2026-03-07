document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & State ---
    const screens = document.querySelectorAll('.screen');
    const startBtn = document.getElementById('start-btn');
    let currentLevel = 0;

    function showScreen(id) {
        screens.forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    startBtn.addEventListener('click', () => {
        currentLevel = 1;
        showScreen('level-1');
        initLevel1();
    });

    // --- Background Effects ---
    const heartsContainer = document.getElementById('floating-hearts');
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = ['❤️', '💖', '💗', '💓', '💕'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
    setInterval(createFloatingHeart, 600);

    // --- LEVEL 1: Memory Lane ---
    function initLevel1() {
        const grid = document.getElementById('memory-grid');
        const emojis = ['🌹', '💎', '🧸', '🍷', '💍', '🕊️', '🍰', '🎸'];
        const pairs = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        grid.innerHTML = '';
        let flippedCards = [];
        let matchedCount = 0;

        pairs.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.innerHTML = '?';

            card.addEventListener('click', () => {
                if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    card.innerHTML = emoji;
                    flippedCards.push(card);

                    if (flippedCards.length === 2) {
                        setTimeout(checkMatch, 600);
                    }
                }
            });
            grid.appendChild(card);
        });

        function checkMatch() {
            const [card1, card2] = flippedCards;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedCount++;
                if (matchedCount === emojis.length) {
                    setTimeout(() => {
                        currentLevel = 2;
                        showScreen('level-2');
                        initLevel2();
                    }, 1000);
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = '?';
                card2.innerHTML = '?';
            }
            flippedCards = [];
        }
    }

    // --- LEVEL 2: Catch My Heart ---
    function initLevel2() {
        const canvas = document.getElementById('catcher-canvas');
        const container = document.getElementById('catcher-game');
        const ctx = canvas.getContext('2d');

        // Set canvas internal resolution to match display size
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        let score = 0;
        const targetScore = 15;
        let hearts = [];
        let catcher = {
            x: canvas.width / 2 - 25,
            y: canvas.height - 50,
            w: 50,
            h: 30
        };
        let gameActive = true;

        const updateCatcherPos = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            catcher.x = clientX - rect.left - catcher.w / 2;

            // Boundary checks
            if (catcher.x < 0) catcher.x = 0;
            if (catcher.x > canvas.width - catcher.w) catcher.x = canvas.width - catcher.w;
        };

        canvas.addEventListener('mousemove', (e) => {
            updateCatcherPos(e.clientX);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            updateCatcherPos(e.touches[0].clientX);
        }, { passive: false });

        function spawnHeart() {
            if (!gameActive) return;
            hearts.push({
                x: Math.random() * (canvas.width - 20),
                y: -20,
                speed: 2 + Math.random() * 3,
                size: 20 + Math.random() * 10
            });
            setTimeout(spawnHeart, 800);
        }

        function update() {
            if (!gameActive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Catcher
            ctx.fillStyle = '#ff4d6d';
            ctx.fillRect(catcher.x, catcher.y, catcher.w, catcher.h);
            ctx.font = '24px Arial';
            ctx.fillText('🧺', catcher.x + 10, catcher.y + 22);

            // Draw Hearts
            hearts.forEach((h, i) => {
                h.y += h.speed;
                ctx.fillText('❤️', h.x, h.y);

                // Collision
                if (h.y > catcher.y && h.y < catcher.y + catcher.h &&
                    h.x > catcher.x && h.x < catcher.x + catcher.w) {
                    hearts.splice(i, 1);
                    score++;
                    if (score >= targetScore) {
                        gameActive = false;
                        setTimeout(() => {
                            currentLevel = 3;
                            showScreen('level-3');
                            initLevel3();
                        }, 500);
                    }
                }
                if (h.y > canvas.height) hearts.splice(i, 1);
            });

            // Score
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Outfit';
            ctx.fillText(`Love Meter: ${score}/${targetScore}`, 20, 30);

            requestAnimationFrame(update);
        }

        spawnHeart();
        update();
    }

    // --- LEVEL 3: Secret Scramble ---
    const words = [
        { original: "PATUTI", scrambled: "ITAPTU" },
        { original: "NAUGHTY", scrambled: "YTHGUAN" },
        { original: "HUMMI", scrambled: "IMMUH" }
    ];
    let currentWordIndex = 0;

    function initLevel3() {
        const display = document.getElementById('word-display');
        const input = document.getElementById('word-input');
        const btn = document.getElementById('check-word-btn');
        const progress = document.getElementById('scramble-progress');

        function loadWord() {
            display.innerText = words[currentWordIndex].scrambled;
            input.value = '';
            progress.innerText = `Word ${currentWordIndex + 1} of ${words.length}`;
        }

        btn.onclick = () => {
            if (input.value.toUpperCase() === words[currentWordIndex].original) {
                currentWordIndex++;
                if (currentWordIndex >= words.length) {
                    showScreen('level-4');
                    initLevel4();
                } else {
                    loadWord();
                }
            } else {
                input.style.border = '2px solid red';
                setTimeout(() => input.style.border = 'none', 500);
            }
        };

        loadWord();
    }

    // --- LEVEL 4: Rhythm of Love ---
    let sequence = [];
    let userSequence = [];
    let level = 1;

    function initLevel4() {
        const colors = ['red', 'pink', 'gold', 'purple'];
        const startBtn = document.getElementById('simon-start-btn');

        startBtn.onclick = () => {
            sequence = [];
            nextStep();
            startBtn.style.display = 'none';
        };

        const hearts = document.querySelectorAll('.heart-btn');
        hearts.forEach(h => {
            h.onclick = () => handleUserClick(h.dataset.color);
        });

        function nextStep() {
            userSequence = [];
            sequence.push(colors[Math.floor(Math.random() * 4)]);
            playSequence();
        }

        async function playSequence() {
            for (let color of sequence) {
                await flashHeart(color);
                await new Promise(r => setTimeout(r, 400));
            }
        }

        function flashHeart(color) {
            return new Promise(resolve => {
                const h = document.getElementById(`heart-${color}`);
                h.classList.add('active');
                setTimeout(() => {
                    h.classList.remove('active');
                    resolve();
                }, 400);
            });
        }

        function handleUserClick(color) {
            flashHeart(color);
            userSequence.push(color);

            const currentIdx = userSequence.length - 1;
            if (userSequence[currentIdx] !== sequence[currentIdx]) {
                alert('Oops! Try again.');
                sequence = [];
                startBtn.style.display = 'block';
                return;
            }

            if (userSequence.length === sequence.length) {
                if (sequence.length >= 4) { // Finish after 4 steps for simplicity
                    setTimeout(() => {
                        showScreen('level-5');
                        initLevel5();
                    }, 1000);
                } else {
                    setTimeout(nextStep, 1000);
                }
            }
        }
    }

    // --- LEVEL 5: Final Choice ---
    function initLevel5() {
        const noBtn = document.getElementById('no-btn');
        const yesBtn = document.getElementById('yes-btn');

        const moveNo = () => {
            const x = Math.random() * 200 - 100;
            const y = Math.random() * 200 - 100;
            noBtn.style.transform = `translate(${x}px, ${y}px)`;
        };

        noBtn.addEventListener('mouseover', moveNo);
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNo();
        }, { passive: false });
        noBtn.addEventListener('click', moveNo);

        yesBtn.addEventListener('click', () => {
            showScreen('success-screen');
            initSuccess();
        });
    }

    function initSuccess() {
        const container = document.querySelector('.fireworks-container');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = ['#ff4d6d', '#ff8fa3', '#f9d423', '#ff0000', '#ffffff'][Math.floor(Math.random() * 5)];
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            container.appendChild(confetti);
        }
    }
});
