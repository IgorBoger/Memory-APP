type Player = "blue" | "orange";


type CardMotif = {
    id: string;
    image: string;
    alt: string;
};


type Card = {
    id: number;
    motifId: string;
    image: string;
    alt: string;
    isMatched: boolean;
};


type GameState = {
    cards: Card[];
    flippedCardIds: number[];
    currentPlayer: Player;
    scores: Record<Player, number>;
    isLocked: boolean;
    status: "idle" | "playing" | "finished";
};


type ResultTheme = {
    winnerClass: string;
    drawClass: string;
    buttonText: string;
    winnerTitles: Record<Player, string>;
    winnerImages: Record<Player, string>;
    drawImage: string;
};

const resultThemeData: Record<string, ResultTheme> = {
    "code-vibes": {
        winnerClass: "winner--code-vibes",
        drawClass: "draw--code-vibes",
        buttonText: "Back to start",
        winnerTitles: { blue: "BLUE PLAYER", orange: "ORANGE PLAYER" },
        winnerImages: {
            blue: "/img/game-field/code-vibes/winner-pawn-blue.png",
            orange: "/img/game-field/code-vibes/winner-pawn-orange.png",
        },
        drawImage: "/img/game-field/code-vibes/draw-scales.png",
    },
    "gaming": {
        winnerClass: "winner--gaming",
        drawClass: "draw--gaming",
        buttonText: "Home",
        winnerTitles: { blue: "Blue Player", orange: "Orange Player" },
        winnerImages: {
            blue: "/img/game-field/gaming/winner-trophy.png",
            orange: "/img/game-field/gaming/winner-trophy.png",
        },
        drawImage: "/img/game-field/gaming/draw-scales.png",
    },
    "da-projects": {
        winnerClass: "winner--da-projects",
        drawClass: "draw--da-projects",
        buttonText: "Home",
        winnerTitles: { blue: "Blue Player", orange: "Orange Player" },
        winnerImages: {
            blue: "/img/game-field/da-projects/winner-pawn-blue.png",
            orange: "/img/game-field/da-projects/winner-pawn-orange.png",
        },
        drawImage: "/img/game-field/da-projects/draw-scales.png",
    }
};


