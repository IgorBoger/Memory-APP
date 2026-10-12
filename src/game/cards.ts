import type { Card, CardMotif } from "../types";
import { createMemoryCardMarkup } from "../templates/card-template";
import { gameState } from "../app-context";
import { cardMotifsByTheme } from "../card-data";
import { gameThemeData } from "../theme-data";

/**
 * Returns half the selected card count, or zero if no board size is selected.
 */
function getPairCount(): number {
  const cardCount = parseInt(document.querySelector<HTMLInputElement>
    ('input[name="board-size"]:checked')?.value || "0", 10);
  return cardCount / 2;
}


/**
 * Selects motifs for the current board size and includes each motif twice.
 */
function getCardMotifs(selectedTheme: string) {
  const pairCount = getPairCount();
  const motifs = cardMotifsByTheme[selectedTheme].slice(0, pairCount);
  return [...motifs, ...motifs];
}


/**
 * Creates a shuffled deck for the selected theme and current board size.
 *
 * @param selectedTheme - An existing theme key from the card data.
 * @returns New cards with unique IDs and two cards per motif.
 */
export function createShuffledDeck(selectedTheme: string) {
  const deck = getCardMotifs(selectedTheme).map(createCard);
  shuffleCards(deck);
  return deck;
}


/**
 * Creates an unmatched card from a motif and its deck index.
 */
function createCard(motif: CardMotif, index: number): Card {
  return { id: index, motifId: motif.id, image: motif.image, alt: motif.alt, isMatched: false };
}


/**
 * Shuffles the supplied array in place using Fisher-Yates and returns that array.
 */
function shuffleCards(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}


/**
 * Replaces the board contents with card buttons using the selected theme.
 */
export function renderPlayingFieldCards(selectedTheme: string, cards: Card[]) {
  const playingFieldBoard = document.getElementById("playingFieldBoard");
  if (!playingFieldBoard) return;
  playingFieldBoard.replaceChildren(...cards.map((card, index) => createMemoryCard(selectedTheme, card, index)));
}


/**
 * Creates a card button and links it to its game data through data-card-id.
 */
function createMemoryCard(selectedTheme: string, card: Card, index: number) {
  const memoryCard = document.createElement("button");
  const gameTheme = gameThemeData[selectedTheme];
  memoryCard.className = "memory-card";
  memoryCard.dataset.cardId = String(card.id);
  memoryCard.innerHTML = createMemoryCardMarkup(gameTheme, card, index);
  return memoryCard;
}


/**
 * Reveals an eligible card and notifies the game flow when two cards are selected.
 */
function openCard(cardElement: HTMLElement, onPairSelected: () => void) {
  if (gameState.status !== "playing" || gameState.isLocked) return;
  const cardId = Number(cardElement.dataset.cardId);
  const card = gameState.cards.find(card => card.id === cardId);
  if (!card || card.isMatched) return;
  if (gameState.flippedCardIds.includes(cardId)) return;
  gameState.flippedCardIds.push(cardId);
  cardElement.classList.add("is-flipped");
  if (gameState.flippedCardIds.length === 2) {
    gameState.isLocked = true;
    onPairSelected();
  }
}


/**
 * Marks a card as matched in both the game state and the DOM.
 */
export function markCardAsMatched(card: Card) {
  card.isMatched = true;
  const cardElement = document.querySelector(
    `#playingFieldBoard .memory-card[data-card-id="${card.id}"]`
  );
  cardElement?.classList.add("is-matched");
}


/**
 * Registers the board click handler. Call once during initialization.
 * The callback connects cards to the game flow without circular imports.
 *
 * @param onPairSelected - Called when two cards have been revealed.
 */
export function initCard(onPairSelected: () => void) {
  const fieldRef = document.getElementById("playingFieldBoard");
  if (fieldRef) {
    fieldRef.addEventListener("click", e => {
      const card = (e.target as HTMLElement).closest(".memory-card");
      if (card instanceof HTMLElement) {
        openCard(card, onPairSelected);
      }
    });
  }
}