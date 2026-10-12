import type { GameConfig, Player, ThemePreview } from "../types";
import { showPage } from "./navigation";
import { GAME_THEME_DATA, THEME_PREVIEW_DATA } from "../theme-data";
import { updateSettingsGroupLabels } from "../settings-groups";

/** Delay before applying a pending settings-preview theme, in milliseconds. */
const PREVIEW_TRANSITION_DELAY_MS = 120;

/** DOM references used to render the settings preview. Image references are asserted to exist and checked by the caller. */
type PreviewElements = {
  settingsPreview: HTMLElement | null;
  primaryCard: HTMLImageElement;
  secondaryCard: HTMLImageElement;
  blueLabel: HTMLImageElement;
  orangeLabel: HTMLImageElement;
  currentPlayerIcon: HTMLImageElement;
  exitIcon: HTMLImageElement;
};

/** DOM references used for the settings summary. The start-button reference is asserted to exist and checked by the caller. */
type SummaryElements = {
  summaryTheme: HTMLElement | null;
  summaryPlayer: HTMLElement | null;
  summaryBoardSize: HTMLElement | null;
  startButton: HTMLButtonElement;
};

/** Raw selected radio-input values; an unselected group has an undefined value. */
type SettingsInputData = {
  selectedTheme: string | undefined;
  selectedPlayer: string | undefined;
  selectedBoardSize: string | undefined;
};

/** Theme selected by the settings radio inputs. */
let selectedTheme = "code-vibes";
/** Theme currently displayed in the settings preview. */
let currentPreviewTheme = "code-vibes";
/** Theme waiting for the preview transition, or undefined when no change is pending. */
let pendingPreviewTheme: string | undefined;
/** Timeout handle for the pending preview transition. */
let previewFadeTimeout: number | undefined;


/**
 * Registers the Play button to open the settings page. Call once.
 */
export function startSettingsPage(): void {
  const playBtn = document.getElementById('playButton');
  playBtn?.addEventListener('click', (): void => {
    const settingsPage = document.getElementById('settingsPage');
    const startPage = document.getElementById('startPage');
    if (startPage && settingsPage) {
      showPage(startPage, settingsPage);
    }
  });
}


/**
 * Selects Code vibes and clears the player and board-size selections.
 * Updates the preview; the caller updates the summary separately.
 */
export function resetSettings(): void {
  const gameThemeInput = document.querySelector<HTMLInputElement>('input[name="game-theme"][value="code-vibes"]');
  const gameSettingsInputs = document.querySelectorAll<HTMLInputElement>('input[name="player"], input[name="board-size"]');
  gameSettingsInputs.forEach((input): void => {
    input.checked = false;
  });
  if (gameThemeInput) gameThemeInput.checked = true;
  selectedTheme = "code-vibes";
  updateSettingsPreview(selectedTheme);
}


/**
 * Registers preview handlers for all theme inputs. Call once.
 */
export function setupThemePreview(): void {
  const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]');
  themeInputs.forEach(setupThemeInput);
}


/**
 * Connects a theme input's hover and selection events to the preview.
 *
 * @param input - Theme radio input whose hover and selection events should update the preview.
 */
function setupThemeInput(input: HTMLInputElement): void {
  const label = input.closest("label");
  label?.addEventListener("mouseenter", (): void => updateSettingsPreview(input.value));
  label?.addEventListener("mouseleave", (): void => updateSettingsPreview(selectedTheme));
  input.addEventListener("change", (): void => selectPreviewTheme(input.value));
}


/**
 * Stores the selected theme and updates its preview.
 *
 * @param theme - Theme key used to select the display data.
 */
function selectPreviewTheme(theme: string): void {
  selectedTheme = theme;
  updateSettingsPreview(theme);
}


/**
 * Schedules a preview change while avoiding outdated or duplicate transitions.
 *
 * @param theme - Theme key used to select the display data.
 */
function updateSettingsPreview(theme: string): void {
  const settingsPreview = document.getElementById("settingsPreview");
  if (!settingsPreview) return;
  if (pendingPreviewTheme === theme) return;
  if (currentPreviewTheme === theme) {
    window.clearTimeout(previewFadeTimeout);
    previewFadeTimeout = undefined;
    pendingPreviewTheme = undefined;
    settingsPreview.classList.remove("settings-page__preview-content--is-changing");
    return;
  }
  preparePreviewTransition(settingsPreview, theme);
  previewFadeTimeout = window.setTimeout((): void => finishPreviewTransition(theme, settingsPreview), PREVIEW_TRANSITION_DELAY_MS);
}