const cardMotifsByTheme: Record<string, CardMotif[]> = {
    "code-vibes": [
        {
            id: "angular",
            image: "/img/game-field/code-vibes/cards/angular.png",
            alt: "Angular icon",
        },
        {
            id: "bootstrap",
            image: "/img/game-field/code-vibes/cards/bootstrap.png",
            alt: "Bootstrap icon",
        },
        {
            id: "css",
            image: "/img/game-field/code-vibes/cards/css.png",
            alt: "CSS icon",
        },
        {
            id: "django",
            image: "/img/game-field/code-vibes/cards/django.png",
            alt: "Django icon",
        },
        {
            id: "firebase",
            image: "/img/game-field/code-vibes/cards/firebase.png",
            alt: "Firebase icon",
        },
        {
            id: "git",
            image: "/img/game-field/code-vibes/cards/git.png",
            alt: "Git icon",
        },
        {
            id: "github",
            image: "/img/game-field/code-vibes/cards/github.png",
            alt: "GitHub icon",
        },
        {
            id: "html",
            image: "/img/game-field/code-vibes/cards/html.png",
            alt: "HTML icon",
        },
        {
            id: "javascript",
            image: "/img/game-field/code-vibes/cards/javascript.png",
            alt: "JavaScript icon",
        },
        {
            id: "node-js",
            image: "/img/game-field/code-vibes/cards/node-js.png",
            alt: "Node.js icon",
        },
        {
            id: "python",
            image: "/img/game-field/code-vibes/cards/python.png",
            alt: "Python icon",
        },
        {
            id: "react",
            image: "/img/game-field/code-vibes/cards/react.png",
            alt: "React icon",
        },
        {
            id: "sass",
            image: "/img/game-field/code-vibes/cards/sass.png",
            alt: "Sass icon",
        },
        {
            id: "sql",
            image: "/img/game-field/code-vibes/cards/sql.png",
            alt: "SQL icon",
        },
        {
            id: "terminal",
            image: "/img/game-field/code-vibes/cards/terminal.png",
            alt: "Terminal icon",
        },
        {
            id: "typescript",
            image: "/img/game-field/code-vibes/cards/typescript.png",
            alt: "TypeScript icon",
        },
        {
            id: "vs-code",
            image: "/img/game-field/code-vibes/cards/vs-code.png",
            alt: "Visual Studio Code icon",
        },
        {
            id: "vue",
            image: "/img/game-field/code-vibes/cards/vue.png",
            alt: "Vue icon",
        },
    ],
    "gaming": [
        {
            id: "ace-of-diamonds",
            image: "/img/game-field/gaming/cards/ace-of-diamonds.png",
            alt: "Ace of diamonds playing card",
        },
        {
            id: "banana",
            image: "/img/game-field/gaming/cards/banana.png",
            alt: "Banana wearing sunglasses",
        },
        {
            id: "circle-guard",
            image: "/img/game-field/gaming/cards/circle-guard.png",
            alt: "Guard with a circle mask",
        },
        {
            id: "creeper",
            image: "/img/game-field/gaming/cards/creeper.png",
            alt: "Creeper face",
        },
        {
            id: "dice",
            image: "/img/game-field/gaming/cards/dice.png",
            alt: "Colorful dice",
        },
        {
            id: "game-controller",
            image: "/img/game-field/gaming/cards/game-controller.png",
            alt: "Game controller",
        },
        {
            id: "handheld-console",
            image: "/img/game-field/gaming/cards/handheld-console.png",
            alt: "Handheld game console",
        },
        {
            id: "level-up-medal",
            image: "/img/game-field/gaming/cards/level-up-medal.png",
            alt: "Level up medal",
        },
        {
            id: "maze",
            image: "/img/game-field/gaming/cards/maze.png",
            alt: "Circular maze",
        },
        {
            id: "mushroom",
            image: "/img/game-field/gaming/cards/mushroom.png",
            alt: "Red and white mushroom",
        },
        {
            id: "pac-man-and-ghost",
            image: "/img/game-field/gaming/cards/pac-man-and-ghost.png",
            alt: "Pac-Man and a ghost",
        },
        {
            id: "pac-man",
            image: "/img/game-field/gaming/cards/pac-man.png",
            alt: "Pac-Man",
        },
        {
            id: "play-button",
            image: "/img/game-field/gaming/cards/play-button.png",
            alt: "Play button",
        },
        {
            id: "puzzle-pieces",
            image: "/img/game-field/gaming/cards/puzzle-pieces.png",
            alt: "Colorful puzzle pieces",
        },
        {
            id: "snake",
            image: "/img/game-field/gaming/cards/snake.png",
            alt: "Snake game",
        },
        {
            id: "square-guard",
            image: "/img/game-field/gaming/cards/square-guard.png",
            alt: "Guard with a square mask",
        },
        {
            id: "star-coin",
            image: "/img/game-field/gaming/cards/star-coin.png",
            alt: "Gold coin with a star",
        },
        {
            id: "triangle-guard",
            image: "/img/game-field/gaming/cards/triangle-guard.png",
            alt: "Guard with a triangle mask",
        },
    ],
    "da-projects": [
        {
            id: "bowl",
            image: "/img/game-field/da-projects/cards/bowl.png",
            alt: "Red bowl",
        },
        {
            id: "broccoli",
            image: "/img/game-field/da-projects/cards/broccoli.png",
            alt: "Green broccoli",
        },
        {
            id: "chat-bubbles",
            image: "/img/game-field/da-projects/cards/chat-bubbles.png",
            alt: "Colorful chat bubbles",
        },
        {
            id: "chef-hat",
            image: "/img/game-field/da-projects/cards/chef-hat.png",
            alt: "White chef hat",
        },
        {
            id: "cherry-blossom",
            image: "/img/game-field/da-projects/cards/cherry-blossom.png",
            alt: "Pink cherry blossom",
        },
        {
            id: "currency-exchange",
            image: "/img/game-field/da-projects/cards/currency-exchange.png",
            alt: "Currency exchange coins",
        },
        {
            id: "egg-halves",
            image: "/img/game-field/da-projects/cards/egg-halves.png",
            alt: "Two egg halves",
        },
        {
            id: "green-link-logo",
            image: "/img/game-field/da-projects/cards/green-link-logo.png",
            alt: "Green interlocking logo",
        },
        {
            id: "join-logo",
            image: "/img/game-field/da-projects/cards/join-logo.png",
            alt: "Blue Join logo",
        },
        {
            id: "noodle-bowl",
            image: "/img/game-field/da-projects/cards/noodle-bowl.png",
            alt: "Bowl of noodles with chopsticks",
        },
        {
            id: "poke-ball",
            image: "/img/game-field/da-projects/cards/poke-ball.png",
            alt: "Red and white Poke Ball",
        },
        {
            id: "purple-arrow",
            image: "/img/game-field/da-projects/cards/purple-arrow.png",
            alt: "Purple and blue arrow",
        },
        {
            id: "shark-fin",
            image: "/img/game-field/da-projects/cards/shark-fin.png",
            alt: "Shark fin in ocean waves",
        },
        {
            id: "shopping-basket",
            image: "/img/game-field/da-projects/cards/shopping-basket.png",
            alt: "Orange shopping basket",
        },
        {
            id: "smiling-face",
            image: "/img/game-field/da-projects/cards/smiling-face.png",
            alt: "Yellow smiling face with a hat",
        },
        {
            id: "sombrero",
            image: "/img/game-field/da-projects/cards/sombrero.png",
            alt: "Orange sombrero",
        },
        {
            id: "tic-tac-toe",
            image: "/img/game-field/da-projects/cards/tic-tac-toe.png",
            alt: "Tic-tac-toe board",
        },
        {
            id: "user-network",
            image: "/img/game-field/da-projects/cards/user-network.png",
            alt: "Purple user network",
        },
    ],
};


