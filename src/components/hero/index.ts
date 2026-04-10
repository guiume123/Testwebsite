import { icons } from '../../icons';
import heroHTML from './hero.html?raw';

export function createHero(): string {
  return heroHTML.replace('<span id="clock-icon"></span>', icons.clock);
}

export function initHero(): void {
  const heroBg = document.querySelector<HTMLElement>('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroBg.style.transform = `translateY(${scroll * 0.3}px) scale(1.1)`;
      }
    });
  }

  const heroContent = document.querySelector<HTMLElement>('.hero-content');
  if (heroContent) {
    requestAnimationFrame(() => {
      heroContent.classList.add('hero-content--visible');
    });
  }
}
