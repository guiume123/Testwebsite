import { icons } from '../../icons';
import heroHTML from './hero.html?raw';

export function createHero(): string {
  return heroHTML.replace('<span id="clock-icon"></span>', icons.clock);
}

export function initHero(): void {
  const heroContent = document.querySelector<HTMLElement>('.hero-content');
  if (heroContent) {
    requestAnimationFrame(() => {
      heroContent.classList.add('hero-content--visible');
    });
  }
}
