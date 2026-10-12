import { resumeTimer, pauseTimer } from "../game/timers";
import { showPage } from "./navigation";
import { getGameConfig } from "./settings";
import { cancelCardReset, cancelGameOver, cancelResultOverlay, gameState, cardResetTimer, gameOverTimer } from "../app-context";
import { QUIT_POPUP_THEME_DATA } from "../theme-data";

/** Delay before hiding the quit dialog and restoring trigger focus, in milliseconds. */
const QUIT_POPUP_CLOSE_DELAY_MS = 300;

/** Element to refocus after closing the quit dialog, or null when no trigger is stored. */
let quitPopupTrigger: HTMLElement | null = null;


/**
 * Registers the exit-button handler to open the confirmation dialog. Call once.
 */
export function exitGame(): void {
  const exitButton = document.getElementById("exitGameBtn");
  exitButton?.addEventListener("click", (): void => {
    openQuitPopup(exitButton);
  });
}


/**
 * Registers the quit dialog's click and keyboard handlers. Call once.
 */
export function setupQuitPopup(): void {
  const popup = document.getElementById("quitPopup");
  const panel = popup?.querySelector<HTMLElement>(".quit-popup__panel");
  const backButton = document.getElementById("quitPopupBack");
  const exitButton = document.getElementById("quitPopupExit");
  if (!popup || !panel || !backButton || !exitButton) return;
  backButton.addEventListener("click", resumeGame);
  popup.querySelector("[data-quit-popup-close]")?.addEventListener("click", resumeGame);
  exitButton.addEventListener("click", exitCurrentGame);
  popup.addEventListener("keydown", (event): void => handleQuitPopupKeydown(event, panel));
}


/**
 * Handles Escape to resume and wraps Tab focus between the dialog controls.
 *
 * @param event - Keyboard event checked for Escape and Tab focus wrapping.
 * @param panel - Quit dialog panel containing the focusable controls.
 */
function handleQuitPopupKeydown(event: KeyboardEvent, panel: HTMLElement): void {
  if (event.key === "Escape") {
    event.preventDefault();
    resumeGame();
    return;
  }
  if (event.key === "Tab") wrapQuitPopupFocus(event, panel);
}


/**
 * Wraps Tab focus between the first and last controls in the quit dialog.
 *
 * @param event - Tab key event indicating the focus direction.
 * @param panel - Quit dialog panel containing the focusable controls.
 */
function wrapQuitPopupFocus(event: KeyboardEvent, panel: HTMLElement): void {
  const items = panel.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) focusQuitPopupControl(event, last);
  if (!event.shiftKey && document.activeElement === last) focusQuitPopupControl(event, first);
}


/**
 * Prevents the default Tab action and focuses the opposite dialog control.
 *
 * @param event - Keyboard event whose default focus movement should be prevented.
 * @param control - Dialog control to receive focus.
 */
function focusQuitPopupControl(event: KeyboardEvent, control: HTMLElement): void {
  event.preventDefault();
  control.focus();
}


/**
 * Stores the triggering button, pauses the game timers, and opens the quit dialog.
 *
 * @param trigger - Element to receive focus after the dialog closes.
 */
function openQuitPopup(trigger: HTMLElement): void {
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
function pauseGameTimers(): void {
  pauseTimer(cardResetTimer);
  pauseTimer(gameOverTimer);
}


/**
 * Shows the quit dialog and focuses its back button.
 *
 * @param popup - Quit confirmation dialog element.
 * @param backButton - Button to focus when the quit dialog opens.
 */
function showQuitPopup(popup: HTMLElement, backButton: HTMLButtonElement): void {
  popup.hidden = false;
  requestAnimationFrame((): void => {
    popup.classList.add("quit-popup--is-open");
    backButton.focus();
  });
}


/**
 * Applies the current theme's class and labels to the quit dialog.
 *
 * @param popup - Quit confirmation dialog element.
 */
function applyQuitPopupTheme(popup: HTMLElement): void {
  const theme = QUIT_POPUP_THEME_DATA[getGameConfig().selectedTheme]
    ?? QUIT_POPUP_THEME_DATA["code-vibes"];
  popup.classList.remove(...Object.values(QUIT_POPUP_THEME_DATA).map((theme): string => theme.popupClass));
  popup.classList.add(theme.popupClass);
  document.getElementById("quitPopupTitle")!.textContent = theme.title;
  document.getElementById("quitPopupBack")!.textContent = theme.backLabel;
  document.getElementById("quitPopupExit")!.textContent = theme.exitLabel;
}


/**
 * Fades out the dialog and restores focus to its trigger after 300 milliseconds.
 */
function closeQuitPopup(): void {
  const popup = document.getElementById("quitPopup");
  if (!popup) return;
  popup.classList.remove("quit-popup--is-open");
  window.setTimeout((): void => {
    popup.hidden = true;
    quitPopupTrigger?.focus();
    quitPopupTrigger = null;
  }, QUIT_POPUP_CLOSE_DELAY_MS);
}


/**
 * Closes an open quit dialog and resumes timers if the game is still playing.
 */
function resumeGame(): void {
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
function exitCurrentGame(): void {
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