function createInitialGameState(currentPlayer: Player): GameState {
    return {
        cards: [],
        flippedCardIds: [],
        currentPlayer,
        scores: { blue: 0, orange: 0 },
        isLocked: false,
        status: "idle",
    };
}


let gameState: GameState = createInitialGameState("blue");
let cardResetTimeout: number | undefined;
let gameOverTimeout: number | undefined;


function getPairCount(): number {
    const cardCount = parseInt(document.querySelector<HTMLInputElement>
        ('input[name="board-size"]:checked')?.value || "0", 10);
    return cardCount / 2;
}


function getCardMotifs(selectedTheme: string) {
    const pairCount = getPairCount();
    const motifs = cardMotifsByTheme[selectedTheme].slice(0, pairCount);
    return [...motifs, ...motifs];
}


function createShuffledDeck(selectedTheme: string) {
    const motifs = getCardMotifs(selectedTheme);

    const deck = motifs.map((motif, index): Card => {
        return {
            id: index,
            motifId: motif.id,
            image: motif.image,
            alt: motif.alt,
            isMatched: false,
        };
    });


    shuffleCards(deck);


    return deck;
}


function shuffleCards(deck: Card[]): Card[] {

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}


init();


function init() {
    startSettingsPage();
    setupThemePreview();
    updateSettingsSummary();
    setupSettingsSelection();
    startGame();
    initCard();
    exitGame();
    setupWinnerOverlay();
    setupDrawOverlay();
}


function showPage(currentPage: HTMLElement, nextPage: HTMLElement) {
    currentPage.classList.remove('page--active');
    setTimeout(() => {
        currentPage.hidden = true;
        nextPage.hidden = false;
        requestAnimationFrame(() => {
            nextPage.classList.add('page--active');
        });
    }, 300);
}


function startSettingsPage() {
    const playBtn = document.getElementById('playButton');
    playBtn?.addEventListener('click', () => {
        const settingsPage = document.getElementById('settingsPage');
        const startPage = document.getElementById('startPage');
        if (startPage && settingsPage) {
            showPage(startPage, settingsPage);
        }
    });
}


function renderPlayingFieldCards(selectedTheme: string, cards: Card[]) {
    const playingFieldBoard = document.getElementById("playingFieldBoard");
    if (playingFieldBoard) {
        playingFieldBoard.innerHTML = "";
        for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
            const card = cards[cardIndex];
            const memoryCard = document.createElement("button");
            const gameTheme = gameThemeData[selectedTheme];
            memoryCard.className = "memory-card";
            memoryCard.dataset.cardId = String(card.id);
            memoryCard.innerHTML = `
            <div class="memory-card__inner">
                <div class="memory-card__face memory-card__face--front">
                    ${gameTheme.cardFrontImage
                    ? `<img class="memory-card__image"
                    src="${gameTheme.cardFrontImage}"
                    alt="${gameTheme.cardFrontAlt}">`
                    : ""}
                </div>
                <div class="memory-card__face memory-card__face--back">
                    <img class="memory-card__image"
                    id="memoryCardBack${cardIndex}"
                    src="${card.image}"
                    alt="${card.alt}">
                </div>
            </div>`;
            playingFieldBoard.appendChild(memoryCard);
        }
    }
}


function openCard(cardElement: HTMLElement, gameConfig: GameConfig) {
    if (gameState.status !== "playing" || gameState.isLocked) return;
    const cardId = Number(cardElement.dataset.cardId);
    const card = gameState.cards.find(card => card.id === cardId);
    if (!card || card.isMatched) return;
    if (gameState.flippedCardIds.includes(cardId)) return;
    gameState.flippedCardIds.push(cardId);
    cardElement.classList.add("is-flipped");
    if (gameState.flippedCardIds.length === 2) {
        gameState.isLocked = true;
        checkSelectedPair(gameConfig);
    }
}


function checkSelectedPair(gameConfig: GameConfig) {
    const firstCardId = gameState.flippedCardIds[0];
    const secondCardId = gameState.flippedCardIds[1];
    const firstCard = gameState.cards.find(card => card.id === firstCardId);
    const secondCard = gameState.cards.find(card => card.id === secondCardId);
    if (firstCard && secondCard && firstCard.motifId === secondCard.motifId) {
        handleMatchedPair(firstCard, secondCard);
    } else {
        scheduleCardReset(gameConfig);
    }
}


