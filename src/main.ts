import type {
    Card, CardMotif, CurrentPlayerDisplay,
    GameConfig, GameState, GameTheme,
    PausableTimer, Player, QuitPopupTheme,
    ResultTheme, ThemePreview,
} from "./types";


import { cardMotifsByTheme } from "./card-data";
import { setupSettingsGroups, updateSettingsGroupLabels } from "./settings-groups";

import {
    gameThemeData, quitPopupThemeData,
    resultThemeData, themePreviewData
} from "./theme-data";


let gameState: GameState = createInitialGameState("blue");
const cardResetTimer = createPausableTimer();
const gameOverTimer = createPausableTimer();
let resultOverlayTimeout: number | undefined;
let selectedTheme = "code-vibes";
let currentPreviewTheme = "code-vibes";
let pendingPreviewTheme: string | undefined;
let previewFadeTimeout: number | undefined;
let quitPopupTrigger: HTMLElement | null = null;


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


function createPausableTimer(): PausableTimer {
    return {
        timeoutId: undefined,
        remaining: 0,
        startedAt: 0,
        action: undefined,
    };
}


function cancelTimer(timer: PausableTimer) {
    window.clearTimeout(timer.timeoutId);
    timer.timeoutId = undefined;
    timer.remaining = 0;
    timer.action = undefined;
}


function finishTimer(timer: PausableTimer) {
    const callback = timer.action;
    cancelTimer(timer);
    callback?.();
}


function resumeTimer(timer: PausableTimer) {
    if (!timer.action || timer.timeoutId !== undefined) return;
    timer.startedAt = performance.now();
    timer.timeoutId = window.setTimeout(
        () => finishTimer(timer),
        timer.remaining
    );
}


function pauseTimer(timer: PausableTimer) {
    if (timer.timeoutId === undefined) return;
    window.clearTimeout(timer.timeoutId);
    timer.timeoutId = undefined;
    const elapsed = performance.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
}


function startTimer(
    timer: PausableTimer,
    callback: () => void,
    delay: number
) {
    cancelTimer(timer);
    timer.action = callback;
    timer.remaining = delay;
    resumeTimer(timer);
}


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
    const deck = getCardMotifs(selectedTheme).map(createCard);
    shuffleCards(deck);
    return deck;
}


function createCard(motif: CardMotif, index: number): Card {
    return { id: index, motifId: motif.id, image: motif.image, alt: motif.alt, isMatched: false };
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
    setupSettingsGroups();
    setupThemePreview();
    updateSettingsSummary();
    setupSettingsSelection();
    startGame();
    initCard();
    exitGame();
    setupQuitPopup();
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
    if (!playingFieldBoard) return;
    playingFieldBoard.replaceChildren(...cards.map((card, index) => createMemoryCard(selectedTheme, card, index)));
}


function createMemoryCard(selectedTheme: string, card: Card, index: number) {
    const memoryCard = document.createElement("button");
    const gameTheme = gameThemeData[selectedTheme];
    memoryCard.className = "memory-card";
    memoryCard.dataset.cardId = String(card.id);
    memoryCard.innerHTML = createMemoryCardMarkup(gameTheme, card, index);
    return memoryCard;
}


function createMemoryCardMarkup(theme: GameTheme, card: Card, index: number) {
    const front = theme.cardFrontImage
        ? `<img class="memory-card__image" src="${theme.cardFrontImage}" alt="${theme.cardFrontAlt}">` : "";
    return `<div class="memory-card__inner"><div class="memory-card__face memory-card__face--front">${front}</div>` +
        `<div class="memory-card__face memory-card__face--back"><img class="memory-card__image" id="memoryCardBack${index}" src="${card.image}" alt="${card.alt}"></div></div>`;
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
    startTimer(cardResetTimer, () => {
        closeSelectedCards(gameConfig);
    }, 1000);
}


