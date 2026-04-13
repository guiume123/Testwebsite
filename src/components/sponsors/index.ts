import sponsorsHTML from './sponsors.html?raw';
import './sponsors.css';

export function createSponsors(): string {
  return sponsorsHTML;
}

export function initSponsors(): void {
  const carousels = document.querySelectorAll<HTMLElement>('.sponsors-carousel');
  if (!carousels.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  carousels.forEach((carousel) => {
    const scrollTrack = carousel.querySelector<HTMLElement>('.sponsors-scroll');
    if (!scrollTrack || scrollTrack.dataset.sponsorsInitialized === 'true') return;

    const originalItems = Array.from(scrollTrack.querySelectorAll<HTMLElement>('.sponsor-item'));
    if (!originalItems.length) return;

    // Duplicate logos once so the loop can scroll seamlessly.
    const clones = originalItems.map((item) => item.cloneNode(true) as HTMLElement);
    clones.forEach((clone) => {
      clone.setAttribute('aria-hidden', 'true');
      scrollTrack.appendChild(clone);
    });

    const updateMetrics = () => {
      const style = window.getComputedStyle(scrollTrack);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      const distance = originalItems.reduce((total, item) => total + item.getBoundingClientRect().width, 0) + gap * originalItems.length;

      const pxPerSecond = 80;
      const duration = Math.max(distance / pxPerSecond, 12);

      scrollTrack.style.setProperty('--sponsors-scroll-distance', `${distance}px`);
      scrollTrack.style.setProperty('--sponsors-scroll-duration', `${duration}s`);
    };

    const setReducedMotionClass = () => {
      scrollTrack.classList.toggle('is-reduced-motion', reducedMotion.matches);
    };

    const setInViewState = (isInView: boolean) => {
      scrollTrack.classList.toggle('is-paused', !isInView);
    };

    let resizeRaf: number | null = null;
    const onResize = () => {
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(updateMetrics);
    };

    carousel.addEventListener('mouseenter', () => scrollTrack.classList.add('is-paused'));
    carousel.addEventListener('mouseleave', () => scrollTrack.classList.remove('is-paused'));
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInViewState(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );
    observer.observe(carousel);

    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', setReducedMotionClass);
    }

    updateMetrics();
    setReducedMotionClass();
    scrollTrack.dataset.sponsorsInitialized = 'true';
  });
}
