/** Player key used for turn order, scores, and themed player images. */
export type Player = "blue" | "orange";


/** Reusable motif data shared by the two cards in a matching pair. */
export type CardMotif = {
  id: string;
  image: string;
  alt: string;
};


/** One playable card with a unique deck ID, a shared motif ID, and its match status. */
export type Card = {
  id: number;
  motifId: string;
  image: string;
  alt: string;
  isMatched: boolean;
};


/** Mutable game state containing the deck, selected cards, scores, turn, and interaction status. */
export type GameState = {
  cards: Card[];
  flippedCardIds: number[];
  currentPlayer: Player;
  scores: Record<Player, number>;
  isLocked: boolean;
  status: "idle" | "playing" | "finished";
};


/** CSS classes, titles, labels, and images used by winner and draw overlays. */
export type ResultTheme = {
  winnerClass: string;
  drawClass: string;
  buttonText: string;
  winnerTitles: Record<Player, string>;
  winnerImages: Record<Player, string>;
  drawImage: string;
};


/** CSS class and text labels used by the quit confirmation dialog. */
export type QuitPopupTheme = {
  popupClass: string;
  title: string;
  backLabel: string;
  exitLabel: string;
};


/** Mutable timeout state that preserves the remaining delay while paused. Times are measured in milliseconds. */
export type PausableTimer = {
  timeoutId: number | undefined;
  remaining: number;
  startedAt: number;
  action: (() => void) | undefined;
};


/** CSS class, image paths, and alternative text for a settings-page theme preview. */
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


/** Theme-specific player display, distinguished by an image or badge type. */
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


/** CSS class, player labels, exit icons, and card-front data for the playing field. */
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


/** Selected theme, starting player, card count, and resolved playing-field theme data. */
export type GameConfig = {
  selectedTheme: string;
  currentPlayer: Player;
  cardCount: number;
  gameTheme: GameTheme;
};