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
import './components/products/products.css'; // assume we create this

import { createUsp } from './components/usp';
import './components/usp/usp.css';

import { createAbout, initAbout } from './components/about';
import './components/about/about.css';

import { createContact, initContact } from './components/contact';
import './components/contact/contact.css';

import { createFooter } from './components/footer';
import './components/footer/footer.css';

function getCategoryFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const category = getCategoryFromURL();

  if (category) {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      <main>
        ${createProducts()}
      </main>
      ${createFooter()}
    `;
  } else {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      <main>
        ${createHero()}
        ${createCategories()}
        ${createUsp()}
        ${createAbout()}
        ${createContact()}
      </main>
      ${createFooter()}
    `;
  }
}

async function initApp() {
  renderApp();

  const category = getCategoryFromURL();

  initAnnouncementBar();
  initNavbar();

  if (category) {
    initProducts();
  } else {
    initHero();
    initCategories();
    initAbout();
    initContact();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
