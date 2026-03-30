import announcementHTML from './announcement.html?raw';

function isOpenNow(): boolean {
  const now = new Date();
  
  // Get time in Belgium
  const brusselsTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Brussels' });
  const bDate = new Date(brusselsTimeString);
  
  const day = bDate.getDay(); // 0 is Sunday, 1 is Monday ...
  const hour = bDate.getHours();
  const minute = bDate.getMinutes();
  const time = hour + minute / 60;

  // Monday (1) and Sunday (0) closed
  if (day === 1 || day === 0) return false;

  // Wednesday (3): 13:00 - 20:30
  if (day === 3) {
    return time >= 13 && time < 20.5;
  }

  // Tue, Thu, Fri, Sat: 9:30 - 18:00
  return time >= 9.5 && time < 18;
}

export function createAnnouncementBar(): string {
  return announcementHTML;
}

export function initAnnouncementBar(): void {
  const closeBtn = document.getElementById('announcement-close');
  const bar = document.getElementById('announcement-bar');
  const statusEl = document.getElementById('shop-status');

  if (statusEl) {
    if (isOpenNow()) {
      statusEl.textContent = '🟢 Wij zijn momenteel open. Kom gerust langs in de winkel!';
    } else {
      statusEl.textContent = '🔴 Wij zijn momenteel gesloten. Bekijk onze openingsuren voor meer info.';
    }
  }

  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.classList.add('announcement-bar--hidden');
      setTimeout(() => {
        bar.style.display = 'none';
        document.body.style.setProperty('--announcement-height', '0px');
      }, 300);
    });
  }
}

