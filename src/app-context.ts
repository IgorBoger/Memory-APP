import type { GameState, Player } from "./types";
import { createPausableTimer, cancelTimer } from "./game/timers";

/** Shared game state; replaced entirely by resetGameState. */
export let gameState: GameState = createInitialGameState("blue");
/** Pausable timer used to hide mismatched cards and delay the player switch. */
export const cardResetTimer = createPausableTimer();
/** Pausable timer used for the transition after the final matching pair. */
export const gameOverTimer = createPausableTimer();
/** Timeout handle for the pending winner or draw overlay. */
export const appTimers: { resultOverlayTimeout: number | undefined } = {
  resultOverlayTimeout: undefined,
};


/**
 * Creates an empty game state with zero scores and the specified starting player.
 *
 * @param currentPlayer - Starting player for the empty game state.
 * @returns Empty game state with zero scores and the specified starting player.
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
export function cancelCardReset(): void {
  cancelTimer(cardResetTimer);
}


/**
 * Cancels the pending transition to the game-over screen.
 */
export function cancelGameOver(): void {
  cancelTimer(gameOverTimer);
}


/**
 * Cancels the pending transition to the winner or draw overlay.
 */
export function cancelResultOverlay(): void {
  window.clearTimeout(appTimers.resultOverlayTimeout);
  appTimers.resultOverlayTimeout = undefined;
}


/**
 * Replaces the shared game state, which remains available through live imports.
 * The caller is responsible for stopping timers and updating the DOM.
 *
 * @param player - Starting player for the new state.
 */
export function resetGameState(player: Player): void {
  gameState = createInitialGameState(player);
}