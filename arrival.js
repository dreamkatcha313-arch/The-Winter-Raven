/* Original procedural snow-tunnel arrival; no external assets or libraries. */
(()=>{
 const overlay=document.querySelector('.wr-arrival');
 if(!overlay)return;
 const canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 const skip=overlay.querySelector('.wr-arrival-skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=6200;
 let width=0,height=0,dpr=1,raf=0,start=0,done=false;
 // Deterministic depth layers: tiny far crystals, mid-distance flakes and
 // soft foreground bokeh. Never use long radial hyperspace streaks.
 const particles=Array.from({length:reduced?60:520},(_,i)=>({
   a:Math.random()*Math.PI*2,
   r:Math.sqrt(Math.random()),
   z:Math.random(),
   speed:.42+Math.random()*1.5,
   size:.45+Math.random()*1.7,
   phase:Math.random()*Math.PI*2,
   swirl:.35+Math.random()*1.15,
   layer:i%10===0?2:i%3===0?1:0
 }));
 function resize(){
   dpr=Math.min(devicePixelRatio||1,2);
   width=window.innerWidth;height=window.innerHeight;
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 function raven(t){
   const progress=Math.min(t/duration,1);
   const cameraSweep=Math.sin(progress*Math.PI*1.35);
   const cx=width*(.5+.10*cameraSweep);
   const dive=Math.max(0,(progress-.38)/.62); const easedDive=dive*dive*(3-2*dive);
   const cy=height*(.39-.055*Math.sin(progress*Math.PI)+.29*easedDive);
   const scale=Math.min(width/700,height/650)*1.1;
   const wing=Math.sin(t*.0048)*.15*(1-easedDive*.8);
   const approach=1+Math.pow(progress,1.6)*1.1;
   ctx.save();
   ctx.translate(cx,cy);
   ctx.rotate(-cameraSweep*.13+easedDive*.17);
   ctx.transform(1,0,0,1-easedDive*.30,0,0);
   ctx.scale(scale*approach,scale*approach);
   ctx.fillStyle='#02050a';ctx.strokeStyle='rgba(196,225,243,.6)';ctx.lineWidth=1.5;
   // Raven body and tail in perspective; wings flap independently.
   ctx.beginPath();ctx.moveTo(0,-38);ctx.bezierCurveTo(-17,-24,-21,23,0,69);ctx.bezierCurveTo(21,23,17,-24,0,-38);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.moveTo(-5,45);ctx.lineTo(-28,95);ctx.lineTo(0,75);ctx.lineTo(28,95);ctx.lineTo(5,45);ctx.fill();
   for(const side of [-1,1]){
     ctx.save();ctx.scale(side,1);ctx.rotate(side*wing*.6);
     ctx.beginPath();ctx.moveTo(7,-19);ctx.bezierCurveTo(50,-63,140,-100,218,-78);
     ctx.bezierCurveTo(185,-58,155,-44,137,-20);
     for(let j=6;j>=0;j--){let x=42+j*22;ctx.lineTo(x,8+j*3);ctx.lineTo(x-16,-4+j*2)}
     ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
   }
   ctx.beginPath();ctx.ellipse(0,-41,14,18,0,0,Math.PI*2);ctx.fill();
   ctx.beginPath();ctx.moveTo(-3,-48);ctx.lineTo(0,-72);ctx.lineTo(4,-48);ctx.fill();
   ctx.restore();
 }
 function render(now){
   if(done)return;
   if(!start)start=now;
   const elapsed=now-start,progress=Math.min(elapsed/duration,1);
   const cameraSweep=Math.sin(progress*Math.PI*1.35);
   const dive=Math.max(0,(progress-.38)/.62),easedDive=dive*dive*(3-2*dive);
   const cx=width*(.5+.10*cameraSweep),cy=height*(.42-.055*Math.sin(progress*Math.PI)+.29*easedDive);
   ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.fillStyle='#030a13';ctx.fillRect(0,0,width,height);
   const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,Math.max(width,height)*.85);
   glow.addColorStop(0,'#849bad');glow.addColorStop(.20,'#344858');
   glow.addColorStop(.55,'#142432');glow.addColorStop(1,'#040a12');
   ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   // Broad low-contrast moving veils create atmosphere rather than a graphic tunnel.
   for(let i=0;i<4;i++){
     const drift=Math.sin(elapsed*.00018+i*2.3)*width*.09;
     const haze=ctx.createRadialGradient(cx+drift,cy+height*(i-1.5)*.18,0,
       cx+drift,cy+height*(i-1.5)*.18,Math.max(width,height)*(.30+i*.07));
     haze.addColorStop(0,'rgba(185,205,216,.045)');
     haze.addColorStop(1,'rgba(185,205,216,0)');
     ctx.fillStyle=haze;ctx.fillRect(0,0,width,height);
   }
   const maxRadius=Math.hypot(width,height)*.72;
   for(const p of particles){
     const z=(p.z+elapsed*.00016*p.speed)%1;
     const radius=Math.pow(z,1.35)*maxRadius*p.r;
     const angle=p.a+elapsed*.00022*p.swirl+Math.sin(elapsed*.0007+p.phase)*.09;
     const driftX=Math.sin(elapsed*.0005+p.phase)*width*.025;
     const x=cx+Math.cos(angle)*radius+driftX;
     const y=cy+Math.sin(angle)*radius*.84+elapsed*.008*p.speed%34;
     const alpha=(.16+z*.55)*(p.layer===2?.62:1);
     const size=p.size*(.38+z*1.25)*(p.layer===2?2.5:1);
     if(p.layer===2){
       // Soft near-lens snow is translucent, not a bright opaque circle.
       const blur=ctx.createRadialGradient(x,y,0,x,y,size*3.3);
       blur.addColorStop(0,'rgba(235,243,248,'+(alpha*.26)+')');
       blur.addColorStop(1,'rgba(235,243,248,0)');
       ctx.fillStyle=blur;ctx.beginPath();ctx.arc(x,y,size*3.3,0,Math.PI*2);ctx.fill();
     }else{
       ctx.strokeStyle='rgba(221,235,244,'+alpha+')';
       ctx.lineWidth=Math.max(.45,size*.65);
       ctx.lineCap='round';
       ctx.beginPath();ctx.moveTo(x,y);
       ctx.lineTo(x+Math.cos(angle+.3)*(1.2+z*3.5),
         y+Math.sin(angle+.3)*(1.2+z*3.5));ctx.stroke();
     }
   }
   // The nearer snow crosses the raven's silhouette to sell depth.
   if(!window.__winterRaven3D)raven(elapsed);
   for(let i=0;i<particles.length;i+=4){
     const p=particles[i],z=(p.z+elapsed*.00022*p.speed)%1;
     if(z<.56)continue;
     const angle=p.a+elapsed*.00042*p.swirl;
     const radius=Math.pow(z,1.85)*maxRadius*p.r;
     const x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius*.78;
     ctx.fillStyle='rgba(235,247,255,'+(.18+z*.45)+')';
     ctx.beginPath();ctx.arc(x,y,p.size*z*1.3,0,Math.PI*2);ctx.fill();
   }
   if(progress>.78){
     ctx.fillStyle='rgba(220,240,255,'+((progress-.78)/.22*.92)+')';
     ctx.fillRect(0,0,width,height);
   }
   if(progress>=1){finish();return}
   raf=requestAnimationFrame(render);
 }
 function finish(){
   if(done)return;done=true;cancelAnimationFrame(raf);
   overlay.classList.add('is-leaving');
   setTimeout(()=>{overlay.hidden=true;window.removeEventListener('resize',resize)},850);
 }
 skip.addEventListener('click',finish);
 resize();
 if(reduced){finish()}else{raf=requestAnimationFrame(render)}
 window.addEventListener('resize',resize,{passive:true});
})();