/**
 * Cancels any pending preview change and begins fading out the preview.
 *
 * @param preview - Settings preview element to update.
 * @param theme - Theme key used to select the display data.
 */
function preparePreviewTransition(preview: HTMLElement, theme: string): void {
  window.clearTimeout(previewFadeTimeout);
  pendingPreviewTheme = theme;
  preview.classList.add("settings-page__preview-content--is-changing");
}


/**
 * Applies the pending theme and completes the preview transition.
 *
 * @param theme - Theme key used to select the display data.
 * @param preview - Settings preview element to update.
 */
function finishPreviewTransition(theme: string, preview: HTMLElement): void {
  previewFadeTimeout = undefined;
  applySettingsPreview(theme);
  currentPreviewTheme = theme;
  pendingPreviewTheme = undefined;
  preview.classList.remove("settings-page__preview-content--is-changing");
}


/**
 * Applies the preview theme and images when all required elements are present.
 *
 * @param theme - Theme key used to select the display data.
 */
function applySettingsPreview(theme: string): void {
  const { settingsPreview, primaryCard, secondaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon } = getPreviewElements();
  const themePreview = THEME_PREVIEW_DATA[theme] ?? THEME_PREVIEW_DATA["code-vibes"];
  if (!settingsPreview || !primaryCard || !secondaryCard || !blueLabel ||
    !orangeLabel || !currentPlayerIcon || !exitIcon) return;
  applyPreviewTheme(settingsPreview, themePreview, theme);
  setPreviewImages(themePreview, primaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon);
  setSecondaryPreview(themePreview, secondaryCard);
}


/**
 * Collects the HTML elements used by the theme preview.
 *
 * @returns Preview container and image references; missing DOM elements remain null at runtime.
 */