function checkGameOver() {
    if (gameState.cards.length > 0 && gameState.cards.every(card => card.isMatched)) {
        gameState.isLocked = true;
        startTimer(gameOverTimer, () => {
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
    startTimer(cardResetTimer, () => {
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
    cancelResultOverlay();
    const winner = getWinningPlayer();
    resultOverlayTimeout = window.setTimeout(() => {
        resultOverlayTimeout = undefined;
        if (gameState.status !== "finished") return;
        showResultOverlay(winner, gameOver);
    }, 3000);
}

function showResultOverlay(winner: Player | null, gameOver: HTMLElement) {
    if (winner) {
        showWinnerOverlay(winner, gameOver);
    } else {
        showDrawOverlay(gameOver);
    }
}


function cancelResultOverlay() {
    window.clearTimeout(resultOverlayTimeout);
    resultOverlayTimeout = undefined;
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
    cancelTimer(cardResetTimer);
}


function cancelGameOver() {
    cancelTimer(gameOverTimer);
}


function setupThemePreview() {
    const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]');
    themeInputs.forEach(setupThemeInput);
}


function setupThemeInput(input: HTMLInputElement) {
    const label = input.closest("label");
    label?.addEventListener("mouseenter", () => updateSettingsPreview(input.value));
    label?.addEventListener("mouseleave", () => updateSettingsPreview(selectedTheme));
    input.addEventListener("change", () => selectPreviewTheme(input.value));
}


function selectPreviewTheme(theme: string) {
    selectedTheme = theme;
    if (currentPreviewTheme !== theme && pendingPreviewTheme !== theme) updateSettingsPreview(theme);
}


function updateSettingsPreview(theme: string) {
    const settingsPreview = document.getElementById("settingsPreview");
    if (!settingsPreview) return;
    if (currentPreviewTheme === theme || pendingPreviewTheme === theme) return;
    preparePreviewTransition(settingsPreview, theme);
    previewFadeTimeout = window.setTimeout(() => finishPreviewTransition(theme, settingsPreview), 120);
}


function preparePreviewTransition(preview: HTMLElement, theme: string) {
    window.clearTimeout(previewFadeTimeout);
    pendingPreviewTheme = theme;
    preview.classList.add("settings-page__preview-content--is-changing");
}


function finishPreviewTransition(theme: string, preview: HTMLElement) {
    applySettingsPreview(theme);
    currentPreviewTheme = theme;
    pendingPreviewTheme = undefined;
    preview.classList.remove("settings-page__preview-content--is-changing");
}


function applySettingsPreview(theme: string) {
    const { settingsPreview, primaryCard, secondaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon } = getPreviewElements();
    const themePreview = themePreviewData[theme] ?? themePreviewData["code-vibes"];
    if (!settingsPreview || !primaryCard || !secondaryCard || !blueLabel ||
        !orangeLabel || !currentPlayerIcon || !exitIcon) return;
    applyPreviewTheme(settingsPreview, themePreview, theme);
    setPreviewImages(themePreview, primaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon);
    setSecondaryPreview(themePreview, secondaryCard);
}


function getPreviewElements() {
    return {
        settingsPreview: document.getElementById("settingsPreview"),
        primaryCard: document.getElementById("settingsPreviewPrimaryCard") as HTMLImageElement,
        secondaryCard: document.getElementById("settingsPreviewSecondaryCard") as HTMLImageElement,
        blueLabel: document.getElementById("settingsPreviewBlueLabel") as HTMLImageElement,
        orangeLabel: document.getElementById("settingsPreviewOrangeLabel") as HTMLImageElement,
        currentPlayerIcon: document.getElementById("settingsPreviewCurrentPlayerIcon") as HTMLImageElement,
        exitIcon: document.getElementById("settingsPreviewExitIcon") as HTMLImageElement,
    };
}


function applyPreviewTheme(preview: HTMLElement, themeData: ThemePreview, theme: string) {
    preview.classList.remove(...Object.values(themePreviewData).map(data => data.previewClass));
    preview.classList.add(themeData.previewClass);
    preview.dataset.themePreview = themePreviewData[theme] ? theme : "code-vibes";
}


function setPreviewImages(data: ThemePreview, primary: HTMLImageElement, blue: HTMLImageElement, orange: HTMLImageElement, player: HTMLImageElement, exit: HTMLImageElement) {
    setImage(primary, data.primaryImage, data.primaryAlt);
    setImage(blue, data.blueLabelImage, data.blueLabelAlt);
    setImage(orange, data.orangeLabelImage, data.orangeLabelAlt);
    setImage(player, data.currentPlayerIcon, data.currentPlayerAlt);
    setImage(exit, data.exitIcon, data.exitIconAlt);
}


function setImage(image: HTMLImageElement, src: string, alt: string) {
    image.src = src;
    image.alt = alt;
}


function setSecondaryPreview(data: ThemePreview, card: HTMLImageElement) {
    if (data.secondaryImage && data.secondaryAlt) return showSecondaryPreview(card, data.secondaryImage, data.secondaryAlt);
    card.hidden = true;
    card.removeAttribute("src");
    card.alt = "";
}


function showSecondaryPreview(card: HTMLImageElement, src: string, alt: string) {
    card.hidden = false;
    setImage(card, src, alt);
}


function updateSettingsSummary() {
    updateSettingsGroupLabels();
    const { selectedTheme, selectedPlayer, selectedBoardSize } = getInputData();
    const { summaryTheme, summaryPlayer, summaryBoardSize, startButton } = getSummaryElements();
    setSummaryText(summaryTheme, getThemeSummaryText(selectedTheme));
    setSummaryText(summaryPlayer, getPlayerSummaryText(selectedPlayer));
    setSummaryText(summaryBoardSize, getBoardSizeSummaryText(selectedBoardSize));
    if (startButton) startButton.disabled = !(selectedTheme && selectedPlayer && selectedBoardSize);
}


function getSummaryElements() {
    return {
        summaryTheme: document.getElementById("settingsSummaryTheme"),
        summaryPlayer: document.getElementById("settingsSummaryPlayer"),
        summaryBoardSize: document.getElementById("settingsSummaryBoardSize"),
        startButton: document.getElementById("startGameBtn") as HTMLButtonElement,
    };
}


function setSummaryText(element: HTMLElement | null, text: string) {
    if (element) element.textContent = text;
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
    return { "code-vibes": "Code Vibe theme", gaming: "Game theme", "da-projects": "DA Project theme", foods: "Food theme" }[theme ?? ""] ?? "Theme";
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
    if (!boardSize) return "Board size";
    return "Board-" + boardSize + " Cards";
}


function startGame() {
    const startButton = document.getElementById("startGameBtn");
    const settingsPage = document.getElementById("settingsPage");
    const playingField = document.getElementById("playingField");
    startButton?.addEventListener("click", () => beginGame(settingsPage, playingField));
}


function beginGame(settingsPage: HTMLElement | null, playingField: HTMLElement | null) {
    if (!settingsPage || !playingField) return;
    const config = getGameConfig();
    showPage(settingsPage, playingField);
    resetGameForStart(config);
    renderPlayingFieldCards(config.selectedTheme, gameState.cards);
    applyBoardSizeClass(config.cardCount);
}


function resetGameForStart(config: GameConfig) {
    cancelCardReset();
    cancelGameOver();
    gameState = createInitialGameState(config.currentPlayer);
    updateScoreDisplay();
    applyPlayingFieldTheme(config);
    applyGameHeader(config);
    gameState.cards = createShuffledDeck(config.selectedTheme);
    gameState.status = "playing";
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
    if (!playingField) return;
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
    exitButton?.addEventListener("click", () => {
        openQuitPopup(exitButton);
    });
}


function setupQuitPopup() {
    const popup = document.getElementById("quitPopup");
    const panel = popup?.querySelector<HTMLElement>(".quit-popup__panel");
    const backButton = document.getElementById("quitPopupBack");
    const exitButton = document.getElementById("quitPopupExit");
    if (!popup || !panel || !backButton || !exitButton) return;
    backButton.addEventListener("click", resumeGame);
    popup.querySelector("[data-quit-popup-close]")?.addEventListener("click", resumeGame);
    exitButton.addEventListener("click", exitCurrentGame);
    popup.addEventListener("keydown", event => handleQuitPopupKeydown(event, panel));
}

function handleQuitPopupKeydown(event: KeyboardEvent, panel: HTMLElement) {
    if (event.key === "Escape") return event.preventDefault(), resumeGame();
    if (event.key !== "Tab") return;
    const items = panel.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
    const first = items[0], last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) event.preventDefault(), last.focus();
    if (!event.shiftKey && document.activeElement === last) event.preventDefault(), first.focus();
}


function openQuitPopup(trigger: HTMLElement) {
    if (gameState.status !== "playing") return;
    const popup = document.getElementById("quitPopup");
    const backButton = document.getElementById("quitPopupBack") as HTMLButtonElement | null;
    if (!popup || !backButton) return;
    quitPopupTrigger = trigger;
    pauseGameTimers();
    applyQuitPopupTheme(popup);
    showQuitPopup(popup, backButton);
}


function pauseGameTimers() {
    pauseTimer(cardResetTimer);
    pauseTimer(gameOverTimer);
}


function showQuitPopup(popup: HTMLElement, backButton: HTMLButtonElement) {
    popup.hidden = false;
    requestAnimationFrame(() => {
        popup.classList.add("quit-popup--is-open");
        backButton.focus();
    });
}


function applyQuitPopupTheme(popup: HTMLElement) {
    const theme = quitPopupThemeData[getGameConfig().selectedTheme]
        ?? quitPopupThemeData["code-vibes"];
    popup.classList.remove(...Object.values(quitPopupThemeData).map(theme => theme.popupClass));
    popup.classList.add(theme.popupClass);
    document.getElementById("quitPopupTitle")!.textContent = theme.title;
    document.getElementById("quitPopupBack")!.textContent = theme.backLabel;
    document.getElementById("quitPopupExit")!.textContent = theme.exitLabel;
}


function closeQuitPopup() {
    const popup = document.getElementById("quitPopup");
    if (!popup) return;
    popup.classList.remove("quit-popup--is-open");
    window.setTimeout(() => {
        popup.hidden = true;
        quitPopupTrigger?.focus();
        quitPopupTrigger = null;
    }, 300);
}


function resumeGame() {
    const popup = document.getElementById("quitPopup");
    if (!popup?.classList.contains("quit-popup--is-open")) return;
    closeQuitPopup();
    if (gameState.status !== "playing") return;
    resumeTimer(cardResetTimer);
    resumeTimer(gameOverTimer);
}


function exitCurrentGame() {
    const settingsPage = document.getElementById("settingsPage");
    const playingField = document.getElementById("playingField");
    if (!settingsPage || !playingField) return;
    closeQuitPopup();
    cancelCardReset();
    cancelGameOver();
    cancelResultOverlay();
    gameState.status = "idle";
    showPage(playingField, settingsPage);
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
    if (currentPlayer.type !== "image") return;
    const currentPlayerIcon = document.getElementById("gameHeaderCurrentPlayerIcon") as HTMLImageElement;
    currentPlayerIcon.src =
        gameState.currentPlayer === "orange"
            ? currentPlayer.currentPlayerOrangeImage
            : currentPlayer.currentPlayerBlueImage;
    currentPlayerIcon.alt = currentPlayer.currentPlayerAlt;
}


function applyCurrentPlayerBadge(gameConfig: GameConfig) {
    const currentPlayer = gameConfig.gameTheme.currentPlayer;
    if (currentPlayer.type !== "badge") return;
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
