document.addEventListener("DOMContentLoaded", () => {
    const SETUP_KEY = "scrambled-setup";
    const USED_KEY = "scrambled-used";

    const setupCard = document.getElementById("setup-card");
    const gameCard = document.getElementById("game-card");
    const endCard = document.getElementById("end-card");

    const categoryGrid = document.getElementById("category-grid");
    const poolNote = document.getElementById("pool-note");
    const countRange = document.getElementById("count-range");
    const countLabel = document.getElementById("count-label");
    const p1Name = document.getElementById("p1-name");
    const p2Name = document.getElementById("p2-name");
    const timerSelect = document.getElementById("timer-select");
    const difficultySelect = document.getElementById("difficulty-select");
    const startBtn = document.getElementById("start-btn");
    const setupError = document.getElementById("setup-error");
    const resetMemoryBtn = document.getElementById("reset-memory");

    const roundPill = document.getElementById("round-pill");
    const categoryPill = document.getElementById("category-pill");
    const timerPill = document.getElementById("timer-pill");
    const scrambleZone = document.getElementById("scramble-zone");
    const wordHint = document.getElementById("word-hint");
    const answerReveal = document.getElementById("answer-reveal");
    const shuffleBtn = document.getElementById("shuffle-btn");
    const revealBtn = document.getElementById("reveal-btn");
    const nextBtn = document.getElementById("next-btn");

    const scoreNames = [
        document.getElementById("score-name-1"),
        document.getElementById("score-name-2")
    ];
    const scoreValues = [
        document.getElementById("score-value-1"),
        document.getElementById("score-value-2")
    ];
    const finalNames = [
        document.getElementById("final-name-1"),
        document.getElementById("final-name-2")
    ];
    const finalValues = [
        document.getElementById("final-value-1"),
        document.getElementById("final-value-2")
    ];
    const endTitle = document.getElementById("end-title");
    const endMessage = document.getElementById("end-message");
    const replayBtn = document.getElementById("replay-btn");
    const editBtn = document.getElementById("edit-btn");

    let categoryId = null;
    let words = [];
    let index = 0;
    let scores = [0, 0];
    let names = ["Player 1", "Player 2"];
    let revealed = false;
    let currentChunks = [];
    let timerSeconds = 0;
    let secondsLeft = 0;
    let timerId = null;

    /* ---------- storage ---------- */

    function readJSON(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            /* storage blocked, game still works for this session */
        }
    }

    function getUsed(id) {
        const used = readJSON(USED_KEY, {});
        return Array.isArray(used[id]) ? used[id] : [];
    }

    function markUsed(id, picked) {
        const used = readJSON(USED_KEY, {});
        const previous = Array.isArray(used[id]) ? used[id] : [];
        used[id] = previous.concat(picked);
        writeJSON(USED_KEY, used);
    }

    function resetUsed(id) {
        const used = readJSON(USED_KEY, {});
        if (id) {
            delete used[id];
        } else {
            Object.keys(used).forEach((key) => delete used[key]);
        }
        writeJSON(USED_KEY, used);
    }

    /* ---------- helpers ---------- */

    function getCategory(id) {
        return WORD_BANKS.find((bank) => bank.id === id) || null;
    }

    function shuffleArray(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function letterCount(word) {
        return word.replace(/\s/g, "").length;
    }

    function matchesDifficulty(word) {
        const size = letterCount(word);
        if (difficultySelect.value === "short") {
            return size <= 7;
        }
        if (difficultySelect.value === "long") {
            return size >= 9;
        }
        return true;
    }

    function scrambleChunk(chunk) {
        const letters = chunk.split("");
        const unique = new Set(letters.map((letter) => letter.toLowerCase()));
        if (letters.length < 2 || unique.size < 2) {
            return chunk;
        }

        let attempt = chunk;
        for (let tries = 0; tries < 24 && attempt === chunk; tries += 1) {
            attempt = shuffleArray(letters).join("");
        }
        return attempt;
    }

    function showCard(activeCard) {
        [setupCard, gameCard, endCard].forEach((card) => {
            card.classList.toggle("is-active", card === activeCard);
        });
    }

    /* ---------- word picking ---------- */

    function drawWords(id, wanted) {
        const category = getCategory(id);
        if (!category) {
            return [];
        }

        const pool = category.words.filter(matchesDifficulty);
        const usedSet = new Set(getUsed(id));
        const fresh = shuffleArray(pool.filter((word) => !usedSet.has(word)));

        if (fresh.length >= wanted) {
            return fresh.slice(0, wanted);
        }

        // Pool ran dry: use whatever is left, wipe the memory, top up from the rest.
        const picked = fresh.slice();
        resetUsed(id);
        const leftover = shuffleArray(pool.filter((word) => !picked.includes(word)));
        return picked.concat(leftover.slice(0, wanted - picked.length));
    }

    function poolStats(id) {
        const category = getCategory(id);
        if (!category) {
            return null;
        }
        const pool = category.words.filter(matchesDifficulty);
        const usedSet = new Set(getUsed(id));
        return {
            total: pool.length,
            fresh: pool.filter((word) => !usedSet.has(word)).length
        };
    }

    function paintPoolNote() {
        if (!categoryId) {
            poolNote.textContent = "pick a category to begin";
            return;
        }

        const stats = poolStats(categoryId);
        const wanted = Number(countRange.value);
        if (stats.total < wanted) {
            poolNote.textContent = `only ${stats.total} words fit this length — lower the count or pick "any length"`;
            return;
        }
        poolNote.textContent = `${stats.fresh} fresh of ${stats.total} words left in this category`;
    }

    /* ---------- setup UI ---------- */

    function buildCategoryGrid() {
        WORD_BANKS.forEach((bank) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "category-chip";
            chip.dataset.category = bank.id;
            chip.innerHTML =
                `<span class="chip-emoji">${bank.emoji}</span>` +
                `<span class="chip-name">${bank.name}</span>` +
                `<span class="chip-blurb">${bank.blurb}</span>`;
            chip.addEventListener("click", () => selectCategory(bank.id));
            categoryGrid.appendChild(chip);
        });
    }

    function selectCategory(id) {
        categoryId = id;
        categoryGrid.querySelectorAll(".category-chip").forEach((chip) => {
            chip.classList.toggle("is-selected", chip.dataset.category === id);
        });
        setupError.textContent = "";
        paintPoolNote();
    }

    function saveSetup() {
        writeJSON(SETUP_KEY, {
            category: categoryId,
            count: countRange.value,
            p1: p1Name.value,
            p2: p2Name.value,
            timer: timerSelect.value,
            difficulty: difficultySelect.value
        });
    }

    function loadSetup() {
        const saved = readJSON(SETUP_KEY, null);
        if (!saved) {
            return;
        }
        countRange.value = saved.count || "10";
        countLabel.textContent = countRange.value;
        p1Name.value = saved.p1 || "Player 1";
        p2Name.value = saved.p2 || "Player 2";
        timerSelect.value = saved.timer || "45";
        difficultySelect.value = saved.difficulty || "any";
        if (saved.category && getCategory(saved.category)) {
            selectCategory(saved.category);
        }
    }

    /* ---------- timer ---------- */

    function stopTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function paintTimer() {
        if (!timerSeconds) {
            timerPill.textContent = "no timer";
            timerPill.classList.remove("is-low", "is-done");
            return;
        }

        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        timerPill.textContent =
            secondsLeft > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : "time up!";
        timerPill.classList.toggle("is-low", secondsLeft > 0 && secondsLeft <= 10);
        timerPill.classList.toggle("is-done", secondsLeft === 0);
    }

    function startTimer() {
        stopTimer();
        secondsLeft = timerSeconds;
        paintTimer();
        if (!timerSeconds) {
            return;
        }

        timerId = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft <= 0) {
                secondsLeft = 0;
                stopTimer();
            }
            paintTimer();
        }, 1000);
    }

    /* ---------- game ---------- */

    /* Sizes the tiles so the longest word always fits on a single line,
       and so a short phrase keeps all its words on one line when it can. */
    function sizeTiles(chunks) {
        const available = scrambleZone.clientWidth;
        if (!available) {
            return;
        }

        const lengths = chunks.map((chunk) => chunk.length);
        const longest = [Math.max.apply(null, lengths)];

        // Widest tile that lets these words sit on a single line together.
        function fitWidth(wordLengths, gap, wordGap) {
            const letters = wordLengths.reduce((sum, len) => sum + len, 0);
            const innerGaps = wordLengths.reduce((sum, len) => sum + (len - 1), 0) * gap;
            const betweenGaps = (wordLengths.length - 1) * wordGap;
            return (available - 2 - innerGaps - betweenGaps) / letters;
        }

        let gap = 8;
        let wordGap = 30;
        // Try the whole phrase on one line; if that gets cramped, fall back to
        // fitting the longest word — a word itself never breaks across lines.
        let width = fitWidth(lengths, gap, wordGap);
        if (width < 26) {
            // The phrase can't fit on one line at a readable size, so fit the
            // longest word instead and let the words stack.
            width = fitWidth(longest, gap, 0);
            if (width < 30) {
                gap = 5;
                wordGap = 18;
                width = fitWidth(longest, gap, 0);
            }
        }

        width = Math.max(20, Math.min(62, width));
        scrambleZone.style.setProperty("--tile-w", `${width}px`);
        scrambleZone.style.setProperty("--tile-h", `${Math.round(width * 1.16)}px`);
        scrambleZone.style.setProperty("--tile-font", `${Math.round(width * 0.54)}px`);
        scrambleZone.style.setProperty("--tile-gap", `${gap}px`);
        scrambleZone.style.setProperty("--word-gap", `${wordGap}px`);
        scrambleZone.style.setProperty(
            "--tile-radius",
            `${Math.max(8, Math.round(width * 0.26))}px`
        );
    }

    function renderScramble(word) {
        currentChunks = word.split(" ").map(scrambleChunk);
        paintTiles();
    }

    function paintTiles() {
        scrambleZone.innerHTML = "";
        currentChunks.forEach((chunk) => {
            const group = document.createElement("div");
            group.className = "tile-group";
            chunk.split("").forEach((letter, letterIndex) => {
                const tile = document.createElement("span");
                tile.className = "tile";
                tile.textContent = letter.toUpperCase();
                tile.style.animationDelay = `${letterIndex * 0.045}s`;
                group.appendChild(tile);
            });
            scrambleZone.appendChild(group);
        });
        sizeTiles(currentChunks);
    }

    function paintScores() {
        scoreValues.forEach((node, i) => {
            node.textContent = String(scores[i]);
        });
        scoreNames.forEach((node, i) => {
            node.textContent = names[i];
        });
    }

    function showWord() {
        const word = words[index];
        revealed = false;
        renderScramble(word);
        roundPill.textContent = `Word ${index + 1} / ${words.length}`;
        answerReveal.textContent = "";
        answerReveal.classList.remove("is-shown");
        revealBtn.textContent = "Reveal answer";

        const letters = letterCount(word);
        const chunks = word.split(" ").length;
        wordHint.textContent =
            chunks > 1 ? `${chunks} words · ${letters} letters` : `${letters} letters`;

        nextBtn.textContent = index === words.length - 1 ? "Finish" : "Next word";
        startTimer();
    }

    function revealAnswer() {
        if (revealed) {
            return;
        }
        revealed = true;
        stopTimer();
        answerReveal.textContent = words[index].toUpperCase();
        answerReveal.classList.add("is-shown");
        revealBtn.textContent = "Revealed";
    }

    function finishGame() {
        stopTimer();
        finalNames.forEach((node, i) => {
            node.textContent = names[i];
        });
        finalValues.forEach((node, i) => {
            node.textContent = String(scores[i]);
        });

        if (scores[0] === scores[1]) {
            endTitle.textContent = "It's a tie";
            endMessage.textContent = "Perfectly matched. Rematch?";
        } else {
            const winner = scores[0] > scores[1] ? names[0] : names[1];
            endTitle.textContent = `${winner} wins`;
            endMessage.textContent = `${winner} unscrambled their way to the top.`;
        }

        showCard(endCard);
    }

    function nextWord() {
        if (index >= words.length - 1) {
            finishGame();
            return;
        }
        index += 1;
        showWord();
    }

    function addPoint(player, amount) {
        scores[player] = Math.max(0, scores[player] + amount);
        paintScores();

        if (amount > 0) {
            const slot = document.getElementById(`slot-${player + 1}`);
            slot.classList.remove("is-scored");
            void slot.offsetWidth;
            slot.classList.add("is-scored");
        }
    }

    function beginGame() {
        if (!categoryId) {
            setupError.textContent = "pick a category first.";
            return;
        }

        const wanted = Number(countRange.value);
        const drawn = drawWords(categoryId, wanted);
        if (drawn.length === 0) {
            setupError.textContent = "no words match that length. try 'any length'.";
            return;
        }

        words = drawn;
        markUsed(categoryId, drawn);
        names = [
            p1Name.value.trim() || "Player 1",
            p2Name.value.trim() || "Player 2"
        ];
        timerSeconds = Number(timerSelect.value) || 0;
        saveSetup();

        const category = getCategory(categoryId);
        categoryPill.innerHTML =
            `<span class="pill-emoji">${category.emoji}</span>${category.name}`;
        setupError.textContent = "";
        scores = [0, 0];
        index = 0;
        paintScores();
        showCard(gameCard);
        showWord();
    }

    /* ---------- wiring ---------- */

    let resizeTimer = null;
    window.addEventListener("resize", () => {
        if (!gameCard.classList.contains("is-active") || currentChunks.length === 0) {
            return;
        }
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => sizeTiles(currentChunks), 120);
    });

    countRange.addEventListener("input", () => {
        countLabel.textContent = countRange.value;
        paintPoolNote();
    });

    difficultySelect.addEventListener("change", paintPoolNote);

    startBtn.addEventListener("click", beginGame);

    resetMemoryBtn.addEventListener("click", () => {
        resetUsed(null);
        paintPoolNote();
        setupError.textContent = "memory cleared — every word is fresh again.";
    });

    shuffleBtn.addEventListener("click", () => renderScramble(words[index]));
    revealBtn.addEventListener("click", revealAnswer);
    nextBtn.addEventListener("click", nextWord);

    document.querySelectorAll("[data-point]").forEach((button) => {
        button.addEventListener("click", () => {
            addPoint(Number(button.dataset.point) - 1, 1);
        });
    });

    document.querySelectorAll("[data-minus]").forEach((button) => {
        button.addEventListener("click", () => {
            addPoint(Number(button.dataset.minus) - 1, -1);
        });
    });

    replayBtn.addEventListener("click", beginGame);
    editBtn.addEventListener("click", () => {
        stopTimer();
        paintPoolNote();
        showCard(setupCard);
    });

    document.addEventListener("keydown", (event) => {
        if (!gameCard.classList.contains("is-active")) {
            return;
        }
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
            return;
        }

        if (event.code === "Space") {
            event.preventDefault();
            revealAnswer();
        } else if (event.key === "Enter") {
            event.preventDefault();
            nextWord();
        } else if (event.key === "1") {
            addPoint(0, 1);
        } else if (event.key === "2") {
            addPoint(1, 1);
        } else if (event.key === "r" || event.key === "R") {
            renderScramble(words[index]);
        }
    });

    buildCategoryGrid();
    loadSetup();
    countLabel.textContent = countRange.value;
    paintPoolNote();
});
