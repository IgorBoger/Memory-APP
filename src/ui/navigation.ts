

/**
 * Fades out the current page and opens the next page after 300 milliseconds.
 *
 * @param currentPage - Page that is currently visible.
 * @param nextPage - Page to display next.
 */
export function showPage(currentPage: HTMLElement, nextPage: HTMLElement) {
  currentPage.classList.remove('page--active');
  setTimeout(() => {
    currentPage.hidden = true;
    nextPage.hidden = false;
    requestAnimationFrame(() => {
      nextPage.classList.add('page--active');
    });
  }, 300);
}


/**
 * Runs a 500-millisecond fade-in animation on an HTML element.
 */
export function fadeInElement(element: HTMLElement) {
  element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 500, easing: "ease-in-out" }
  );
}