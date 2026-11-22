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
 ellipsoid(bird,black,0,.45,.27,.34,.38,.35);
 ellipsoid(bird,edge,0,.63,.56,.20,.20,.12);
 const bill=new THREE.Mesh(new THREE.ConeGeometry(.17,.54,5),beak);
 bill.rotation.x=Math.PI/2;bill.position.set(0,.41,.78);bird.add(bill);
 for(const sign of [-1,1]){
   ellipsoid(bird,eye,sign*.235,.54,.55,.068,.065,.04);
   const highlight=ellipsoid(bird,edge,sign*.215,.565,.594,.017,.018,.008);
   const wing=new THREE.Group();wing.position.set(sign*.32,.12,0);bird.add(wing);
   const cover=ellipsoid(wing,black,sign*.47,-.02,-.05,.64,.15,.24);cover.rotation.z=-sign*.17;
   // Overlapping tapered feather vanes give the wings an articulated silhouette.
   for(let i=0;i<13;i++){
     const u=i/12;
     const length=.72+Math.sin(u*Math.PI)*.38;
     const geometry=new THREE.BufferGeometry();
     const x=sign*(.12+u*1.12);
     const verts=new Float32Array([x,0,-.03,x+sign*.105,-.025,-.10,x+sign*(.13+length*.40),-.18-length*.22,-.20,x+sign*.105,-.025,-.10,x+sign*(.13+length*.40),-.18-length*.22,-.20,x+sign*.18,-.15,-.01]);
     geometry.setAttribute('position',new THREE.BufferAttribute(verts,3));geometry.computeVertexNormals();
     wing.add(new THREE.Mesh(geometry,i%3===0?edge:featherMat));
   }
   bird.userData[sign<0?'left':'right']=wing;
   for(let i=0;i<4;i++){
     const tail=ellipsoid(bird,featherMat,sign*(.07+i*.05),-.86,-.29,.055,.43,.075);
     tail.rotation.z=sign*(.1+i*.11)
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
   bird.position.set(sweep*.85,-smooth*1.25+Math.sin(p*Math.PI)*.15,0);
   bird.rotation.set(-smooth*.48,-sweep*.18,-sweep*.15);
   const flap=Math.sin(t*5.5)*(.16*(1-smooth*.85));
   bird.userData.left.rotation.z=-flap-smooth*.33;
   bird.userData.right.rotation.z=flap+smooth*.33;
   const scale=(innerWidth<600?.68:1.05)*(1+p*p*.85);
   bird.scale.setScalar(scale);
   renderer.render(scene,camera);
   requestAnimationFrame(frame)
 }
 frame();
 window.__winterRaven3D={dispose};
})();