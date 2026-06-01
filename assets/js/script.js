// AseguraTuMascota.es — Main JS

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      if (nav.classList.contains('open')) {
        nav.style.cssText = 'display:flex; position:absolute; top:100%; left:0; right:0; flex-direction:column; background:var(--color-bg); padding:24px; border-bottom:1px solid var(--color-line); gap:18px;';
      } else {
        nav.style.cssText = '';
      }
    });
  }

  // Hero card chips interactivity
  document.querySelectorAll('.chip-row').forEach(row => {
    row.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        updateHeroPrice();
      });
    });
  });

  function updateHeroPrice() {
    const priceEl = document.querySelector('.hero-card-result .price span');
    if (!priceEl) return;
    const rows = document.querySelectorAll('.hero-card-body .chip-row');
    if (rows.length < 2) return;
    const pet = rows[0].querySelector('.chip.active')?.textContent || '';
    const cov = rows[1].querySelector('.chip.active')?.textContent || '';

    let base = 12;
    if (pet.includes('Gato')) base = 9;
    if (pet.includes('Exótico')) base = 16;

    if (cov === 'Básica') base = Math.round(base * 0.65);
    if (cov === 'Premium') base = Math.round(base * 1.6);

    priceEl.textContent = base;
  }

  // Calculator (only on calculator page)
  initCalculator();
});

