/* Experimental articulated 3D raven. Canvas silhouette remains the offline fallback.
   Geometry is procedural; a photogrammetric/artist-authored model can replace it later. */
(async()=>{
 const overlay=document.querySelector('.wr-arrival');
 if(!overlay||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let THREE;
 try{THREE=await import('three')}
 catch(e){console.warn('3D raven unavailable; retaining canvas raven.',e);return}
 if(overlay.hidden||overlay.classList.contains('is-leaving'))return;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(37,1,.1,100);
 camera.position.set(0,0,9);camera.lookAt(0,0,0);
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}
 catch(e){return}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<600?1.15:1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.35;
 renderer.domElement.className='wr-raven-3d';
 renderer.domElement.setAttribute('aria-hidden','true');
 overlay.appendChild(renderer.domElement);
 // Small repeatable feather-grain texture, generated locally without image downloads.
 function plumageTexture(){
   const c=document.createElement('canvas');c.width=256;c.height=256;
   const g=c.getContext('2d');g.fillStyle='#a3a3a3';g.fillRect(0,0,256,256);
   let seed=84217;
   function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}
   for(let row=0;row<22;row++)for(let col=0;col<18;col++){
     const x=col*15+(row%2)*7+(random()-.5)*4;
     const y=row*12+(random()-.5)*3;
     g.strokeStyle='rgba(16,22,31,'+(.14+random()*.22)+')';
     g.lineWidth=.7+random()*.7;
     g.beginPath();g.moveTo(x-4,y-6);g.quadraticCurveTo(x+1,y+1,x,y+10);g.stroke();
     g.strokeStyle='rgba(225,237,247,'+(.09+random()*.16)+')';
     g.beginPath();g.moveTo(x,y-4);g.lineTo(x+3,y+5);g.stroke();
   }
   const texture=new THREE.CanvasTexture(c);
   texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
   texture.repeat.set(2,2);
   texture.colorSpace=THREE.SRGBColorSpace;
   texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
   return texture;
 }
 const plumage=plumageTexture();
 // Directional feather micro-roughness: dark rachis lines and finer barb striations.
 // This is an inexpensive procedural approximation, not a scanned feather texture.
 function featherRoughness(){
   const c=document.createElement('canvas');c.width=c.height=256;
   const g=c.getContext('2d');
   g.fillStyle='#c4c4c4';g.fillRect(0,0,256,256);
   let seed=31019;
   const rnd=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296};
   for(let i=0;i<1150;i++){
     const x=rnd()*256,y=rnd()*256,len=4+rnd()*17;
     g.strokeStyle=rnd()>.5?'rgba(35,35,35,.12)':'rgba(255,255,255,.16)';
     g.lineWidth=.4+rnd()*.6;
     g.beginPath();g.moveTo(x,y);g.lineTo(x+len*.18,y+len);g.stroke();
   }
   const t=new THREE.CanvasTexture(c);
   t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);
   t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
   return t;
 }
 const roughnessMap=featherRoughness();
 const black=new THREE.MeshStandardMaterial({color:0x10151c,roughness:.92,metalness:0,map:plumage,roughnessMap,side:THREE.DoubleSide});
 const featherMat=new THREE.MeshStandardMaterial({color:0x151c27,roughness:.86,metalness:.015,map:plumage,roughnessMap,side:THREE.DoubleSide});
 const edge=new THREE.MeshStandardMaterial({color:0x1a2734,roughness:.88,metalness:.01,map:plumage,roughnessMap,side:THREE.DoubleSide});
 const beak=new THREE.MeshStandardMaterial({color:0x101720,roughness:.38,metalness:.22});
 const eye=new THREE.MeshPhysicalMaterial({color:0x05080e,roughness:.1,clearcoat:1});
 scene.add(new THREE.HemisphereLight(0xd4eaff,0x080c13,2.15));
 const key=new THREE.DirectionalLight(0xdde7ed,2.25);key.position.set(-3,4,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0x91b4d3,1.1);rim.position.set(3,2,-4);scene.add(rim);
 const bird=new THREE.Group();scene.add(bird);
 function ellipsoid(parent,material,x,y,z,sx,sy,sz){
   const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),material);
   m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m
 }
 // A tapered aerodynamic wing surface avoids the appearance of linked cylinders.
 function wingSurface(parent,material,sign,length,rootChord,tipChord){
   const verts=[],uv=[],idx=[],sections=12;
   for(let i=0;i<=sections;i++){
     const u=i/sections;
     const chord=rootChord*(1-u)+tipChord*u;
     const x=sign*length*u;
     const y=.035*Math.sin(Math.PI*u);
     const z=-.08-.11*u;
     for(let j=0;j<3;j++){
       const v=j/2;
       verts.push(x,y+(v-.5)*chord,z+.045*Math.sin(Math.PI*v)*Math.sin(Math.PI*u));
       uv.push(u,v);
     }
   }
   for(let i=0;i<sections;i++)for(let j=0;j<2;j++){
     const a=i*3+j,b=a+3;idx.push(a,b,a+1,b,b+1,a+1);
   }
   const g=new THREE.BufferGeometry();
   g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
   g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
   g.setIndex(idx);g.computeVertexNormals();
   const mesh=new THREE.Mesh(g,material);parent.add(mesh);return mesh;
 }
 ellipsoid(bird,black,0,-.22,0,.37,.61,.39);
 // Shoulder mantle overlaps the wing roots, reducing the detached-joint silhouette.
 for(const side of [-1,1]){
   const mantle=ellipsoid(bird,black,side*.275,.115,.12,.185,.26,.21);
   mantle.rotation.z=side*.22;
 }
 // Overlapping mantle and scapular feather contours on the visible back.
 for(let row=0;row<9;row++){
   const y=.25-row*.112;
   const taper=Math.sqrt(Math.max(.05,1-Math.pow((y+.18)/.70,2)));
   for(let j=-4;j<=4;j++){
     const x=j*.073*taper+(row%2)*.025;
     const z=.36*Math.sqrt(Math.max(.05,1-Math.pow(x/.40,2)-Math.pow((y+.18)/.72,2)))+.012;
     const m=ellipsoid(bird,(row+j)%4===0?edge:featherMat,x,y,z,.052,.11,.018);
     m.rotation.z=-j*.035;
   }
 }
 // Continuous neck and compact skull: rear-facing camera sees the mantle,
 // not a large round head. The bill projects forward along local -Z.
 ellipsoid(bird,black,0,.38,-.24,.245,.31,.26);
 ellipsoid(bird,black,0,.59,-.38,.155,.145,.18);
 // Low-profile shaggy throat hackles, tucked beneath the head silhouette.
 for(let i=-3;i<=3;i++){
   const hackle=ellipsoid(bird,featherMat,i*.039,.39-Math.abs(i)*.008,-.535,.029,.092,.022);
   hackle.rotation.z=i*.075;
 }
 // Tapered bill with broad base; the tip remains pointed away from the camera.
 const bill=new THREE.Mesh(new THREE.ConeGeometry(.105,.40,9),beak);
 bill.rotation.x=-Math.PI/2;bill.position.set(0,.52,-.66);bird.add(bill);
 for(const sign of [-1,1]){
   // Eyes are on the forward-facing sides of the head, not visible as rear-facing dots.
   ellipsoid(bird,eye,sign*.244,.48,-.41,.028,.033,.025);
   // Shoulder and wrist are separate joints so the wing can fold during a dive.
   const shoulder=new THREE.Group();shoulder.position.set(sign*.30,.13,-.03);bird.add(shoulder);
   wingSurface(shoulder,black,sign,.84,.30,.19);
   const wrist=new THREE.Group();wrist.position.set(sign*.81,.05,-.12);shoulder.add(wrist);
   wingSurface(wrist,black,sign,.76,.20,.035);
   // Rounded shoulder coverts bridge the body and the moving upper wing.
   for(let i=0;i<7;i++){
     const u=i/6;
     const covert=ellipsoid(shoulder,i%3===0?edge:featherMat,sign*(.12+u*.53),.075-u*.018,.075-u*.035,
       .16-u*.025,.075-u*.018,.035);
     covert.rotation.z=sign*(-.10-u*.15);
   }
   // Smaller overlapping wrist coverts soften the elbow-to-primary transition.
   for(let i=0;i<6;i++){
     const u=i/5;
     const covert=ellipsoid(wrist,i%3===0?edge:featherMat,sign*(.07+u*.45),.055,.065-u*.018,
       .14-u*.02,.055,.027);
     covert.rotation.z=sign*(-.13-u*.12);
   }
   // Thin overlapping tapered vanes, individually shaded rather than rectangular quills.
   // Curved, tapered feather blades with a raised rachis and soft asymmetric vanes.
   function vane(parent,material,x,y,z,length,width,angle){
     const vertices=[],uvs=[],indices=[];
     const steps=8;
     for(let i=0;i<=steps;i++){
       const u=i/steps;
       const taper=Math.pow(Math.sin(Math.PI*(.035+u*.95)),.65);
       const offset=sign*length*u;
       const camber=.025*Math.sin(u*Math.PI);
       const sweep=-.10*u*u;
       for(let j=0;j<3;j++){
         const across=j-1;
         const asymmetric=across<0?.86:1.14;
         vertices.push(offset,across*width*.5*taper*asymmetric+camber,sweep+(.018*(1-Math.abs(across))*Math.sin(Math.PI*u)));
         uvs.push(u,(j/2));
       }
     }
     for(let i=0;i<steps;i++)for(let j=0;j<2;j++){
       const a=i*3+j,b=a+3;
       indices.push(a,b,a+1,b,b+1,a+1);
     }
     const g=new THREE.BufferGeometry();
     g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
     g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
     g.setIndex(indices);g.computeVertexNormals();
     const m=new THREE.Mesh(g,material);
     m.position.set(x,y,z);m.rotation.z=angle;parent.add(m);
     return m;
   }
   const secondaryFeathers=[];
   for(let i=0;i<16;i++){
     const u=i/15;
     secondaryFeathers.push(vane(shoulder,i%4===0?edge:featherMat,sign*(.12+u*.58),-.02,-.12-u*.08,
       .40+.20*Math.sin(u*Math.PI),.18,sign*(-.22-u*.12)));
   }
   const primaryFeathers=[];
   for(let i=0;i<18;i++){
     const u=i/17;
     primaryFeathers.push(vane(wrist,i%5===0?edge:featherMat,sign*(u*.65),-.03,-.12-u*.06,
       .50+.26*(1-u),.155,sign*(-.16-u*.30)));
   }
   // Long, separated primaries form a tapered hand instead of blunt cylindrical tips.
   for(let i=0;i<6;i++){
     const u=i/5;
     vane(wrist,i%3===0?edge:featherMat,sign*(.66+u*.18),-.06-u*.055,-.14,
       .43-u*.12,.075-u*.018,sign*(-.22-u*.18));
   }
   bird.userData[sign<0?'left':'right']={shoulder,wrist,sign,primaryFeathers,secondaryFeathers};
   // Layered wedge-shaped rectrices: central feathers extend farther than
   // the outer feathers, a characteristic common-raven flight silhouette.
   if(sign===1)for(let i=-5;i<=5;i++){
     const u=Math.abs(i)/5;
     const length=.42-.15*u;
     const tail=ellipsoid(bird,i%4===0?edge:featherMat,i*.038,-.85-length*.33,.12,.030,length,.019);
     tail.rotation.z=-i*.065;
   }
 }
 // Rigged GLB is optional: do not block the intro while an asset downloads.
 // Preserve the procedural model until a complete, validated scene is ready.
 let external=null,mixer=null;
 let active=true;
 const modelURL='assets/raven/raven-rigged.glb';
 (async()=>{
   try{
     const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
     if(!active)return;
     const gltf=await new Promise((resolve,reject)=>new GLTFLoader().load(modelURL,resolve,undefined,reject));
     if(!active||overlay.hidden||overlay.classList.contains('is-leaving'))return;
     // Production quality gate: block low-detail stand-ins from replacing the raven.
     // An artist-authored asset must have skinned geometry, a real feather texture,
     // and a flight animation before it can be displayed to visitors.
     let skinned=0,textured=0,bones=0,triangles=0;
     gltf.scene.traverse(o=>{
       if(o.isBone)bones++;
       if(o.isSkinnedMesh)skinned++;
       if(o.isMesh){
         const mats=Array.isArray(o.material)?o.material:[o.material];
         if(mats.some(m=>m&&m.map&&m.map.image&&m.map.image.width>=256&&m.map.image.height>=256))textured++;
         const g=o.geometry;
         if(g)triangles+=g.index?g.index.count/3:(g.attributes.position?g.attributes.position.count/3:0);
       }
     });
     if(skinned<1||bones<8||textured<1||triangles<3000||!gltf.animations.some(c=>/fly|flap|flight/i.test(c.name))){
       throw Error('Raven asset does not meet production geometry, texture, rig and animation requirements');
     }
     const root=gltf.scene;
     const bounds=new THREE.Box3().setFromObject(root);
     const size=bounds.getSize(new THREE.Vector3());
     const maxDimension=Math.max(size.x,size.y,size.z);
     if(!Number.isFinite(maxDimension)||maxDimension<=0)throw Error('Invalid raven model bounds');
     const center=bounds.getCenter(new THREE.Vector3());
     // Center the model in its own pivot before scaling to the existing flight rig.
     const pivot=new THREE.Group();
     root.position.sub(center);
     pivot.add(root);
     pivot.scale.setScalar(2.8/maxDimension);
     const nextMixer=gltf.animations.length?new THREE.AnimationMixer(root):null;
     if(nextMixer){
       const clip=gltf.animations.find(c=>/fly|flap|flight/i.test(c.name))||gltf.animations[0];
       nextMixer.clipAction(clip).play();
     }
     root.traverse(o=>{if(o.isMesh){o.frustumCulled=false;}});
     if(!active)return;
     bird.add(pivot);
     bird.children.forEach(child=>{if(child!==pivot)child.visible=false});
     external=pivot;mixer=nextMixer;
   }catch(e){
     // An absent asset is normal until the production model is installed.
     console.info('Procedural raven retained; rigged GLB not available.');
   }
 })();
 const clock=new THREE.Clock();
 let lastFrameTime=0;
 const duration=6.2;
 function resize(){
   const w=innerWidth,h=innerHeight;
   renderer.setPixelRatio(Math.min(devicePixelRatio||1,w<600?1.15:1.5));
   renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 }
 resize();addEventListener('resize',resize,{passive:true});
 const observer=new MutationObserver(()=>{if(overlay.hidden||overlay.classList.contains('is-leaving'))dispose()});
 observer.observe(overlay,{attributes:true,attributeFilter:['hidden','class']});
 function dispose(){
   if(!active)return;active=false;observer.disconnect();removeEventListener('resize',resize);
   scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
   if(mixer)mixer.stopAllAction();
   if(external)external.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});
   [black,featherMat,edge,beak,eye].forEach(m=>m.dispose());
   plumage.dispose();roughnessMap.dispose();
   renderer.dispose();renderer.domElement.remove()
 }
 function frame(){
   if(!active)return;
   if(overlay.hidden||overlay.classList.contains('is-leaving')){dispose();return}
   if(document.hidden){lastFrameTime=clock.getElapsedTime();requestAnimationFrame(frame);return}
   const t=clock.getElapsedTime(),p=Math.min(t/duration,1);
   const dive=Math.max(0,(p-.38)/.62),smooth=dive*dive*(3-2*dive);
   const sweep=Math.sin(p*Math.PI*1.35);
   bird.position.set(sweep*.12,.48-smooth*.42+Math.sin(p*Math.PI)*.04,-p*2.4);
   // Follow the raven from behind: its beak points into the storm, away from the viewer.
   // The raven's face points along -Z, away from the camera at +Z.
   bird.rotation.set(-smooth*.38+Math.sin(t*2.1)*.014,sweep*.045+Math.sin(t*1.3)*.012,-sweep*.045+Math.sin(t*2.6)*.012);
   // Two phases: active wingbeats, then a controlled partially folded dive.
   // Smooth downstroke and quicker recovery upstroke; amplitude diminishes into the dive.
   const phase=t*4.8;
   const cycle=Math.sin(phase);
   const stroke=cycle>=0?Math.pow(cycle,.82):-Math.pow(-cycle,1.22);
   const flap=(stroke+.12*Math.sin(phase*2-.5))*(.17*(1-smooth*.70));
   const glide=Math.sin(t*1.4)*.035;
   const featherFlex=Math.sin(t*3.8)*.018;
   if(mixer)mixer.update(Math.min(Math.max(0,t-lastFrameTime),.05)*(1-smooth*.25));
   lastFrameTime=t;
   for(const wing of [bird.userData.left,bird.userData.right]){
     const side=wing.sign;
     wing.shoulder.rotation.z=side*(flap+glide-smooth*.20);
     wing.shoulder.rotation.y=side*(smooth*.10);
     wing.wrist.rotation.z=side*(-flap*.42-smooth*.24+Math.sin(phase-.55)*.025);
     wing.wrist.rotation.x=-smooth*.13+featherFlex;
     // A small phase-lag ripple lets individual vanes flex instead of moving as one rigid plate.
     wing.primaryFeathers.forEach((feather,i)=>{
       feather.rotation.x=Math.sin(phase-.45-i*.045)*(.025+.016*i/18)*(1-smooth*.5);
     });
     wing.secondaryFeathers.forEach((feather,i)=>{
       feather.rotation.x=Math.sin(phase-.20-i*.025)*.012*(1-smooth*.5);
     });
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