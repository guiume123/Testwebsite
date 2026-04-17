import filter from './filter.html?raw';
import './filter.css';

interface NavItem {
  label: string;
  href: string;
  id: string;
  children?: NavItem[];
}

const categoryMenu: NavItem[] = [
  { label: 'Alle Producten', href: '?category=alle', id: 'sidebar-alle' },
  {
    label: 'Wapens', href: '?category=wapens', id: 'sidebar-wapens',
    children: [
      { label: 'Geweren en Karabijnen', href: '?category=wapens&subcategory=Geweren%20en%20Karabijnen', id: 'sidebar-geweren' },
      { label: 'Pistolen en Revolvers', href: '?category=wapens&subcategory=Pistolen%20en%20Revolvers', id: 'sidebar-pistolen' },
      { label: 'Luchtdrukwapens', href: '?category=wapens&subcategory=Luchtdrukwapens', id: 'sidebar-luchtdruk' },
      { label: 'CO2 Pistolen en Revolvers', href: '?category=wapens&subcategory=CO2%20Pistolen%20en%20Revolvers', id: 'sidebar-co2' },
      { label: 'Alarmpistolen en Revolvers', href: '?category=wapens&subcategory=Alarmpistolen%20en%20Revolvers', id: 'sidebar-alarm' },
      { label: 'Soft-Air Guns', href: '?category=wapens&subcategory=Soft-Air%20Guns', id: 'sidebar-softair' },
      { label: 'Messen', href: '?category=wapens&subcategory=Messen', id: 'sidebar-messen' },
      { label: 'Kruisbogen', href: '?category=wapens&subcategory=Kruisbogen', id: 'sidebar-kruisbogen' },
    ],
  },
  {
    label: 'Munitie', href: '?category=munitie', id: 'sidebar-munitie',
    children: [
      { label: 'Hagel Munitie Jacht', href: '?category=munitie&subcategory=Hagel%20Munitie%20Jacht', id: 'sidebar-hagel-jacht' },
      { label: 'Kogel Munitie Jacht', href: '?category=munitie&subcategory=Kogel%20Munitie%20Jacht', id: 'sidebar-kogel-jacht' },
      { label: 'Hagel Munitie Sport', href: '?category=munitie&subcategory=Hagel%20Munitie%20Sport', id: 'sidebar-hagel-sport' },
      { label: 'Kogel Munitie Sport', href: '?category=munitie&subcategory=Kogel%20Munitie%20Sport', id: 'sidebar-kogel-sport' },
      { label: 'Luchtdruk Munitie', href: '?category=munitie&subcategory=Luchtdruk%20Munitie', id: 'sidebar-luchtdruk-munitie' },
      { label: 'Alarm Munitie', href: '?category=munitie&subcategory=Alarm%20Munitie', id: 'sidebar-alarm-munitie' },
    ],
  },
  {
    label: 'Kleding', href: '?category=kleding', id: 'sidebar-kleding-main',
    children: [
      { label: 'Kleding', href: '?category=kleding&subcategory=Kleding', id: 'sidebar-kleding' },
      { label: 'Kleivesten en toebehoren', href: '?category=kleding&subcategory=Kleivesten%20en%20toebehoren', id: 'sidebar-kleivesten' },
      { label: 'Laarzen en Schoenen', href: '?category=kleding&subcategory=Laarzen%20en%20Schoenen', id: 'sidebar-laarzen' },
      { label: 'Waadpakken', href: '?category=kleding&subcategory=Waadpakken', id: 'sidebar-waadpakken' },
    ],
  },
  {
    label: 'Geschenken', href: '?category=geschenken', id: 'sidebar-geschenken',
    children: [
      { label: 'Allerlei Geschenkartikelen', href: '?category=geschenken&subcategory=Allerlei%20Geschenkartikelen', id: 'sidebar-geschenkartikelen' },
    ],
  },
  {
    label: 'Optiek', href: '?category=optiek', id: 'sidebar-optiek',
    children: [
      { label: 'Richtkijkers en Verrekijkers', href: '?category=optiek&subcategory=Richtkijkers%20en%20Verrekijkers', id: 'sidebar-richtkijkers' },
    ],
  },
  {
    label: 'Honden', href: '?category=honden', id: 'sidebar-honden',
    children: [
      { label: 'Africhtinghalsband', href: '?category=honden&subcategory=Africhtinghalsband', id: 'sidebar-africhtingshalsbands' },
    ],
  },
  {
    label: 'Toebehoren', href: '?category=toebehoren', id: 'sidebar-toebehoren',
    children: [
      { label: 'Lokkers Decoys', href: '?category=toebehoren&subcategory=Lokkers%20Decoys', id: 'sidebar-lokkers' },
      { label: 'Vallen en vangkooien', href: '?category=toebehoren&subcategory=Vallen%20en%20vangkooien', id: 'sidebar-vallen' },
      { label: 'Hoogzitten en Tenten', href: '?category=toebehoren&subcategory=Hoogzitten%20en%20Tenten', id: 'sidebar-hoogszitten' },
      { label: 'Wildcamera\'s', href: '?category=toebehoren&subcategory=Wildcamera%27s', id: 'sidebar-wildcamera' },
    ],
  },
  {
    label: 'Brand- en veiligheidskoffer', href: '?category=brand-en-veiligheidskoffer', id: 'sidebar-brand-veiligheidskoffer',
    children: [
      { label: 'Veiligheidskoffers', href: '?category=brand-en-veiligheidskoffer&subcategory=Veiligheidskoffers', id: 'sidebar-veiligheidskoffers' },
    ],
  },
];

function renderFilterMenu(items: NavItem[]): string {
  return items.map(item => {
    const hasChildren = item.children && item.children.length > 0;
    const childrenHtml = hasChildren
      ? `<div class="filter-nav-submenu">${renderFilterMenu(item.children!)}</div>`
      : '';
    
    return `
      <div class="filter-nav-item ${hasChildren ? 'has-children' : ''}">
        <a href="${item.href}" class="filter-nav-link" id="${item.id}">${item.label}</a>
        ${childrenHtml}
      </div>
    `;
  }).join('');
}

export function createFilter(): string {
  return filter;
}

export function initFilter(): void {
  const filterNav = document.getElementById('filter-nav');
  if (!filterNav) return;

  filterNav.innerHTML = renderFilterMenu(categoryMenu);

  // Add toggle functionality for parent items
  const parentItems = filterNav.querySelectorAll('.filter-nav-item.has-children');
  parentItems.forEach(item => {
    const link = item.querySelector('.filter-nav-link') as HTMLElement;
    link?.addEventListener('click', (e) => {
      e.preventDefault();
      // Close all other items
      parentItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
        }
      });
      // Toggle current item
      item.classList.toggle('open');
    });
  });

  // Set active state based on current category
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  if (category) {
    const activeLink = filterNav.querySelector(`a[href*="category=${category}"]`) as HTMLElement;
    if (activeLink && !activeLink.querySelector('[href*="&"]')) {
      activeLink.classList.add('active');
      // Open parent if exists
      const parent = activeLink.closest('.filter-nav-item')?.parentElement?.closest('.filter-nav-item');
      if (parent) parent.classList.add('open');
    }
  }
}
