import type { UspItem } from '../../types';
import { icons } from '../../icons';
import uspHTML from './usp.html?raw';

const uspItems: UspItem[] = [
  { iconSvg: icons.shield, title: 'Erkende wapenhandelaar', subtitle: 'Volledig conform Belgische wetgeving' },
  { iconSvg: icons.users, title: 'Persoonlijk advies', subtitle: 'Onze experts begeleiden u graag' },
  { iconSvg: icons.truck, title: 'Afhaling in winkel', subtitle: 'Uw bestelling klaar op afspraak' },
  { iconSvg: icons.gift, title: 'Ruim assortiment', subtitle: 'Meer dan 5000 producten op voorraad' },
];

function renderUspItem(item: UspItem, index: number): string {
  const divider = index < uspItems.length - 1 ? '<div class="usp-divider"></div>' : '';
  return `
    <div class="usp-item">
      <div class="usp-icon">${item.iconSvg}</div>
      <div class="usp-text">
        <strong>${item.title}</strong>
        <span>${item.subtitle}</span>
      </div>
    </div>
    ${divider}
  `;
}

export function createUsp(): string {
  const uspItemsHtml = uspItems.map(renderUspItem).join('');
  return uspHTML.replace('<div class="usp-grid" id="usp-grid"></div>', `<div class="usp-grid" id="usp-grid">${uspItemsHtml}</div>`);
}
