import type { GameTheme, QuitPopupTheme, ResultTheme, ThemePreview } from "./types";

export const quitPopupThemeData: Record<string, QuitPopupTheme> = {
    "code-vibes": {
        popupClass: "quit-popup--code-vibes",
        title: "Are you sure you want to quit the game?",
        backLabel: "Back to game",
        exitLabel: "Exit game",
    },
    "gaming": {
        popupClass: "quit-popup--gaming",
        title: "Are you sure you want to quit the game?",
        backLabel: "No, back to game",
        exitLabel: "Yes, quit game",
    },
    "da-projects": {
        popupClass: "quit-popup--da-projects",
        title: "Are you sure you want to quit the game?",
        backLabel: "Back to game",
        exitLabel: "Exit game",
    },
    "foods": {
        popupClass: "quit-popup--foods",
        title: "Are you sure you want to quit the game?",
        backLabel: "No, back to game",
        exitLabel: "Exit game",
    },
};

export const resultThemeData: Record<string, ResultTheme> = {
    "code-vibes": {
        winnerClass: "winner--code-vibes",
        drawClass: "draw--code-vibes",
        buttonText: "Back to start",
        winnerTitles: { blue: "BLUE PLAYER", orange: "ORANGE PLAYER" },
        winnerImages: {
            blue: "/img/game-field/code-vibes/winner-pawn-blue.png",
            orange: "/img/game-field/code-vibes/winner-pawn-orange.png",
        },
        drawImage: "/img/game-field/code-vibes/draw-scales.png",
    },
    "gaming": {
        winnerClass: "winner--gaming",
        drawClass: "draw--gaming",
        buttonText: "Home",
        winnerTitles: { blue: "Blue Player", orange: "Orange Player" },
        winnerImages: {
            blue: "/img/game-field/gaming/winner-trophy.png",
            orange: "/img/game-field/gaming/winner-trophy.png",
        },
        drawImage: "/img/game-field/gaming/draw-scales.png",
    },
    "da-projects": {
        winnerClass: "winner--da-projects",
        drawClass: "draw--da-projects",
        buttonText: "Home",
        winnerTitles: { blue: "Blue Player", orange: "Orange Player" },
        winnerImages: {
            blue: "/img/game-field/da-projects/winner-pawn-blue.png",
            orange: "/img/game-field/da-projects/winner-pawn-orange.png",
        },
        drawImage: "/img/game-field/da-projects/draw-scales.png",
    },
    "foods": {
        winnerClass: "winner--foods",
        drawClass: "draw--foods",
        buttonText: "Home",
        winnerTitles: { blue: "Blue Player", orange: "Orange Player" },
        winnerImages: {
            blue: "/img/game-field/foods/winner-pawn-blue.png",
            orange: "/img/game-field/foods/winner-pawn-orange.png",
        },
        drawImage: "/img/game-field/foods/draw-scales.png",
    }
};

export const themePreviewData: Record<string, ThemePreview> = {
    "code-vibes": {
        previewClass: "settings-page__preview-content--code-vibes",
        primaryImage: "/img/settings-page/gaming-theme/code-vibes/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/code-vibes/card-back.png",
        secondaryAlt: "Card back",
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
        primaryImage: "/img/settings-page/gaming-theme/gaming/card-back.png",
        primaryAlt: "Card back",
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
        primaryImage: "/img/settings-page/gaming-theme/da-projects/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/da-projects/card-back.png",
        secondaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/da-projects/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/da-projects/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/da-projects/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/da-projects/exit-game-icon.png",
        exitIconAlt: "Exit game",
    },
    foods: {
        previewClass: "settings-page__preview-content--foods",
        primaryImage: "/img/settings-page/gaming-theme/foods/card-front.png",
        primaryAlt: "Card front with laptop and code symbol",
        secondaryImage: "/img/settings-page/gaming-theme/foods/card-back.png",
        secondaryAlt: "Card back",
        blueLabelImage: "/img/settings-page/gaming-theme/foods/blue-label.png",
        blueLabelAlt: "Blue player",
        orangeLabelImage: "/img/settings-page/gaming-theme/foods/orange-label.png",
        orangeLabelAlt: "Orange player",
        currentPlayerIcon: "/img/settings-page/gaming-theme/foods/current-player-icon.png",
        currentPlayerAlt: "Current player",
        exitIcon: "/img/settings-page/gaming-theme/foods/exit-game-button.png",
        exitIconAlt: "Exit game",
    },
};

export const gameThemeData: Record<string, GameTheme> = {
    "code-vibes": {
        playingFieldClass: "playing-field--code-vibes",

        blueLabelImage: "/img/game-field/code-vibes/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/code-vibes/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "image",
            currentPlayerBlueImage: "/img/game-field/code-vibes/blue-label.png",
            currentPlayerOrangeImage: "/img/game-field/code-vibes/orange-label.png",
            currentPlayerAlt: "Current player",
        },

        exitIcon: "/img/game-field/code-vibes/exit-game.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/code-vibes/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",
    },
    "gaming": {
        playingFieldClass: "playing-field--gaming",

        blueLabelImage: "/img/game-field/gaming/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/gaming/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/gaming/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/gaming/exit-game-icon.png",
        exitIconHover: "/img/game-field/gaming/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontAlt: "Card front",
    },
    "da-projects": {
        playingFieldClass: "playing-field--da-projects",

        blueLabelImage: "/img/game-field/da-projects/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/da-projects/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/da-projects/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/da-projects/exit-game-icon.png",
        exitIconHover: "/img/game-field/da-projects/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/da-projects/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",
    },
    "foods": {
        playingFieldClass: "playing-field--foods",

        blueLabelImage: "/img/game-field/foods/blue-label.png",
        blueLabelAlt: "Blue player score",

        orangeLabelImage: "/img/game-field/foods/orange-label.png",
        orangeLabelAlt: "Orange player score",

        currentPlayer: {
            type: "badge",
            iconImage: "/img/game-field/foods/current-player-icon.png",
            alt: "Current player",
        },

        exitIcon: "/img/game-field/foods/exit-game-icon.png",
        exitIconHover: "/img/game-field/foods/exit-game-icon-hover.png",
        exitIconAlt: "Exit game",

        cardFrontImage: "/img/game-field/foods/card-front.png",
        cardFrontAlt: "Card front with laptop and code symbol",
    }
};