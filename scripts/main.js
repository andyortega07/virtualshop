
document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => drawer.classList.add('is-open'));
    drawerClose?.addEventListener('click', () => drawer.classList.remove('is-open'));
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('is-open');
    });
  }

  document.querySelectorAll('.drawer-panel .has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      const parent = link.closest('.has-dropdown');
      if (parent && parent.querySelector('.dropdown')) {
        e.preventDefault();
        parent.classList.toggle('is-expanded');
      }
    });
  });

  const cards = document.querySelectorAll('.game-card, .holo-card');
  cards.forEach(card => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      if (glow) {
        glow.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        glow.style.setProperty('--my', `${(y / rect.height) * 100}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.acc-item');
      const panel = item.querySelector('.acc-panel');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.acc-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.acc-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  document.querySelectorAll('.qty-control').forEach(control => {
    const display = control.querySelector('.qty-display');
    const minus = control.querySelector('.qty-minus');
    const plus = control.querySelector('.qty-plus');
    let qty = parseInt(display?.textContent || '1', 10);

    plus?.addEventListener('click', () => {
      qty++;
      display.textContent = qty;
      updateLinePrice(control, qty);
    });
    minus?.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        display.textContent = qty;
        updateLinePrice(control, qty);
      }
    });
  });

  function updateLinePrice(control, qty) {
    const item = control.closest('.cart-item');
    const priceEl = item?.querySelector('.line-price');
    const unitPrice = parseFloat(item?.dataset.unitPrice || '0');
    if (priceEl) priceEl.textContent = `$${(unitPrice * qty).toFixed(2)}`;
    recalcSummary();
  }

  function recalcSummary() {
    const lines = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    lines.forEach(line => {
      const unitPrice = parseFloat(line.dataset.unitPrice || '0');
      const qty = parseInt(line.querySelector('.qty-display')?.textContent || '1', 10);
      subtotal += unitPrice * qty;
    });
    const subtotalEl = document.querySelector('[data-summary="subtotal"]');
    const totalEl = document.querySelector('[data-summary="total"]');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  document.querySelectorAll('.remove-x').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.cart-item');
      item?.remove();
      recalcSummary();
    });
  });

  const toast = document.querySelector('.toast');
  let toastTimer;

  function showToast(text) {
    if (!toast) return;
    const span = toast.querySelector('span');
    if (span && text) span.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.closest('.game-card')?.querySelector('.card-title')?.textContent || 'Producto';
      showToast(`"${title}" se añadió al carrito`);
      const badge = document.querySelector('.badge-count');
      if (badge) badge.textContent = (parseInt(badge.textContent, 10) + 1).toString();
    });
  });

  const pills = document.querySelectorAll('.cat-pill');
  const gridCards = document.querySelectorAll('[data-category]');

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const target = pill.dataset.filter;

      gridCards.forEach(card => {
        if (target === 'todos' || card.dataset.category === target) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.reveal-key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.previousElementSibling;
      if (target && target.classList.contains('key-reveal')) {
        target.textContent = target.dataset.key || target.textContent;
        btn.remove();
      }
    });
  });

});