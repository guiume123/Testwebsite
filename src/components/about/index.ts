import aboutHTML from './about.html?raw';

export function createAbout(): string {
  return aboutHTML;
}

export function initAbout(): void {
  const aboutSection = document.querySelector<HTMLElement>('.about-section');
  if (!aboutSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        aboutSection.classList.add('about--visible');
        observer.unobserve(aboutSection);
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(aboutSection);
}