function handleMatchedPair(firstCard: Card, secondCard: Card) {
    markCardAsMatched(firstCard);
    markCardAsMatched(secondCard);
    gameState.scores[gameState.currentPlayer]++;
    updateScoreDisplay();
    gameState.flippedCardIds = [];
    gameState.isLocked = false;
    checkGameOver();
}


function markCardAsMatched(card: Card) {
    card.isMatched = true;
    const cardElement = document.querySelector(
        `#playingFieldBoard .memory-card[data-card-id="${card.id}"]`
    );
    cardElement?.classList.add("is-matched");
}


function scheduleCardReset(gameConfig: GameConfig) {
    cardResetTimeout = window.setTimeout(() => {
        cardResetTimeout = undefined;
        closeSelectedCards(gameConfig);
    }, 1000);
}


function checkGameOver() {
    if (gameState.cards.length > 0 && gameState.cards.every(card => card.isMatched)) {
        gameState.isLocked = true;
        gameOverTimeout = window.setTimeout(() => {
            gameOverTimeout = undefined;
            showGameOver();
        }, 1000);
    }
}


function closeSelectedCards(gameConfig: GameConfig) {
    gameState.flippedCardIds.forEach(cardId => {
        const cardElement = document.querySelector(
            `#playingFieldBoard .memory-card[data-card-id="${cardId}"]`
        );
        cardElement?.classList.remove("is-flipped");
    });

    cardResetTimeout = window.setTimeout(() => {
        cardResetTimeout = undefined;
        gameState.flippedCardIds = [];
        switchPlayer(gameConfig);
        gameState.isLocked = false;
    }, 500);
}


function switchPlayer(gameConfig: GameConfig) {
    if (gameState.currentPlayer === "blue") {
        gameState.currentPlayer = "orange";
    } else {
        gameState.currentPlayer = "blue";
    }
    applyCurrentPlayer(gameConfig);
    const badge = document.getElementById("gameHeaderCurrentPlayerBadge");
    if (badge) {
        fadeInElement(badge);
    }
}


function updateScoreDisplay() {
    const blueScore = document.getElementById("gameHeaderBlueScore");
    const orangeScore = document.getElementById("gameHeaderOrangeScore");

    if (blueScore && blueScore.textContent !== String(gameState.scores.blue)) {
        blueScore.textContent = String(gameState.scores.blue);
        fadeInElement(blueScore);
    }
    if (orangeScore && orangeScore.textContent !== String(gameState.scores.orange)) {
        orangeScore.textContent = String(gameState.scores.orange);
        fadeInElement(orangeScore);
    }
}


function showGameOver() {
    const playingField = document.getElementById("playingField");
    const gameOver = document.getElementById("gameOver");
    if (!playingField || !gameOver) return;
    applyGameOverTheme(gameOver, getGameConfig());
    updateFinalScoreDisplay();
    gameState.status = "finished";
    showPage(playingField, gameOver);
    scheduleResultOverlay();
}

function applyGameOverTheme(gameOver: HTMLElement, gameConfig: GameConfig) {
    gameOver.classList.remove("game-over--code-vibes", "game-over--gaming", "game-over--da-projects", "game-over--foods");
    gameOver.classList.add(`game-over--${gameConfig.selectedTheme}`);
    const blueLabel = gameOver.querySelector<HTMLImageElement>(".game-over__score--blue img");
    const orangeLabel = gameOver.querySelector<HTMLImageElement>(".game-over__score--orange img");
    blueLabel?.setAttribute("src", gameConfig.gameTheme.blueLabelImage);
    orangeLabel?.setAttribute("src", gameConfig.gameTheme.orangeLabelImage);
}


function scheduleResultOverlay() {
    const gameOver = document.getElementById("gameOver");
    if (!gameOver) return;
    const winner = getWinningPlayer();
    if (winner) {
        window.setTimeout(() => showWinnerOverlay(winner, gameOver), 3000);
    } else {
        window.setTimeout(() => showDrawOverlay(gameOver), 3000);
    }
}


function getWinningPlayer(): Player | null {
    if (gameState.scores.blue === gameState.scores.orange) return null;
    return gameState.scores.blue > gameState.scores.orange ? "blue" : "orange";
}


function getResultTheme(theme: string): ResultTheme {
    return resultThemeData[theme] ?? resultThemeData["code-vibes"];
}

function applyResultTheme(overlay: HTMLElement, theme: ResultTheme, kind: "winner" | "draw") {
    const classKey = kind === "winner" ? "winnerClass" : "drawClass";
    overlay.classList.remove(...Object.values(resultThemeData).map(data => data[classKey]));
    overlay.classList.add(theme[classKey]);
    const button = overlay.querySelector<HTMLButtonElement>("button");
    if (button) button.textContent = theme.buttonText;
}

