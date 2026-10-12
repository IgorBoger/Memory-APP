import type { Card, GameTheme } from "../types";


/**
 * Creates the HTML markup for the front and back of a memory card.
 *
 * @param theme - Theme data for the card front.
 * @param card - Card data from the internal motif lists.
 * @param index - Position used for the unique back-image ID.
 * @returns HTML markup to be inserted by the cards module.
 */
export function createMemoryCardMarkup(theme: GameTheme, card: Card, index: number) {
  const front = theme.cardFrontImage
    ? `<img class="memory-card__image" src="${theme.cardFrontImage}" alt="${theme.cardFrontAlt}">` : "";
  return `<div class="memory-card__inner"><div class="memory-card__face memory-card__face--front">${front}</div>` +
    `<div class="memory-card__face memory-card__face--back"><img class="memory-card__image" id="memoryCardBack${index}" src="${card.image}" alt="${card.alt}"></div></div>`;
}