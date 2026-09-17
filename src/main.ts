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


const codeVibesMotifs: CardMotif[] = [
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
];


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


function getPairCount(): number {
    const cardCount = parseInt(document.querySelector<HTMLInputElement>
        ('input[name="board-size"]:checked')?.value || "0", 10);
    return cardCount / 2;
}


function getCodeVibesMotifs() {
    const pairCount = getPairCount();
    const motifs = codeVibesMotifs.slice(0, pairCount);
    return [...motifs, ...motifs];
}


function createShuffledCodeVibesDeck() {
    const motifs = getCodeVibesMotifs();

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


function openCard(cardElement: HTMLElement) {
    if (gameState.status !== "playing" || gameState.isLocked) return;
    const cardId = Number(cardElement.dataset.cardId);
    const card = gameState.cards.find(card => card.id === cardId);
    if (!card || card.isMatched) return;
    if (gameState.flippedCardIds.includes(cardId)) return;
    gameState.flippedCardIds.push(cardId);
    cardElement.classList.add("is-flipped");
    if (gameState.flippedCardIds.length === 2) {
        gameState.isLocked = true;
        checkSelectedPair();
    }
}


function checkSelectedPair() {
    const firstCardId = gameState.flippedCardIds[0];
    const secondCardId = gameState.flippedCardIds[1];

    const firstCard = gameState.cards.find(card => card.id === firstCardId);
    const secondCard = gameState.cards.find(card => card.id === secondCardId);

    if (firstCard && secondCard && firstCard.motifId === secondCard.motifId) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        const firstCardElement = document.querySelector(
            `#playingFieldBoard .memory-card[data-card-id="${firstCardId}"]`
        );
        const secondCardElement = document.querySelector(
            `#playingFieldBoard .memory-card[data-card-id="${secondCardId}"]`
        );
        firstCardElement?.classList.add("is-matched");
        secondCardElement?.classList.add("is-matched");
        gameState.flippedCardIds = [];
        gameState.isLocked = false;
    } else {
        cardResetTimeout = window.setTimeout(() => {
            cardResetTimeout = undefined;
            closeSelectedCards();
        }, 1000);
    }
}


function closeSelectedCards() {
    gameState.flippedCardIds.forEach(cardId => {
        const cardElement = document.querySelector(
            `#playingFieldBoard .memory-card[data-card-id="${cardId}"]`
        );
        cardElement?.classList.remove("is-flipped");
    });

    gameState.flippedCardIds = [];
    gameState.isLocked = false;
}


function cancelCardReset() {
    window.clearTimeout(cardResetTimeout);
    cardResetTimeout = undefined;
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

        cardBackImage: "/img/game-field/gaming/card-back.png",
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
            gameState = createInitialGameState(gameConfig.currentPlayer);
            applyPlayingFieldTheme(gameConfig);
            applyGameHeader(gameConfig);
            gameState.cards = createShuffledCodeVibesDeck();
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
        gameConfig.currentPlayer === "orange"
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
    updateCurrentPlayerBadgeColor(currentPlayerBadge, gameConfig.currentPlayer);
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
                openCard(card);
            }
        });
    }
}