function applyWinnerContent(overlay: HTMLElement, player: Player, theme: ResultTheme) {
    const title = document.getElementById("winnerPlayer");
    const pawn = document.getElementById("winnerPawn") as HTMLImageElement | null;
    overlay.dataset.player = player;
    if (title) title.textContent = theme.winnerTitles[player];
    if (pawn) pawn.src = theme.winnerImages[player];
}

function showWinnerOverlay(player: Player, currentPage: HTMLElement, theme = getGameConfig().selectedTheme) {
    const overlay = document.getElementById("winnerOverlay");
    if (!overlay) return;
    const resultTheme = getResultTheme(theme);
    applyResultTheme(overlay, resultTheme, "winner");
    applyWinnerContent(overlay, player, resultTheme);
    showPage(currentPage, overlay);
}


function setupWinnerOverlay() {
    const overlay = document.getElementById("winnerOverlay");
    const startPage = document.getElementById("startPage");
    document.getElementById("winnerBackToStart")?.addEventListener("click", () => {
        if (!overlay || !startPage) return;
        cancelCardReset();
        cancelGameOver();
        gameState = createInitialGameState("blue");
        resetSettings();
        updateSettingsSummary();
        showPage(overlay, startPage);
    });
}


function showDrawOverlay(currentPage: HTMLElement, theme = getGameConfig().selectedTheme) {
    const overlay = document.getElementById("drawOverlay");
    if (!overlay) return;
    const resultTheme = getResultTheme(theme);
    applyResultTheme(overlay, resultTheme, "draw");
    const scales = overlay.querySelector<HTMLImageElement>(".draw__scales");
    if (scales) scales.src = resultTheme.drawImage;
    showPage(currentPage, overlay);
}


function setupDrawOverlay() {
    const overlay = document.getElementById("drawOverlay");
    const startPage = document.getElementById("startPage");
    document.getElementById("drawBackToStart")?.addEventListener("click", () => {
        if (!overlay || !startPage) return;
        cancelCardReset();
        cancelGameOver();
        gameState = createInitialGameState("blue");
        resetSettings();
        updateSettingsSummary();
        showPage(overlay, startPage);
    });
}


function resetSettings() {
    const gameThemeInput = document.querySelector<HTMLInputElement>('input[name="game-theme"][value="code-vibes"]');
    const gameSettingsInputs = document.querySelectorAll<HTMLInputElement>('input[name="player"], input[name="board-size"]');
    gameSettingsInputs.forEach(input => {
        input.checked = false;
    });
    if (gameThemeInput) gameThemeInput.checked = true;
    selectedTheme = "code-vibes";
    updateSettingsPreview(selectedTheme);
}


function updateFinalScoreDisplay() {
    const blueScore = document.getElementById("gameOverBlueScore");
    const orangeScore = document.getElementById("gameOverOrangeScore");
    if (blueScore) blueScore.textContent = String(gameState.scores.blue);
    if (orangeScore) orangeScore.textContent = String(gameState.scores.orange);
}


function fadeInElement(element: HTMLElement) {
    element.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 500, easing: "ease-in-out" }
    );
}


function cancelCardReset() {
    window.clearTimeout(cardResetTimeout);
    cardResetTimeout = undefined;
}


function cancelGameOver() {
    window.clearTimeout(gameOverTimeout);
    gameOverTimeout = undefined;
}


type ThemePreview = {
    previewClass: string;
    primaryImage: string;
    primaryAlt: string;
    secondaryImage?: string;
    secondaryAlt?: string;
    blueLabelImage: string;
    blueLabelAlt: string;
    orangeLabelImage: string;
    orangeLabelAlt: string;
    currentPlayerIcon: string;
    currentPlayerAlt: string;
    exitIcon: string;
    exitIconAlt: string;
};


const themePreviewData: Record<string, ThemePreview> = {
    "code-vibes": {
        previewClass: "settings-page__preview-content--code-vibes",
        primaryImage: "/img/settings-page/gaming-theme/code-vibes/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/code-vibes/card-back.png",
        secondaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/code-vibes/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/code-vibes/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/code-vibes/blue-label.png",
        currentPlayerAlt: "Current player blue",
        exitIcon: "/img/settings-page/gaming-theme/code-vibes/exit-game.png",
        exitIconAlt: "Exit game",
    },
    gaming: {
        previewClass: "settings-page__preview-content--gaming",
        primaryImage: "/img/settings-page/gaming-theme/gaming/card-back.png",
        primaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/gaming/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/gaming/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/gaming/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/gaming/exit-game-icon.png",
        exitIconAlt: "Exit game",
    },
    "da-projects": {
        previewClass: "settings-page__preview-content--da-projects",
        primaryImage: "/img/settings-page/gaming-theme/da-projects/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/da-projects/card-back.png",
        secondaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/da-projects/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/da-projects/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/da-projects/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/da-projects/exit-game-icon.png",
        exitIconAlt: "Exit game",
    },
    foods: {
        previewClass: "settings-page__preview-content--foods",
        primaryImage: "/img/settings-page/gaming-theme/foods/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/foods/card-back.png",
        secondaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/foods/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/foods/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/foods/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/foods/exit-game-button.png",
        exitIconAlt: "Exit game",
    },
};


