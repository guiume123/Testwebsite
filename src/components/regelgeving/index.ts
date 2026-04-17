import regelgevingHTML from './regelgeving.html?raw';

export function createRegelgeving(): string {
  return regelgevingHTML;
}

export function initRegelgeving(): void {
  const section = document.querySelector<HTMLElement>('.regelgeving-page');
  if (!section) return;

  section.classList.add('regelgeving--visible');
}
