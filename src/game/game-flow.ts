import type { Card, GameConfig } from "../types";
import { startTimer } from "./timers";
import { showPage, fadeInElement } from "../ui/navigation";
import { getGameConfig } from "../ui/settings";
import { applyGameHeader, applyBoardSizeClass, applyPlayingFieldTheme, applyCurrentPlayer } from "../ui/game-header";
import { createShuffledDeck, renderPlayingFieldCards, markCardAsMatched } from "./cards";
import { showGameOver } from "../ui/results";
import { cancelCardReset, cancelGameOver, resetGameState, gameState, cardResetTimer, gameOverTimer } from "../app-context";

/** Delay before hiding a mismatched card pair, in milliseconds. */
const CARD_RESET_DELAY_MS = 800;
/** Delay before showing the game-over page after the final match, in milliseconds. */
const GAME_OVER_DELAY_MS = 1000;
/** Delay after hiding a mismatched pair before switching players, in milliseconds. */
const PLAYER_SWITCH_DELAY_MS = 300;

/**
 * Compares the two selected cards and handles a match or a mismatch.
 *
 * @param gameConfig - Settings used to update the player display after a mismatch.
 */
export function checkSelectedPair(gameConfig: GameConfig): void {
  const firstCardId = gameState.flippedCardIds[0];
  const secondCardId = gameState.flippedCardIds[1];
  const firstCard = gameState.cards.find((card): boolean => card.id === firstCardId);
  const secondCard = gameState.cards.find((card): boolean => card.id === secondCardId);
  if (firstCard && secondCard && firstCard.motifId === secondCard.motifId) {
    handleMatchedPair(firstCard, secondCard);
  } else {
    scheduleCardReset(gameConfig);
  }
}


/**
 * Awards a point, marks the pair as matched, and checks for game completion.
 *
 * @param firstCard - First revealed card of the matching pair.
 * @param secondCard - Second revealed card of the matching pair.
 */
function handleMatchedPair(firstCard: Card, secondCard: Card): void {
  markCardAsMatched(firstCard);
  markCardAsMatched(secondCard);
  gameState.scores[gameState.currentPlayer]++;
  updateScoreDisplay();
  gameState.flippedCardIds = [];
  gameState.isLocked = false;
  checkGameOver();
}


/**
 * Schedules a mismatched pair to be hidden after 800 milliseconds.
 *
 * @param gameConfig - Game settings used to update the themed display.
 */
function scheduleCardReset(gameConfig: GameConfig): void {
  startTimer(cardResetTimer, (): void => {
    closeSelectedCards(gameConfig);
  }, CARD_RESET_DELAY_MS);
}


/**
 * Locks a fully matched board and schedules the game-over screen.
 */
function checkGameOver(): void {
  if (gameState.cards.length > 0 && gameState.cards.every((card): boolean => card.isMatched)) {
    gameState.isLocked = true;
    startTimer(gameOverTimer, (): void => {
      showGameOver();
    }, GAME_OVER_DELAY_MS);
  }
}


/**
 * Hides the selected pair and switches players after 300 milliseconds.
 *
 * @param gameConfig - Game settings used to update the themed display.
 */
function closeSelectedCards(gameConfig: GameConfig): void {
  gameState.flippedCardIds.forEach((cardId): void => {
    const cardElement = document.querySelector(
      `#playingFieldBoard .memory-card[data-card-id="${cardId}"]`
    );
    cardElement?.classList.remove("is-flipped");
  });
  startTimer(cardResetTimer, (): void => {
    gameState.flippedCardIds = [];
    switchPlayer(gameConfig);
    gameState.isLocked = false;
  }, PLAYER_SWITCH_DELAY_MS);
}


/**
 * Switches between blue and orange and updates the current-player display.
 *
 * @param gameConfig - Game settings used to update the themed display.
 */
function switchPlayer(gameConfig: GameConfig): void {
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
function updateScoreDisplay(): void {
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
export function startGame(): void {
  const startButton = document.getElementById("startGameBtn");
  const settingsPage = document.getElementById("settingsPage");
  const playingField = document.getElementById("playingField");
  startButton?.addEventListener("click", (): void => beginGame(settingsPage, playingField));
}


/**
 * Opens the playing field, resets the game state, and renders a new deck.
 *
 * @param settingsPage - Settings page to hide, or null when unavailable.
 * @param playingField - Playing field to display, or null when unavailable.
 */
function beginGame(settingsPage: HTMLElement | null, playingField: HTMLElement | null): void {
  if (!settingsPage || !playingField) return;
  const config = getGameConfig();
  showPage(settingsPage, playingField);
  resetGameForStart(config);
  renderPlayingFieldCards(config.selectedTheme, gameState.cards);
  applyBoardSizeClass(config.cardCount);
}


/**
 * Stops the game timers and prepares the state, theme, player display, and deck.
 *
 * @param config - Settings for the new game.
 */
function resetGameForStart(config: GameConfig): void {
  cancelCardReset();
  cancelGameOver();
  resetGameState(config.currentPlayer);
  updateScoreDisplay();
  applyPlayingFieldTheme(config);
  applyGameHeader(config);
  gameState.cards = createShuffledDeck(config.selectedTheme);
  gameState.status = "playing";
}
