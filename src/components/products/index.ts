import type { Product } from '../../types';
import productsHTML from './products.html?raw';
import productsData from '../../data/products.json';

let products: any[] = productsData;

function getCategoryFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

function renderProductCard(product: Product): string {
  const sub = product.subcategory ? product.subcategory.toLowerCase().replace(/ /g, '-') : 'unknown';
  const imagePath = product.image.startsWith('http') ? product.image : `/src/assets/products/${product.main_category.toLowerCase()}/${sub}/${encodeURIComponent(product.name)}/image.jpg`;
  return `
    <div class="product-card" role="listitem">
      <div class="product-image">
        <img src="${imagePath}" alt="${product.name}" loading="lazy" onerror="this.src='/placeholder.jpg'">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-brand">${product.brand || ''}</p>
        <p class="product-description">${product.description || 'Geen beschrijving beschikbaar'}</p>
        ${product.price ? `<p class="product-price">€${product.price}</p>` : ''}
        <a href="${product.link}" target="_blank" class="product-link">Meer info →</a>
      </div>
    </div>
  `;
}

export function createProducts(): string {
  return productsHTML;
}

export function initProducts() {
  const category = getCategoryFromURL();
  const allProducts: Product[] = products;
  
  // If no category or 'alle', show all products
  const filteredProducts = (category && category.toLowerCase() !== 'alle') 
    ? allProducts.filter(p => p.main_category.toLowerCase() === category.toLowerCase()) 
    : allProducts;

  const title = (category && category.toLowerCase() !== 'alle') ? `Producten - ${category}` : 'Alle Producten';
  const subtitle = (category && category.toLowerCase() !== 'alle') ? `Ontdek ons ${category.toLowerCase()} assortiment` : 'Ontdek ons volledige assortiment';

  const titleEl = document.getElementById('category-title');
  const subtitleEl = document.getElementById('category-subtitle');
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;

  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = filteredProducts.map(renderProductCard).join('');
  }
}