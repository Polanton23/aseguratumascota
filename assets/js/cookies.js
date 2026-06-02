/* ==========================================================================
   BANNER DE COOKIES — AseguraTuMascota.net
   Cumplimiento RGPD + LSSI + Preparado para Google AdSense
   ========================================================================== */
(function() {
  'use strict';

  const STORAGE_KEY = 'atm_cookie_consent';
  const VERSION = '1.0';

  // Estado por defecto: solo cookies técnicas (siempre necesarias)
  const DEFAULT_STATE = {
    version: VERSION,
    date: null,
    analytics: false,
    advertising: false,
    necessary: true
  };

  // ============= GESTIÓN DE PREFERENCIAS =============

  function getConsent() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Si la versión cambió, invalidar consentimiento (re-pedir)
      if (parsed.version !== VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    consent.version = VERSION;
    consent.date = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {}
    applyConsent(consent);
  }

  function applyConsent(consent) {
    // Aplicar Google Consent Mode v2 (requisito de AdSense en UE)
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': consent.advertising ? 'granted' : 'denied',
        'ad_user_data': consent.advertising ? 'granted' : 'denied',
        'ad_personalization': consent.advertising ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied'
      });
    }
    // Disparar evento personalizado por si otros scripts quieren reaccionar
    document.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  // ============= INICIALIZACIÓN: Google Consent Mode v2 =============
  // Esto debe ejecutarse ANTES de que se cargue AdSense
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  // Estado inicial: todo denegado por defecto (modo "denied first")
  // Cumple RGPD: no se rastrea hasta consentimiento explícito
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });

  // ============= UI DEL BANNER =============

  function buildBannerHTML() {
    return `
      <div id="cookie-banner" class="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
        <div class="cookie-banner-content">
          <div class="cookie-banner-text">
            <h3 id="cookie-title">🍪 Usamos cookies</h3>
            <p id="cookie-desc">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia, mostrar publicidad
              relevante y analizar el tráfico. Puedes aceptar todas, rechazar las no esenciales o
              configurar tu elección. Más info en nuestra
              <a href="/legal/politica-cookies.html">Política de Cookies</a>.
            </p>
          </div>
          <div class="cookie-banner-buttons">
            <button type="button" class="cookie-btn cookie-btn-config" data-action="config">Configurar</button>
            <button type="button" class="cookie-btn cookie-btn-reject" data-action="reject">Rechazar</button>
            <button type="button" class="cookie-btn cookie-btn-accept" data-action="accept">Aceptar todas</button>
          </div>
        </div>
      </div>

      <div id="cookie-modal" class="cookie-modal" role="dialog" aria-labelledby="cookie-modal-title" aria-modal="true" hidden>
        <div class="cookie-modal-backdrop" data-action="close-modal"></div>
        <div class="cookie-modal-content">
          <button type="button" class="cookie-modal-close" data-action="close-modal" aria-label="Cerrar">×</button>
          <h2 id="cookie-modal-title">Configuración de cookies</h2>
          <p>Selecciona qué tipo de cookies aceptas. Las técnicas son siempre necesarias para que la web funcione.</p>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-toggle">
                <input type="checkbox" checked disabled>
                <span class="cookie-toggle-slider"></span>
              </label>
              <h4>Cookies técnicas <small>(siempre activas)</small></h4>
            </div>
            <p>Necesarias para el funcionamiento básico del sitio. No se pueden desactivar. No recogen datos personales.</p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-analytics">
                <span class="cookie-toggle-slider"></span>
              </label>
              <h4>Cookies analíticas</h4>
            </div>
            <p>Nos permiten conocer cómo usas la web (páginas más visitadas, tiempo de navegación) para mejorarla. Datos anonimizados.</p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-advertising">
                <span class="cookie-toggle-slider"></span>
              </label>
              <h4>Cookies publicitarias</h4>
            </div>
            <p>Nos permiten mostrarte anuncios relevantes (Google AdSense) y medir su rendimiento. Sin estas cookies seguirás viendo publicidad, pero menos personalizada.</p>
          </div>

          <div class="cookie-modal-actions">
            <button type="button" class="cookie-btn cookie-btn-reject" data-action="reject">Rechazar todas</button>
            <button type="button" class="cookie-btn cookie-btn-accept" data-action="save-custom">Guardar selección</button>
            <button type="button" class="cookie-btn cookie-btn-accept-all" data-action="accept">Aceptar todas</button>
          </div>
        </div>
      </div>

      <button id="cookie-reset-btn" class="cookie-reset-btn" aria-label="Configurar cookies" title="Configurar cookies" hidden>
        🍪
      </button>
    `;
  }

  function showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('cookie-banner-visible');
      document.getElementById('cookie-reset-btn').hidden = true;
    }
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('cookie-banner-visible');
      // Mostrar botón flotante para reabrir config
      document.getElementById('cookie-reset-btn').hidden = false;
    }
  }

  function showModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
      // Cargar estado actual en los checkboxes
      const current = getConsent() || DEFAULT_STATE;
      document.getElementById('cookie-analytics').checked = current.analytics;
      document.getElementById('cookie-advertising').checked = current.advertising;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  // ============= EVENTOS =============

  function handleAction(action) {
    switch (action) {
      case 'accept':
        saveConsent({ analytics: true, advertising: true, necessary: true });
        hideBanner();
        hideModal();
        break;
      case 'reject':
        saveConsent({ analytics: false, advertising: false, necessary: true });
        hideBanner();
        hideModal();
        break;
      case 'config':
        showModal();
        break;
      case 'close-modal':
        hideModal();
        break;
      case 'save-custom':
        saveConsent({
          analytics: document.getElementById('cookie-analytics').checked,
          advertising: document.getElementById('cookie-advertising').checked,
          necessary: true
        });
        hideBanner();
        hideModal();
        break;
      case 'open-config':
        showModal();
        break;
    }
  }

  // ============= INICIALIZAR =============

  function init() {
    // Inyectar HTML en el body
    const container = document.createElement('div');
    container.innerHTML = buildBannerHTML();
    document.body.appendChild(container);

    // Event delegation
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-action]');
      if (target) {
        handleAction(target.dataset.action);
      }
      // Click en el botón flotante reabre la config
      if (e.target.id === 'cookie-reset-btn') {
        handleAction('open-config');
      }
    });

    // Comprobar estado guardado
    const existing = getConsent();
    if (existing) {
      // Ya hay consentimiento → aplicar y NO mostrar banner
      applyConsent(existing);
      hideBanner();
    } else {
      // No hay consentimiento → mostrar banner
      setTimeout(showBanner, 600);
    }
  }

  // API pública para reabrir desde otros elementos (ej: footer "Configurar cookies")
  window.openCookieSettings = function() {
    showModal();
  };

  // DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
