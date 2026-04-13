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

import { createFooter } from './components/footer';
import './components/footer/footer.css';



function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const category = urlParams.get('category');
  const type = urlParams.get('type');

  if (page === 'vraag') {
    app.innerHTML = `
      ${createAnnouncementBar()}
      ${createNavbar()}
      ${createOpeningsuren()}
      <main>
        ${createVraag()}
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

  if (page === 'vraag') {
    initVraag();
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
