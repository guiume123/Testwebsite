import type { NavItem } from '../../types';
import { icons } from '../../icons';
import navbarHTML from './navbar.html?raw';

const navItems: NavItem[] = [
  {
    label: 'Home', href: '/', id: 'nav-home',
  },
  {
    label: 'Producten', href: '#producten', id: 'nav-producten',
    children: [
      {
        label: 'Wapens', href: '#wapens', id: 'nav-wapens',
        children: [
          { label: 'Geweren en karabijnen', href: '#wapens/geweren-en-karabijnen', id: 'nav-geweren' },
          { label: 'Pistolen en revolvers', href: '#wapens/pistolen-en-revolvers', id: 'nav-pistolen' },
          { label: 'Luchtdrukwapens', href: '#wapens/luchtdrukwapens', id: 'nav-luchtdrukwapens' },
          { label: 'CO2 pistolen en revolvers', href: '#wapens/co2-pistolen-en-revolvers', id: 'nav-co2-pistolen' },
          { label: 'Alarmpistolen en revolvers', href: '#wapens/alarmpistolen-en-revolvers', id: 'nav-alarmpistolen' },
          { label: 'Soft-air guns', href: '#wapens/soft-air-guns', id: 'nav-softair' },
          { label: 'Messen', href: '#wapens/messen', id: 'nav-messen' },
          { label: 'Kruisbogen', href: '#wapens/kruisbogen', id: 'nav-kruisbogen' },
        ],
      },
      {
        label: 'Munitie', href: '#munitie', id: 'nav-munitie',
        children: [
          { label: 'Hagel munitie jacht', href: '#munitie/hagel-munitie-jacht', id: 'nav-hagel-jacht' },
          { label: 'Kogel munitie jacht', href: '#munitie/kogel-munitie-jacht', id: 'nav-kogel-jacht' },
          { label: 'Hagel munitie sport', href: '#munitie/hagel-munitie-sport', id: 'nav-hagel-sport' },
          { label: 'Kogel munitie sport', href: '#munitie/kogel-munitie-sport', id: 'nav-kogel-sport' },
          { label: 'Luchtdruk munitie', href: '#munitie/luchtdruk-munitie', id: 'nav-luchtdruk-munitie' },
          { label: 'Alarm munitie', href: '#munitie/alarm-munitie', id: 'nav-alarm-munitie' },
          { label: 'Herlaad toebehoren', href: '#munitie/herlaad-toebehoren', id: 'nav-herlaad' },
        ],
      },
      {
        label: 'Kleding', href: '#kleding', id: 'nav-kleding',
        children: [
          { label: 'Kleding', href: '#kleding/kleding', id: 'nav-kleding-main' },
          { label: 'Kleivesten en toebehoren', href: '#kleding/kleivesten-en-toebehoren', id: 'nav-kleivesten' },
          { label: 'Laarzen en schoenen', href: '#kleding/laarzen-en-schoenen', id: 'nav-laarzen' },
          { label: 'Waadpakken', href: '#kleding/waadpakken', id: 'nav-waadpakken' },
        ],
      },
      {
        label: 'Geschenken', href: '#geschenken', id: 'nav-geschenken',
        children: [
          { label: 'Allerlei geschenkkartikelen', href: '#geschenken/allerlei-geschenkkartikelen', id: 'nav-geschenkartikelen' },
        ],
      },
      {
        label: 'Optiek', href: '#optiek', id: 'nav-optiek',
        children: [
          { label: 'Richtkijkers en verrekijkers', href: '#optiek/richtkijkers-en-verrekijkers', id: 'nav-richtkijkers' },
        ],
      },
      {
        label: 'Honden', href: '#honden', id: 'nav-honden',
        children: [
          { label: 'Africhtingshalsbands', href: '#honden/africhtingshalsbands', id: 'nav-africhtingshalsbands' },
        ],
      },
      {
        label: 'Toebehoren', href: '#toebehoren', id: 'nav-toebehoren',
        children: [
          { label: 'Lokkers decoys', href: '#toebehoren/lokkers-decoys', id: 'nav-lokkers' },
          { label: 'Vallen en vangkooien', href: '#toebehoren/vallen-en-vangkooien', id: 'nav-vallen' },
          { label: 'Hoogszitten en tenten', href: '#toebehoren/hoogszitten-en-tenten', id: 'nav-hoogszitten' },
          { label: 'Wildamera\'s', href: '#toebehoren/wildcamera-s', id: 'nav-wildcamera' },
          { label: 'Veiligheidskoffers', href: '#toebehoren/veiligheidskoffers', id: 'nav-veiligheidskoffers' },
        ],
      },
    ],
  },
  {
    label: 'Aanbiedingen', href: '#aanbiedingen', id: 'nav-aanbiedingen',
  },
  {
    label: 'Logo', href: '/', id: 'nav-logo', isLogo: true,
  },
  {
    label: 'Tweedehands', href: '#tweedehands', id: 'nav-tweedehands',
  },
  {
    label: 'Contact', href: '#contact', id: 'nav-contact',
  },
  {
    label: 'Openingsuren', href: '#openingsuren', id: 'nav-openingsuren',
  },
];

