import * as r from './raven-lab.js';
const assert=(v,m)=>{if(!v)throw Error(m)};
const near=(a,b)=>Math.abs(a-b)<1e-8;
const rng=r.seededRandom(5);
const cases=[
['01 deterministic random',()=>near(r.seededRandom(5)(),rng())],
['02 clamp',()=>r.clamp(-1,0,1)===0],
['03 smoothstep endpoints',()=>r.smoothstep(0,1,0)===0&&r.smoothstep(0,1,1)===1],
['04 wing chord tapers',()=>r.wingChord(0)>r.wingChord(1)],
['05 feather taper',()=>r.featherTaper(.5)>r.featherTaper(0)],
['06 camber',()=>r.featherCamber(.5)>r.featherCamber(0)],
['07 asymmetric vanes',()=>r.featherVane(.5,-1).width<r.featherVane(.5,1).width],
['08 primary spread',()=>r.primarySpread(6)<r.primarySpread(0)],
['09 secondary length',()=>r.secondaryLength(8)>r.secondaryLength(0)],
['10 wedge tail',()=>r.tailWedge(5)>r.tailWedge(0)],
['11 wingbeat finite',()=>Number.isFinite(r.wingbeat(1))],
['12 wrist lag finite',()=>Number.isFinite(r.wristLag(1))],
['13 feather lag varied',()=>r.featherLag(1,0)!==r.featherLag(1,12)],
['14 dive fold',()=>r.diveFold(.1)===0&&r.diveFold(1)===1],
['15 flight recession',()=>r.flightPath(1).z<r.flightPath(0).z],
['16 gust finite',()=>Number.isFinite(r.windGust(5))],
['17 wind integral continuity',()=>Math.abs(r.windIntegral(1.001)-r.windIntegral(1))<.002],
['18 depth parallax',()=>r.snowDepth(1).parallax>r.snowDepth(0).parallax],
['19 snow position',()=>Number.isFinite(r.snowPosition({x:.3,y:.4,depth:.5,speed:1},2).x)],
['20 mobile budget and model gate',()=>r.performanceBudget(400)===300&&!r.qualityGate({skinned:0,bones:0,textured:0,triangles:100,flightClip:false})]
];
for(const [name,fn] of cases){assert(fn(),name);console.log('PASS',name)}
console.log('20/20 raven lab checks passed');
