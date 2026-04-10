import type { Product } from '../../types';
import aanbiedingen from './aanbiedingen.html?raw';
import aanbiedingenData from '../../assets/products/aanbiedingen/algemeen/products.json';

export function createAanbiedingen(): string {
  return `
    ${aanbiedingen}
  `;
}

function renderAanbiedingenCard(product: Product): string {
  return `
    <div class="aanbiedingen-card" role="listitem">
      <div class="aanbiedingen-image" style="cursor: pointer;">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='/placeholder.jpg'" class="lightbox-trigger" data-src="${product.image}" data-alt="${product.name}">
      </div>
      <div class="aanbiedingen-info">
        <h3 class="aanbiedingen-name">${product.name}</h3>
        <p class="aanbiedingen-description">${product.description || 'Geen beschrijving beschikbaar'}</p>
      </div>
    </div>
  `;
}

export function initAanbiedingen(): void {
  const grid = document.getElementById('aanbiedingen-grid');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxClose = document.getElementById('lightbox-close');

  if (grid) {
    grid.innerHTML = aanbiedingenData.map((p: Product) => renderAanbiedingenCard(p)).join('');
    
    // Add lightbox functionality for all images
    const images = grid.querySelectorAll('.lightbox-trigger');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        const src = (img as HTMLImageElement).getAttribute('data-src');
        const alt = (img as HTMLImageElement).getAttribute('data-alt');
        if (lightboxImage && src) {
          lightboxImage.src = src;
          lightboxImage.alt = alt || 'Afbeelding';
          lightbox?.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Close lightbox
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = 'auto';
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  document.getElementById('image-lightbox')?.querySelector('.lightbox-overlay')?.addEventListener('click', closeLightbox);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });
}
