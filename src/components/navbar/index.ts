import type { NavItem } from '../../types';
import { icons } from '../../icons';
import navbarHTML from './navbar.html?raw';

const navItems: NavItem[] = [
  {
    label: 'Home', href: '/', id: 'nav-home',
  },
  {
    label: 'Producten', href: '?category=alle', id: 'nav-producten',
    children: [
      {
        label: 'Wapens', href: '?category=wapens', id: 'nav-wapens',
        children: [
          { label: 'Geweren en Karabijnen', href: '?category=wapens', id: 'nav-geweren' },
          { label: 'Pistolen en Revolvers/Pistolet et Revolvers', href: '?category=wapens', id: 'nav-pistolen' },
          { label: 'Luchtdrukwapens', href: '?category=wapens', id: 'nav-luchtdrukwapens' },
          { label: 'CO2 Pistolen en Revolvers', href: '?category=wapens', id: 'nav-co2-pistolen' },
          { label: 'Alarmpistolen en Revolvers', href: '?category=wapens', id: 'nav-alarmpistolen' },
          { label: 'Soft-Air Guns', href: '?category=wapens', id: 'nav-softair' },
          { label: 'Messen', href: '?category=wapens', id: 'nav-messen' },
          { label: 'Kruisbogen', href: '?category=wapens', id: 'nav-kruisbogen' },
        ],
      },
      {
        label: 'Munitie', href: '?category=munitie', id: 'nav-munitie',
        children: [
          { label: 'Hagel Munitie Jacht', href: '?category=munitie', id: 'nav-hagel-jacht' },
          { label: 'Kogel Munitie Jacht', href: '?category=munitie', id: 'nav-kogel-jacht' },
          { label: 'Hagel Munitie Sport', href: '?category=munitie', id: 'nav-hagel-sport' },
          { label: 'Kogel Munitie Sport', href: '?category=munitie', id: 'nav-kogel-sport' },
          { label: 'Luchtdruk Munitie', href: '?category=munitie', id: 'nav-luchtdruk-munitie' },
          { label: 'Alarm Munitie', href: '?category=munitie', id: 'nav-alarm-munitie' },
          { label: 'Herlaad Toebehoren', href: '?category=munitie', id: 'nav-herlaad' },
        ],
      },
      {
        label: 'Kleding', href: '?category=kleding', id: 'nav-kleding',
        children: [
          { label: 'Kleding', href: '?category=kleding', id: 'nav-kleding-main' },
          { label: 'Kleivesten en toebehoren', href: '?category=kleding', id: 'nav-kleivesten' },
          { label: 'Laarzen en Schoenen', href: '?category=kleding', id: 'nav-laarzen' },
          { label: 'Waadpakken', href: '?category=kleding', id: 'nav-waadpakken' },
        ],
      },
      {
        label: 'Geschenken', href: '?category=geschenken', id: 'nav-geschenken',
        children: [
          { label: 'Allerlei Geschenkartikelen', href: '?category=geschenken', id: 'nav-geschenkartikelen' },
        ],
      },
      {
        label: 'Optiek', href: '?category=optiek', id: 'nav-optiek',
        children: [
          { label: 'Richtkijkers & verrekijkers', href: '?category=optiek', id: 'nav-richtkijkers' },
        ],
      },
      {
        label: 'Honden', href: '?category=honden', id: 'nav-honden',
        children: [
          { label: 'Africhtinghalsband', href: '?category=honden', id: 'nav-africhtingshalsbands' },
        ],
      },
      {
        label: 'Toebehoren', href: '?category=toebehoren', id: 'nav-toebehoren',
        children: [
          { label: 'Lokkers Decoys', href: '?category=toebehoren', id: 'nav-lokkers' },
          { label: 'Vallen en vangkooien', href: '?category=toebehoren', id: 'nav-vallen' },
          { label: 'Hoogzitten en Tenten', href: '?category=toebehoren', id: 'nav-hoogszitten' },
          { label: 'Wildcamera\'s', href: '?category=toebehoren', id: 'nav-wildcamera' },
        ],
      },
      {
        label: 'Brand- en veiligheidskoffer', href: '?category=brand-en-veiligheidskoffer', id: 'nav-brand-veiligheidskoffer',
        children: [
          { label: 'Veiligheidskoffers', href: '?category=brand-en-veiligheidskoffer', id: 'nav-veiligheidskoffers' },
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