import type { Product } from '../../types';
import aanbiedingen from './aanbiedingen.html?raw';
import aanbiedingenData from '../../TWEEDEHANDS-AANBIEDINGEN/aanbiedingen/aanbiedingen/products.json';

export function createAanbiedingen(): string {
  return `
    ${aanbiedingen}
  `;
}

function renderAanbiedingenCard(product: Product): string {
  const imagePath = product.image || '/placeholder.jpg';
  const productName = product.name || 'Onbekend product';
  const productDetailUrl = `?page=product&product=${encodeURIComponent(productName)}&img=${encodeURIComponent(imagePath)}`;
  const priceHtml = product.price
    ? `<div class="aanbiedingen-price">${product.price.toString().includes('euro') || product.price.toString().includes('€') ? product.price : `€${product.price}`}</div>`
    : '';

  return `
    <div class="aanbiedingen-card" role="listitem">
      <div class="aanbiedingen-image" style="cursor: pointer;">
        <img src="${imagePath}" alt="${productName}" loading="lazy" onerror="this.src='/placeholder.jpg'" class="lightbox-trigger" data-src="${imagePath}" data-alt="${productName}">
      </div>
      <div class="aanbiedingen-info">
        <h3 class="aanbiedingen-name">${productName}</h3>
        ${priceHtml}
        <p class="aanbiedingen-description">${product.description || 'Geen beschrijving beschikbaar'}</p>
        <a class="aanbiedingen-detail-link" href="${productDetailUrl}">Meer info</a>
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
    grid.innerHTML = aanbiedingenData.map((p: any) => renderAanbiedingenCard(p)).join('');
    
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
