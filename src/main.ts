init();


function init() {
    startSettingsPage();
    setupThemePreview();
    renderPlayingFieldCards();
}


function showPage(currentPage: HTMLElement, nextPage: HTMLElement) {
    currentPage.classList.remove('page--active');
    setTimeout(() => {
        currentPage.hidden = true;
        nextPage.hidden = false;
        requestAnimationFrame(() => {
            nextPage.classList.add('page--active');
        });
    }, 300);
}


function startSettingsPage() {
    const playBtn = document.getElementById('playButton');
    playBtn?.addEventListener('click', () => {
        const settingsPage = document.getElementById('settingsPage');
        const startPage = document.getElementById('startPage');
        if (startPage && settingsPage) {
            showPage(startPage, settingsPage);
        }
    });
}


function renderPlayingFieldCards() {
    const playingFieldBoard = document.getElementById("playingFieldBoard");
    if (playingFieldBoard) {
        for (let cardIndex = 0; cardIndex < 16; cardIndex++) {
            const memoryCard = document.createElement("button");
            memoryCard.className = "memory-card";
            memoryCard.innerHTML = `
            <div class="memory-card__inner">
                <div class="memory-card__face memory-card__face--front">
                    <img class="memory-card__image"
                    src="/img/settings-page/gaming-theme/code-vibes/dev-logo.png"
                    alt="Code vibes card">
                </div>
                <div class="memory-card__face memory-card__face--back">
                    <img class="memory-card__image"
                    src="/img/settings-page/gaming-theme/code-vibes/git-logo.png"
                    alt="Git card">
                </div>
            </div>`;
            playingFieldBoard.appendChild(memoryCard);
        }
    }
}


type ThemePreview = {
    previewClass: string;
    primaryImage: string;
    primaryAlt: string;
    secondaryImage?: string;
    secondaryAlt?: string;
    blueLabelImage: string;
    blueLabelAlt: string;
    orangeLabelImage: string;
    orangeLabelAlt: string;
    currentPlayerIcon: string;
    currentPlayerAlt: string;
    exitIcon: string;
    exitIconAlt: string;
};


const themePreviewData: Record<string, ThemePreview> = {
    "code-vibes": {
        previewClass: "settings-page__preview-content--code-vibes",
        primaryImage: "/img/settings-page/gaming-theme/code-vibes/dev-logo.png",
        primaryAlt: "Code vibes card",
        secondaryImage: "/img/settings-page/gaming-theme/code-vibes/git-logo.png",
        secondaryAlt: "Git card",
        blueLabelImage: "/img/settings-page/gaming-theme/code-vibes/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/code-vibes/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/code-vibes/blue-label.png",
        currentPlayerAlt: "Current player blue",
        exitIcon: "/img/settings-page/gaming-theme/code-vibes/exit-game.png",
        exitIconAlt: "Exit game",
    },
    gaming: {
        previewClass: "settings-page__preview-content--gaming",
        primaryImage: "/img/settings-page/gaming-theme/gaming/dice-card.png",
        primaryAlt: "Gaming dice card",
        blueLabelImage: "/img/settings-page/gaming-theme/gaming/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/gaming/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/gaming/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/gaming/exit-game-icon.png",
        exitIconAlt: "Exit game",
    },
    "da-projects": {
        previewClass: "settings-page__preview-content--da-projects",
        primaryImage: "/img/settings-page/gaming-theme/da-projects/dev-card.png",
        primaryAlt: "DA Projects card",
        secondaryImage: "/img/settings-page/gaming-theme/da-projects/project-card.png",
        secondaryAlt: "DA Projects card back",
        blueLabelImage: "/img/settings-page/gaming-theme/da-projects/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/da-projects/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/da-projects/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/da-projects/exit-game-icon.png",
        exitIconAlt: "Exit game",
    },
};


let selectedTheme = "code-vibes";

function setupThemePreview() {
    const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]');

    themeInputs.forEach((input) => {
        const optionLabel = input.closest("label");

        optionLabel?.addEventListener("mouseenter", () => {
            updateSettingsPreview(input.value);
        });

        optionLabel?.addEventListener("mouseleave", () => {
            updateSettingsPreview(selectedTheme);
        });

        input.addEventListener("change", () => {
            selectedTheme = input.value;
            updateSettingsPreview(selectedTheme);
        });
    });
}


function updateSettingsPreview(theme: string) {
    const settingsPreview = document.getElementById("settingsPreview");
    const primaryCard = document.getElementById("settingsPreviewPrimaryCard") as HTMLImageElement;
    const secondaryCard = document.getElementById("settingsPreviewSecondaryCard") as HTMLImageElement;
    const blueLabel = document.getElementById("settingsPreviewBlueLabel") as HTMLImageElement;
    const orangeLabel = document.getElementById("settingsPreviewOrangeLabel") as HTMLImageElement;
    const currentPlayerIcon = document.getElementById("settingsPreviewCurrentPlayerIcon") as HTMLImageElement;
    const exitIcon = document.getElementById("settingsPreviewExitIcon") as HTMLImageElement;
    const themePreview = themePreviewData[theme] ?? themePreviewData["code-vibes"];

    if (!settingsPreview || !primaryCard || !secondaryCard || !blueLabel || !orangeLabel || !currentPlayerIcon || !exitIcon) {
        return;
    }

    settingsPreview.classList.remove(...Object.values(themePreviewData).map((preview) => preview.previewClass));
    settingsPreview.classList.add(themePreview.previewClass);
    settingsPreview.dataset.themePreview = themePreviewData[theme] ? theme : "code-vibes";

    primaryCard.src = themePreview.primaryImage;
    primaryCard.alt = themePreview.primaryAlt;
    blueLabel.src = themePreview.blueLabelImage;
    blueLabel.alt = themePreview.blueLabelAlt;
    orangeLabel.src = themePreview.orangeLabelImage;
    orangeLabel.alt = themePreview.orangeLabelAlt;
    currentPlayerIcon.src = themePreview.currentPlayerIcon;
    currentPlayerIcon.alt = themePreview.currentPlayerAlt;
    exitIcon.src = themePreview.exitIcon;
    exitIcon.alt = themePreview.exitIconAlt;

    if (themePreview.secondaryImage && themePreview.secondaryAlt) {
        secondaryCard.hidden = false;
        secondaryCard.src = themePreview.secondaryImage;
        secondaryCard.alt = themePreview.secondaryAlt;
        return;
    }

    secondaryCard.hidden = true;
    secondaryCard.removeAttribute("src");
    secondaryCard.alt = "";
}
