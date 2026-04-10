import type { HourEntry } from '../../types';
import { icons } from '../../icons';
import openingsuurenHTML from './openingsuren.html?raw';

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

export function createOpeningsuren(): string {
  const hoursHtml = openingHours
    .map(h => `<li><span>${h.day}</span><span>${h.time}</span></li>`)
    .join('');

  return openingsuurenHTML
    .replace('<!-- hours will be inserted here -->', hoursHtml)
    .replace('<span id="modal-clock-icon"></span>', icons.clockLarge);
}

export function initOpeningsuren(): void {
  const modal = document.getElementById('openingsuren-modal');
  const closeBtn = document.querySelector('.openingsuren-modal-close');
  const overlay = document.querySelector('.openingsuren-modal-overlay');
  const openBtn = document.getElementById('nav-openingsuren');
  const clockIcon = document.getElementById('clock-icon');

  // Add clock icon to navbar
  if (clockIcon) {
    clockIcon.innerHTML = icons.clock;
  }

  if (!modal || !openBtn) return;

  // Open modal
  openBtn.addEventListener('click', (e: Event) => {
    e.preventDefault();
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });
}
