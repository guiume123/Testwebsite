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

import { createUsp } from './components/usp';
import './components/usp/usp.css';

import { createAbout, initAbout } from './components/about';
import './components/about/about.css';

import { createContact, initContact } from './components/contact';
import './components/contact/contact.css';

import { createFooter } from './components/footer';
import './components/footer/footer.css';

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

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

function initApp() {
  renderApp();

  initAnnouncementBar();
  initNavbar();
  initHero();
  initCategories();
  initAbout();
  initContact();
}

document.addEventListener('DOMContentLoaded', initApp);
