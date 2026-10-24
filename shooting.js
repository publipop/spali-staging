const mounted = new WeakMap();
const motionQuery = '(prefers-reduced-motion: reduce)';

export function renderShooting() {
  const reduced = Boolean(globalThis.matchMedia?.(motionQuery).matches);
  return `<div class="hero-shooting" role="region" aria-label="Deporte en movimiento">
    <video class="shooting-video" muted${reduced ? '' : ' autoplay'} loop playsinline preload="metadata" poster="assets/hero-spali-v2-poster.jpg" aria-label="Deportistas de varias disciplinas en movimiento"><source src="assets/hero-spali-v2.mp4" type="video/mp4"></video>
    <span class="shooting-caption">CADA PASO CUENTA.</span>
    <span class="hero-signature"><img src="assets/logo-spali-stencil.svg" alt="SPALI SPORTS" width="584" height="122"></span>
    <div class="shooting-controls"><button class="shooting-pause" type="button" aria-label="${reduced ? 'Reproducir' : 'Pausar'} el vídeo" aria-pressed="${reduced}">${reduced ? 'Reproducir' : 'Pausar'}</button></div>
    <span class="shooting-status" role="status" aria-live="polite" aria-atomic="true"></span>
  </div>`;
}

/** Playback follows visibility; only an explicit play action clears a user pause. */
export function mountShooting(root = globalThis.document) {
  const hero = root?.matches?.('.hero-shooting') ? root : root?.querySelector?.('.hero-shooting');
  const video = hero?.querySelector('.shooting-video');
  const button = hero?.querySelector('.shooting-pause');
  if (!video || !button) return () => {};
  mounted.get(video)?.();
  const doc = hero.ownerDocument || root;
  const view = doc.defaultView || globalThis;
  const motion = view.matchMedia?.(motionQuery);
  const status = hero.querySelector('.shooting-status');
  const listeners = [];
  let alive = true;
  let userPaused = false;
  let reducedMotionConsent = false;
  let blocked = false;
  let pending = false;
  let generation = 0;
  let observer;

  const inViewport = () => {
    const box = hero.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.right > 0
      && box.top < (view.innerHeight || 800) && box.left < (view.innerWidth || 1280);
  };
  let visible = inViewport();
  const shouldPlay = () => alive && hero.isConnected && visible && !doc.hidden && !userPaused
    && !blocked && (!motion?.matches || reducedMotionConsent);
  const syncButton = () => {
    const playing = shouldPlay() && (pending || !video.paused);
    button.textContent = playing ? 'Pausar' : 'Reproducir';
    button.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproducir'} el vídeo`);
    button.setAttribute('aria-pressed', String(!playing));
  };
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
  };
  const stop = () => {
    generation += 1;
    pending = false;
    video.pause();
  };
  const rejectPlayback = (attempt) => {
    if (!alive || attempt !== generation) return;
    blocked = true;
    stop();
    if (status) status.textContent = 'Pulsa Reproducir para iniciar el vídeo.';
    syncButton();
  };
  const reconcile = () => {
    const wanted = shouldPlay();
    // Native autoplay is disabled whenever playback is not eligible, including reduced motion.
    video.autoplay = wanted && !motion?.matches;
    if (!wanted) {
      stop();
      syncButton();
      return;
    }
    if (pending || !video.paused) {
      syncButton();
      return;
    }
    pending = true;
    const attempt = ++generation;
    syncButton();
    try {
      Promise.resolve(video.play()).then(() => {
        if (!alive) {
          // A stale play promise must not restart a detached video or pause a new controller.
          if (!mounted.has(video)) video.pause();
          return;
        }
        if (attempt !== generation) {
          if (!shouldPlay()) video.pause();
          return;
        }
        pending = false;
        if (!shouldPlay()) video.pause();
        if (status && !video.paused) status.textContent = '';
        syncButton();
      }, () => rejectPlayback(attempt));
    } catch {
      rejectPlayback(attempt);
    }
  };

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  listen(button, 'click', () => {
    if (shouldPlay() && (pending || !video.paused)) userPaused = true;
    else {
      userPaused = false;
      reducedMotionConsent = true;
      blocked = false;
      if (status) status.textContent = '';
      // A failed media load can be retried by the same visible control.
      if (video.error) video.load();
    }
    reconcile();
  });
  listen(video, 'play', () => {
    if (!shouldPlay()) video.pause();
    syncButton();
  });
  listen(video, 'playing', () => {
    if (!shouldPlay()) video.pause();
    else if (status) status.textContent = '';
    syncButton();
  });
  listen(video, 'pause', syncButton);
  listen(video, 'error', () => {
    blocked = true;
    stop();
    if (status) status.textContent = 'No se ha podido reproducir el vídeo. Puedes volver a intentarlo.';
    syncButton();
  });
  listen(doc, 'visibilitychange', reconcile);
  const onMotionChange = () => {
    reducedMotionConsent = false;
    reconcile();
  };
  if (motion?.addEventListener) listen(motion, 'change', onMotionChange);
  else if (motion?.addListener) {
    motion.addListener(onMotionChange);
    listeners.push(() => motion.removeListener(onMotionChange));
  }

  if (view.IntersectionObserver) {
    observer = new view.IntersectionObserver((entries) => {
      if (!alive) return;
      const entry = entries.find((item) => item.target === hero);
      if (!entry) return;
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      reconcile();
    }, { threshold: [0, 0.1] });
    observer.observe(hero);
  } else {
    const onViewportChange = () => { visible = inViewport(); reconcile(); };
    listen(view, 'scroll', onViewportChange, { passive: true });
    listen(view, 'resize', onViewportChange, { passive: true });
  }

  const cleanup = () => {
    if (!alive) return;
    alive = false;
    video.autoplay = false;
    stop();
    observer?.disconnect();
    listeners.forEach((remove) => remove());
    if (mounted.get(video) === cleanup) mounted.delete(video);
  };
  mounted.set(video, cleanup);
  reconcile();
  return cleanup;
}
