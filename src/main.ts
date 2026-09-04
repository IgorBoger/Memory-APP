init();


function init() {
    startSettingsPage();
    setupThemePreview();
    updateSettingsSummary();
    setupSettingsSelection();
    startGame();
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


function renderPlayingFieldCards(selectedTheme: string, cardCount: number) {
    const playingFieldBoard = document.getElementById("playingFieldBoard");
    if (playingFieldBoard) {
        playingFieldBoard.innerHTML = "";
        for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
            const memoryCard = document.createElement("button");
            const gameTheme = gameThemeData[selectedTheme];
            memoryCard.className = "memory-card";
            memoryCard.innerHTML = `
            <div class="memory-card__inner">
                <div class="memory-card__face memory-card__face--front">
                    <img class="memory-card__image"
                    src="${gameTheme.cardFrontImage}"
                    alt="Code vibes card">
                </div>
                <div class="memory-card__face memory-card__face--back">
                    <img class="memory-card__image"
                    src="${gameTheme.cardBackImage}"
                    alt="Git card">
                </div>
            </div>`;
            playingFieldBoard.appendChild(memoryCard);
        }
    }
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
        primaryImage: "/img/settings-page/gaming-theme/code-vibes/dev-logo.png",
        primaryAlt: "Code vibes card",
        secondaryImage: "/img/settings-page/gaming-theme/code-vibes/git-logo.png",
        secondaryAlt: "Git card",
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
        primaryImage: "/img/settings-page/gaming-theme/gaming/dice-card.png",
        primaryAlt: "Gaming dice card",
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
        primaryImage: "/img/settings-page/gaming-theme/da-projects/dev-card.png",
        primaryAlt: "DA Projects card",
        secondaryImage: "/img/settings-page/gaming-theme/da-projects/project-card.png",
        secondaryAlt: "DA Projects card back",
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
        primaryImage: "/img/settings-page/gaming-theme/foods/dev-card.png",
        primaryAlt: "Foods code card",
        secondaryImage: "/img/settings-page/gaming-theme/foods/food-card.png",
        secondaryAlt: "Foods card",
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
    cardFrontImage: string;
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

        cardFrontImage: "/img/settings-page/gaming-theme/code-vibes/dev-logo.png",
        cardFrontAlt: "Code vibes card",

        cardBackImage: "/img/settings-page/gaming-theme/code-vibes/git-logo.png",
        cardBackAlt: "Git card",
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

        cardFrontImage: "/img/game-field/gaming/card-front.png",
        cardFrontAlt: "Gaming card front",

        cardBackImage: "/img/game-field/gaming/card-back.png",
        cardBackAlt: "Gaming card back",
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
        cardFrontAlt: "DA Projects card front",

        cardBackImage: "/img/game-field/da-projects/card-back.png",
        cardBackAlt: "DA Projects card back",
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
            applyPlayingFieldTheme(gameConfig);
            applyGameHeader(gameConfig);
            renderPlayingFieldCards(gameConfig.selectedTheme, gameConfig.cardCount);
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
    const currentPlayer = selectedPlayer ?? "blue";
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