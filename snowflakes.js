/* Independently scattered, uniform-size snowflakes. */
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
    flake.textContent='❄';
    // Independent draws avoid the correlated diagonals of the old sequence.
    const x=Math.random(), opacity=Math.random(), speed=Math.random();
    const delay=Math.random(), drift=Math.random(), spin=Math.random();
    flake.style.setProperty('--x',(x*100).toFixed(2)+'%');
    flake.style.setProperty('--size','15px');
    flake.style.setProperty('--opacity',(0.40+opacity*0.40).toFixed(2));
    const duration=2.3+speed*3.5;
    flake.style.setProperty('--duration',duration.toFixed(2)+'s');
    flake.style.setProperty('--delay',(-delay*duration).toFixed(2)+'s');
    flake.style.setProperty('--drift',((drift-.5)*300).toFixed(0)+'px');
    flake.style.setProperty('--spin',(spin>.5?180:-180)+'deg');
    flake.style.setProperty('--static-y',(Math.random()*100).toFixed(1)+'vh');
    layer.appendChild(flake);
  }
  document.body.appendChild(layer);
})();
