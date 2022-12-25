export function isDocumentElement(
  el: HTMLElement | typeof window
): el is typeof window {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

export const errorMessage = (error: any): string =>
  `${error instanceof Error ? error.message : error}`;

export function scrollTo(el: HTMLElement | typeof window, top: number): void {
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

export function scrollIntoView(
  listElement: HTMLElement,
  elementToShow: HTMLElement
): void {
  const menuRect = listElement.getBoundingClientRect();
  const focusedRect = elementToShow.getBoundingClientRect();
  const overScroll = elementToShow.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(
      listElement,
      Math.min(
        elementToShow.offsetTop +
          elementToShow.clientHeight -
          listElement.offsetHeight +
          overScroll,
        listElement.scrollHeight
      )
    );
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(listElement, Math.max(elementToShow.offsetTop - overScroll, 0));
  }
}
