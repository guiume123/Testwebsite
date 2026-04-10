import type { HourEntry } from '../../types';
import { icons } from '../../icons';
import contactHTML from './contact.html?raw';

const openingHours: HourEntry[] = [
  { day: 'Maandag', time: 'Gesloten' },
  { day: 'Dinsdag', time: '09:30 – 18:00' },
  { day: 'Woensdag', time: '<strong>Voormiddag op afspraak</strong>' },
  { day: '', time: '13:00 – 20:30' },
  { day: 'Donderdag', time: '09:30 – 18:00' },
  { day: 'Vrijdag', time: '09:30 – 18:00' },
  { day: 'Zaterdag', time: '09:30 – 18:00' },
  { day: 'Zondag', time: 'Gesloten' },
];

export function createContact(): string {
  const hoursHtml = openingHours
    .map(h => `<li><span>${h.day}</span><span>${h.time}</span></li>`)
    .join('');

  return contactHTML
    .replace('<!-- hours -->', hoursHtml)
    .replace('<span id="map-icon"></span>', icons.mapPin)
    .replace('<span id="clock-large-icon"></span>', icons.clockLarge)
    .replace('<span id="phone-large-icon"></span>', icons.phoneLarge);
}

export function initContact(): void {
  const cards = document.querySelectorAll<HTMLElement>('.contact-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('contact-card--visible');
          }, index * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach(card => observer.observe(card));
}
