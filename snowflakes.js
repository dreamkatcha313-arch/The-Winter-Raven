/* Winter Raven snowfall — depth, turbulence, and natural irregular motion. */
(()=>{
  if(!document.body.classList.contains('home-page')) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas=document.createElement('canvas');
  canvas.className='wr-snow-canvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;
  let width=0,height=0,dpr=1,flakes=[],frame=0,last=0;
  const random=(a,b)=>a+Math.random()*(b-a);
  function makeFlake(anywhere){
    const depth=Math.random();
    return {
      x:random(-30,width+30),y:anywhere?random(0,height):random(-45,-5),
      depth, radius:0.65+depth*2.25, speed:35+depth*100+random(-10,12),
      sway:random(6,24), phase:random(0,Math.PI*2),
      frequency:random(0.5,1.4), wind:random(-14,18),
      opacity:random(0.24,0.48)+depth*0.35,
      crystal:depth>0.91&&Math.random()<0.3
    };
  }
  function resize(){
    width=window.innerWidth;height=window.innerHeight;
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const target=reduced?26:Math.min(115,Math.max(65,Math.round(width*height/11500)));
    flakes=Array.from({length:target},()=>makeFlake(true));
    draw();
  }
  function draw(){
    ctx.clearRect(0,0,width,height);
    for(const f of flakes){
      ctx.globalAlpha=f.opacity;
      ctx.strokeStyle='#f2f9ff';ctx.fillStyle='#f2f9ff';
      if(f.crystal){
        ctx.lineWidth=0.65;
        for(let i=0;i<3;i++){
          const a=i*Math.PI/3;
          const dx=Math.cos(a)*f.radius*1.6,dy=Math.sin(a)*f.radius*1.6;
          ctx.beginPath();ctx.moveTo(f.x-dx,f.y-dy);ctx.lineTo(f.x+dx,f.y+dy);ctx.stroke();
        }
      }else{
        ctx.beginPath();ctx.arc(f.x,f.y,f.radius,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.globalAlpha=1;
  }
  function tick(now){
    if(!document.hidden){
      const dt=Math.min((now-(last||now))/1000,0.04);
      const t=now/1000;
      for(const f of flakes){
        const gust=Math.sin(t*0.38+f.phase)*8;
        f.x+=(f.wind+gust+Math.sin(t*f.frequency+f.phase)*f.sway)*dt;
        f.y+=f.speed*dt;
        if(f.y>height+12){Object.assign(f,makeFlake(false));}
        if(f.x>width+35)f.x=-25;
        if(f.x< -35)f.x=width+25;
      }
      draw();
    }
    last=now;
    frame=requestAnimationFrame(tick);
  }
  window.addEventListener('resize',resize,{passive:true});
  resize();
  if(!reduced)frame=requestAnimationFrame(tick);
})();
