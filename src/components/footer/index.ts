import type { HourEntry } from '../../types';
import { icons } from '../../icons';
import footerHTML from './footer.html?raw';

const footerHours: HourEntry[] = [
  { day: 'Ma', time: 'Gesloten' },
  { day: 'Di', time: '9u30 - 18u00' },
  { day: 'Wo', time: '<strong>Voormiddag op afspraak</strong>' },
  { day: '', time: '13u00 - 20u30' },
  { day: 'Do', time: '9u30 - 18u00' },
  { day: 'Vr', time: '9u30 - 18u00' },
  { day: 'Za', time: '9u30 - 18u00' },
  { day: 'Zo', time: 'Gesloten' },
];

export function createFooter(): string {
  const hoursHtml = footerHours
    .map(h => `<li><span>${h.day}</span><span>${h.time}</span></li>`)
    .join('');

  return footerHTML
    .replace('<!-- hours -->', hoursHtml)
    .replace('<!-- year -->', String(new Date().getFullYear()))
    .replace('<span id="facebook-icon"></span>', icons.facebook)
    .replace('<span id="instagram-icon"></span>', icons.instagram);
}
