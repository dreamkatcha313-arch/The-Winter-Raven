/* Lightweight snowfall with recognizable flakes and depth. */
(()=>{
  if(!document.body.classList.contains('home-page'))return;
  const layer=document.createElement('div');
  layer.className='wr-flurries';
  layer.setAttribute('aria-hidden','true');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count=reduced?18:77;
  for(let i=0;i<count;i++){
    const flake=document.createElement('span');
    flake.className='wr-flake';
    flake.textContent=i%5===0?'✻':'❄';
    const n=(k)=>((i*73+k*137)%997)/997;
    const size=8+Math.round(n(1)*14);
    flake.style.setProperty('--x',(n(2)*100).toFixed(2)+'%');
    flake.style.setProperty('--size',size+'px');
    flake.style.setProperty('--opacity',(0.25+n(3)*0.55).toFixed(2));
    flake.style.setProperty('--duration',(2.3+n(4)*3.5).toFixed(2)+'s');
    flake.style.setProperty('--delay',(-n(5)*6).toFixed(2)+'s');
    flake.style.setProperty('--drift',((n(6)-.5)*300).toFixed(0)+'px');
    flake.style.setProperty('--spin',(n(7)>.5?180:-180)+'deg');
    flake.style.setProperty('--static-y',(n(8)*100).toFixed(1)+'vh');
    layer.appendChild(flake);
  }
  document.body.appendChild(layer);
})();
