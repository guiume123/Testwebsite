import './style.css';

// Component imports & styles
import { createAnnouncementBar, initAnnouncementBar } from './components/announcement';
import './components/announcement/announcement.css';

import { createNavbar, initNavbar } from './components/navbar';
import './components/navbar/navbar.css';

import { createHero, initHero } from './components/hero';
import './components/hero/hero.css';

import { createCategories, initCategories } from './components/categories';
import './components/categories/categories.css';

import { createProducts, initProducts } from './components/products';
import './components/products/products.css';

import { createFilter, initFilter } from './components/filter';
import './components/filter/filter.css';

import { createAanbiedingen, initAanbiedingen } from './components/aanbiedingen';
import './components/aanbiedingen/aanbiedingen.css';

import { createTweedehands, initTweedehands } from './components/tweedehands';
import './components/tweedehands/tweedehands.css';

import { createAbout, initAbout } from './components/about';
import './components/about/about.css';

import { createSponsors, initSponsors } from './components/sponsors';
import './components/sponsors/sponsors.css';

import { createContact, initContact } from './components/contact';
import './components/contact/contact.css';

import { createVraag, initVraag } from './components/vraag';

import { createOpeningsuren, initOpeningsuren } from './components/openingsuren';
import './components/openingsuren/openingsuren.css';

import { createRegelgeving, initRegelgeving } from './components/regelgeving';
import './components/regelgeving/regelgeving.css';

import { createFooter } from './components/footer';
import './components/footer/footer.css';
import { toSafeImageUrl } from './utils/image-url';


function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeImageSrc(value: string): string {
  return toSafeImageUrl(value);
}

const EMPTY_PRODUCT_TEMPLATE = {
  brand: '',
  name: '',
  image: '',
  main_category: '',
  subcategory: '',
  productcode: '',
  price: '',
  description: '',
  specs: {
    gewicht: '',
    jaar: '',
    munitie: '',
    precisie: ''
  }
};


function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const category = urlParams.get('category');
  const type = urlParams.get('type');
  const productName = (urlParams.get('product') || '').trim();
  const productImage = sanitizeImageSrc((urlParams.get('img') || '').trim());
  const safeProductName = escapeHtml(productName || 'Onbekend product');
  const emptyProductTemplateJson = escapeHtml(JSON.stringify(EMPTY_PRODUCT_TEMPLATE, null, 2));

  if (page === 'product') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        <section class="products-section" aria-label="Product detail">
          <div class="container">
            <div style="margin: 0.25rem 0 4rem calc(-1 * var(--container-px) - 8rem);">
              <span class="section-label" style="display: block; margin-bottom: 0.5rem;">Product</span>
              <h2 class="section-title" style="font-size: 1.5rem; margin: 0 0 1rem 0;">${safeProductName}</h2>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 2rem; margin: 0 0 4rem calc(-1 * var(--container-px) - 8rem); flex-wrap: wrap;">
              <div style="max-width: 640px; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; flex: 0 1 640px;">
                <img src="${escapeHtml(productImage)}" alt="${safeProductName}" loading="lazy" style="width: 100%; height: auto; display: block;" onerror="this.src='/placeholder.jpg'">
              </div>
              <div style="padding-top: 0; max-width: 420px; flex: 1 1 320px;">
                <pre style="margin-top: 1rem; padding: 1rem; background: #fff; border: 1px solid #e8ebea; border-radius: 8px; font-size: 0.8rem; line-height: 1.45; overflow: auto;">${emptyProductTemplateJson}</pre>
              </div>
            </div>
          </div>
        </section>
      </main>
      ${createFooter()}
    `;
  } else if (page === 'vraag') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createVraag()}
      </main>
      ${createFooter()}
    `;
  } else if (page === 'regelgeving') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createRegelgeving()}
      </main>
      ${createFooter()}
    `;
  } else if (category === 'aanbiedingen') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createAanbiedingen()}
      </main>
      ${createFooter()}
    `;
  } else if (category === 'tweedehands') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createTweedehands()}
      </main>
      ${createFooter()}
    `;
  } else if (category || type) {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createFilter()}
        ${createProducts()}
      </main>
      ${createFooter()}
    `;
  } else {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createHero()}
        ${createCategories()}
        ${createAbout()}
        ${createSponsors()}
        ${createContact()}
      </main>
      ${createFooter()}
    `;
  }
}

async function initApp() {
  renderApp();

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const category = urlParams.get('category');
  const type = urlParams.get('type');

  initAnnouncementBar();
  initNavbar();
  initOpeningsuren();

  if (page === 'product') {
    // Product detail page is intentionally minimal for now.
  } else if (page === 'vraag') {
    initVraag();
  } else if (page === 'regelgeving') {
    initRegelgeving();
  } else if (category === 'aanbiedingen') {
    initAanbiedingen();
  } else if (category === 'tweedehands') {
    initTweedehands();
  } else if (category || type) {
    initProducts();
    initFilter();
  } else {
    initHero();
    initCategories();
    initAbout();
    initSponsors();
    initContact();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
