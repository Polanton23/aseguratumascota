/**
 * AseguraTuMascota.net — Animaciones de scroll
 * Fade-in + slide-up cuando los elementos entran en el viewport
 * Usa Intersection Observer (nativo, sin librerías)
 * Basado en la filosofía de Emil Kowalski: animaciones con propósito
 */

(function() {
  'use strict';

  // No animar si el usuario prefiere reducción de movimiento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Elementos que animan al entrar en viewport
  const SELECTORS = [
    '.section-head',        // Títulos de sección
    '.cta-card',            // Cards de CTA
    '.compare-table',       // Tabla del comparador
    '.pet-card',            // Cards de categoría (perros, gatos, exóticos)
    '.calc-card',           // Calculadora
    '.article-hero-content',// Hero de los artículos
    '.recommended-list',    // Lista de aseguradoras en calculadora
  ].join(', ');

  // CSS inicial: oculto y desplazado hacia abajo
  const style = document.createElement('style');
  style.textContent = `
    .will-animate {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1),
                  transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .will-animate.animated {
      opacity: 1;
      transform: translateY(0);
    }
    /* Delay escalonado para grupos de elementos */
    .will-animate[data-delay="1"] { transition-delay: 80ms; }
    .will-animate[data-delay="2"] { transition-delay: 160ms; }
    .will-animate[data-delay="3"] { transition-delay: 240ms; }
  `;
  document.head.appendChild(style);

  // Marcar elementos para animar
  function setupElements() {
    const elements = document.querySelectorAll(SELECTORS);
    elements.forEach(el => {
      // No animar lo que ya está visible sin scroll (above the fold)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) return;
      el.classList.add('will-animate');
    });

    // Stagger delay en grupos de pet-cards
    document.querySelectorAll('.pet-card.will-animate').forEach((el, i) => {
      if (i % 3 === 1) el.dataset.delay = '1';
      if (i % 3 === 2) el.dataset.delay = '2';
    });
  }

  // Intersection Observer: animar cuando el elemento es visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Una vez animado, dejar de observar (la animación solo ocurre una vez)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,       // Animar cuando el 12% del elemento es visible
      rootMargin: '0px 0px -40px 0px'  // Animar un poco antes del borde inferior
    }
  );

  // Inicializar
  function init() {
    setupElements();
    document.querySelectorAll('.will-animate').forEach(el => observer.observe(el));
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
