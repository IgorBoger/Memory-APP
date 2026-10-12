import type { GameConfig, Player, ResultTheme } from "../types";
import { showPage } from "./navigation";
import { resetSettings, updateSettingsSummary, getGameConfig } from "./settings";
import { cancelCardReset, cancelGameOver, cancelResultOverlay, resetGameState, gameState, appTimers } from "../app-context";
import { resultThemeData } from "../theme-data";

/**
 * Displays final scores, sets the status to finished, and schedules the result overlay.
 */
export function showGameOver(): void {
  const playingField = document.getElementById("playingField");
  const gameOver = document.getElementById("gameOver");
  if (!playingField || !gameOver) return;
  applyGameOverTheme(gameOver, getGameConfig());
  updateFinalScoreDisplay();
  gameState.status = "finished";
  showPage(playingField, gameOver);
  scheduleResultOverlay();
}


/**
 * Applies the game theme and player images to the game-over screen.
 */
function applyGameOverTheme(gameOver: HTMLElement, gameConfig: GameConfig): void {
  gameOver.classList.remove("game-over--code-vibes", "game-over--gaming", "game-over--da-projects", "game-over--foods");
  gameOver.classList.add(`game-over--${gameConfig.selectedTheme}`);
  const blueLabel = gameOver.querySelector<HTMLImageElement>(".game-over__score--blue img");
  const orangeLabel = gameOver.querySelector<HTMLImageElement>(".game-over__score--orange img");
  blueLabel?.setAttribute("src", gameConfig.gameTheme.blueLabelImage);
  orangeLabel?.setAttribute("src", gameConfig.gameTheme.orangeLabelImage);
}


/**
 * Schedules the result overlay after three seconds if the game is still finished.
 */
function scheduleResultOverlay(): void {
  const gameOver = document.getElementById("gameOver");
  if (!gameOver) return;
  cancelResultOverlay();
  const winner = getWinningPlayer();
  appTimers.resultOverlayTimeout = window.setTimeout((): void => {
    appTimers.resultOverlayTimeout = undefined;
    if (gameState.status !== "finished") return;
    showResultOverlay(winner, gameOver);
  }, 3000);
}


/**
 * Opens the winner or draw overlay according to the result.
 */
function showResultOverlay(winner: Player | null, gameOver: HTMLElement): void {
  if (winner) {
    showWinnerOverlay(winner, gameOver);
  } else {
    showDrawOverlay(gameOver);
  }
}


/**
 * Determines which player has the higher score.
 *
 * @returns The blue or orange player key, or null if the scores are equal.
 */
function getWinningPlayer(): Player | null {
  if (gameState.scores.blue === gameState.scores.orange) return null;
  return gameState.scores.blue > gameState.scores.orange ? "blue" : "orange";
}


/**
 * Returns the result theme, falling back to Code vibes for an unknown key.
 */
function getResultTheme(theme: string): ResultTheme {
  return resultThemeData[theme] ?? resultThemeData["code-vibes"];
}


/**
 * Applies the CSS class and button label to a result overlay.
 */
function applyResultTheme(overlay: HTMLElement, theme: ResultTheme, kind: "winner" | "draw"): void {
  const classKey = kind === "winner" ? "winnerClass" : "drawClass";
  overlay.classList.remove(...Object.values(resultThemeData).map((data): string => data[classKey]));
  overlay.classList.add(theme[classKey]);
  const button = overlay.querySelector<HTMLButtonElement>("button");
  if (button) button.textContent = theme.buttonText;
}


/**
 * Sets the winner title, winner image, and player data attribute.
 */
function applyWinnerContent(overlay: HTMLElement, player: Player, theme: ResultTheme): void {
  const title = document.getElementById("winnerPlayer");
  const pawn = document.getElementById("winnerPawn") as HTMLImageElement | null;
  overlay.dataset.player = player;
  if (title) title.textContent = theme.winnerTitles[player];
  if (pawn) pawn.src = theme.winnerImages[player];
}


/**
 * Configures the winner overlay and navigates to it from the current page.
 */
function showWinnerOverlay(player: Player, currentPage: HTMLElement, theme = getGameConfig().selectedTheme): void {
  const overlay = document.getElementById("winnerOverlay");
  if (!overlay) return;
  const resultTheme = getResultTheme(theme);
  applyResultTheme(overlay, resultTheme, "winner");
  applyWinnerContent(overlay, player, resultTheme);
  showPage(currentPage, overlay);
}


/**
 * Registers the winner overlay's back-button handler. Call once.
 * A later click resets the game and settings and opens the start page.
 * Calling this setup function does not display the winner overlay.
 */
export function setupWinnerOverlay(): void {
  const overlay = document.getElementById("winnerOverlay");
  const startPage = document.getElementById("startPage");
  document.getElementById("winnerBackToStart")?.addEventListener("click", (): void => {
    if (!overlay || !startPage) return;
    cancelCardReset();
    cancelGameOver();
    resetGameState("blue");
    resetSettings();
    updateSettingsSummary();
    showPage(overlay, startPage);
  });
}


/**
 * Configures the draw overlay and navigates to it from the current page.
 */
function showDrawOverlay(currentPage: HTMLElement, theme = getGameConfig().selectedTheme): void {
  const overlay = document.getElementById("drawOverlay");
  if (!overlay) return;
  const resultTheme = getResultTheme(theme);
  applyResultTheme(overlay, resultTheme, "draw");
  const scales = overlay.querySelector<HTMLImageElement>(".draw__scales");
  if (scales) scales.src = resultTheme.drawImage;
  showPage(currentPage, overlay);
}


/**
 * Registers the draw overlay's back-button handler. Call once.
 * A later click resets the game and settings and opens the start page.
 * Calling this setup function does not display the draw overlay.
 */
export function setupDrawOverlay(): void {
  const overlay = document.getElementById("drawOverlay");
  const startPage = document.getElementById("startPage");
  document.getElementById("drawBackToStart")?.addEventListener("click", (): void => {
    if (!overlay || !startPage) return;
    cancelCardReset();
    cancelGameOver();
    resetGameState("blue");
    resetSettings();
    updateSettingsSummary();
    showPage(overlay, startPage);
  });
}


/**
 * Copies both players' scores to the game-over screen.
 */
function updateFinalScoreDisplay(): void {
  const blueScore = document.getElementById("gameOverBlueScore");
  const orangeScore = document.getElementById("gameOverOrangeScore");
  if (blueScore) blueScore.textContent = String(gameState.scores.blue);
  if (orangeScore) orangeScore.textContent = String(gameState.scores.orange);
}