function getPreviewElements(): PreviewElements {
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


/**
 * Applies the preview's theme class and theme data attribute.
 *
 * @param preview - Settings preview element to update.
 * @param themeData - Image and CSS data for the selected preview theme.
 * @param theme - Theme key used to select the display data.
 */
function applyPreviewTheme(preview: HTMLElement, themeData: ThemePreview, theme: string): void {
  preview.classList.remove(...Object.values(THEME_PREVIEW_DATA).map((data): string => data.previewClass));
  preview.classList.add(themeData.previewClass);
  preview.dataset.themePreview = THEME_PREVIEW_DATA[theme] ? theme : "code-vibes";
}


/**
 * Copies the theme's image paths and alternative text to the preview images.
 *
 * @param data - Theme preview image paths and alternative text.
 * @param primary - Primary preview card image.
 * @param blue - Blue player label image.
 * @param orange - Orange player label image.
 * @param player - Current-player preview image.
 * @param exit - Exit-button preview image.
 */
function setPreviewImages(data: ThemePreview, primary: HTMLImageElement, blue: HTMLImageElement, orange: HTMLImageElement, player: HTMLImageElement, exit: HTMLImageElement): void {
  setImage(primary, data.primaryImage, data.primaryAlt);
  setImage(blue, data.blueLabelImage, data.blueLabelAlt);
  setImage(orange, data.orangeLabelImage, data.orangeLabelAlt);
  setImage(player, data.currentPlayerIcon, data.currentPlayerAlt);
  setImage(exit, data.exitIcon, data.exitIconAlt);
}


/**
 * Sets an image's source path and alternative text.
 *
 * @param image - Image element to update.
 * @param src - Image source path.
 * @param alt - Alternative text for the image.
 */
function setImage(image: HTMLImageElement, src: string, alt: string): void {
  image.src = src;
  image.alt = alt;
}


/**
 * Shows the secondary preview image only if the theme supplies an image and alternative text.
 *
 * @param data - Theme preview image paths and alternative text.
 * @param card - Secondary preview image to show or clear.
 */
function setSecondaryPreview(data: ThemePreview, card: HTMLImageElement): void {
  if (data.secondaryImage && data.secondaryAlt) return showSecondaryPreview(card, data.secondaryImage, data.secondaryAlt);
  card.hidden = true;
  card.removeAttribute("src");
  card.alt = "";
}


/**
 * Shows the secondary preview image and applies its image data.
 *
 * @param card - Secondary preview image to reveal.
 * @param src - Image source path.
 * @param alt - Alternative text for the image.
 */
function showSecondaryPreview(card: HTMLImageElement, src: string, alt: string): void {
  card.hidden = false;
  setImage(card, src, alt);
}


/**
 * Updates the summary and enables Start only when all selections are complete.
 */
export function updateSettingsSummary(): void {
  updateSettingsGroupLabels();
  const { selectedTheme, selectedPlayer, selectedBoardSize } = getInputData();
  const { summaryTheme, summaryPlayer, summaryBoardSize, startButton } = getSummaryElements();
  setSummaryText(summaryTheme, getThemeSummaryText(selectedTheme));
  setSummaryText(summaryPlayer, getPlayerSummaryText(selectedPlayer));
  setSummaryText(summaryBoardSize, getBoardSizeSummaryText(selectedBoardSize));
  if (startButton) startButton.disabled = !(selectedTheme && selectedPlayer && selectedBoardSize);
}


/**
 * Collects the summary text elements and the start button.
 *
 * @returns Summary text and start-button references; missing DOM elements remain null at runtime.
 */
function getSummaryElements(): SummaryElements {
  return {
    summaryTheme: document.getElementById("settingsSummaryTheme"),
    summaryPlayer: document.getElementById("settingsSummaryPlayer"),
    summaryBoardSize: document.getElementById("settingsSummaryBoardSize"),
    startButton: document.getElementById("startGameBtn") as HTMLButtonElement,
  };
}


/**
 * Sets an element's text if the element exists.
 *
 * @param element - Element to update when present.
 * @param text - Text to display.
 */
function setSummaryText(element: HTMLElement | null, text: string): void {
  if (element) element.textContent = text;
}


/**
 * Registers summary updates for changes to the selected settings. Call once.
 */
export function setupSettingsSelection(): void {
  const settingsInputs = document.querySelectorAll<HTMLInputElement>(
    'input[name="game-theme"], input[name="player"], input[name="board-size"]'
  );
  settingsInputs.forEach((input): void => {
    input.addEventListener("change", updateSettingsSummary);
  });
}


/**
 * Returns the theme's display label or a placeholder.
 *
 * @param theme - Selected theme key, or undefined when unselected.
 * @returns Theme display label, or Theme when the key is missing or unknown.
 */
function getThemeSummaryText(theme: string | undefined): string {
  return { "code-vibes": "Code Vibe theme", gaming: "Game theme", "da-projects": "DA Project theme", foods: "Food theme" }[theme ?? ""] ?? "Theme";
}


/**
 * Returns the player's display label or a placeholder if no player is selected.
 *
 * @param player - Selected player key, or undefined when unselected.
 * @returns Player display label, or Player when the selection is missing or unknown.
 */
function getPlayerSummaryText(player: string | undefined): string {
  if (player === "blue") {
    return "Blue Player";
  }
  if (player === "orange") {
    return "Orange Player";
  }
  return "Player";
}


/**
 * Returns the card-count label or a placeholder if no board size is selected.
 *
 * @param boardSize - Selected card count as text, or undefined when unselected.
 * @returns Board-size display label, or Board size when no selection is supplied.
 */
function getBoardSizeSummaryText(boardSize: string | undefined): string {
  if (!boardSize) return "Board size";
  return "Board-" + boardSize + " Cards";
}


/**
 * Reads the selected radio inputs, leaving missing selections undefined.
 *
 * @returns Selected theme, player, and board-size values, with undefined for missing selections.
 */
function getInputData(): SettingsInputData {
  const selectedTheme = document.querySelector<HTMLInputElement>('input[name="game-theme"]:checked')?.value;
  const selectedPlayer = document.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;
  const selectedBoardSize = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked')?.value;
  return {
    selectedTheme,
    selectedPlayer,
    selectedBoardSize,
  };
}


/**
 * Builds the game configuration from the selected settings.
 * Missing selections default to Code vibes, blue, and 16 cards.
 *
 * @returns Selected game configuration with defaults for missing selections.
 */
export function getGameConfig(): GameConfig {
  const { selectedTheme, selectedPlayer, selectedBoardSize } = getInputData();
  const gameTheme = GAME_THEME_DATA[selectedTheme ?? "code-vibes"];
  const cardCount = Number(selectedBoardSize ?? 16);
  const currentPlayer: Player = selectedPlayer === "orange" ? "orange" : "blue";
  return {
    selectedTheme: selectedTheme ?? "code-vibes",
    currentPlayer,
    cardCount,
    gameTheme,
  };
}