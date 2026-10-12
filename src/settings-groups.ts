/** Radio-group names paired with the IDs of their selected-option summary elements. */
const SETTINGS_GROUPS = [
  { name: "game-theme", target: "settingsGameThemesValue" },
  { name: "player", target: "settingsPlayerValue" },
  { name: "board-size", target: "settingsBoardValue" }
];

/** Live media-query state used to enable collapsible settings groups on narrow screens. */
const mobileLayout = window.matchMedia("(max-width: 800px)");
/** Settings-group toggles collected during initialization. */
let buttons: HTMLButtonElement[] = [];
/** Currently expanded mobile settings toggle, or null when all mobile groups are closed. */
let activeButton: HTMLButtonElement | null = null;

/**
 * Registers the responsive settings-group handlers and renders the initial layout. Call once.
 */
export function setupSettingsGroups(): void {
  buttons = [...document.querySelectorAll<HTMLButtonElement>(".settings-page__group-toggle")];
  buttons.forEach(setupSettingsGroup);
  document.addEventListener("pointerdown", handleOutsidePointer);
  mobileLayout.addEventListener("change", handleLayoutChange);
  renderGroups();
}

/**
 * Finds the panel referenced by a settings toggle's aria-controls attribute.
 *
 * @param button - Toggle button belonging to the settings group.
 * @returns Referenced panel, or null if the reference is missing or no matching element exists.
 */
function getPanel(button: HTMLButtonElement): HTMLElement | null {
  return document.getElementById(button.getAttribute("aria-controls") ?? "");
}

/**
 * Registers toggle, pointer, focus, keyboard, and option handlers for one settings group.
 *
 * @param button - Toggle button belonging to the settings group.
 */
function setupSettingsGroup(button: HTMLButtonElement): void {
  const group = button.closest("fieldset");
  const panel = getPanel(button);
  button.addEventListener("click", (): void => toggleGroup(button));
  group?.addEventListener("pointerleave", (event): void => handleGroupLeave(event, button));
  group?.addEventListener("focusout", (event): void => handleGroupFocus(event, button));
  group?.addEventListener("keydown", (event): void => handleGroupKey(event, button));
  panel?.addEventListener("click", handleOptionClick);
  panel?.addEventListener("change", (): void => closeGroup(true));
}

/**
 * Updates all settings groups for the current layout and active toggle.
 */
function renderGroups(): void {
  buttons.forEach(updateGroup);
}

/**
 * Keeps a settings panel visible on desktop and opens only the active panel on mobile.
 *
 * @param button - Toggle button belonging to the settings group.
 */
function updateGroup(button: HTMLButtonElement): void {
  const panel = getPanel(button);
  if (!panel) return;
  const expanded = !mobileLayout.matches || button === activeButton;
  button.disabled = !mobileLayout.matches;
  button.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
}

/**
 * Opens the selected mobile settings group or closes it if it is already active.
 *
 * @param button - Toggle button belonging to the settings group.
 */
function toggleGroup(button: HTMLButtonElement): void {
  activeButton = activeButton === button ? null : button;
  renderGroups();
}

/**
 * Closes the active mobile settings group and optionally restores focus to its toggle.
 *
 * @param restoreFocus - Whether to focus the active toggle before closing; defaults to false.
 */
function closeGroup(restoreFocus = false): void {
  if (!activeButton) return;
  if (restoreFocus) activeButton.focus();
  activeButton = null;
  renderGroups();
}

/**
 * Closes the active settings group when the mouse leaves its fieldset.
 *
 * @param event - Pointer event used to distinguish mouse movement from touch and pen input.
 * @param button - Toggle button belonging to the settings group.
 */
function handleGroupLeave(event: PointerEvent, button: HTMLButtonElement): void {
  if (event.pointerType === "mouse" && activeButton === button) closeGroup();
}

/**
 * Closes the active group when focus moves to a target outside its fieldset.
 *
 * @param event - Focus event whose related target identifies the next focused element.
 * @param button - Toggle button belonging to the settings group.
 */
function handleGroupFocus(event: FocusEvent, button: HTMLButtonElement): void {
  const nextTarget = event.relatedTarget as Node | null;
  const group = button.closest("fieldset");
  // Blank panel space has no focus target; outside clicks are handled separately.
  if (activeButton === button && nextTarget && !group?.contains(nextTarget)) closeGroup();
}

/**
 * Handles Escape in the active settings group and restores focus to its toggle.
 *
 * @param event - Keyboard event checked for the Escape key.
 * @param button - Toggle button belonging to the settings group.
 */
function handleGroupKey(event: KeyboardEvent, button: HTMLButtonElement): void {
  if (event.key !== "Escape" || activeButton !== button) return;
  event.preventDefault();
  closeGroup(true);
}

/**
 * Closes the active group and restores toggle focus when an input is clicked.
 *
 * @param event - Click event checked for an input target.
 */
function handleOptionClick(event: MouseEvent): void {
  if (event.target instanceof HTMLInputElement) closeGroup(true);
}

/**
 * Closes the active settings group when a pointer press occurs outside its fieldset.
 *
 * @param event - Pointer press whose target is checked against the active fieldset.
 */
function handleOutsidePointer(event: PointerEvent): void {
  if (activeButton && !activeButton.closest("fieldset")?.contains(event.target as Node)) closeGroup();
}

/**
 * Clears the active group, updates the layout, and restores toggle focus when entering mobile layout.
 */
function handleLayoutChange(): void {
  const focusedButton = buttons.find((button): boolean | undefined => getPanel(button)?.contains(document.activeElement));
  activeButton = null;
  renderGroups();
  if (mobileLayout.matches) focusedButton?.focus();
}

/**
 * Copies each selected option's trimmed label to its group summary, or clears it when unselected.
 */
export function updateSettingsGroupLabels(): void {
  SETTINGS_GROUPS.forEach(({ name, target }): void => {
    const selected = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
    const label = selected?.closest("label")?.querySelector(".settings-page__option-label")?.textContent;
    const value = document.getElementById(target);
    if (value) value.textContent = label?.trim() ?? "";
  });
}