function initCalculator() {
  const calc = document.querySelector('.calc-card');
  if (!calc) return;

  const state = {
    pet: null,
    age: null,
    coverage: null,
    step: 0
  };

  const steps = document.querySelectorAll('.calc-step');
  const progress = document.querySelectorAll('.calc-progress span');

  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    progress.forEach((p, i) => p.classList.toggle('done', i <= idx));
    state.step = idx;
  }

  // Option selection
  calc.querySelectorAll('.calc-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const group = opt.dataset.group;
      const value = opt.dataset.value;

      calc.querySelectorAll(`.calc-option[data-group="${group}"]`)
        .forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      state[group] = value;
    });
  });

  // Next button
  calc.querySelectorAll('[data-action="next"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const required = btn.dataset.requires;
      if (required && !state[required]) {
        alert('Por favor, selecciona una opción');
        return;
      }
      if (state.step < steps.length - 1) {
        showStep(state.step + 1);
        if (state.step === steps.length - 1) computeResult();
      }
    });
  });

  // Back button
  calc.querySelectorAll('[data-action="back"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.step > 0) showStep(state.step - 1);
    });
  });

  // Restart
  calc.querySelectorAll('[data-action="restart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pet = null;
      state.age = null;
      state.coverage = null;
      calc.querySelectorAll('.calc-option').forEach(o => o.classList.remove('selected'));
      showStep(0);
    });
  });

  function computeResult() {
    // PRECIOS BASE REALES por aseguradora (verificados en sus webs oficiales 2026)
    // Modalidad COMPLETA (no básica ni premium) para perro adulto medio
    const aseguradoras = {
      petplan: {
        nombre: 'Petplan',
        sub: 'Completa, reembolso 100% del gasto veterinario',
        base: 21,           // 0,7 €/día = 21 €/mes confirmado en petplan.es
        url: 'https://petplan.es/',
        valoracion: '9.4'
      },
      mapfre: {
        nombre: 'Mapfre Mascotas',
        sub: '+350 clínicas concertadas en toda España',
        base: 15,           // Modalidad veterinario completo ~180€/año
        url: 'https://www.mapfre.es/particulares/seguros-animales/',
        valoracion: '8.9'
      },
      caser: {
        nombre: 'Caser MIMAscota',
        sub: 'Plan Salud con cuadro veterinario propio',
        base: 19,           // 19,40 €/mes confirmado en caser.es
        url: 'https://www.caser.es/seguros-de-mascotas',
        valoracion: '8.7'
      },
      santalucia: {
        nombre: 'Santalucía Mascotas',
        sub: 'Buena relación calidad/precio',
        base: 10,           // RC + asistencia básica ~5-12€/mes según modalidad
        url: 'https://www.santalucia.es/seguros-mascotas',
        valoracion: '8.4'
      },
      catalana: {
        nombre: 'Catalana Occidente',
        sub: 'Fuerte en displasia y razas grandes',
        base: 13,
        url: 'https://www.seguroscatalanaoccidente.com/particulares/animales-de-compania',
        valoracion: '8.2'
      },
      lineaDirecta: {
        nombre: 'Línea Directa',
        sub: 'Gestión 100% online, app muy cómoda',
        base: 11,
        url: 'https://www.lineadirecta.com/seguro-mascotas',
        valoracion: '7.8'
      },
      allianz: {
        nombre: 'Allianz Mascotas',
        sub: 'Respaldo de gran marca internacional',
        base: 12,
        url: 'https://www.allianz.es/seguros-particulares/seguro-mascotas.html',
        valoracion: '7.6'
      },
      axa: {
        nombre: 'AXA Mascotas',
        sub: 'Modalidades adaptables para PPP y no PPP',
        base: 11,
        url: 'https://www.axa.es/seguros-mascotas',
        valoracion: '7.4'
      }
    };

    // MULTIPLICADORES según perfil del usuario
    let petMult = 1.0;
    if (state.pet === 'cat') petMult = 0.70;       // Gatos ~30% más baratos
    if (state.pet === 'exotic') petMult = 1.20;    // Exóticos ~20% más caros

    let ageMult = 1.0;
    if (state.age === 'puppy') ageMult = 0.85;     // Cachorros más baratos
    if (state.age === 'senior') ageMult = 1.55;    // Senior considerable subida

    let covMult = 1.0;
    if (state.coverage === 'basic') covMult = 0.45;   // Solo RC + urgencias
    if (state.coverage === 'premium') covMult = 1.45; // Con dental, oncológico, todo

    // Función helper: calcula precio final por aseguradora
    function precioFinal(base) {
      return Math.round(base * petMult * ageMult * covMult);
    }

    // RECOMENDACIONES SEGÚN PERFIL
    // - Premium / senior → Petplan, Caser, Mapfre (las más completas)
    // - Básica / cachorro → Santalucía, Línea Directa, Mapfre (las más baratas)
    // - Exóticos → solo aseguradoras que los cubren
    // - Default → top 3 (Petplan, Mapfre, Caser)
    let seleccion = [];

    if (state.pet === 'exotic') {
      // Para exóticos pocas aseguradoras dan cobertura amplia
      seleccion = [aseguradoras.mapfre, aseguradoras.catalana, aseguradoras.caser];
    } else if (state.coverage === 'basic') {
      seleccion = [aseguradoras.santalucia, aseguradoras.lineaDirecta, aseguradoras.caser];
    } else if (state.coverage === 'premium') {
      seleccion = [aseguradoras.petplan, aseguradoras.caser, aseguradoras.mapfre];
    } else if (state.age === 'senior') {
      seleccion = [aseguradoras.petplan, aseguradoras.mapfre, aseguradoras.caser];
    } else {
      // Cobertura completa estándar
      seleccion = [aseguradoras.petplan, aseguradoras.mapfre, aseguradoras.caser];
    }

    // Calcular precio mostrado arriba (la media de las 3 recomendadas)
    const precios = seleccion.map(a => precioFinal(a.base));
    const precioMedio = Math.round(precios.reduce((a, b) => a + b, 0) / precios.length);

    const priceEl = calc.querySelector('.big-price span');
    if (priceEl) priceEl.textContent = precioMedio;

    // Pintar las 3 recomendaciones con sus precios y botón a la web oficial
    const recList = calc.querySelector('.recommended-list');
    if (recList) {
      recList.innerHTML = seleccion.map(a => {
        const precio = precioFinal(a.base);
        return `
        <div class="rec-item">
          <div class="rec-info">
            <strong>${a.nombre}</strong>
            <small>${a.sub}</small>
          </div>
          <div class="rec-price-block">
            <div class="rec-price">${precio}€<small>/mes</small></div>
            <a href="${a.url}" target="_blank" rel="nofollow sponsored noopener" class="btn btn-mini btn-primary rec-cta">Ir a su web ↗</a>
          </div>
        </div>
        `;
      }).join('');
    }
  }
}