function renderNavItem(item: NavItem, isNested: boolean = false): string {
  if ((item as any).isLogo) {
    return `
    <li class="nav-item nav-item--logo">
      <a href="${item.href}" class="nav-link nav-link--logo" id="${item.id}" aria-label="Baus - Startpagina">
        <img src="/images/baus-logo.png" alt="Baus Logo" class="logo-img" />
      </a>
    </li>
  `;
  }

  const hasChildren = item.children && item.children.length > 0;
  const dropdownHtml = hasChildren
    // FIX: nested items get ONLY 'dropdown--nested', not both classes
    ? `<ul class="${isNested ? 'dropdown--nested' : 'dropdown'}" role="list" aria-label="${item.label} submenu">
        ${item.children!.map(child => renderNavItem(child, true)).join('')}
      </ul>`
    : '';

  const itemClass = isNested ? 'nav-item--nested' : '';

  return `
    <li class="nav-item ${hasChildren ? 'has-dropdown' : ''} ${itemClass}">
      <a href="${item.href}" class="nav-link" id="${item.id}">
        ${item.label}
        ${hasChildren ? icons.chevronDown : ''}
      </a>
      ${dropdownHtml}
    </li>
  `;
}

export function createNavbar(): string {
  const navItemsHtml = navItems.map(item => renderNavItem(item)).join('');
  return navbarHTML
    .replace('<!-- nav items -->', navItemsHtml)
    .replace('<span id="phone-icon"></span>', icons.phone);
}

export function initNavbar(): void {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Sticky header on scroll
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
      if (currentScroll > lastScroll && currentScroll > 400) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScroll = currentScroll;
    });
  }

  // Mobile hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      hamburger.classList.toggle('is-active');
      navMenu.classList.toggle('nav-menu--open');
      document.body.classList.toggle('nav-open');
    });
  }

  // Top-level dropdown menus
  const dropdownItems = document.querySelectorAll<HTMLElement>(':scope .nav-menu > .nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector<HTMLElement>(':scope > .nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const isAlreadyOpen = item.classList.contains('dropdown-open');
        // Close all top-level dropdowns
        dropdownItems.forEach(other => other.classList.remove('dropdown-open'));
        // Toggle this one
        if (!isAlreadyOpen) item.classList.add('dropdown-open');
      });
    }

    // Nested dropdowns — toggle on click (desktop + mobile)
    const nestedItems = item.querySelectorAll<HTMLElement>('.nav-item--nested.has-dropdown');
    nestedItems.forEach(nestedItem => {
      const nestedLink = nestedItem.querySelector<HTMLElement>(':scope > .nav-link');
      if (nestedLink) {
        nestedLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Close sibling nested dropdowns
          nestedItems.forEach(other => {
            if (other !== nestedItem) {
              other.classList.remove('dropdown-open');
            }
          });
          nestedItem.classList.toggle('dropdown-open');
        });
      }
    });
  });

  // FIX: close open dropdowns when clicking outside (desktop)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) return;
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
    }
  });

  // Close mobile menu when clicking a leaf link
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link, .dropdown-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const parentItem = link.closest('.nav-item');
      const hasChildren = parentItem?.classList.contains('has-dropdown');
      if (!hasChildren && navMenu && hamburger && window.innerWidth <= 1024) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        navMenu.classList.remove('nav-menu--open');
        document.body.classList.remove('nav-open');
      }
    });
  });
}