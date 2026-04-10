import type { CategoryCard } from '../../types';
import categoriesHTML from './categories.html?raw';

const categories: CategoryCard[] = [
  { id: 'cat-wapens', name: 'Wapens', href: '?category=wapens', bgClass: 'cat-bg-1' },
  { id: 'cat-munitie', name: 'Munitie', href: '?category=munitie', bgClass: 'cat-bg-2' },
  { id: 'cat-kleding', name: 'Kleding', href: '?category=kleding', bgClass: 'cat-bg-3' },
  { id: 'cat-geschenken', name: 'Geschenken', href: '?category=geschenken', bgClass: 'cat-bg-4' },
  { id: 'cat-optiek', name: 'Optiek', href: '?category=optiek', bgClass: 'cat-bg-5' },
  { id: 'cat-honden', name: 'Honden', href: '?category=honden', bgClass: 'cat-bg-6' },
  { id: 'cat-toebehoren', name: 'Toebehoren', href: '?category=toebehoren', bgClass: 'cat-bg-7' },
  { id: 'cat-veiligheid', name: 'Brand- en veiligheidskoffer', href: '?category=brand-en-veiligheidskoffer', bgClass: 'cat-bg-8' },
];

function renderCategoryCard(cat: CategoryCard): string {
  return `
    <a href="${cat.href}" class="category-card"
       id="${cat.id}" role="listitem" aria-label="Categorie ${cat.name}">
      <div class="category-bg ${cat.bgClass}"></div>
      <div class="category-overlay"></div>
      <div class="category-info">
        <h3 class="category-name">${cat.name}</h3>
        <button class="category-link">Bekijk collectie →</button>
      </div>
      <div class="category-shine"></div>
    </a>
  `;
}

export function createCategories(): string {
  const categoriesHtml = categories.map(renderCategoryCard).join('');
  return categoriesHTML.replace('<!-- categories -->', categoriesHtml);
}

export function initCategories(): void {
  // Intersection Observer for scroll reveal animations
  const cards = document.querySelectorAll<HTMLElement>('.category-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('card-visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  cards.forEach(card => observer.observe(card));

  // Mouse shine effect
  cards.forEach(card => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