type CurrentPlayerDisplay =
    | {
        type: "image";
        currentPlayerBlueImage: string;
        currentPlayerOrangeImage: string;
        currentPlayerAlt: string;
    }
    | {
        type: "badge";
        iconImage: string;
        alt: string;
    };


type GameTheme = {
    playingFieldClass: string;
    blueLabelImage: string;
    blueLabelAlt: string;
    orangeLabelImage: string;
    orangeLabelAlt: string;
    currentPlayer: CurrentPlayerDisplay;
    exitIcon: string;
    exitIconHover?: string;
    exitIconAlt: string;
    cardFrontImage?: string;
    cardFrontAlt: string;
    cardBackImage: string;
    cardBackAlt: string;
};


const gameThemeData: Record<string, GameTheme> = {
    "code-vibes": {
        playingFieldClass: "playing-field--code-vibes",

        blueLabelImage: "/img/game-field/code-vibes/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/code-vibes/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "image",
            currentPlayerBlueImage: "/img/game-field/code-vibes/blue-label.png",
            currentPlayerOrangeImage: "/img/game-field/code-vibes/orange-label.png",
            currentPlayerAlt: "Current player",
        },

        exitIcon: "/img/game-field/code-vibes/exit-game.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/code-vibes/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",

        cardBackImage: "/img/game-field/code-vibes/cards/git.png",
        cardBackAlt: "Card back",
    },
    "gaming": {
        playingFieldClass: "playing-field--gaming",

        blueLabelImage: "/img/game-field/gaming/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/gaming/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/gaming/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/gaming/exit-game-icon.png",
        exitIconHover: "/img/game-field/gaming/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontAlt: "Card front",

        cardBackImage: "/img/game-field/gaming/cards/dice.png",
        cardBackAlt: "Card back",
    },
    "da-projects": {
        playingFieldClass: "playing-field--da-projects",

        blueLabelImage: "/img/game-field/da-projects/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/da-projects/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/da-projects/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/da-projects/exit-game-icon.png",
        exitIconHover: "/img/game-field/da-projects/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/da-projects/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",

        cardBackImage: "/img/game-field/da-projects/card-back.png",
        cardBackAlt: "Card back",
    },
    "foods": {
        playingFieldClass: "playing-field--foods",

        blueLabelImage: "/img/game-field/foods/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/foods/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/foods/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/foods/exit-game-icon.png",
        exitIconHover: "/img/game-field/foods/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/foods/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",

        cardBackImage: "/img/game-field/foods/card-back.png",
        cardBackAlt: "Card back",
    }
};


let selectedTheme = "code-vibes";
let currentPreviewTheme = "code-vibes";
let pendingPreviewTheme: string | undefined;
let previewFadeTimeout: number | undefined;

function setupThemePreview() {
    const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]');

    themeInputs.forEach((input) => {
        const optionLabel = input.closest("label");

        optionLabel?.addEventListener("mouseenter", () => {
            updateSettingsPreview(input.value);
        });

        optionLabel?.addEventListener("mouseleave", () => {
            updateSettingsPreview(selectedTheme);
        });

        input.addEventListener("change", () => {
            selectedTheme = input.value;
            if (currentPreviewTheme !== selectedTheme && pendingPreviewTheme !== selectedTheme) {
                updateSettingsPreview(selectedTheme);
            }
        });
    });
}


function updateSettingsPreview(theme: string) {
    const settingsPreview = document.getElementById("settingsPreview");

    if (!settingsPreview) {
        return;
    }

    if (currentPreviewTheme === theme || pendingPreviewTheme === theme) {
        return;
    }

    window.clearTimeout(previewFadeTimeout);
    pendingPreviewTheme = theme;
    settingsPreview.classList.add("settings-page__preview-content--is-changing");

    previewFadeTimeout = window.setTimeout(() => {
        applySettingsPreview(theme);
        currentPreviewTheme = theme;
        pendingPreviewTheme = undefined;
        settingsPreview.classList.remove("settings-page__preview-content--is-changing");
    }, 120);
}


