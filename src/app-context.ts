import type { GameState, Player } from "./types";
import { createPausableTimer, cancelTimer } from "./game/timers";

/** Shared game state; replaced entirely by resetGameState. */
export let gameState: GameState = createInitialGameState("blue");
export const cardResetTimer = createPausableTimer();
export const gameOverTimer = createPausableTimer();
export const appTimers: { resultOverlayTimeout: number | undefined } = {
  resultOverlayTimeout: undefined,
};


/**
 * Creates an empty game state with zero scores and the specified starting player.
 */
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


/**
 * Cancels the pending card reset or player switch.
 */
export function cancelCardReset() {
  cancelTimer(cardResetTimer);
}


/**
 * Cancels the pending transition to the game-over screen.
 */
export function cancelGameOver() {
  cancelTimer(gameOverTimer);
}


/**
 * Cancels the pending transition to the winner or draw overlay.
 */
export function cancelResultOverlay() {
  window.clearTimeout(appTimers.resultOverlayTimeout);
  appTimers.resultOverlayTimeout = undefined;
}


/**
 * Replaces the shared game state, which remains available through live imports.
 * The caller is responsible for stopping timers and updating the DOM.
 *
 * @param player - Starting player for the new state.
 */
export function resetGameState(player: Player) {
  gameState = createInitialGameState(player);
}