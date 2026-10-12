import { resumeTimer, pauseTimer } from "../game/timers";
import { showPage } from "./navigation";
import { getGameConfig } from "./settings";
import { cancelCardReset, cancelGameOver, cancelResultOverlay, gameState, cardResetTimer, gameOverTimer } from "../app-context";
import { quitPopupThemeData } from "../theme-data";

let quitPopupTrigger: HTMLElement | null = null;


/**
 * Registers the exit-button handler to open the confirmation dialog. Call once.
 */
export function exitGame() {
  const exitButton = document.getElementById("exitGameBtn");
  exitButton?.addEventListener("click", () => {
    openQuitPopup(exitButton);
  });
}


/**
 * Registers the quit dialog's click and keyboard handlers. Call once.
 */
export function setupQuitPopup() {
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


/**
 * Handles Escape to resume and wraps Tab focus between the dialog controls.
 */
function handleQuitPopupKeydown(event: KeyboardEvent, panel: HTMLElement) {
  if (event.key === "Escape") return event.preventDefault(), resumeGame();
  if (event.key !== "Tab") return;
  const items = panel.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
  const first = items[0], last = items[items.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) event.preventDefault(), last.focus();
  if (!event.shiftKey && document.activeElement === last) event.preventDefault(), first.focus();
}


/**
 * Stores the triggering button, pauses the game timers, and opens the quit dialog.
 */
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


/**
 * Pauses the card-reset timer and the pending game-over transition.
 */
function pauseGameTimers() {
  pauseTimer(cardResetTimer);
  pauseTimer(gameOverTimer);
}


/**
 * Shows the quit dialog and focuses its back button.
 */
function showQuitPopup(popup: HTMLElement, backButton: HTMLButtonElement) {
  popup.hidden = false;
  requestAnimationFrame(() => {
    popup.classList.add("quit-popup--is-open");
    backButton.focus();
  });
}


/**
 * Applies the current theme's class and labels to the quit dialog.
 */
function applyQuitPopupTheme(popup: HTMLElement) {
  const theme = quitPopupThemeData[getGameConfig().selectedTheme]
    ?? quitPopupThemeData["code-vibes"];
  popup.classList.remove(...Object.values(quitPopupThemeData).map(theme => theme.popupClass));
  popup.classList.add(theme.popupClass);
  document.getElementById("quitPopupTitle")!.textContent = theme.title;
  document.getElementById("quitPopupBack")!.textContent = theme.backLabel;
  document.getElementById("quitPopupExit")!.textContent = theme.exitLabel;
}


/**
 * Fades out the dialog and restores focus to its trigger after 300 milliseconds.
 */
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


/**
 * Closes an open quit dialog and resumes timers if the game is still playing.
 */
function resumeGame() {
  const popup = document.getElementById("quitPopup");
  if (!popup?.classList.contains("quit-popup--is-open")) return;
  closeQuitPopup();
  if (gameState.status !== "playing") return;
  resumeTimer(cardResetTimer);
  resumeTimer(gameOverTimer);
}


/**
 * Cancels game timers, sets the status to idle, and opens the settings page.
 */
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