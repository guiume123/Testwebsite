import type { Product } from '../../types';
import productsHTML from './products.html?raw';
import productsData from '../../ALL PRODUCTS/products.json';

let products: any[] = productsData;

const GEWEREN_BRAND_IMAGES: Record<string, string> = {
  'artisanale': '/src/assets/products/wapens/geweren-en-karabijnen/Artisanale/Artsinale.jpg',
  'browning': '/src/assets/products/wapens/geweren-en-karabijnen/Browning/Browning.jpg',
  'diverse': '/src/assets/products/wapens/geweren-en-karabijnen/Diverse/Diverse.jpg',
  'fair': '/src/assets/products/wapens/geweren-en-karabijnen/Fair/Fair.jpg',
  'winchester': '/src/assets/products/wapens/geweren-en-karabijnen/Winchester/Winchester.jpg'
};

const GEWEREN_BRANDS = ['Artisanale', 'Browning', 'Diverse', 'FAIR', 'Winchester'];

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    category: urlParams.get('category'),
    subcategory: urlParams.get('subcategory'),
    brand: urlParams.get('brand')
  };
}

function getBrandFromImagePath(imagePath: string): string | null {
  // Extract brand from path like "/src/assets/products/wapens/geweren-en-karabijnen/Diverse/..."
  const match = imagePath.match(/geweren-en-karabijnen\/([^\/]+)\//);
  return match ? match[1] : null;
}

function renderProductCard(product: Product): string {
  const imagePath = product.image || '/placeholder.jpg';
  
  let priceHtml = '';
  if (product.price) {
    const priceDisplay = product.price.toString().includes('euro') ? product.price : `€${product.price}`;
    priceHtml = `<div class="product-price" style="font-size: 0.95rem; font-weight: bold; color: #d97636; margin-top: 0.5rem;">${priceDisplay}</div>`;
  }

  return `
    <div class="product-card" role="listitem">
      <div class="product-image">
        <img src="${imagePath}" alt="${product.name}" loading="lazy" onerror="this.src='/placeholder.jpg'" class="lightbox-trigger" data-src="${imagePath}" data-alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        ${product.brand ? `<p class="product-brand">${product.brand}</p>` : ''}
        ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
        ${priceHtml}
      </div>
    </div>
  `;
}

function renderBrandCard(brand: string, imageUrl: string, category: string, subcategory: string, normalizeString: (str: string) => string): string {
  const normalizedSubcategory = normalizeString(subcategory);
  const normalizedBrand = normalizeString(brand);
  return `
    <a href="?category=${encodeURIComponent(category)}&amp;subcategory=${encodeURIComponent(normalizedSubcategory)}&amp;brand=${encodeURIComponent(normalizedBrand)}" style="text-decoration: none; color: inherit;">
      <div class="product-card" style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: transparent; height: 100%; border: none; box-shadow: none;">
        <div style="height: 150px; background: #fff; display: flex; align-items: center; justify-content: center; width: 100%; margin-bottom: 0.75rem; padding: 0.75rem;">
          <img src="${imageUrl}" alt="${brand}" style="max-height: 100%; max-width: 100%; object-fit: contain;" loading="lazy" onerror="this.src='/placeholder.jpg'">
        </div>
        <h3 style="color: var(--c-baus-gold, #d39535); font-style: italic; font-size: 1.3rem; font-weight: 700; text-transform: uppercase; margin: 0; align-self: flex-start; width: 100%;">${brand}</h3>
      </div>
    </a>
  `;
}

function renderSubcategoryCard(subcategory: string, imageUrl: string, category: string, normalizeString: (str: string) => string): string {
  const normalizedSubcategory = normalizeString(subcategory);
  return `
    <a href="?category=${encodeURIComponent(category)}&amp;subcategory=${encodeURIComponent(normalizedSubcategory)}" style="text-decoration: none; color: inherit;">
      <div class="product-card" style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: transparent; height: 100%; border: none; box-shadow: none;">
        <div style="height: 150px; background: #fff; display: flex; align-items: center; justify-content: center; width: 100%; margin-bottom: 0.75rem; padding: 0.75rem;">
          <img src="${imageUrl}" alt="${subcategory}" style="max-height: 100%; max-width: 100%; object-fit: cover;" loading="lazy" onerror="this.src='/placeholder.jpg'">
        </div>
        <h3 style="color: var(--c-baus-gold, #d39535); font-style: italic; font-size: 1rem; font-weight: 700; text-transform: capitalize; margin: 0; align-self: flex-start; width: 100%;">${subcategory}</h3>
      </div>
    </a>
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
  
  // === HELPER FUNCTION ===
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/[^\w-]/g, '')    // Remove special characters (keep word chars and hyphens)
      .replace(/-+/g, '-');      // Collapse multiple hyphens to single
  };

  // === DETERMINE VIEW TYPE (early) ===
  const isSpecialCategory = category && (category.toLowerCase() === 'tweedehands' || category.toLowerCase() === 'aanbiedingen');
  const normalizedUrlSubcat = subcategory ? normalizeString(subcategory) : '';
  const isGewerenSubcategory = normalizedUrlSubcat === normalizeString('Geweren en Karabijnen');
  
  // === FILTERING LOGIC ===
  
  // Filter by main category or special field
  let filteredByCategory = allProducts.filter(p => {
    const mainCat = p.main_category ? normalizeString(p.main_category) : '';
    const specialCat = p.special ? normalizeString(p.special) : '';
    
    if (category && category.toLowerCase() !== 'alle') {
      const normalizedCategory = normalizeString(category);
      return mainCat === normalizedCategory || specialCat === normalizedCategory;
    }
    return true;
  });

  // Get unique subcategories from filtered category
  const uniqueSubcategories = Array.from(new Set(
    filteredByCategory
      .filter(p => p.subcategory)
      .map(p => p.subcategory)
  )) as string[];

  // Check if we should show subcategory selection
  const shouldShowSubcategorySelection = 
    !isSpecialCategory && 
    !subcategory && 
    category && 
    uniqueSubcategories.length > 1;

  // Filter by subcategory (only if category is not special and subcategory is provided)
  let filteredBySubcategory = filteredByCategory;
  if (subcategory && category?.toLowerCase() !== 'tweedehands' && category?.toLowerCase() !== 'aanbiedingen') {
    filteredBySubcategory = filteredByCategory.filter(p => 
      p.subcategory && normalizeString(p.subcategory) === normalizedUrlSubcat
    );
  }

  // Filter by brand (for geweren: filter by brand folder from image path)
  let filteredByBrand = filteredBySubcategory;
  if (brand) {
    if (isGewerenSubcategory) {
      // For geweren products: filter by brand folder in image path
      filteredByBrand = filteredBySubcategory.filter(p => {
        const brandFromPath = getBrandFromImagePath(p.image || '');
        return brandFromPath && brandFromPath.toLowerCase() === brand.toLowerCase();
      });
    } else {
      // For other products: filter by brand field
      filteredByBrand = filteredBySubcategory.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
    }
  }

  const shouldShowBrands = isGewerenSubcategory && !brand;

  // === SET PAGE TITLE ===
  
  let title = 'Alle Producten';
  if (isSpecialCategory) {
    title = category?.toLowerCase() === 'tweedehands' ? 'Tweedehands Aanbod' : 'Aanbiedingen';
  } else if (brand) {
    title = brand.toUpperCase();
  } else if (subcategory) {
    // Use the actual subcategory name from data if available
    const subFromData = filteredBySubcategory.length > 0 ? filteredBySubcategory[0].subcategory : subcategory;
    title = subFromData || subcategory;
  } else if (shouldShowSubcategorySelection) {
    // When showing subcategory selection, show the category name
    title = category || 'Categorieën';
  } else if (category) {
    title = category;
  }

  // === UPDATE DOM ===
  
  const titleEl = document.getElementById('category-title');
  const subtitleEl = document.getElementById('category-subtitle');
  const labelEl = document.getElementById('category-label');
  const grid = document.getElementById('products-grid');
  const section = document.querySelector('.products-section') as HTMLElement;

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.style.display = 'none';

  // === RENDER GRID ===
  
  if (!grid) return;

  // Style for geweren brand view
  if (isGewerenSubcategory) {
    if (labelEl) labelEl.style.display = 'none';
    if (section) {
      section.classList.add('geweren-brand-view');
      section.style.backgroundColor = 'var(--c-baus-green, #173f35)';
    }
    if (titleEl && titleEl.parentElement) {
      titleEl.style.color = 'var(--c-baus-gold, #d39535)';
      titleEl.parentElement.style.backgroundColor = 'var(--c-baus-green, #173f35)';
    }
  } else {
    if (labelEl) labelEl.style.display = '';
    if (section) {
      section.classList.remove('geweren-brand-view');
      section.style.backgroundColor = '';
    }
    if (titleEl && titleEl.parentElement) {
      titleEl.style.color = '';
      titleEl.parentElement.style.backgroundColor = '';
    }
  }

  // Render subcategory selection for normal categories
  if (shouldShowSubcategorySelection) {
    grid.classList.add('subcategory-grid');
    grid.innerHTML = uniqueSubcategories.sort().map(subcat => {
      // Get first product image from this subcategory
      const productsInSubcat = filteredByCategory.filter(p => p.subcategory === subcat);
      const firstProduct = productsInSubcat[0];
      const imageUrl = firstProduct?.image || '/placeholder.jpg';
      return renderSubcategoryCard(subcat, imageUrl, category || '', normalizeString);
    }).join('');
  }
  // Render brands for geweren-en-karabijnen when no brand is selected
  else if (shouldShowBrands) {
    grid.classList.add('geweren-brand-grid');
    grid.innerHTML = GEWEREN_BRANDS.map(b => {
      const imageUrl = GEWEREN_BRAND_IMAGES[b.toLowerCase()] || '/placeholder.jpg';
      return renderBrandCard(b, imageUrl, category || '', subcategory || '', normalizeString);
    }).join('');
  } 
  // Render normal product cards
  else {
    grid.classList.remove('subcategory-grid');
    grid.classList.remove('geweren-brand-grid');
    grid.innerHTML = filteredByBrand.map(p => renderProductCard(p)).join('');
  }

  // === LIGHTBOX FUNCTIONALITY ===
  
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