function applySettingsPreview(theme: string) {
    const settingsPreview = document.getElementById("settingsPreview");
    const primaryCard = document.getElementById("settingsPreviewPrimaryCard") as HTMLImageElement;
    const secondaryCard = document.getElementById("settingsPreviewSecondaryCard") as HTMLImageElement;
    const blueLabel = document.getElementById("settingsPreviewBlueLabel") as HTMLImageElement;
    const orangeLabel = document.getElementById("settingsPreviewOrangeLabel") as HTMLImageElement;
    const currentPlayerIcon = document.getElementById("settingsPreviewCurrentPlayerIcon") as HTMLImageElement;
    const exitIcon = document.getElementById("settingsPreviewExitIcon") as HTMLImageElement;
    const themePreview = themePreviewData[theme] ?? themePreviewData["code-vibes"];

    if (!settingsPreview || !primaryCard || !secondaryCard || !blueLabel || !orangeLabel || !currentPlayerIcon || !exitIcon) {
        return;
    }

    settingsPreview.classList.remove(...Object.values(themePreviewData).map((preview) => preview.previewClass));
    settingsPreview.classList.add(themePreview.previewClass);
    settingsPreview.dataset.themePreview = themePreviewData[theme] ? theme : "code-vibes";

    primaryCard.src = themePreview.primaryImage;
    primaryCard.alt = themePreview.primaryAlt;
    blueLabel.src = themePreview.blueLabelImage;
    blueLabel.alt = themePreview.blueLabelAlt;
    orangeLabel.src = themePreview.orangeLabelImage;
    orangeLabel.alt = themePreview.orangeLabelAlt;
    currentPlayerIcon.src = themePreview.currentPlayerIcon;
    currentPlayerIcon.alt = themePreview.currentPlayerAlt;
    exitIcon.src = themePreview.exitIcon;
    exitIcon.alt = themePreview.exitIconAlt;

    if (themePreview.secondaryImage && themePreview.secondaryAlt) {
        secondaryCard.hidden = false;
        secondaryCard.src = themePreview.secondaryImage;
        secondaryCard.alt = themePreview.secondaryAlt;
        return;
    }

    secondaryCard.hidden = true;
    secondaryCard.removeAttribute("src");
    secondaryCard.alt = "";
}


function updateSettingsSummary() {
    const selectedTheme = document.querySelector<HTMLInputElement>('input[name="game-theme"]:checked')?.value;
    const selectedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
    const selectedBoardSize = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;

    const summaryTheme = document.getElementById("settingsSummaryTheme");
    const summaryPlayer = document.getElementById("settingsSummaryPlayer");
    const summaryBoardSize = document.getElementById("settingsSummaryBoardSize");
    const startButton = document.getElementById("startGameBtn") as HTMLButtonElement;

    if (summaryTheme) {
        summaryTheme.textContent = getThemeSummaryText(selectedTheme);
    }

    if (summaryPlayer) {
        summaryPlayer.textContent = getPlayerSummaryText(selectedPlayer);
    }

    if (summaryBoardSize) {
        summaryBoardSize.textContent = getBoardSizeSummaryText(selectedBoardSize);
    }

    if (startButton) {
        startButton.disabled = !(selectedTheme && selectedPlayer && selectedBoardSize);
    }
}

function setupSettingsSelection() {
    const settingsInputs = document.querySelectorAll<HTMLInputElement>(
        'input[name="game-theme"], input[name="player"], input[name="board-size"]'
    );

    settingsInputs.forEach((input) => {
        input.addEventListener("change", updateSettingsSummary);
    });
}


function getThemeSummaryText(theme: string | undefined) {
    if (theme === "code-vibes") {
        return "Code Vibe theme";
    }
    if (theme === "gaming") {
        return "Game theme";
    }
    if (theme === "da-projects") {
        return "DA Project theme";
    }
    if (theme === "foods") {
        return "Food theme";
    }
    return "Theme";
}


function getPlayerSummaryText(player: string | undefined) {
    if (player === "blue") {
        return "Blue Player";
    }
    if (player === "orange") {
        return "Orange Player";
    }
    return "Player";
}


function getBoardSizeSummaryText(boardSize: string | undefined) {
    if (!boardSize) {
        return "Board size";
    }
    return "Board-" + boardSize + " Cards";
}


function startGame() {
    const startButton = document.getElementById("startGameBtn");
    const settingsPage = document.getElementById("settingsPage");
    const playingField = document.getElementById("playingField");
    startButton?.addEventListener("click", () => {
        if (settingsPage && playingField) {
            showPage(settingsPage, playingField);
            const gameConfig = getGameConfig();
            cancelCardReset();
            cancelGameOver();
            gameState = createInitialGameState(gameConfig.currentPlayer);
            updateScoreDisplay();
            applyPlayingFieldTheme(gameConfig);
            applyGameHeader(gameConfig);
            gameState.cards = createShuffledDeck(gameConfig.selectedTheme);
            gameState.status = "playing";
            renderPlayingFieldCards(gameConfig.selectedTheme, gameState.cards);
            applyBoardSizeClass(gameConfig.cardCount);
        }
    });
}


function getInputData() {
    const selectedTheme = document.querySelector<HTMLInputElement>('input[name="game-theme"]:checked')?.value;
    const selectedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
    const selectedBoardSize = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;
    return {
        selectedTheme,
        selectedPlayer,
        selectedBoardSize,
    };
}


