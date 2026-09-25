export type Player = "blue" | "orange";


export type CardMotif = {
    id: string;
    image: string;
    alt: string;
};


export type Card = {
    id: number;
    motifId: string;
    image: string;
    alt: string;
    isMatched: boolean;
};


export type GameState = {
    cards: Card[];
    flippedCardIds: number[];
    currentPlayer: Player;
    scores: Record<Player, number>;
    isLocked: boolean;
    status: "idle" | "playing" | "finished";
};


export type ResultTheme = {
    winnerClass: string;
    drawClass: string;
    buttonText: string;
    winnerTitles: Record<Player, string>;
    winnerImages: Record<Player, string>;
    drawImage: string;
};


export type QuitPopupTheme = {
    popupClass: string;
    title: string;
    backLabel: string;
    exitLabel: string;
};


export type PausableTimer = {
    timeoutId: number | undefined;
    remaining: number;
    startedAt: number;
    action: (() => void) | undefined;
};


export type ThemePreview = {
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


export type CurrentPlayerDisplay =
    | {
        type: "image";
        currentPlayerBlueImage: string;
        currentPlayerOrangeImage: string;
        currentPlayerAlt: string
    }
    | {
        type: "badge";
        iconImage: string;
        alt: string
    };


export type GameTheme = {
    playingFieldClass: string;
    blueLabelImage: string;
    blueLabelAlt: string;
    orangeLabelImage: string;
    orangeLabelAlt: string;
    currentPlayer: CurrentPlayerDisplay;
    exitIcon: string;
    exitIconHover?: string;
    exitIconAlt: string;
    cardFrontImage?: string;
    cardFrontAlt: string;
};


export type GameConfig = {
    selectedTheme: string;
    currentPlayer: Player;
    cardCount: number;
    gameTheme: GameTheme;
};