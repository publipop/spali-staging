/** SPALI: fotografías por color, sin filtros que simulen variantes. */
const IMAGES = Object.freeze({
  camisetas: { negro: 'assets/camiseta-negra.jpg', rojo: 'assets/camiseta-roja.jpg', crema: 'assets/camiseta-crema.jpg' },
  tops: { rojo: 'assets/top-rojo.jpg', negro: 'assets/top-negro.jpg' },
  shorts: { negro: 'assets/short-negro.jpg', rojo: 'assets/short-rojo.jpg' },
  mallas: { negro: 'assets/malla-negra.jpg', gris: 'assets/malla-gris.jpg' },
  chaquetas: { crema: 'assets/chaqueta-crema.jpg', negro: 'assets/chaqueta-negra.jpg' },
  sudaderas: { negro: 'assets/sudadera-negra.jpg', crema: 'assets/sudadera-crema.jpg' },
});
const mounted = new WeakMap();
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const colorKey = (value = '') => String(value).normalize('NFC').trim().toLocaleLowerCase('es');
const validImage = (value) => typeof value === 'string' && /^assets\/[a-z0-9._/-]+\.(?:jpe?g|png|webp)$/i.test(value);
const arrow = (direction) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="${direction === 'prev' ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'}"/></svg>`;
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7 5h3v14H7zm7 0h3v14h-3z"/></svg>';
const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="m8 5 11 7-11 7z"/></svg>';

/** Returns an actual image path, or an empty string when that photo does not exist. */
export function getProductVariantImage(product, colorName) {
  if (!product || typeof product !== 'object') return '';
  const key = colorKey(colorName || product.colors?.[0]?.name);
  const map = IMAGES[product.category];
  if (map?.[key]) return map[key];
  // Other categories have only their existing first-color photograph.
  return !map && key === colorKey(product.colors?.[0]?.name) && validImage(product.image) ? product.image : '';
}

function variants(product) {
  const seen = new Set();
  return (Array.isArray(product.colors) ? product.colors : []).flatMap((color) => {
    const src = getProductVariantImage(product, color.name);
    const key = colorKey(color.name);
    if (!src || seen.has(key)) return [];
    seen.add(key);
    return [{ name: String(color.name), key, hex: /^#[a-f0-9]{3,8}$/i.test(color.hex || '') ? color.hex : '#777777', src }];
  });
}

/** Own product link surrounds only the picture; every control is its sibling. */
export function renderProductSlides(product) {
  if (!product?.id) return '';
  const slides = variants(product);
  if (!slides.length) return '';
  const name = esc(product.name);
  const count = slides.length;
  const photoFrames = slides.map((color, index) => `<div class="product-slide${index === 0 ? ' is-active' : ''}" data-slide-index="${index}" data-color="${esc(color.key)}" data-color-name="${esc(color.name)}" aria-hidden="${index !== 0}"><img class="product-slide-photo" src="${esc(color.src)}" alt="${name} en ${esc(color.name)}. Imagen conceptual." loading="lazy" decoding="async" width="700" height="700"><img class="garment-mark-full" src="assets/logotipo-spali.svg" alt="" aria-hidden="true" width="430" height="88"></div>`).join('');
  const swatches = slides.map((color, index) => `<button type="button" class="product-slide-swatch${index === 0 ? ' is-active' : ''}" data-product-slide-control data-slide-to="${index}" style="--swatch:${esc(color.hex)}" aria-label="Ver ${name} en ${esc(color.name)}" aria-pressed="${index === 0}" title="${esc(color.name)}"><span aria-hidden="true"></span></button>`).join('');
  const picker = `<div class="product-slide-picker"><div class="product-slide-swatches" role="group" aria-label="Colores de ${name}">${swatches}</div><span class="product-slides-color" data-slide-color>${esc(slides[0].name)}</span></div>`;
  return `<div class="product-slides${count === 1 ? ' product-slides--single' : ''}" data-product-slides data-product-id="${esc(product.id)}" data-product-name="${name}" data-active-slide="0" role="group" aria-roledescription="${count > 1 ? 'carrusel' : 'imagen de producto'}" aria-label="${name}: colores disponibles"><a class="product-slides-link" href="#/producto/${encodeURIComponent(product.id)}?color=${encodeURIComponent(slides[0].name)}" aria-label="Ver ${name} en ${esc(slides[0].name)}"><div class="product-image" data-garment="${esc(product.category)}">${photoFrames}</div></a><div class="product-slides-controls">${count > 1 ? `<button type="button" class="product-slides-arrow" data-product-slide-control data-slide-prev aria-label="Color anterior de ${name}">${arrow('prev')}</button>` : ''}${picker}${count > 1 ? `<button type="button" class="product-slides-arrow" data-product-slide-control data-slide-next aria-label="Color siguiente de ${name}">${arrow('next')}</button>` : ''}</div>${count > 1 ? `<button type="button" class="product-slides-toggle" data-product-slide-control data-slide-toggle aria-label="Pausar cambio automático de colores de ${name}" aria-pressed="false">${pauseIcon}</button>` : ''}<span class="product-slides-announcement" data-slide-announcement role="status" aria-live="polite" aria-atomic="true"></span></div>`;
}

/** Attach after rendering; call its cleanup before replacing the rendered DOM. */
export function mountProductSlides(root = globalThis.document) {
  if (!root?.querySelectorAll) return () => {};
  const elements = [...root.querySelectorAll('[data-product-slides]')];
  if (root.matches?.('[data-product-slides]')) elements.unshift(root);
  for (const previous of new Set(elements.map((element) => mounted.get(element)).filter(Boolean))) previous();
  const doc = root.ownerDocument || root;
  const view = doc.defaultView || globalThis;
  const motion = view.matchMedia?.('(prefers-reduced-motion: reduce)');
  const controllers = [];
  const listeners = [];
  let alive = true;
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  };
  const isInViewport = (element) => {
    const box = element.getBoundingClientRect();
    return box.bottom > 0 && box.right > 0 && box.top < (view.innerHeight || 800) && box.left < (view.innerWidth || 1280);
  };

  for (const element of elements) {
    const frames = [...element.querySelectorAll('.product-slide')];
    if (!frames.length) continue;
    const swatches = [...element.querySelectorAll('[data-slide-to]')];
    const name = element.dataset.productName || 'Prenda';
    const link = element.querySelector('.product-slides-link');
    const color = element.querySelector('[data-slide-color]');
    const announcement = element.querySelector('[data-slide-announcement]');
    const toggle = element.querySelector('[data-slide-toggle]');
    let active = Math.max(0, Math.min(frames.length - 1, Number(element.dataset.activeSlide) || 0));
    let hovered = false;
    let focused = element.contains(doc.activeElement);
    let visible = isInViewport(element);
    let userPaused = false;
    let timer;
    const clear = () => { if (timer !== undefined) view.clearTimeout(timer); timer = undefined; };
    const canAdvance = () => alive && element.isConnected && frames.length > 1 && visible && !hovered && !focused && !userPaused && !doc.hidden && !motion?.matches;
    const schedule = () => {
      clear();
      if (canAdvance()) timer = view.setTimeout(() => { select(active + 1, false); schedule(); }, 5500);
    };
    const select = (index, manual = true) => {
      if (!alive) return;
      active = ((index % frames.length) + frames.length) % frames.length;
      element.dataset.activeSlide = String(active);
      frames.forEach((frame, index) => {
        frame.classList.toggle('is-active', index === active);
        frame.setAttribute('aria-hidden', String(index !== active));
      });
      swatches.forEach((button, index) => {
        button.classList.toggle('is-active', index === active);
        button.setAttribute('aria-pressed', String(index === active));
      });
      const label = frames[active].dataset.colorName;
      if (color) color.textContent = label;
      if (link) {
        link.setAttribute('aria-label', `Ver ${name} en ${label}`);
        link.setAttribute('href', `#/producto/${encodeURIComponent(element.dataset.productId)}?color=${encodeURIComponent(label)}`);
      }
      // Automatic changes stay quiet for screen readers; manual actions announce.
      if (manual && announcement) announcement.textContent = `${name}, color ${label}.`;
    };
    const updateMotion = () => {
      element.dataset.reducedMotion = String(Boolean(motion?.matches));
      if (toggle) toggle.hidden = Boolean(motion?.matches);
      schedule();
    };
    listen(element, 'click', (event) => {
      const button = event.target.closest?.('[data-product-slide-control]');
      if (!button || !element.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      if (button.hasAttribute('data-slide-toggle')) {
        userPaused = !userPaused;
        button.setAttribute('aria-pressed', String(userPaused));
        button.setAttribute('aria-label', `${userPaused ? 'Reanudar' : 'Pausar'} cambio automático de colores de ${name}`);
        button.innerHTML = userPaused ? playIcon : pauseIcon;
      } else select(button.hasAttribute('data-slide-to') ? Number(button.dataset.slideTo) : active + (button.hasAttribute('data-slide-prev') ? -1 : 1));
      schedule();
    });
    listen(element, 'keydown', (event) => {
      if (!event.target.closest?.('[data-product-slide-control]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? frames.length - 1 : active + (event.key === 'ArrowLeft' ? -1 : 1));
      swatches[active]?.focus({ preventScroll: true });
      schedule();
    });
    listen(element, 'pointerenter', (event) => { if (event.pointerType !== 'touch') { hovered = true; schedule(); } });
    listen(element, 'pointerleave', (event) => { if (event.pointerType !== 'touch') { hovered = false; schedule(); } });
    listen(element, 'focusin', () => { focused = true; schedule(); });
    listen(element, 'focusout', (event) => { focused = element.contains(event.relatedTarget); schedule(); });
    const controller = { element, schedule, clear, updateMotion, setVisible(value) { visible = value; schedule(); }, checkViewport() { visible = isInViewport(element); schedule(); } };
    controllers.push(controller);
    select(active, false);
    updateMotion();
  }

  let observer;
  if (view.IntersectionObserver) {
    const byElement = new Map(controllers.map((controller) => [controller.element, controller]));
    observer = new view.IntersectionObserver((entries) => {
      if (!alive) return;
      for (const entry of entries) byElement.get(entry.target)?.setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2);
    }, { threshold: [0, 0.2] });
    controllers.forEach((controller) => observer.observe(controller.element));
  } else {
    const checkViewport = () => controllers.forEach((controller) => controller.checkViewport());
    listen(view, 'scroll', checkViewport, { passive: true });
    listen(view, 'resize', checkViewport, { passive: true });
  }
  listen(doc, 'visibilitychange', () => controllers.forEach((controller) => controller.schedule()));
  const changeMotion = () => controllers.forEach((controller) => controller.updateMotion());
  if (motion?.addEventListener) listen(motion, 'change', changeMotion);
  else if (motion?.addListener) { motion.addListener(changeMotion); listeners.push(() => motion.removeListener(changeMotion)); }

  const cleanup = () => {
    if (!alive) return;
    alive = false;
    controllers.forEach((controller) => controller.clear());
    observer?.disconnect();
    listeners.forEach((remove) => remove());
    elements.forEach((element) => { if (mounted.get(element) === cleanup) mounted.delete(element); });
  };
  elements.forEach((element) => mounted.set(element, cleanup));
  return cleanup;
}