function getGameConfig() {
    const { selectedTheme, selectedPlayer, selectedBoardSize } = getInputData();
    const gameTheme = gameThemeData[selectedTheme ?? "code-vibes"];
    const cardCount = Number(selectedBoardSize ?? 16);
    const currentPlayer: Player = selectedPlayer === "orange" ? "orange" : "blue";
    return {
        selectedTheme: selectedTheme ?? "code-vibes",
        currentPlayer,
        cardCount,
        gameTheme,
    };
}


type GameConfig = ReturnType<typeof getGameConfig>;


function applyGameHeader(gameConfig: GameConfig) {
    const blueLabel = document.getElementById("gameHeaderBlueLabel") as HTMLImageElement;
    const orangeLabel = document.getElementById("gameHeaderOrangeLabel") as HTMLImageElement;
    const exitIcon = document.getElementById("gameHeaderExitIcon") as HTMLImageElement;
    const exitIconHover = document.getElementById("gameHeaderExitIconHover") as HTMLImageElement;
    blueLabel.src = gameConfig.gameTheme.blueLabelImage;
    orangeLabel.src = gameConfig.gameTheme.orangeLabelImage;
    exitIcon.src = gameConfig.gameTheme.exitIcon;
    exitIcon.alt = gameConfig.gameTheme.exitIconAlt;
    exitIconHover.src = gameConfig.gameTheme.exitIconHover ?? gameConfig.gameTheme.exitIcon;
    applyCurrentPlayer(gameConfig);
}


function applyBoardSizeClass(cardCount: number) {
    const playingFieldBoard = document.getElementById("playingFieldBoard");
    if (!playingFieldBoard) {
        return;
    }
    playingFieldBoard.classList.remove(
        "playing-field__board--size-16",
        "playing-field__board--size-24",
        "playing-field__board--size-36"
    );
    playingFieldBoard.classList.add(`playing-field__board--size-${cardCount}`);
}

function applyPlayingFieldTheme(gameConfig: GameConfig) {
    const playingField = document.getElementById("playingField");
    if (!playingField) {
        return;
    }
    playingField.classList.remove(
        "playing-field--code-vibes",
        "playing-field--gaming",
        "playing-field--da-projects",
        "playing-field--foods"
    );

    playingField.classList.add(gameConfig.gameTheme.playingFieldClass);
}


function exitGame() {
    const exitButton = document.getElementById("exitGameBtn");
    const settingsPage = document.getElementById("settingsPage");
    const playingField = document.getElementById("playingField");
    exitButton?.addEventListener("click", () => {
        if (settingsPage && playingField) {
            cancelCardReset();
            cancelGameOver();
            gameState.status = "idle";
            showPage(playingField, settingsPage);
        }
    });
}


function applyCurrentPlayer(gameConfig: GameConfig) {
    if (gameConfig.gameTheme.currentPlayer.type === "image") {
        applyCurrentPlayerImage(gameConfig);
        return;
    }
    applyCurrentPlayerBadge(gameConfig);
}


function applyCurrentPlayerImage(gameConfig: GameConfig) {
    const currentPlayer = gameConfig.gameTheme.currentPlayer;
    if (currentPlayer.type !== "image") {
        return;
    }
    const currentPlayerIcon = document.getElementById("gameHeaderCurrentPlayerIcon") as HTMLImageElement;
    currentPlayerIcon.src =
        gameState.currentPlayer === "orange"
            ? currentPlayer.currentPlayerOrangeImage
            : currentPlayer.currentPlayerBlueImage;
    currentPlayerIcon.alt = currentPlayer.currentPlayerAlt;
}


function applyCurrentPlayerBadge(gameConfig: GameConfig) {
    const currentPlayer = gameConfig.gameTheme.currentPlayer;
    if (currentPlayer.type !== "badge") {
        return;
    }
    const currentPlayerBadge = document.getElementById("gameHeaderCurrentPlayerBadge");
    const currentPlayerIcon = document.getElementById("gameHeaderCurrentPlayerIcon") as HTMLImageElement;
    currentPlayerIcon.src = currentPlayer.iconImage;
    currentPlayerIcon.alt = currentPlayer.alt;
    updateCurrentPlayerBadgeColor(currentPlayerBadge, gameState.currentPlayer);
}


function updateCurrentPlayerBadgeColor(currentPlayerBadge: HTMLElement | null, currentPlayer: string) {
    currentPlayerBadge?.classList.remove(
        "game-header__current-player-icon--blue",
        "game-header__current-player-icon--orange"
    );
    currentPlayerBadge?.classList.add(
        currentPlayer === "blue"
            ? "game-header__current-player-icon--blue"
            : "game-header__current-player-icon--orange"
    );
}


function initCard() {
    const fieldRef = document.getElementById("playingFieldBoard");
    if (fieldRef) {
        fieldRef.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".memory-card");
            if (card instanceof HTMLElement) {
                openCard(card, getGameConfig());
            }
        });
    }
}
