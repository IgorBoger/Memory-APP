
const PAGE_TRANSITION_DELAY_MS = 300;
const ELEMENT_FADE_DURATION_MS = 500;


/**
 * Fades out the current page and opens the next page after 300 milliseconds.
 *
 * @param currentPage - Page that is currently visible.
 * @param nextPage - Page to display next.
 */
export function showPage(currentPage: HTMLElement, nextPage: HTMLElement): void {
  currentPage.classList.remove('page--active');
  setTimeout((): void => {
    currentPage.hidden = true;
    nextPage.hidden = false;
    requestAnimationFrame((): void => {
      nextPage.classList.add('page--active');
    });
  }, PAGE_TRANSITION_DELAY_MS);
}


/**
 * Runs a 500-millisecond fade-in animation on an HTML element.
 */
export function fadeInElement(element: HTMLElement): void {
  element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: ELEMENT_FADE_DURATION_MS, easing: "ease-in-out" }
  );
}