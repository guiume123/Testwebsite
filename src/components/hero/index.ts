import type { StatItem } from '../../types';
import { icons } from '../../icons';
import heroHTML from './hero.html?raw';

const heroStats: StatItem[] = [
  { number: '80+', label: 'Jaar ervaring' },
  { number: '5000+', label: 'Producten' },
  { number: '100%', label: 'Erkend & legaal' },
];

export function createHero(): string {
  const statsHtml = heroStats
    .map((stat, i) => {
      const divider = i < heroStats.length - 1 ? '<div class="stat-divider"></div>' : '';
      return `
        <div class="stat-item">
          <span class="stat-number">${stat.number}</span>
          <span class="stat-label">${stat.label}</span>
        </div>
        ${divider}
      `;
    })
    .join('');

  return heroHTML
    .replace('<div class="hero-stats" id="hero-stats"></div>', `<div class="hero-stats" id="hero-stats">${statsHtml}</div>`)
    .replace('<span id="clock-icon"></span>', icons.clock);
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
