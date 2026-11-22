/* Depth-layered wind-driven snow; procedural fallback raven retained. */
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
 const mobile=matchMedia('(max-width: 600px)').matches;
 // Snow falls under gravity while coherent gusts push the full particle field.
 // Layer depth changes apparent velocity, opacity and defocus.
 const particles=Array.from({length:reduced?60:mobile?300:520},(_,i)=>({
   x:Math.random(),y:Math.random(),depth:.18+Math.random()*.82,
   speed:.55+Math.random()*.9,size:.5+Math.random()*1.55,
   phase:Math.random()*Math.PI*2,layer:i%11===0?2:i%3===0?1:0
 }));
 function wind(time,y){
   const gust=Math.sin(time*.00042)*.64+Math.sin(time*.00113+.7)*.24;
   return gust+.18*Math.sin(time*.0008+y*5);
 }
 // Pre-render optical blur once, avoiding hundreds of radial gradients per frame.
 const blurSprite=document.createElement('canvas');
 blurSprite.width=blurSprite.height=64;
 const blurCtx=blurSprite.getContext('2d');
 const falloff=blurCtx.createRadialGradient(32,32,1,32,32,31);
 falloff.addColorStop(0,'rgba(244,249,252,.75)');
 falloff.addColorStop(.25,'rgba(235,245,252,.28)');
 falloff.addColorStop(1,'rgba(235,245,252,0)');
 blurCtx.fillStyle=falloff;blurCtx.fillRect(0,0,64,64);
 function resize(){
   // Bound fill rate on high-density phones while retaining crisp snow.
   dpr=Math.min(devicePixelRatio||1,mobile?1.35:1.75);
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
   if(document.hidden){raf=requestAnimationFrame(render);return}
   if(!start)start=now;
   const elapsed=Math.min(now-start,duration),progress=Math.min(elapsed/duration,1);
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
   const seconds=elapsed*.001;
   for(const p of particles){
     const parallax=.32+p.depth*1.35;
     const fall=(seconds*(.065+.105*p.speed)*parallax);
     const yNorm=((p.y+fall)%1.28+1.28)%1.28-.14;
     const localWind=wind(elapsed,yNorm);
     const flutter=Math.sin(seconds*(1.7+p.speed)+p.phase)*.006;
     const xNorm=((p.x+seconds*.043*localWind*parallax+flutter)%1.25+1.25)%1.25-.125;
     const x=xNorm*width,y=yNorm*height;
     if(x< -25||x>width+25||y< -25||y>height+25)continue;
     const alpha=(.12+.44*p.depth)*(p.layer===2?.8:1);
     const size=p.size*(.45+p.depth*1.4)*(p.layer===2?2.25:1);
     if(p.layer===2){
       ctx.globalAlpha=Math.min(.55,alpha*.8);
       ctx.drawImage(blurSprite,x-size*3.3,y-size*3.3,size*6.6,size*6.6);
       ctx.globalAlpha=1;
     }else{
       const dx=localWind*(.65+2.2*p.depth);
       const dy=(1.2+2.3*p.depth)*p.speed;
       ctx.strokeStyle='rgba(224,238,247,'+alpha+')';
       ctx.lineWidth=Math.max(.45,size*.62);
       ctx.lineCap='round';
       ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();
     }
   }
   // The Canvas2D silhouette is retained only when WebGL cannot initialize.
   if(!window.__winterRaven3D)raven(elapsed);
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
