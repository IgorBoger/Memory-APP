import { setupSettingsGroups } from "./settings-groups";
import { initCard } from "./game/cards";
import { checkSelectedPair, startGame } from "./game/game-flow";
import {
  getGameConfig, startSettingsPage, setupThemePreview,
  updateSettingsSummary, setupSettingsSelection,
} from "./ui/settings";
import { exitGame, setupQuitPopup } from "./ui/quit-popup";
// Named imports make exported functions available here; they do not call them.
import { setupWinnerOverlay, setupDrawOverlay } from "./ui/results";

/**
 * Connects the controls to their actions during application startup. Call once.
 */
function init() {
  startSettingsPage();
  setupSettingsGroups();
  setupThemePreview();
  updateSettingsSummary();
  setupSettingsSelection();
  startGame();
  initCard(() => checkSelectedPair(getGameConfig()));
  exitGame();
  setupQuitPopup();
  setupWinnerOverlay();
  setupDrawOverlay();
}

init();