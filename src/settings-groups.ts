const SETTINGS_GROUPS = [
  { name: "game-theme", target: "settingsGameThemesValue" },
  { name: "player", target: "settingsPlayerValue" },
  { name: "board-size", target: "settingsBoardValue" }
];

const mobileLayout = window.matchMedia("(max-width: 800px)");
let buttons: HTMLButtonElement[] = [];
let activeButton: HTMLButtonElement | null = null;

export function setupSettingsGroups(): void {
  buttons = [...document.querySelectorAll<HTMLButtonElement>(".settings-page__group-toggle")];
  buttons.forEach(setupSettingsGroup);
  document.addEventListener("pointerdown", handleOutsidePointer);
  mobileLayout.addEventListener("change", handleLayoutChange);
  renderGroups();
}

function getPanel(button: HTMLButtonElement): HTMLElement | null {
  return document.getElementById(button.getAttribute("aria-controls") ?? "");
}

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

function renderGroups(): void {
  buttons.forEach(updateGroup);
}

function updateGroup(button: HTMLButtonElement): void {
  const panel = getPanel(button);
  if (!panel) return;
  const expanded = !mobileLayout.matches || button === activeButton;
  button.disabled = !mobileLayout.matches;
  button.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
}

function toggleGroup(button: HTMLButtonElement): void {
  activeButton = activeButton === button ? null : button;
  renderGroups();
}

function closeGroup(restoreFocus = false): void {
  if (!activeButton) return;
  if (restoreFocus) activeButton.focus();
  activeButton = null;
  renderGroups();
}

function handleGroupLeave(event: PointerEvent, button: HTMLButtonElement): void {
  if (event.pointerType === "mouse" && activeButton === button) closeGroup();
}

function handleGroupFocus(event: FocusEvent, button: HTMLButtonElement): void {
  const nextTarget = event.relatedTarget as Node | null;
  const group = button.closest("fieldset");
  // Blank panel space has no focus target; outside clicks are handled separately.
  if (activeButton === button && nextTarget && !group?.contains(nextTarget)) closeGroup();
}

function handleGroupKey(event: KeyboardEvent, button: HTMLButtonElement): void {
  if (event.key !== "Escape" || activeButton !== button) return;
  event.preventDefault();
  closeGroup(true);
}

function handleOptionClick(event: MouseEvent): void {
  if (event.target instanceof HTMLInputElement) closeGroup(true);
}

function handleOutsidePointer(event: PointerEvent): void {
  if (activeButton && !activeButton.closest("fieldset")?.contains(event.target as Node)) closeGroup();
}

function handleLayoutChange(): void {
  const focusedButton = buttons.find((button): boolean | undefined => getPanel(button)?.contains(document.activeElement));
  activeButton = null;
  renderGroups();
  if (mobileLayout.matches) focusedButton?.focus();
}

export function updateSettingsGroupLabels(): void {
  SETTINGS_GROUPS.forEach(({ name, target }): void => {
    const selected = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
    const label = selected?.closest("label")?.querySelector(".settings-page__option-label")?.textContent;
    const value = document.getElementById(target);
    if (value) value.textContent = label?.trim() ?? "";
  });
}