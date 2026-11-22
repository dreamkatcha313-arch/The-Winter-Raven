/* Winter Raven development lab — deterministic pure geometry/motion utilities.
   NOT loaded by the production homepage. Validate visually before promotion. */
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const smoothstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
export function seededRandom(seed){let x=seed>>>0;return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296)}
export function wingChord(u){u=clamp(u,0,1);return .31*(1-u)+.055*u}
export function featherTaper(u){u=clamp(u,0,1);return Math.pow(Math.sin(Math.PI*(.02+.96*u)),.72)}
export function featherCamber(u){return .026*Math.sin(Math.PI*clamp(u,0,1))}
export function featherVane(u,side=1){return {x:u,z:-.11*u*u,y:featherCamber(u),width:featherTaper(u)*(side<0?.88:1.12)}}
export function primarySpread(i,count=7){const u=i/Math.max(1,count-1);return -.21-u*.22}
export function secondaryLength(i,count=16){const u=i/Math.max(1,count-1);return .40+.20*Math.sin(u*Math.PI)}
export function tailWedge(i,count=11){const u=Math.abs(i-(count-1)/2)/((count-1)/2);return .42-.15*u}
export function wingbeat(t){const x=Math.sin(t*4.8);return (x>=0?Math.pow(x,.82):-Math.pow(-x,1.22))+.12*Math.sin(t*9.6-.5)}
export function wristLag(t){return Math.sin(t*4.8-.55)*.025}
export function featherLag(t,i){return Math.sin(t*4.8-.45-i*.045)*(.025+.016*i/18)}
export function diveFold(progress){return smoothstep(.38,1,progress)}
export function flightPath(progress){const p=clamp(progress,0,1),d=diveFold(p),s=Math.sin(p*Math.PI*1.35);return {x:s*.12,y:.48-d*.42+Math.sin(p*Math.PI)*.04,z:-p*2.4}}
export function windGust(t){return Math.sin(t*.42)*.64+Math.sin(t*1.13+.7)*.24}
export function windIntegral(t){return .64*(1-Math.cos(t*.42))/.42+.24*(Math.cos(.7)-Math.cos(t*1.13+.7))/1.13}
export function snowDepth(z){const d=clamp(z,0,1);return {parallax:.32+d*1.35,opacity:.12+.44*d,size:.45+d*1.4}}
export function snowPosition(p,t){const d=snowDepth(p.depth),y=((p.y+t*(.065+.105*p.speed)*d.parallax)%1.28+1.28)%1.28-.14;const x=((p.x+.043*windIntegral(t)*d.parallax)%1.25+1.25)%1.25-.125;return {x,y}}
export function performanceBudget(width,reduced=false){return reduced?60:width<=600?300:520}
export function qualityGate({skinned,bones,textured,triangles,flightClip}){return skinned>=1&&bones>=8&&textured>=1&&triangles>=3000&&Boolean(flightClip)}
