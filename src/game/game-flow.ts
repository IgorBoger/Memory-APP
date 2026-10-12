import type { Card, GameConfig } from "../types";
import { startTimer } from "./timers";
import { showPage, fadeInElement } from "../ui/navigation";
import { getGameConfig } from "../ui/settings";
import { applyGameHeader, applyBoardSizeClass, applyPlayingFieldTheme, applyCurrentPlayer } from "../ui/game-header";
import { createShuffledDeck, renderPlayingFieldCards, markCardAsMatched } from "./cards";
import { showGameOver } from "../ui/results";
import { cancelCardReset, cancelGameOver, resetGameState, gameState, cardResetTimer, gameOverTimer } from "../app-context";

/**
 * Compares the two selected cards and handles a match or a mismatch.
 *
 * @param gameConfig - Settings used to update the player display after a mismatch.
 */
export function checkSelectedPair(gameConfig: GameConfig) {
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


/**
 * Awards a point, marks the pair as matched, and checks for game completion.
 */
function handleMatchedPair(firstCard: Card, secondCard: Card) {
  markCardAsMatched(firstCard);
  markCardAsMatched(secondCard);
  gameState.scores[gameState.currentPlayer]++;
  updateScoreDisplay();
  gameState.flippedCardIds = [];
  gameState.isLocked = false;
  checkGameOver();
}


/**
 * Schedules a mismatched pair to be hidden after one second.
 */
function scheduleCardReset(gameConfig: GameConfig) {
  startTimer(cardResetTimer, () => {
    closeSelectedCards(gameConfig);
  }, 1000);
}


/**
 * Locks a fully matched board and schedules the game-over screen.
 */
function checkGameOver() {
  if (gameState.cards.length > 0 && gameState.cards.every(card => card.isMatched)) {
    gameState.isLocked = true;
    startTimer(gameOverTimer, () => {
      showGameOver();
    }, 1000);
  }
}


/**
 * Hides the selected pair and switches players after 500 milliseconds.
 */
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


/**
 * Switches between blue and orange and updates the current-player display.
 */
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


/**
 * Updates the score elements and animates any changed scores.
 */
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


/**
 * Registers the start-button click handler. Call once; the game starts on a later click.
 */
export function startGame() {
  const startButton = document.getElementById("startGameBtn");
  const settingsPage = document.getElementById("settingsPage");
  const playingField = document.getElementById("playingField");
  startButton?.addEventListener("click", () => beginGame(settingsPage, playingField));
}


/**
 * Opens the playing field, resets the game state, and renders a new deck.
 */
function beginGame(settingsPage: HTMLElement | null, playingField: HTMLElement | null) {
  if (!settingsPage || !playingField) return;
  const config = getGameConfig();
  showPage(settingsPage, playingField);
  resetGameForStart(config);
  renderPlayingFieldCards(config.selectedTheme, gameState.cards);
  applyBoardSizeClass(config.cardCount);
}


/**
 * Stops the game timers and prepares the state, theme, player display, and deck.
 */
function resetGameForStart(config: GameConfig) {
  cancelCardReset();
  cancelGameOver();
  resetGameState(config.currentPlayer);
  updateScoreDisplay();
  applyPlayingFieldTheme(config);
  applyGameHeader(config);
  gameState.cards = createShuffledDeck(config.selectedTheme);
  gameState.status = "playing";
}