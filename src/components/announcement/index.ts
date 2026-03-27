import announcementHTML from './announcement.html?raw';

export function createAnnouncementBar(): string {
  return announcementHTML;
}

export function initAnnouncementBar(): void {
  const closeBtn = document.getElementById('announcement-close');
  const bar = document.getElementById('announcement-bar');

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
