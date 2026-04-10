import type { Product } from '../../types';
import tweedehands from './tweedehands.html?raw';
import tweedehandsData from '../../assets/products/tweedehands/algemeen/products.json';

export function createTweedehands(): string {
  return `
    ${tweedehands}
  `;
}

function renderTweedehandsCard(product: Product): string {
  let priceHtml = '';
  if (product.price) {
    priceHtml = `<div class="tweedehands-price">Prijs: €${product.price}</div>`;
  }

  return `
    <div class="tweedehands-card" role="listitem">
      <div class="tweedehands-image" style="cursor: pointer;">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='/placeholder.jpg'" class="lightbox-trigger" data-src="${product.image}" data-alt="${product.name}">
      </div>
      <div class="tweedehands-info">
        <h3 class="tweedehands-name">${product.name}</h3>
        ${product.brand ? `<p class="tweedehands-brand">${product.brand}</p>` : ''}
        <p class="tweedehands-description">${product.description || 'Geen beschrijving beschikbaar'}</p>
        ${priceHtml}
      </div>
    </div>
  `;
}

export function initTweedehands(): void {
  const grid = document.getElementById('tweedehands-grid');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxClose = document.getElementById('lightbox-close');

  if (grid) {
    grid.innerHTML = tweedehandsData.map((p: Product) => renderTweedehandsCard(p)).join('');
    
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
