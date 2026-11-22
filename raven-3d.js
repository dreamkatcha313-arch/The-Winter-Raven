/* Experimental articulated 3D raven. Canvas silhouette remains the offline fallback.
   Geometry is procedural; a photogrammetric/artist-authored model can replace it later. */
(async()=>{
 const overlay=document.querySelector('.wr-arrival');
 if(!overlay||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let THREE;
 try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')}
 catch(e){console.warn('3D raven unavailable; retaining canvas raven.',e);return}
 if(overlay.hidden||overlay.classList.contains('is-leaving'))return;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(37,1,.1,100);
 camera.position.set(0,0,9);camera.lookAt(0,0,0);
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}
 catch(e){return}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.35;
 renderer.domElement.className='wr-raven-3d';
 renderer.domElement.setAttribute('aria-hidden','true');
 overlay.appendChild(renderer.domElement);
 const black=new THREE.MeshStandardMaterial({color:0x0b111a,roughness:.78,metalness:.08,side:THREE.DoubleSide});
 const featherMat=new THREE.MeshStandardMaterial({color:0x111c2b,roughness:.69,metalness:.13,side:THREE.DoubleSide});
 const edge=new THREE.MeshStandardMaterial({color:0x24384b,roughness:.8,side:THREE.DoubleSide});
 const beak=new THREE.MeshStandardMaterial({color:0x101720,roughness:.38,metalness:.22});
 const eye=new THREE.MeshPhysicalMaterial({color:0x05080e,roughness:.1,clearcoat:1});
 scene.add(new THREE.HemisphereLight(0xd4eaff,0x030509,2.5));
 const key=new THREE.DirectionalLight(0xe5f4ff,3.2);key.position.set(-3,4,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0x77b4ff,2.4);rim.position.set(3,2,-4);scene.add(rim);
 const bird=new THREE.Group();scene.add(bird);
 function ellipsoid(parent,material,x,y,z,sx,sy,sz){
   const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),material);
   m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m
 }
 ellipsoid(bird,black,0,-.22,0,.43,.67,.46);
 ellipsoid(bird,black,0,.45,-.27,.30,.33,.32);
 ellipsoid(bird,edge,0,.58,-.36,.16,.15,.10);
 const bill=new THREE.Mesh(new THREE.ConeGeometry(.17,.54,5),beak);
 bill.rotation.x=-Math.PI/2;bill.position.set(0,.39,-.74);bird.add(bill);
 for(const sign of [-1,1]){
   ellipsoid(bird,eye,sign*.235,.54,-.55,.068,.065,.04);
   const highlight=ellipsoid(bird,edge,sign*.215,.565,-.594,.017,.018,.008);
   // Shoulder and wrist are separate joints so the wing can fold during a dive.
   const shoulder=new THREE.Group();shoulder.position.set(sign*.30,.13,-.03);bird.add(shoulder);
   const upper=ellipsoid(shoulder,black,sign*.40,.035,-.10,.51,.12,.23);
   upper.rotation.z=sign*.08;
   const wrist=new THREE.Group();wrist.position.set(sign*.81,.05,-.12);shoulder.add(wrist);
   const outer=ellipsoid(wrist,black,sign*.35,.015,-.10,.44,.09,.17);
   outer.rotation.z=-sign*.10;
   // Thin overlapping tapered vanes, individually shaded rather than rectangular quills.
   function vane(parent,material,x,y,z,length,width,angle){
     const g=new THREE.BufferGeometry();
     const positions=new Float32Array([
       0,0,0, sign*length*.40,width*.5,-.025,
       sign*length,0,-.13,
       0,0,0, sign*length,0,-.13,
       sign*length*.40,-width*.5,-.025
     ]);
     g.setAttribute('position',new THREE.BufferAttribute(positions,3));
     g.computeVertexNormals();
     const m=new THREE.Mesh(g,material);m.position.set(x,y,z);m.rotation.z=angle;parent.add(m);
     return m;
   }
   for(let i=0;i<16;i++){
     const u=i/15;
     vane(shoulder,i%4===0?edge:featherMat,sign*(.12+u*.58),-.02,-.12-u*.08,
       .40+.20*Math.sin(u*Math.PI),.14,sign*(-.22-u*.12));
   }
   for(let i=0;i<18;i++){
     const u=i/17;
     vane(wrist,i%5===0?edge:featherMat,sign*(u*.65),-.03,-.12-u*.06,
       .50+.26*(1-u),.12,sign*(-.16-u*.30));
   }
   // Distinct primary feathers at the wingtip.
   for(let i=0;i<6;i++){
     const feather=ellipsoid(wrist,i%2?featherMat:edge,sign*(.66+i*.045),-.055-i*.045,-.13,.055,.23+i*.025,.025);
     feather.rotation.z=sign*(.30+i*.13);
   }
   bird.userData[sign<0?'left':'right']={shoulder,wrist,sign};
   // Tail fan remains behind the body, visible from the following camera.
   if(sign===1)for(let i=-3;i<=3;i++){
     const tail=ellipsoid(bird,i%2?featherMat:edge,i*.055,-.89,-.12,.047,.36-Math.abs(i)*.025,.055);
     tail.rotation.z=-i*.12;
   }
 }
 const clock=new THREE.Clock();
 const duration=6.2;
 let active=true;
 function resize(){
   const w=innerWidth,h=innerHeight;
   renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 }
 resize();addEventListener('resize',resize,{passive:true});
 const observer=new MutationObserver(()=>{if(overlay.hidden||overlay.classList.contains('is-leaving'))dispose()});
 observer.observe(overlay,{attributes:true,attributeFilter:['hidden','class']});
 function dispose(){
   if(!active)return;active=false;observer.disconnect();removeEventListener('resize',resize);
   scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
   [black,featherMat,edge,beak,eye].forEach(m=>m.dispose());
   renderer.dispose();renderer.domElement.remove()
 }
 function frame(){
   if(!active)return;
   if(overlay.hidden||overlay.classList.contains('is-leaving')){dispose();return}
   const t=clock.getElapsedTime(),p=Math.min(t/duration,1);
   const dive=Math.max(0,(p-.38)/.62),smooth=dive*dive*(3-2*dive);
   const sweep=Math.sin(p*Math.PI*1.35);
   bird.position.set(sweep*.36,.48-smooth*.42+Math.sin(p*Math.PI)*.08,-p*2.4);
   // Follow the raven from behind: its beak points into the storm, away from the viewer.
   // The raven's face points along -Z, away from the camera at +Z.
   bird.rotation.set(-smooth*.38,sweep*.13,-sweep*.12);
   // Two phases: active wingbeats, then a controlled partially folded dive.
   const flap=Math.sin(t*5.2)*(.19*(1-smooth*.70));
   const glide=Math.sin(t*1.4)*.035;
   for(const wing of [bird.userData.left,bird.userData.right]){
     const side=wing.sign;
     wing.shoulder.rotation.z=side*(flap+glide-smooth*.20);
     wing.shoulder.rotation.y=side*(smooth*.10);
     wing.wrist.rotation.z=side*(-flap*.42-smooth*.24);
     wing.wrist.rotation.x=-smooth*.13;
   }
   // Recede into the distance instead of enlarging toward the camera.
   const scale=(innerWidth<600?.52:.77)*(1-.34*p);
   bird.scale.setScalar(scale);
   renderer.render(scene,camera);
   requestAnimationFrame(frame)
 }
 frame();
 window.__winterRaven3D={dispose};
})();