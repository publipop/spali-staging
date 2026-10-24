const FRAMES = [
  {src:'assets/shoot-running.jpg',alt:'Atleta corriendo en una pista de atletismo',label:'CADA PASO CUENTA.'},
  {src:'assets/shoot-baloncesto.jpg',alt:'Jugadores de baloncesto en acción en una pista exterior',label:'EL EQUIPO TE MUEVE.'},
  {src:'assets/shoot-tenis.jpg',alt:'Pareja de tenistas durante un punto de dobles',label:'COMPARTE TU JUEGO.'},
  {src:'assets/shoot-ciclismo.jpg',alt:'Ciclistas pedaleando por una carretera abierta',label:'ENCUENTRA TU RITMO.'},
];

export function renderShooting() {
  return `<div class="hero-shooting" role="region" aria-roledescription="carrusel" aria-label="Deporte en movimiento">
    <div class="shooting-frames">${FRAMES.map((f,i)=>`<figure class="shooting-frame ${i===0?'is-active':''}" aria-hidden="${i!==0}"><img src="${f.src}" alt="${f.alt}" width="1536" height="1024" ${i===0?'fetchpriority="high"':'loading="lazy"'}></figure>`).join('')}</div>
    <span class="shooting-caption">${FRAMES[0].label}</span>
    <span class="hero-signature"><img src="assets/logotipo-spali.svg" alt="SPALI" width="430" height="88"></span>
    <div class="shooting-controls"><button class="shooting-pause" type="button" aria-label="Pausar las imágenes" aria-pressed="false">Pausa</button><div class="shooting-dots" role="group" aria-label="Elegir deporte">${FRAMES.map((f,i)=>`<button type="button" data-shooting-index="${i}" aria-label="${f.alt}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div></div>
  </div>`;
}

export function mountShooting(root=document) {
  const carousel=root.querySelector('.hero-shooting');
  if(!carousel)return ()=>{};
  const frames=[...carousel.querySelectorAll('.shooting-frame')];
  const dots=[...carousel.querySelectorAll('[data-shooting-index]')];
  const pause=carousel.querySelector('.shooting-pause');
  const caption=carousel.querySelector('.shooting-caption');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const abort=new AbortController();
  let index=0,timer,visible=true,hovered=false,focused=false,paused=motion.matches;
  const stop=()=>{clearTimeout(timer);timer=undefined;};
  const schedule=()=>{
    stop();
    if(paused||hovered||focused||!visible||document.hidden||motion.matches)return;
    timer=setTimeout(()=>{show((index+1)%frames.length);schedule();},9000);
  };
  const show=next=>{
    index=next;
    frames.forEach((frame,i)=>{frame.classList.toggle('is-active',i===index);frame.setAttribute('aria-hidden',String(i!==index));});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
    caption.textContent=FRAMES[index].label;
  };
  const syncPause=()=>{pause.textContent=paused?'Reproducir':'Pausa';pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Reproducir las imágenes':'Pausar las imágenes');schedule();};
  pause.addEventListener('click',()=>{paused=!paused;syncPause();},{signal:abort.signal});
  dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.shootingIndex));schedule();},{signal:abort.signal}));
  carousel.addEventListener('mouseenter',()=>{hovered=true;stop();},{signal:abort.signal});
  carousel.addEventListener('mouseleave',()=>{hovered=false;schedule();},{signal:abort.signal});
  carousel.addEventListener('focusin',()=>{focused=true;stop();},{signal:abort.signal});
  carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focused=false;schedule();}},{signal:abort.signal});
  document.addEventListener('visibilitychange',schedule,{signal:abort.signal});
  motion.addEventListener('change',()=>{paused=motion.matches;syncPause();},{signal:abort.signal});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:0.1});
  observer.observe(carousel);syncPause();
  return ()=>{stop();observer.disconnect();abort.abort();};
}
