import type { GameConfig } from "../types";
import { gameState } from "../app-context";

/**
 * Applies the theme images to the game header and updates the current-player display.
 */
export function applyGameHeader(gameConfig: GameConfig): void {
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


/**
 * Applies the board layout class for 16, 24, or 36 cards.
 */
export function applyBoardSizeClass(cardCount: number): void {
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


/**
 * Replaces the playing field's previous theme class with the selected theme.
 */
export function applyPlayingFieldTheme(gameConfig: GameConfig): void {
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


/**
 * Displays the current player as an image or a colored badge, depending on the theme.
 */
export function applyCurrentPlayer(gameConfig: GameConfig): void {
  if (gameConfig.gameTheme.currentPlayer.type === "image") {
    applyCurrentPlayerImage(gameConfig);
    return;
  }
  applyCurrentPlayerBadge(gameConfig);
}


/**
 * Selects the blue or orange player image from the current theme.
 */
function applyCurrentPlayerImage(gameConfig: GameConfig): void {
  const currentPlayer = gameConfig.gameTheme.currentPlayer;
  if (currentPlayer.type !== "image") return;
  const currentPlayerIcon = document.getElementById("gameHeaderCurrentPlayerIcon") as HTMLImageElement;
  currentPlayerIcon.src =
    gameState.currentPlayer === "orange"
      ? currentPlayer.currentPlayerOrangeImage
      : currentPlayer.currentPlayerBlueImage;
  currentPlayerIcon.alt = gameState.currentPlayer === "orange" ? "Orange" : "Blue";
}


/**
 * Applies the player badge icon and its current-player color.
 */
function applyCurrentPlayerBadge(gameConfig: GameConfig): void {
  const currentPlayer = gameConfig.gameTheme.currentPlayer;
  if (currentPlayer.type !== "badge") return;
  const currentPlayerBadge = document.getElementById("gameHeaderCurrentPlayerBadge");
  const currentPlayerIcon = document.getElementById("gameHeaderCurrentPlayerIcon") as HTMLImageElement;
  currentPlayerIcon.src = currentPlayer.iconImage;
  currentPlayerIcon.alt = gameState.currentPlayer === "orange" ? "Orange" : "Blue";
  updateCurrentPlayerBadgeColor(currentPlayerBadge, gameState.currentPlayer);
}


/**
 * Replaces the badge's previous player color with blue or orange.
 */
function updateCurrentPlayerBadgeColor(currentPlayerBadge: HTMLElement | null, currentPlayer: string): void {
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