/* Original procedural snow-tunnel arrival; no external assets or libraries. */
(()=>{
 const overlay=document.querySelector('.wr-arrival');
 if(!overlay)return;
 const canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 const skip=overlay.querySelector('.wr-arrival-skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=5600;
 let width=0,height=0,dpr=1,raf=0,start=0,done=false;
 const particles=Array.from({length:reduced?60:360},(_,i)=>({
   a:(i*2.399963229728653)% (Math.PI*2),
   r:Math.sqrt(((i*73)%359+1)/360),
   z:((i*127)%367)/367,
   speed:.65+((i*13)%19)/20,
   size:.7+((i*17)%13)/10
 }));
 function resize(){
   dpr=Math.min(devicePixelRatio||1,2);
   width=window.innerWidth;height=window.innerHeight;
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 function raven(t){
   const cx=width*.5,cy=height*.39,scale=Math.min(width/700,height/650)*1.1;
   const wing=Math.sin(t*.009)*.23;
   ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
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
   const cx=width*.5,cy=height*.42;
   ctx.fillStyle='#030a13';ctx.fillRect(0,0,width,height);
   const glow=ctx.createRadialGradient(cx,cy,8,cx,cy,Math.max(width,height)*.7);
   glow.addColorStop(0,'#b7d8ec');glow.addColorStop(.12,'#31536c');glow.addColorStop(.5,'#0b1c2d');glow.addColorStop(1,'#030a13');
   ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   const maxRadius=Math.hypot(width,height)*.7;
   for(const p of particles){
     const z=(p.z+elapsed*.00014*p.speed)%1;
     const radius=Math.pow(z,2.3)*maxRadius*p.r;
     const x=cx+Math.cos(p.a)*radius,y=cy+Math.sin(p.a)*radius*.78;
     const trail=4+z*z*42;
     ctx.strokeStyle='rgba(224,243,255,'+(.18+z*.75)+')';
     ctx.lineWidth=p.size*(.45+z*1.6);
     ctx.beginPath();ctx.moveTo(x,y);
     ctx.lineTo(x+Math.cos(p.a)*trail,y+Math.sin(p.a)*trail*.78);ctx.stroke();
   }
   raven(elapsed);
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
