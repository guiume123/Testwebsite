import type { NavItem } from '../../types';
import { icons } from '../../icons';
import navbarHTML from './navbar.html?raw';

const navItems: NavItem[] = [
  {
    label: 'Producten', href: '?category=alle', id: 'nav-producten',
    children: [
      {
        label: 'Wapens', href: '?category=wapens', id: 'nav-wapens',
        children: [
          { label: 'Geweren en Karabijnen', href: '?category=wapens&subcategory=Geweren%20en%20Karabijnen', id: 'nav-geweren' },
          { label: 'Pistolen en Revolvers/Pistolet et Revolvers', href: '?category=wapens&subcategory=Pistolen%20en%20Revolvers', id: 'nav-pistolen' },
          { label: 'Luchtdrukwapens', href: '?category=wapens&subcategory=Luchtdrukwapens', id: 'nav-luchtdrukwapens' },
          { label: 'CO2 Pistolen en Revolvers', href: '?category=wapens&subcategory=CO2%20Pistolen%20en%20Revolvers', id: 'nav-co2-pistolen' },
          { label: 'Alarmpistolen en Revolvers', href: '?category=wapens&subcategory=Alarmpistolen%20en%20Revolvers', id: 'nav-alarmpistolen' },
          { label: 'Soft-Air Guns', href: '?category=wapens&subcategory=Soft-Air%20Guns', id: 'nav-softair' },
          { label: 'Messen', href: '?category=wapens&subcategory=Messen', id: 'nav-messen' },
          { label: 'Kruisbogen', href: '?category=wapens&subcategory=Kruisbogen', id: 'nav-kruisbogen' },
        ],
      },
      {
        label: 'Munitie', href: '?category=munitie', id: 'nav-munitie',
        children: [
          { label: 'Hagel Munitie Jacht', href: '?category=munitie&subcategory=Hagel%20Munitie%20Jacht', id: 'nav-hagel-jacht' },
          { label: 'Kogel Munitie Jacht', href: '?category=munitie&subcategory=Kogel%20Munitie%20Jacht', id: 'nav-kogel-jacht' },
          { label: 'Hagel Munitie Sport', href: '?category=munitie&subcategory=Hagel%20Munitie%20Sport', id: 'nav-hagel-sport' },
          { label: 'Kogel Munitie Sport', href: '?category=munitie&subcategory=Kogel%20Munitie%20Sport', id: 'nav-kogel-sport' },
          { label: 'Luchtdruk Munitie', href: '?category=munitie&subcategory=Luchtdruk%20Munitie', id: 'nav-luchtdruk-munitie' },
          { label: 'Alarm Munitie', href: '?category=munitie&subcategory=Alarm%20Munitie', id: 'nav-alarm-munitie' },
          { label: 'Herlaad Toebehoren', href: '?category=munitie&subcategory=Herlaad%20Toebehoren', id: 'nav-herlaad' },
        ],
      },
      {
        label: 'Kleding', href: '?category=kleding', id: 'nav-kleding',
        children: [
          { label: 'Kleding', href: '?category=kleding&subcategory=Kleding', id: 'nav-kleding-main' },
          { label: 'Kleivesten en toebehoren', href: '?category=kleding&subcategory=Kleivesten%20en%20toebehoren', id: 'nav-kleivesten' },
          { label: 'Laarzen en Schoenen', href: '?category=kleding&subcategory=Laarzen%20en%20Schoenen', id: 'nav-laarzen' },
          { label: 'Waadpakken', href: '?category=kleding&subcategory=Waadpakken', id: 'nav-waadpakken' },
        ],
      },
      {
        label: 'Geschenken', href: '?category=geschenken', id: 'nav-geschenken',
        children: [
          { label: 'Allerlei Geschenkartikelen', href: '?category=geschenken&subcategory=Allerlei%20Geschenkartikelen', id: 'nav-geschenkartikelen' },
        ],
      },
      {
        label: 'Optiek', href: '?category=optiek', id: 'nav-optiek',
        children: [
          { label: 'Richtkijkers en Verrekijkers', href: '?category=optiek&subcategory=Richtkijkers%20en%20Verrekijkers', id: 'nav-richtkijkers' },
        ],
      },
      {
        label: 'Honden', href: '?category=honden', id: 'nav-honden',
        children: [
          { label: 'Africhtinghalsband', href: '?category=honden&subcategory=Africhtinghalsband', id: 'nav-africhtingshalsbands' },
        ],
      },
      {
        label: 'Toebehoren', href: '?category=toebehoren', id: 'nav-toebehoren',
        children: [
          { label: 'Lokkers Decoys', href: '?category=toebehoren&subcategory=Lokkers%20Decoys', id: 'nav-lokkers' },
          { label: 'Vallen en vangkooien', href: '?category=toebehoren&subcategory=Vallen%20en%20vangkooien', id: 'nav-vallen' },
          { label: 'Hoogzitten en Tenten', href: '?category=toebehoren&subcategory=Hoogzitten%20en%20Tenten', id: 'nav-hoogszitten' },
          { label: 'Wildcamera\'s', href: '?category=toebehoren&subcategory=Wildcamera%27s', id: 'nav-wildcamera' },
        ],
      },
      {
        label: 'Brand- en veiligheidskoffer', href: '?category=brand-en-veiligheidskoffer', id: 'nav-brand-veiligheidskoffer',
        children: [
          { label: 'Veiligheidskoffers', href: '?category=brand-en-veiligheidskoffer&subcategory=Veiligheidskoffers', id: 'nav-veiligheidskoffers' },
        ],
      },
    ],
  },
  {
    label: 'Aanbiedingen', href: '?category=aanbiedingen', id: 'nav-aanbiedingen',
  },
  {
    label: 'Tweedehands', href: '?category=tweedehands', id: 'nav-tweedehands',
  },
  {
    label: 'Regelgeving', href: '?page=regelgeving', id: 'nav-regelgeving',
  },
  {
    label: 'Openingsuren', href: '#', id: 'nav-openingsuren',
  },
];

const navItemsLeft = navItems.filter(
  item => item.id === 'nav-producten' || item.id === 'nav-aanbiedingen' || item.id === 'nav-tweedehands'
);
const navItemsRight = navItems.filter(item => item.id === 'nav-regelgeving' || item.id === 'nav-openingsuren');

function renderNavItem(item: NavItem, isNested: boolean = false): string {
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
  const navItemsLeftHtml = navItemsLeft.map(item => renderNavItem(item)).join('');
  const navItemsRightHtml = navItemsRight.map(item => renderNavItem(item)).join('');
  return navbarHTML
    .replace('<!-- nav items left -->', navItemsLeftHtml)
    .replace('<!-- nav items right -->', navItemsRightHtml)
    .replace('<span id="phone-icon"></span>', icons.phone);
}

export function initNavbar(): void {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navMenuLeft = document.getElementById('nav-menu-left');
  const navMenuRight = document.getElementById('nav-menu-right');

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
  if (hamburger && navMenuLeft) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      hamburger.classList.toggle('is-active');
      navMenuLeft.classList.toggle('nav-menu--open');
      if (navMenuRight) navMenuRight.classList.toggle('nav-menu--open');
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
      if (!hasChildren && navMenuLeft && hamburger && window.innerWidth <= 1024) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        navMenuLeft.classList.remove('nav-menu--open');
        if (navMenuRight) navMenuRight.classList.remove('nav-menu--open');
        document.body.classList.remove('nav-open');
      }
    });
  });
}