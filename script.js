document.addEventListener("DOMContentLoaded", () => {
    const loveCard = document.getElementById("love-card");
    const fatkoCard = document.getElementById("fatko-card");
    const hugCard = document.getElementById("hug-card");
    const answerZone = document.getElementById("answer-zone");
    const yesLove = document.getElementById("yes-love");
    const noLove = document.getElementById("no-love");
    const tease = document.getElementById("tease");
    const adnanFigure = document.getElementById("adnan-figure");
    const burstLayer = document.getElementById("burst-layer");
    const punchCount = document.getElementById("punch-count");
    const hugBtn = document.getElementById("hug-btn");
    const hugMessage = document.getElementById("hug-message");

    const noMessages = [
        "nope, that button is shy.",
        "almost... but still no.",
        "it ran away because it knows the truth.",
        "try again, habibti.",
        "the pink button misses you."
    ];
    const punchWords = ["bonk", "fatko", "ouch", "sorry", "ok ok"];

    let noMoveCount = 0;
    let punches = 0;

    function showCard(activeCard) {
        [loveCard, fatkoCard, hugCard].forEach((card) => {
            card.classList.toggle("is-active", card === activeCard);
        });
    }

    function moveNoButton() {
        const zoneRect = answerZone.getBoundingClientRect();
        const buttonRect = noLove.getBoundingClientRect();
        const padding = 8;
        const maxX = Math.max(padding, zoneRect.width - buttonRect.width - padding);
        const maxY = Math.max(padding, zoneRect.height - buttonRect.height - padding);
        const x = padding + Math.random() * (maxX - padding);
        const y = padding + Math.random() * (maxY - padding);

        noLove.style.left = `${x}px`;
        noLove.style.top = `${y}px`;
        noLove.style.transform = "none";
        tease.textContent = noMessages[noMoveCount % noMessages.length];
        noMoveCount += 1;
    }

    function createBurst() {
        const burst = document.createElement("span");
        burst.className = "burst";
        burst.textContent = punchWords[Math.min(punches, punchWords.length - 1)];
        burst.style.left = `${38 + Math.random() * 24}%`;
        burst.style.top = `${22 + Math.random() * 24}%`;
        burstLayer.appendChild(burst);
        burst.addEventListener("animationend", () => burst.remove());
    }

    function punchAdnan() {
        if (punches >= 5) {
            return;
        }

        punches += 1;
        punchCount.textContent = String(punches);
        createBurst();
        adnanFigure.classList.remove("is-hit");
        void adnanFigure.offsetWidth;
        adnanFigure.classList.add("is-hit");

        if (punches === 5) {
            setTimeout(() => {
                showCard(hugCard);
            }, 650);
        }
    }

    function giveHug() {
        hugMessage.textContent = "hug accepted. Adnan is now 500% happier.";
        hugBtn.textContent = "Hug delivered";
        hugBtn.disabled = true;
    }

    noLove.addEventListener("pointerenter", moveNoButton);
    noLove.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        moveNoButton();
    });
    noLove.addEventListener("click", (event) => {
        event.preventDefault();
        moveNoButton();
    });
    noLove.addEventListener("focus", moveNoButton);

    yesLove.addEventListener("click", () => {
        showCard(fatkoCard);
        adnanFigure.focus();
    });

    adnanFigure.addEventListener("click", punchAdnan);
    hugBtn.addEventListener("click", giveHug);
});
