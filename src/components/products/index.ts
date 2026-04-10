import type { Product } from '../../types';
import productsHTML from './products.html?raw';
import productsData from '../../data/products.json';

let products: any[] = productsData;

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    category: urlParams.get('category'),
    subcategory: urlParams.get('subcategory'),
    brand: urlParams.get('brand')
  };
}

function renderProductCard(product: Product, isTweedehands: boolean): string {
  const sub = product.subcategory ? product.subcategory.toLowerCase().replace(/ /g, '-') : 'unknown';
  const imagePath = product.image 
    ? product.image 
    : `/src/assets/products/${(product.main_category || '').toLowerCase()}/${sub}/${encodeURIComponent(product.name)}/image.jpg`;
  
  let priceHtml = '';
  if (product.price) {
     if (isTweedehands || (product.main_category && product.main_category.toLowerCase() === 'tweedehands')) {
       priceHtml = `<div class="product-price" style="font-size: 1.1rem; font-weight: bold; color: #d97636; margin-top: 0.5rem;">Prijs: €${product.price}</div>`;
     } else {
       priceHtml = `<p class="product-price">€${product.price}</p>`;
     }
  }

  return `
    <div class="product-card" role="listitem">
      <div class="product-image">
        <img src="${imagePath}" alt="${product.name}" loading="lazy" onerror="this.src='/placeholder.jpg'" class="lightbox-trigger" data-src="${imagePath}" data-alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-brand">${product.brand || ''}</p>
        <p class="product-description">${product.description || 'Geen beschrijving beschikbaar'}</p>
        ${priceHtml}
      </div>
    </div>
  `;
}

export function createProducts(): string {
  return `
    ${productsHTML}
  `;
}

export function initProducts() {
  const { category, subcategory, brand } = getParams();
  const allProducts: Product[] = products;
  
  let filteredProducts = allProducts;

  if (category && category.toLowerCase() !== 'alle') {
    filteredProducts = filteredProducts.filter(p => p.main_category && p.main_category.toLowerCase() === category.toLowerCase());
  }

  if (subcategory) {
    filteredProducts = filteredProducts.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase());
  }

  if (brand) {
    filteredProducts = filteredProducts.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
  }

  const isTweedehands = category && category.toLowerCase() === 'tweedehands';
  
  let title = 'Alle Producten';

  if (category && category.toLowerCase() !== 'alle') {
    title = subcategory ? subcategory : category;
  }
  
  if (brand) {
    title = brand.toUpperCase();
  }

  if (isTweedehands) {
    title = 'Tweedehands Aanbod';
  } else if (category && category.toLowerCase() === 'aanbiedingen') {
    title = 'Aanbiedingen';
  }

  const titleEl = document.getElementById('category-title');
  const subtitleEl = document.getElementById('category-subtitle');
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.style.display = 'none';

  const grid = document.getElementById('products-grid');
  const section = document.querySelector('.products-section') as HTMLElement;

  if (subcategory && subcategory.toLowerCase() === 'geweren en karabijnen' && !brand && grid) {
    if (section) section.style.backgroundColor = 'var(--c-baus-green, #173f35)';
    if (titleEl) {
      titleEl.style.color = 'var(--c-baus-gold, #d39535)';
      titleEl.parentElement!.style.backgroundColor = 'var(--c-baus-green, #173f35)';
    }
    
    const brands = Array.from(new Set(filteredProducts.map(p => p.brand).filter(Boolean))) as string[];
    
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    grid.style.gap = '3rem';
    grid.style.paddingTop = '1rem';
    
    grid.innerHTML = brands.map(b => {
      const firstProduct = filteredProducts.find(p => p.brand === b);
      const sub = firstProduct?.subcategory ? firstProduct.subcategory.toLowerCase().replace(/ /g, '-') : 'unknown';
      let imagePath = '/placeholder.jpg';
      
      if (firstProduct) {
        if (firstProduct.image) {
          imagePath = firstProduct.image;
        } else {
          imagePath = `/src/assets/products/${(firstProduct.main_category || '').toLowerCase()}/${sub}/${encodeURIComponent(firstProduct.name)}/image.jpg`;
        }
      }

      return `
        <a href="?category=${encodeURIComponent(category || '')}&subcategory=${encodeURIComponent(subcategory)}&brand=${encodeURIComponent(b)}" style="text-decoration: none; color: inherit;">
          <div class="product-card" style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: transparent; height: 100%; border: none; box-shadow: none;">
            <div style="height: 200px; background: #fff; display: flex; align-items: center; justify-content: center; width: 100%; margin-bottom: 1rem; padding: 1rem;">
              <img src="${imagePath}" alt="${b}" style="max-height: 100%; max-width: 100%; object-fit: contain;" loading="lazy" onerror="this.src='/placeholder.jpg'">
            </div>
            <h3 style="color: var(--c-baus-gold, #d39535); font-style: italic; font-size: 1.5rem; font-weight: 700; text-transform: uppercase; margin: 0; align-self: flex-start; width: 100%;">${b}</h3>
          </div>
        </a>
      `;
    }).join('');
  } else if (grid) {
    grid.style.cssText = '';
    if (section) section.style.backgroundColor = '';
    if (titleEl) {
      titleEl.style.color = '';
      titleEl.parentElement!.style.backgroundColor = '';
    }
    grid.innerHTML = filteredProducts.map(p => renderProductCard(p, !!isTweedehands)).join('');
  }

  // Add lightbox functionality for all images
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (lightbox) {
    const images = document.querySelectorAll('.lightbox-trigger');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        const src = (img as HTMLImageElement).getAttribute('data-src');
        const alt = (img as HTMLImageElement).getAttribute('data-alt');
        if (lightboxImage && src) {
          lightboxImage.src = src;
          lightboxImage.alt = alt || 'Afbeelding';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = 'auto';
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay')?.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
}
