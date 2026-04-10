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

  // Carousel functionality
  const carouselSlides = document.querySelectorAll('.carousel-slide') as NodeListOf<HTMLImageElement>;
  
  if (carouselSlides.length === 0) return;
  
  let currentIndex = 0;
  const slideCount = carouselSlides.length;
  const slideInterval = 5000; // 5 seconds per slide
  
  function showSlide(index: number) {
    carouselSlides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    showSlide(currentIndex);
  }
  
  // Show first slide
  showSlide(0);
  
  // Auto-rotate slides
  setInterval(nextSlide, slideInterval);
}
