/* ==========================================================================
   BANNER DE COOKIES — AseguraTuMascota.net
   Modal centrado RGPD + LSSI + Google Consent Mode v2 (AdSense ready)
   ========================================================================== */
(function() {
  'use strict';

  const STORAGE_KEY = 'atm_cookie_consent';
  const VERSION = '2.0';

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
    // Google Consent Mode v2 — requisito de AdSense en UE
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': consent.advertising ? 'granted' : 'denied',
        'ad_user_data': consent.advertising ? 'granted' : 'denied',
        'ad_personalization': consent.advertising ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied'
      });
    }
    document.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  // ============= GOOGLE CONSENT MODE INICIAL =============
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });

  // ============= UI DEL MODAL =============

  function buildHTML() {
    return `
      <div id="cookie-modal-main" class="cookie-modal-main" role="dialog" aria-labelledby="cookie-main-title" aria-modal="true">
        <div class="cookie-modal-main-backdrop"></div>
        <div class="cookie-modal-main-content">
          <div class="cookie-icon">🍪</div>
          <h2 id="cookie-main-title">Tu privacidad es importante</h2>
          <p class="cookie-modal-main-text">
            Usamos cookies propias y de terceros para mejorar tu experiencia,
            mostrar publicidad relevante y analizar el tráfico de la web.
            Puedes aceptar todas, rechazar las no esenciales o configurar tu elección.
            Más información en nuestra <a href="/legal/politica-cookies.html">Política de Cookies</a>.
          </p>
          <div class="cookie-modal-main-buttons">
            <button type="button" class="cookie-btn cookie-btn-config" data-action="config">Configurar</button>
            <button type="button" class="cookie-btn cookie-btn-reject" data-action="reject">Rechazar todas</button>
            <button type="button" class="cookie-btn cookie-btn-accept" data-action="accept">Aceptar todas</button>
          </div>
        </div>
      </div>

      <div id="cookie-config-modal" class="cookie-modal" role="dialog" aria-labelledby="cookie-config-title" aria-modal="true" hidden>
        <div class="cookie-modal-backdrop"></div>
        <div class="cookie-modal-content">
          <button type="button" class="cookie-modal-close" data-action="close-config" aria-label="Cerrar">×</button>
          <h2 id="cookie-config-title">Configuración de cookies</h2>
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
            <button type="button" class="cookie-btn cookie-btn-config" data-action="save-custom">Guardar selección</button>
            <button type="button" class="cookie-btn cookie-btn-accept" data-action="accept">Aceptar todas</button>
          </div>
        </div>
      </div>

      <button id="cookie-reset-btn" class="cookie-reset-btn" aria-label="Configurar cookies" title="Configurar cookies" hidden>
        🍪
      </button>
    `;
  }

  function showMainModal() {
    const modal = document.getElementById('cookie-modal-main');
    if (modal) {
      modal.classList.add('cookie-modal-main-visible');
      document.body.style.overflow = 'hidden';
      document.getElementById('cookie-reset-btn').hidden = true;
    }
  }

  function hideMainModal() {
    const modal = document.getElementById('cookie-modal-main');
    if (modal) {
      modal.classList.remove('cookie-modal-main-visible');
      document.body.style.overflow = '';
      document.getElementById('cookie-reset-btn').hidden = false;
    }
  }

  function showConfigModal() {
    const modal = document.getElementById('cookie-config-modal');
    if (modal) {
      const current = getConsent() || DEFAULT_STATE;
      document.getElementById('cookie-analytics').checked = current.analytics;
      document.getElementById('cookie-advertising').checked = current.advertising;
      modal.hidden = false;
      // Asegurar que el cuerpo esté bloqueado
      document.body.style.overflow = 'hidden';
    }
  }

  function hideConfigModal() {
    const modal = document.getElementById('cookie-config-modal');
    if (modal) {
      modal.hidden = true;
      // Si el modal principal no está visible, desbloquear scroll
      const mainModal = document.getElementById('cookie-modal-main');
      if (!mainModal || !mainModal.classList.contains('cookie-modal-main-visible')) {
        document.body.style.overflow = '';
      }
    }
  }

  // ============= EVENTOS =============

  function handleAction(action) {
    switch (action) {
      case 'accept':
        saveConsent({ analytics: true, advertising: true, necessary: true });
        hideMainModal();
        hideConfigModal();
        break;
      case 'reject':
        saveConsent({ analytics: false, advertising: false, necessary: true });
        hideMainModal();
        hideConfigModal();
        break;
      case 'config':
        showConfigModal();
        break;
      case 'close-config':
        hideConfigModal();
        // Si el banner principal aún está activo, mantenerlo
        const main = document.getElementById('cookie-modal-main');
        if (main && main.classList.contains('cookie-modal-main-visible')) {
          document.body.style.overflow = 'hidden';
        }
        break;
      case 'save-custom':
        saveConsent({
          analytics: document.getElementById('cookie-analytics').checked,
          advertising: document.getElementById('cookie-advertising').checked,
          necessary: true
        });
        hideMainModal();
        hideConfigModal();
        break;
      case 'open-config':
        showConfigModal();
        break;
    }
  }

  // ============= INICIALIZAR =============

  function init() {
    const container = document.createElement('div');
    container.innerHTML = buildHTML();
    document.body.appendChild(container);

    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-action]');
      if (target) {
        handleAction(target.dataset.action);
      }
      if (e.target.id === 'cookie-reset-btn') {
        handleAction('open-config');
      }
    });

    const existing = getConsent();
    if (existing) {
      applyConsent(existing);
      // Mostrar botón flotante para reabrir
      const resetBtn = document.getElementById('cookie-reset-btn');
      if (resetBtn) resetBtn.hidden = false;
    } else {
      // No hay consentimiento → mostrar modal principal con un pequeño delay
      setTimeout(showMainModal, 400);
    }
  }

  // API pública para reabrir desde otros sitios (footer)
  window.openCookieSettings = function() {
    showConfigModal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
