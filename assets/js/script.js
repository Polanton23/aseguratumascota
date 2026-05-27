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
    let base = 12;
    if (state.pet === 'dog') base = 13;
    if (state.pet === 'cat') base = 9;
    if (state.pet === 'exotic') base = 16;

    if (state.age === 'puppy') base *= 0.85;
    if (state.age === 'senior') base *= 1.55;

    let multiplier = 1;
    if (state.coverage === 'basic') multiplier = 0.6;
    if (state.coverage === 'premium') multiplier = 1.7;

    const finalPrice = Math.round(base * multiplier);

    const priceEl = calc.querySelector('.big-price span');
    if (priceEl) priceEl.textContent = finalPrice;

    // Generate 3 recommendations based on price
    const recs = [
      { name: 'Petplan', cov: 'Premium con dental', mult: 1.15 },
      { name: 'Mapfre Mascotas', cov: 'Completa', mult: 0.95 },
      { name: 'Santalucía Mascotas', cov: 'Estándar', mult: 0.78 }
    ];

    const recList = calc.querySelector('.recommended-list');
    if (recList) {
      recList.innerHTML = recs.map(r => `
        <div class="rec-item">
          <div>
            <strong>${r.name}</strong>
            <small>${r.cov}</small>
          </div>
          <div class="rec-price">${Math.round(finalPrice * r.mult)}€<small>/mes</small></div>
        </div>
      `).join('');
    }
  }
}
