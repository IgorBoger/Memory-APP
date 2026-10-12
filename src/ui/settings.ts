import type { Player, ThemePreview } from "../types";
import { showPage } from "./navigation";
import { gameThemeData, themePreviewData } from "../theme-data";
import { updateSettingsGroupLabels } from "../settings-groups";

let selectedTheme = "code-vibes";
let currentPreviewTheme = "code-vibes";
let pendingPreviewTheme: string | undefined;
let previewFadeTimeout: number | undefined;


/**
 * Registers the Play button to open the settings page. Call once.
 */
export function startSettingsPage() {
    const playBtn = document.getElementById('playButton');
    playBtn?.addEventListener('click', () => {
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
export function resetSettings() {
    const gameThemeInput = document.querySelector<HTMLInputElement>('input[name="game-theme"][value="code-vibes"]');
    const gameSettingsInputs = document.querySelectorAll<HTMLInputElement>('input[name="player"], input[name="board-size"]');
    gameSettingsInputs.forEach(input => {
        input.checked = false;
    });
    if (gameThemeInput) gameThemeInput.checked = true;
    selectedTheme = "code-vibes";
    updateSettingsPreview(selectedTheme);
}


/**
 * Registers preview handlers for all theme inputs. Call once.
 */
export function setupThemePreview() {
    const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]');
    themeInputs.forEach(setupThemeInput);
}


/**
 * Connects a theme input's hover and selection events to the preview.
 */
function setupThemeInput(input: HTMLInputElement) {
    const label = input.closest("label");
    label?.addEventListener("mouseenter", () => updateSettingsPreview(input.value));
    label?.addEventListener("mouseleave", () => updateSettingsPreview(selectedTheme));
    input.addEventListener("change", () => selectPreviewTheme(input.value));
}


/**
 * Stores the selected theme and updates its preview.
 */
function selectPreviewTheme(theme: string) {
    selectedTheme = theme;
    updateSettingsPreview(theme);
}


/**
 * Schedules a preview change while avoiding outdated or duplicate transitions.
 */
function updateSettingsPreview(theme: string) {
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
    previewFadeTimeout = window.setTimeout(() => finishPreviewTransition(theme, settingsPreview), 120);
}


/**
 * Cancels any pending preview change and begins fading out the preview.
 */
function preparePreviewTransition(preview: HTMLElement, theme: string) {
    window.clearTimeout(previewFadeTimeout);
    pendingPreviewTheme = theme;
    preview.classList.add("settings-page__preview-content--is-changing");
}


/**
 * Applies the pending theme and completes the preview transition.
 */
function finishPreviewTransition(theme: string, preview: HTMLElement) {
    previewFadeTimeout = undefined;
    applySettingsPreview(theme);
    currentPreviewTheme = theme;
    pendingPreviewTheme = undefined;
    preview.classList.remove("settings-page__preview-content--is-changing");
}


/**
 * Applies the preview theme and images when all required elements are present.
 */
function applySettingsPreview(theme: string) {
    const { settingsPreview, primaryCard, secondaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon } = getPreviewElements();
    const themePreview = themePreviewData[theme] ?? themePreviewData["code-vibes"];
    if (!settingsPreview || !primaryCard || !secondaryCard || !blueLabel ||
        !orangeLabel || !currentPlayerIcon || !exitIcon) return;
    applyPreviewTheme(settingsPreview, themePreview, theme);
    setPreviewImages(themePreview, primaryCard, blueLabel, orangeLabel, currentPlayerIcon, exitIcon);
    setSecondaryPreview(themePreview, secondaryCard);
}


/**
 * Collects the HTML elements used by the theme preview.
 */
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


/**
 * Applies the preview's theme class and theme data attribute.
 */
function applyPreviewTheme(preview: HTMLElement, themeData: ThemePreview, theme: string) {
    preview.classList.remove(...Object.values(themePreviewData).map(data => data.previewClass));
    preview.classList.add(themeData.previewClass);
    preview.dataset.themePreview = themePreviewData[theme] ? theme : "code-vibes";
}


/**
 * Copies the theme's image paths and alternative text to the preview images.
 */
function setPreviewImages(data: ThemePreview, primary: HTMLImageElement, blue: HTMLImageElement, orange: HTMLImageElement, player: HTMLImageElement, exit: HTMLImageElement) {
    setImage(primary, data.primaryImage, data.primaryAlt);
    setImage(blue, data.blueLabelImage, data.blueLabelAlt);
    setImage(orange, data.orangeLabelImage, data.orangeLabelAlt);
    setImage(player, data.currentPlayerIcon, data.currentPlayerAlt);
    setImage(exit, data.exitIcon, data.exitIconAlt);
}


/**
 * Sets an image's source path and alternative text.
 */
function setImage(image: HTMLImageElement, src: string, alt: string) {
    image.src = src;
    image.alt = alt;
}


/**
 * Shows the secondary preview image only if the theme supplies an image and alternative text.
 */
function setSecondaryPreview(data: ThemePreview, card: HTMLImageElement) {
    if (data.secondaryImage && data.secondaryAlt) return showSecondaryPreview(card, data.secondaryImage, data.secondaryAlt);
    card.hidden = true;
    card.removeAttribute("src");
    card.alt = "";
}


/**
 * Shows the secondary preview image and applies its image data.
 */
function showSecondaryPreview(card: HTMLImageElement, src: string, alt: string) {
    card.hidden = false;
    setImage(card, src, alt);
}


/**
 * Updates the summary and enables Start only when all selections are complete.
 */
export function updateSettingsSummary() {
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
 */
function getSummaryElements() {
    return {
        summaryTheme: document.getElementById("settingsSummaryTheme"),
        summaryPlayer: document.getElementById("settingsSummaryPlayer"),
        summaryBoardSize: document.getElementById("settingsSummaryBoardSize"),
        startButton: document.getElementById("startGameBtn") as HTMLButtonElement,
    };
}


/**
 * Sets an element's text if the element exists.
 */
function setSummaryText(element: HTMLElement | null, text: string) {
    if (element) element.textContent = text;
}


/**
 * Registers summary updates for changes to the selected settings. Call once.
 */
export function setupSettingsSelection() {
    const settingsInputs = document.querySelectorAll<HTMLInputElement>(
        'input[name="game-theme"], input[name="player"], input[name="board-size"]'
    );
    settingsInputs.forEach((input) => {
        input.addEventListener("change", updateSettingsSummary);
    });
}


/**
 * Returns the theme's display label or a placeholder.
 */
function getThemeSummaryText(theme: string | undefined) {
    return { "code-vibes": "Code Vibe theme", gaming: "Game theme", "da-projects": "DA Project theme", foods: "Food theme" }[theme ?? ""] ?? "Theme";
}


/**
 * Returns the player's display label or a placeholder if no player is selected.
 */
function getPlayerSummaryText(player: string | undefined) {
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
 */
function getBoardSizeSummaryText(boardSize: string | undefined) {
    if (!boardSize) return "Board size";
    return "Board-" + boardSize + " Cards";
}


/**
 * Reads the selected radio inputs, leaving missing selections undefined.
 */
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


/**
 * Builds the game configuration from the selected settings.
 * Missing selections default to Code vibes, blue, and 16 cards.
 */
export function getGameConfig() {
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
