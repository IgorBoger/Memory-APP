const groups = [
    { name: "game-theme", target: "settingsGameThemesValue" },
    { name: "player", target: "settingsPlayerValue" },
    { name: "board-size", target: "settingsBoardValue" }
];

const mobileLayout = window.matchMedia("(max-width: 600px)");
let buttons: HTMLButtonElement[] = [];
let activeButton: HTMLButtonElement | null = null;

export function setupSettingsGroups() {
    buttons = [...document.querySelectorAll<HTMLButtonElement>(".settings-page__group-toggle")];
    buttons.forEach(setupSettingsGroup);
    document.addEventListener("pointerdown", handleOutsidePointer);
    mobileLayout.addEventListener("change", handleLayoutChange);
    renderGroups();
}

function getPanel(button: HTMLButtonElement) {
    return document.getElementById(button.getAttribute("aria-controls") ?? "");
}

function setupSettingsGroup(button: HTMLButtonElement) {
    const group = button.closest("fieldset");
    const panel = getPanel(button);
    button.addEventListener("click", () => toggleGroup(button));
    group?.addEventListener("pointerleave", event => handleGroupLeave(event, button));
    group?.addEventListener("focusout", event => handleGroupFocus(event, button));
    group?.addEventListener("keydown", event => handleGroupKey(event, button));
    panel?.addEventListener("click", handleOptionClick);
    panel?.addEventListener("change", () => closeGroup(true));
}

function renderGroups() {
    buttons.forEach(updateGroup);
}

function updateGroup(button: HTMLButtonElement) {
    const panel = getPanel(button);
    if (!panel) return;
    const expanded = !mobileLayout.matches || button === activeButton;
    button.disabled = !mobileLayout.matches;
    button.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
}

function toggleGroup(button: HTMLButtonElement) {
    activeButton = activeButton === button ? null : button;
    renderGroups();
}

function closeGroup(restoreFocus = false) {
    if (!activeButton) return;
    if (restoreFocus) activeButton.focus();
    activeButton = null;
    renderGroups();
}

function handleGroupLeave(event: PointerEvent, button: HTMLButtonElement) {
    if (event.pointerType === "mouse" && activeButton === button) closeGroup();
}

function handleGroupFocus(event: FocusEvent, button: HTMLButtonElement) {
    const nextTarget = event.relatedTarget as Node | null;
    const group = button.closest("fieldset");
    // Blank panel space has no focus target; outside clicks are handled separately.
    if (activeButton === button && nextTarget && !group?.contains(nextTarget)) closeGroup();
}

function handleGroupKey(event: KeyboardEvent, button: HTMLButtonElement) {
    if (event.key !== "Escape" || activeButton !== button) return;
    event.preventDefault();
    closeGroup(true);
}

function handleOptionClick(event: MouseEvent) {
    if (event.target instanceof HTMLInputElement) closeGroup(true);
}

function handleOutsidePointer(event: PointerEvent) {
    if (activeButton && !activeButton.closest("fieldset")?.contains(event.target as Node)) closeGroup();
}

function handleLayoutChange() {
    const focusedButton = buttons.find(button => getPanel(button)?.contains(document.activeElement));
    activeButton = null;
    renderGroups();
    if (mobileLayout.matches) focusedButton?.focus();
}

export function updateSettingsGroupLabels() {
    groups.forEach(({ name, target }) => {
        const selected = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
        const label = selected?.closest("label")?.querySelector(".settings-page__option-label")?.textContent;
        const value = document.getElementById(target);
        if (value) value.textContent = label?.trim() ?? "";
    });
}