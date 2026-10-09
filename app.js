import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { addInteriors } from './interiors.js';
import { renovateSet } from './realism.js';

const $ = id => document.getElementById(id);
const mobile = matchMedia('(pointer:coarse)').matches;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#aab3a5');
scene.fog = new THREE.FogExp2(0xb8b5a8,0.006);
const camera = new THREE.PerspectiveCamera(61, innerWidth/innerHeight,.08,300);
// Start INSIDE the courtyard, past the gate and facing its iconic set.
camera.position.set(0,1.68,8.5);
let yaw=0,pitch=-.055,night=false,entered=false,paused=false,ambientOn=false,tourIndex=-1,nearby=null;
camera.rotation.order='YXZ';
camera.rotation.set(pitch,yaw,0);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.23;
renderer.outputColorSpace=THREE.SRGBColorSpace;
$('scene').appendChild(renderer.domElement);
const clock=new THREE.Clock();
const material=(color,roughness=1,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const seed=734321;
let rndState=seed;
function rnd(){rndState=(rndState*1664525+1013904223)>>>0;return rndState/4294967296}
const r=(min,max)=>min+(max-min)*rnd();
const pale=material('#dcc49e'),brick=material('#9a4d37'),woodDark=material('#493c35'),metal=material('#292c2a',.47,.65);
function noiseTexture(type){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
 if(type==='plaster'){
  ctx.fillStyle='#e6d6b6';ctx.fillRect(0,0,512,512);
  for(let i=0;i<52000;i++){const v=Math.floor(r(50,220));ctx.fillStyle='rgba('+[v,Math.floor(v*.89),Math.floor(v*.71)].join(',')+','+r(.025,.1)+')';ctx.fillRect(r(0,512),r(0,512),r(1,6),r(1,5))}
  for(let i=0;i<36;i++){ctx.strokeStyle='rgba(91,70,49,'+r(.05,.15)+')';ctx.lineWidth=r(.4,1.5);ctx.beginPath();let x=r(0,512),y=r(0,512);ctx.moveTo(x,y);for(let j=0;j<5;j++){x+=r(-10,10);y+=r(4,19);ctx.lineTo(x,y)}ctx.stroke()}
 }else if(type==='floor'){
  ctx.fillStyle='#bcb5a6';ctx.fillRect(0,0,512,512);
  for(let row=0;row<8;row++){for(let col=-1;col<9;col++){let x=col*66+(row%2)*33,y=row*66;const v=Math.floor(r(158,200));ctx.fillStyle='rgb('+v+','+(v-5)+','+(v-15)+')';ctx.fillRect(x+2,y+2,63,63);ctx.strokeStyle='#999184';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,64,64)}}
  for(let i=0;i<52000;i++){const v=Math.floor(r(70,240));ctx.fillStyle='rgba('+v+','+v+','+v+','+r(.015,.08)+')';ctx.fillRect(r(0,512),r(0,512),r(.5,3),r(.5,3))}
 }else if(type==='wood'){
  ctx.fillStyle='#805533';ctx.fillRect(0,0,512,512);
  for(let i=0;i<800;i++){const x=r(0,512);ctx.strokeStyle='rgba('+Math.floor(r(29,152))+',22,12,'+r(.03,.14)+')';ctx.lineWidth=r(.4,4);ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+r(-17,17),160,x+r(-18,18),340,x+r(-11,11),512);ctx.stroke()}
  for(let i=0;i<14;i++){const x=i*37;ctx.fillStyle='rgba(24,12,10,.27)';ctx.fillRect(x,0,3,512)}
 }
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const texPlaster=noiseTexture('plaster'),texFloor=noiseTexture('floor'),texWood=noiseTexture('wood');
const ochre=new THREE.MeshStandardMaterial({map:texPlaster,color:'#d8a54e',roughness:1});
const beige=new THREE.MeshStandardMaterial({map:texPlaster,color:'#dcc5a1',roughness:1});
const greenStucco=new THREE.MeshStandardMaterial({map:texPlaster,color:'#a3bea3',roughness:1});
const redStucco=new THREE.MeshStandardMaterial({map:texPlaster,color:'#bd6d56',roughness:1});
const floorMat=new THREE.MeshStandardMaterial({map:texFloor,roughness:.97});
const paintedWood=new THREE.MeshStandardMaterial({map:texWood,color:'#8b6555',roughness:.85});
const roofMat=material('#9b6a49');
const terracotta=material('#925c42');
function mesh(geometry,mat,parent=scene){const o=new THREE.Mesh(geometry,mat);parent.add(o);o.castShadow=true;o.receiveShadow=true;return o}
function box(w,h,d,x,y,z,mat,parent=scene){const o=mesh(new THREE.BoxGeometry(w,h,d),mat,parent);o.position.set(x,y,z);return o}
function cyl(top,bottom,height,x,y,z,mat,segments=18){const o=mesh(new THREE.CylinderGeometry(top,bottom,height,segments),mat);o.position.set(x,y,z);return o}
function orb(rad,x,y,z,mat){let o=mesh(new THREE.SphereGeometry(rad,16,12),mat);o.position.set(x,y,z);return o}
function barBetween(ax,ay,az,bx,by,bz,rad,mat){
 const a=new THREE.Vector3(ax,ay,az),b=new THREE.Vector3(bx,by,bz),d=new THREE.Vector3().subVectors(b,a);
 const o=mesh(new THREE.CylinderGeometry(rad,rad,d.length(),8),mat);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;
}
function sign(text,width=.65,height=.42,color='#eedbb1'){
 const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#4a3930';ctx.fillRect(0,0,256,128);ctx.strokeStyle='#877868';ctx.lineWidth=5;ctx.strokeRect(5,5,246,118);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.font='bold 75px Georgia';ctx.fillText(text,128,66);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 const o=mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshStandardMaterial({map:t,roughness:.86,side:THREE.DoubleSide}));return o;
}
function stuccoWall(x,z,w,h,mat,d=.38){return box(w,h,d,x,h/2,z,mat)}
// Opening doors and physical passable doorframes: real walk-in apartments.
const entryDoors=[];
function door(x,z,num,col='#625048',y=0,turn=0){
 const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=turn;scene.add(group);
 const hinge=new THREE.Group();hinge.position.x=-.76;group.add(hinge);
 const leaf=(w,h,d,xx,yy,zz,mat)=>box(w,h,d,xx,yy,zz,mat,hinge);
 leaf(1.48,2.67,.13,.76,1.38,0,material(col,.8));
 for(let yy of [.7,1.76]){
   leaf(1.17,.84,.03,.76,yy,.085,material('#4c372b',.85));
   leaf(1.06,.72,.038,.76,yy,.113,material(col,.89));
 }
 // Plain white house numbers painted on wooden door, not a detached plaque.
 const canvas=document.createElement('canvas');canvas.width=160;canvas.height=110;
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,160,110);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#eee4d0';ctx.font='bold 74px Georgia';
 ctx.fillText(String(num),80,56);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
 const plate=mesh(new THREE.PlaneGeometry(.54,.35),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.93,depthWrite:false,side:THREE.DoubleSide}),hinge);
 plate.position.set(.76,2.2,.137);
 for(const xx of [-.8,.8]) box(.105,2.82,.23,xx,1.41,.04,paintedWood,group);
 box(1.73,.11,.27,0,2.8,.04,paintedWood,group);
 box(1.92,.12,.57,0,2.94,.04,terracotta,group);
 const knob=mesh(new THREE.SphereGeometry(.057,12,8),material('#ab925f',.35,.65),hinge);knob.position.set(1.35,1.25,.16);
 box(1.7,.06,.44,0,.03,.15,material('#a9a092'),group);
 entryDoors.push({num,x,z,pivot:hinge,angle:0});
 return group;
}
function windowAt(x,z,wide=1.7,turn=0,y=2){
 let g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=turn;scene.add(g);
 box(wide+.24,1.6,.13,0,0,0,material('#b7aa8d'),g);
 box(wide,1.4,.045,0,0,.09,material('#2c4140',.25),g);
 const glass=new THREE.MeshPhysicalMaterial({color:'#809b97',roughness:.14,metalness:.28,transparent:true,opacity:.72});
 box(wide-.1,1.3,.017,0,0,.13,glass,g);
 const frame=material('#4d392f');
 box(.095,1.45,.09,0,0,.17,frame,g);box(wide,.09,.09,0,0,.17,frame,g);
 for(const xx of [-wide/2+.03,wide/2-.03]) box(.08,1.56,.09,xx,0,.16,frame,g);
 for(const yy of [-.75,.75]) box(wide+.2,.09,.18,0,yy,.16,frame,g);
 box(wide+.32,.13,.3,0,-.86,.21,beige,g);
 return g;
}
const ground=mesh(new THREE.PlaneGeometry(90,110),floorMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.015;
const patio=box(26,.08,26,0,-.065,0,material('#a89c87'));patio.receiveShadow=true; // texture floor remains visible on top
for(let i=0;i<18;i++){const x=r(-11,11),z=r(-10,11);const stain=mesh(new THREE.CircleGeometry(r(.17,.6),12),new THREE.MeshBasicMaterial({color:'#777563',transparent:true,opacity:r(.03,.085),depthWrite:false}));stain.rotation.x=-Math.PI/2;stain.position.set(x,.014,z)}
// First patio architecture: left wall, right wall, front with open entrance
box(.48,7.2,27,-12.15,3.6,.2,greenStucco);
box(.48,7.2,27,12.15,3.6,.2,ochre);
box(8.95,7.2,.5,-7.6,3.6,13.35,beige);
box(8.95,7.2,.5,7.6,3.6,13.35,beige);
box(6.35,2.45,.5,0,5.975,13.35,beige);
box(.67,5.3,.75,-3.1,2.65,13.35,material('#ccb083'));
box(.67,5.3,.75,3.1,2.65,13.35,material('#ccb083'));
// The old gate was modeled as two huge opaque slabs, causing the black
// triangle that obscured the right side of the screenshot. Keep slim ironwork
// by the entrance instead, outside the main line of sight.
for(let n=0;n<5;n++){
 const dx=n*.16;
 barBetween(-3.04+dx,.23,13.04,-3.04+dx,3.30,13.04,.019,metal);
 barBetween(3.04-dx,.23,13.04,3.04-dx,3.30,13.04,.019,metal);
}
// Rear facade includes gap between 71 & 72
// Facades with real human-sized openings under their door frames.
// 14 and 71: separate fragments instead of one impassable facade.
box(4.30,7.35,.55,-9.95,3.675,-12.1,greenStucco);
box(4.15,7.35,.55,-3.825,3.675,-12.1,greenStucco);
box(3.02,7.35,.55,1.64,3.675,-12.1,ochre);
// lintels above door openings (2.85 m clearance)
box(1.9,4.50,.55,-6.85,5.10,-12.1,greenStucco);
box(1.9,4.50,.55,-.8,5.10,-12.1,ochre);
// Casa 72 — opening around door 72
box(2.09,7.35,.55,7.035,3.675,-12.1,ochre);
box(2.28,7.35,.55,11.07,3.675,-12.1,ochre);
box(1.85,4.50,.55,9.0,5.10,-12.1,ochre);
box(2.8,2.3,.55,4.3,6.2,-12.1,ochre);
box(.34,4.2,.55,2.9,2.1,-12.1,beige);
box(.34,4.2,.55,5.7,2.1,-12.1,ochre);
box(1.04,.25,.67,4.3,4.18,-12.05,roofMat);
box(25.5,.3,1.12,0,7.4,-11.87,roofMat);
box(25.8,.23,1.55,0,7.61,-12,material('#876a53'));
for(const xx of [-9.6,-4.6,.9,7.65,11.2]){box(.22,7.2,.67,xx,3.65,-11.87,material('#c9a77c'))}
// wall base skirting red
// Skirting must also leave thresholds fully open.
box(4.27,.82,.11,-9.96,.42,-11.74,redStucco);
box(4.11,.82,.11,-3.83,.42,-11.74,redStucco);
box(2.99,.82,.11,1.63,.42,-11.74,redStucco);
box(2.06,.82,.11,7.04,.42,-11.74,redStucco);
box(2.23,.82,.11,11.08,.42,-11.74,redStucco);
box(.14,.83,26.5,-11.84,.42,0,redStucco);
box(.14,.83,26.5,11.84,.42,0,redStucco);
// Door facades
door(-6.85,-11.76,14,'#584a42');
door(-.8,-11.76,71,'#584c47');
door(9.0,-11.76,72,'#51483e');
windowAt(-4.35,-11.75,1.55,0,2.1);
windowAt(11.0,-11.75,1.22,0,2.3);
windowAt(-7.6,13.02,1.6,Math.PI,3.95);
// stairway to #23 at left
const stairStone=material('#777574'),stairFront=material('#956955');
for(let i=0;i<13;i++){let y=(i+1)*.245;let z=-1.9-i*.56;box(2.84,y,.565,-9.72,y/2,z,stairStone);box(.22,y+.09,.565,-11.26,(y+.09)/2,z,stairFront)}
box(3.4,.22,2,-9.72,3.28,-10.65,stairStone);
barBetween(-8.13,.25,-2,-8.13,3.85,-9.3,.035,metal);
barBetween(-11.35,.25,-2,-11.35,3.85,-9.3,.035,metal);
for(let i=0;i<8;i++){let z=-2-i*.89,y=.47+i*.43;barBetween(-8.13,y,z,-8.13,y+1.06,z,.016,metal)}
door(-9.75,-11.76,23,'#61514d',3.29);
box(3.9,.27,1.2,-9.8,3.68,-11.6,material('#ad957a'));
// Left facade details
windowAt(-11.78,4.8,1.4,Math.PI/2,2.5);
windowAt(11.78,2.1,1.9,-Math.PI/2,2.6);
box(25.8,.25,.7,0,6.15,-11.8,terracotta);
for(let j=0;j<8;j++){const xx=-11.1+j*3.1;box(.08,1.75,.08,xx,5.6,-11.47,material('#9f8467'))}
// barrels built via lathe with stave details
const barrelWood=new THREE.MeshStandardMaterial({map:texWood,color:'#9a6947',roughness:.85,side:THREE.DoubleSide});
function barrel(x,z,s=1){
 let g=new THREE.Group();g.position.set(x,.015,z);g.scale.setScalar(s);scene.add(g);
 const profile=[[.51,0],[.57,.12],[.64,.35],[.7,.72],[.66,1.15],[.58,1.55],[.54,1.65]].map(p=>new THREE.Vector2(...p));
 const body=mesh(new THREE.LatheGeometry(profile,32),barrelWood,g);body.castShadow=true;
 for(const y of [.14,.58,1.13,1.51]){const ring=mesh(new THREE.TorusGeometry(.62,.036,7,38),metal,g);ring.rotation.x=Math.PI/2;ring.position.y=y;if(y===.58)ring.scale.set(1.095,1.095,1)}
 for(let i=0;i<15;i++){const a=i/15*Math.PI*2;const radius=.62;let slat=box(.018,1.48,.035,Math.cos(a)*radius,.78,Math.sin(a)*radius,material('#34241d'),g);slat.rotation.y=-a;}
 const rim=mesh(new THREE.TorusGeometry(.56,.052,8,32),woodDark,g);rim.rotation.x=Math.PI/2;rim.position.y=1.66;
 const inner=mesh(new THREE.CircleGeometry(.52,32),material('#29241e'),g);inner.rotation.x=-Math.PI/2;inner.position.y=1.65;
 return g;
}
barrel(-.45,-1.4,1.1);
barrel(-10.65,8.5,.77);
function planter(x,z,scale=1){
 const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
 const pot=mesh(new THREE.CylinderGeometry(.35,.24,.57,12),terracotta,g);pot.position.y=.31;
 const soil=mesh(new THREE.CircleGeometry(.31,12),material('#393a29'),g);soil.rotation.x=-Math.PI/2;soil.position.y=.605;
 const greenM=[material('#436b3a',.9),material('#557b40',.9),material('#638349',.9)];
 for(let i=0;i<17;i++){
  let a=i/17*Math.PI*2+r(-.1,.1),reach=r(.43,1.04),height=r(.5,1.1);
  const from=[0,.58,0],to=[Math.cos(a)*reach,.58+height,Math.sin(a)*reach];
  barBetween(from[0],from[1],from[2],to[0],to[1],to[2],.014,greenM[i%3]).position.add(new THREE.Vector3(x,0,z)); // separate scene stems follow world
  const l=mesh(new THREE.SphereGeometry(.12,8,6),greenM[i%3],g);l.scale.set(.45,2.6,.85);l.position.set(Math.cos(a)*reach,.58+height,Math.sin(a)*reach);l.rotation.z=-Math.cos(a)*.65;
 }
 return g;
}
for(const p of [[-11.2,-11,.95],[-10.3,-10.9,.7],[-5.45,-11.5,.53],[-3.1,-11.4,.68],[1.5,-11.5,.8],[6,-11.4,1],[10.4,-11.45,.58],[11.1,-2.7,.8],[11.12,8.4,1],[-11.2,10,.8],[-11.3,-2.2,.7]]) planter(...p);
// Washing basin under stairs
box(1.8,.75,.82,-7.38,.94,-9.73,material('#bdbbb2'));
box(2.05,.19,1.07,-7.38,1.35,-9.73,material('#d4d1c9'));
box(1.52,.07,.62,-7.38,1.45,-9.73,material('#868e87'));
barBetween(-7.38,1.5,-10.07,-7.38,2.04,-10.07,.045,metal);
barBetween(-7.38,2.04,-10.07,-7.11,2.04,-10.07,.04,metal);
cyl(.15,.12,.25,-8.35,.15,-9.6,material('#7e8580'));
// Clay crates and props
function crate(x,z,a=0){const g=new THREE.Group();g.position.set(x,.24,z);g.rotation.y=a;scene.add(g);const m=material('#806242');for(const y of [-.19,.19])for(let i=0;i<3;i++)box(.94,.1,.09,0,y,-.38+i*.38,m,g);for(const zz of [-.44,.44])for(let i=0;i<4;i++)box(.18,.56,.06,-.32+i*.22,0,zz,m,g);return g;}
crate(-11.05,2.5,.12);crate(10.85,-10.9,.3);
function ball(x,y,z,rad){const m=[];for(const c of ['#cf9c3c','#498d9d','#cb4e39','#f0d179','#7f9a53','#e5a35b'])m.push(material(c,.8));const ob=mesh(new THREE.SphereGeometry(rad,24,16,0,Math.PI*2,0,Math.PI),m[0]);ob.position.set(x,y,z);for(let i=0;i<6;i++){const arc=mesh(new THREE.SphereGeometry(rad*1.005,16,12,i*Math.PI/3,Math.PI/3),m[i]);arc.position.set(x,y,z)}}
ball(-5.6,.42,-6,.42);
// Hanging laundry and clothes line
barBetween(-11.5,3.81,-9.28,10.5,4.00,-9.28,.009,material('#897965'));
function garment(x,y,z,color,w=.87,h=1.1){
 const mat=new THREE.MeshStandardMaterial({color,roughness:1,side:THREE.DoubleSide});
 const shape=new THREE.Shape();shape.moveTo(-w*.34,0);shape.lineTo(w*.34,0);shape.lineTo(w*.65,-.25);shape.lineTo(w*.46,-.48);shape.lineTo(w*.38,-.34);shape.lineTo(w*.43,-h);shape.lineTo(-w*.43,-h);shape.lineTo(-w*.38,-.34);shape.lineTo(-w*.46,-.48);shape.lineTo(-w*.65,-.25);shape.closePath();
 const g=mesh(new THREE.ShapeGeometry(shape),mat);g.position.set(x,y,z);g.rotation.y=r(-.18,.18);return g;
}
const hanging=[garment(-3.6,3.86,-9.28,'#bf7b75'),garment(5.85,3.96,-9.28,'#d3bba0'),garment(7.38,3.98,-9.28,'#7b998b'),garment(9.1,4.0,-9.28,'#e2cbb0')];
for(let x of [-3.72,-3.47,5.72,5.97,7.26,7.51,9.01,9.21])box(.04,.16,.065,x,3.95,-9.28,woodDark);
// Wall lanterns
const lanterns=[],lampLights=[];
function lantern(x,y,z){const m=material('#292b28',.5,.65);box(.3,.43,.26,x,y,z,m);const bulb=box(.18,.29,.12,x,y,z+.15,new THREE.MeshStandardMaterial({color:'#ffc88a',emissive:'#e8a95a',emissiveIntensity:.18,roughness:.45}));const light=new THREE.PointLight(0xffb977,0,12,2);light.position.set(x,y,z+1);scene.add(light);lanterns.push(bulb);lampLights.push(light)}
lantern(-3.3,3.65,-11.56);lantern(6.6,3.8,-11.52);lantern(-11.48,3.8,7);
// Exterior second patio: corridor through rear wall
// Patio 1 is fully separate: a narrow corridor runs backward between 71/72.
// At its blind end, the visitor must turn RIGHT; no straight sightline to the fountain.
box(.38,5.2,11.65,3.07,2.6,-17.74,greenStucco);
// Openable views between Don Ramón's window and the passage.
box(.38,5.2,3.05,5.85,2.6,-13.475,ochre);
box(.38,5.2,2.45,5.85,2.6,-18.275,ochre);
box(.38,1.12,2.1,5.85,.56,-16.05,ochre);
box(.38,2.05,2.1,5.85,4.175,-16.05,ochre);
windowAt(5.62,-16.05,2.02,-Math.PI/2,2.1);
box(3.1,.33,10.6,4.47,5.15,-17.1,roofMat);
for(let i=0;i<5;i++){const z=-13.2-i*2;box(2.85,.11,.17,4.46,4.5,z,material('#7d6148'))}
// Physical 90-degree passage: first turn east, then enter the distant second patio.
// Its south wall makes the fountain invisible from the main courtyard.
box(12.2,.10,3.65,10.10,-.04,-21.62,floorMat);
box(10.77,4.7,.36,11.21,2.35,-19.77,beige); // north wall
box(10.86,4.7,.36,8.65,2.35,-23.46,ochre); // south wall, ends at x=14.1
box(11.35,.23,3.85,10.85,4.64,-21.59,roofMat); // covered roof
for(let i=0;i<7;i++)box(.095,.11,3.65,5.85+i*1.73,4.40,-21.62,paintedWood);
// Dead end directly ahead; moving east past x=5.8 is the route.
box(2.85,4.65,.35,4.45,2.33,-23.48,greenStucco);
// Keep the 2nd patio physically offset (not an open extension behind the first).
const secondaryStart = scene.children.length;
box(18,.12,18,4.45,-.055,-28,floorMat);
box(.4,6,19,-4.75,3,-28,ochre);
box(.4,6,19,13.6,3,-28,greenStucco);
box(18.6,6,.48,4.4,3,-37.2,beige);
box(7.7,6,.44,-1.05,3,-19.1,greenStucco);
box(7.5,6,.44,9.88,3,-19.1,greenStucco);
box(18.3,.32,.92,4.4,6.1,-37.2,roofMat);
door(-1.35,-36.84,11,'#58473f');
door(8.3,-36.84,21,'#58473f');
windowAt(1.2,-36.8,2.1,0,2.3);
for(let i=0;i<12;i++){const a=i*Math.PI*2/12;const xx=4.4+6.5*Math.cos(a),zz=-28.5+6.5*Math.sin(a);if(Math.abs(xx-4.4)>1.5)planter(xx,zz,r(.6,.95))}
// Offset the second patio 12m EAST and 5m NORTH-SOUTH away from the first.
// It remains a separate 18x18 enclosed courtyard with its own doors.
const secondaryOffset={x:12,z:-5};
for(const obj of scene.children.slice(secondaryStart)){
 obj.position.x+=secondaryOffset.x;
 obj.position.z+=secondaryOffset.z;
}
// Historical second patio: upper galleries seen in later episodes, separated from first.
const galleryWood=material('#705340'),galleryIron=material('#514c43',.55,.55);
for(let i=0;i<12;i++){
 const gx=8.55+i*1.49;
 box(1.39,.22,1.45,gx,4.20,-40.55,galleryWood);
 barBetween(gx-.64,4.39,-39.85,gx-.64,5.48,-39.85,.028,galleryIron);
 barBetween(gx+.64,4.39,-39.85,gx+.64,5.48,-39.85,.028,galleryIron);
}
barBetween(7.9,5.49,-39.85,25.0,5.49,-39.85,.036,galleryIron);
const fountainStart=scene.children.length;
// Fully explorable apartments 14, 71, 72, with period-specific furniture.
const interiorWorld=addInteriors({THREE,scene,mesh,box,cyl,material,barBetween});
const water=new THREE.MeshPhysicalMaterial({color:'#78a49f',roughness:.1,metalness:.12,transparent:true,opacity:.82,clearcoat:.9});
cyl(2.3,2.4,.6,4.4,.28,-29.1,material('#b6ae96'),40);
cyl(1.92,1.92,.08,4.4,.63,-29.1,water,40);
cyl(.55,.8,1.3,4.4,1.25,-29.1,material('#bdb49d'),26);
cyl(.73,.5,.2,4.4,2.0,-29.1,material('#c9c3a9'),26);
const ripple1=mesh(new THREE.TorusGeometry(.55,.015,5,48),new THREE.MeshBasicMaterial({color:'#d1f0e7',transparent:true,opacity:.5}));ripple1.rotation.x=Math.PI/2;ripple1.position.set(4.4,.695,-29.1);
const ripple2=ripple1.clone();scene.add(ripple2);ripple2.position.set(4.4,.698,-29.1);
// Fountain meshes are generated after home interiors: move only these fountain objects.
for(const obj of scene.children.slice(fountainStart)){
 obj.position.x+=secondaryOffset.x;
 obj.position.z+=secondaryOffset.z;
}
// Distinct visual landmarks in the second patio.
const otherPatioSign=sign('II',.72,.43);
otherPatioSign.position.set(16.4,3.12,-41.75);
// Updated studio-era set: cracked flagstones, real curtain lace, stained plaster,
// flowering staircase, hanging laundry and detailed period fittings.
const version2=renovateSet({
 THREE,scene,renderer,box,mesh,cyl,barBetween,material,hanging,lanterns,
 materials:{greenStucco,ochre,beige,redStucco,floorMat,wood:paintedWood,metal}
});
// Secondary patio features
barrel(22.85,-37.5,.86);
crate(8.2,-37,.55);
const sun=new THREE.DirectionalLight(0xffe4bd,2.7);sun.position.set(-19,35,19);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-50;sun.shadow.camera.right=50;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.bias=-.00025;sun.shadow.normalBias=.018;scene.add(sun,sun.target);sun.target.position.set(0,0,-12);
const hemi=new THREE.HemisphereLight(0xd8e0de,0x665944,1.3);scene.add(hemi);
const ambient=new THREE.AmbientLight(0xffffff,.23);scene.add(ambient);
// Sky dome
const sky=new THREE.Mesh(new THREE.SphereGeometry(170,32,16),new THREE.ShaderMaterial({
 side:THREE.BackSide,depthWrite:false,uniforms:{uNight:{value:0}},
 vertexShader:'varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec3 vPos; uniform float uNight;void main(){float h=clamp((normalize(vPos).y+0.14)*1.2,0.,1.);vec3 horizon=mix(vec3(0.80,0.70,0.55),vec3(0.11,0.17,0.27),uNight);vec3 zenith=mix(vec3(0.25,0.47,0.65),vec3(0.018,0.038,0.10),uNight);vec3 color=mix(horizon,zenith,pow(h,.75));gl_FragColor=vec4(color,1.);}'
}));scene.add(sky);
// Warm floating dust particles
const dustPositions=new Float32Array(420*3);for(let i=0;i<420;i++){dustPositions[i*3]=r(-13,13);dustPositions[i*3+1]=r(.4,7.4);dustPositions[i*3+2]=r(-13,13)}
const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:'#fff3d2',size:.023,transparent:true,opacity:.65,depthWrite:false}));scene.add(dust);
// Interaction points
const places=[
{id:'barril',title:'El barril del Chavo',sub:'Donde nacen las historias',cat:'EL RINCÓN MÁS QUERIDO',icon:'◉',x:-.45,z:-1.4,tx:0,tz:2.3,desc:'Mucho más que un barril: el refugio más famoso del patio. Una réplica artística de ese rincón donde el Chavo se escondía, pensaba y encontraba un poquito de tranquilidad.'},
{id:'14',title:'Departamento 14',sub:'Doña Florinda y Quico',cat:'LOS VECINOS',icon:'14',x:-6.85,z:-11.6,tx:-6.6,tz:-7.6,desc:'Aquí viven Doña Florinda y Quico. La puerta número 14, entre visitas del Profesor Jirafales y tardes de patio, forma parte inseparable de los recuerdos de la serie.'},
{id:'71',title:'Departamento 71',sub:'Doña Clotilde',cat:'LOS VECINOS',icon:'71',x:-.8,z:-11.6,tx:-.8,tz:-7.5,desc:'El hogar de Doña Clotilde, a quien los niños llamaban la Bruja del 71. Su puerta es uno de los lugares más reconocibles de la vecindad.'},
{id:'72',title:'Departamento 72',sub:'Don Ramón y la Chilindrina',cat:'LOS VECINOS',icon:'72',x:9,z:-11.6,tx:8.6,tz:-7.4,desc:'Puedes entrar caminando: paredes verde menta, mesa de cuadros, dos sillones desgastados sobre bloques, televisor antiguo, cajonera, fotos, banderines, guitarra y una pequeña habitación de la Chilindrina. Reconstrucción inspirada en distintas épocas del programa.'},
{id:'23',title:'Las escaleras y el 23',sub:'Arriba del patio',cat:'LA ARQUITECTURA',icon:'↗',x:-9.2,z:-7.9,tx:-7.1,tz:-4.7,desc:'Las escaleras de concreto, con barandal de hierro, conducen al departamento 23. El interior de esta vivienda no se mostraba habitualmente en la serie.'},
{id:'lavadero',title:'El lavadero',sub:'Historias entre cubetas',cat:'VIDA COTIDIANA',icon:'≈',x:-7.4,z:-9.7,tx:-5.0,tz:-7.8,desc:'El lavadero, las cubetas y las plantas recuerdan que la vecindad era un lugar de vida cotidiana, encuentros inesperados y pequeños enredos.'},
{id:'pasillo',title:'El corredor de conexión',sub:'Avanza y gira a la derecha',cat:'PATIO 1 → PATIO 2',icon:'→',x:4.45,z:-20.7,tx:4.45,tz:-18.2,desc:'Entre los departamentos 71 y 72 se abre el paso al segundo patio. Atrévete a caminar por él: hay otra sorpresa esperándote al final.'},
{id:'fuente',title:'El segundo patio',sub:'La fuente de la vecindad',cat:'PATIO 2 · TRAS EL PASILLO',icon:'✦',x:16.4,z:-34,tx:16.4,tz:-27.5,desc:'Este segundo patio incluye una fuente, evocando un espacio menos visto de la serie. La forma, materiales y proporciones son interpretaciones artísticas, no una reconstrucción exacta.'}
];
const visited=new Set(),markers=[];
for(const p of places){
 const glow=mesh(new THREE.SphereGeometry(.13,12,10),new THREE.MeshBasicMaterial({color:0xf3cf9c,transparent:true,opacity:.84,depthWrite:false}));glow.position.set(p.x,p.id==='23'?2.0:1.9,p.z);glow.castShadow=false;
 const ring=mesh(new THREE.TorusGeometry(.25,.018,6,24),new THREE.MeshBasicMaterial({color:0xf1d2a2,transparent:true,opacity:.65,depthWrite:false}));ring.rotation.x=Math.PI/2;ring.position.copy(glow.position);ring.position.y-=.4;ring.castShadow=false;markers.push({ring,glow,p});
}
const placesWrap=$('places');
for(let i=0;i<places.length;i++){const p=places[i];const b=document.createElement('button');b.className='place';b.dataset.id=p.id;b.innerHTML='<span class="place-num">'+String(i+1).padStart(2,'0')+'</span><span class="place-text"><strong>'+p.title+'</strong><small>'+p.sub+'</small></span><span class="place-arr">↗</span>';b.addEventListener('click',()=>{teleport(p);closeMap();});placesWrap.appendChild(b)}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>$('toast').classList.remove('show'),2600)}
function markVisited(p){visited.add(p.id);$('visitedCount').textContent=visited.size+' / 8';const b=document.querySelector('.place[data-id="'+p.id+'"]');if(b)b.classList.add('visited')}
function teleport(p){
 const interiorTarget=['14','71','72'].includes(p.id);
 const destX=interiorTarget?p.x:p.tx,destZ=interiorTarget?-13.55:p.tz;
 camera.position.set(destX,1.7,destZ);
 yaw=interiorTarget?0:Math.atan2(-(p.x-p.tx),-(p.z-p.tz));pitch=-.03;
 camera.rotation.set(pitch,yaw,0);$('areaTitle').innerHTML=p.id==='fuente'?'El otro patio<span>.</span>':'El patio de siempre<span>.</span>';
 $('areaText').textContent=p.sub;markVisited(p);toast('DESTINO: '+p.title.toUpperCase());
}
function openInfo(p){paused=true;if(document.pointerLockElement)document.exitPointerLock();markVisited(p);$('storyIndex').textContent=String(places.indexOf(p)+1).padStart(2,'0')+' / 08';$('storyIcon').textContent=p.icon;$('storyCategory').textContent=p.cat;$('storyTitle').textContent=p.title;$('storyDesc').textContent=p.desc;$('modalBackdrop').classList.add('open');}
function closeInfo(){$('modalBackdrop').classList.remove('open');paused=false}
function openMap(){if(!entered)return;paused=true;if(document.pointerLockElement)document.exitPointerLock();$('mapDrawer').classList.add('open');$('drawerBackdrop').classList.add('open');$('mapDrawer').setAttribute('aria-hidden','false')}
function closeMap(){$('mapDrawer').classList.remove('open');$('drawerBackdrop').classList.remove('open');$('mapDrawer').setAttribute('aria-hidden','true');paused=false}
$('mapBtn').addEventListener('click',()=>{if($('mapDrawer').classList.contains('open'))closeMap();else openMap()});
$('closeMap').onclick=closeMap;$('drawerBackdrop').onclick=closeMap;
$('closeModal').onclick=closeInfo;
// Clear shortcuts: the most-requested residence is one click away.
$('roomBtn')?.addEventListener('click',()=>{
 const p=places.find(place=>place.id==='72');
 if(!entered){$('intro').classList.add('leave');entered=true;if(mobile)$('mobileHud').classList.add('active');}
 teleport(p);
 toast('CASA 72 · YA PUEDES CAMINAR POR EL INTERIOR');
});
// Side-by-side historical reference (a PHOTO, not a fake render).
function showReference(){
 paused=true;if(document.pointerLockElement)document.exitPointerLock();
 $('referenceOverlay').classList.add('open');$('referenceOverlay').setAttribute('aria-hidden','false');
}
function hideReference(){
 $('referenceOverlay').classList.remove('open');$('referenceOverlay').setAttribute('aria-hidden','true');
 paused=false;
}
$('referenceBtn')?.addEventListener('click',showReference);
$('closeReference')?.addEventListener('click',hideReference);
$('referenceOverlay')?.addEventListener('click',e=>{if(e.target===$('referenceOverlay'))hideReference()});
$('referenceImage')?.addEventListener('error',e=>{if(e.target.dataset.fallback)return;e.target.dataset.fallback='true';e.target.src='https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/H622FSJ7NFFN5J4EAFV4VEEQLI.jpg'});
$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeInfo()});
$('nextPlace').onclick=()=>{let n=(places.indexOf(places.find(p=>p.title===$('storyTitle').textContent))+1)%places.length;closeInfo();teleport(places[n]);openInfo(places[n])};
$('timeBtn').onclick=()=>{
 night=!night;$('timeBtn').textContent=night?'☀':'☾';$('timeBtn').classList.toggle('selected',night);
 sun.intensity=night?.12:2.7;hemi.intensity=night?.42:1.3;ambient.intensity=night?.3:.23;renderer.toneMappingExposure=night?1.04:1.23;
 scene.fog.color.set(night?'#1b2633':'#b8b5a8');scene.background.set(night?'#192537':'#aab3a5');sky.material.uniforms.uNight.value=night?1:0;
 lampLights.forEach(l=>l.intensity=night?7:0);lanterns.forEach(b=>b.material.emissiveIntensity=night?3:.18);
 toast(night?'MODO NOCHE ACTIVADO':'VOLVIMOS A LA TARDE');
};
let audioContext=null,audioSource=null;
$('soundBtn').onclick=()=>{
 ambientOn=!ambientOn;$('soundBtn').classList.toggle('selected',ambientOn);
 if(!audioContext){audioContext=new (window.AudioContext||window.webkitAudioContext)();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.09;const src=audioContext.createBufferSource();src.buffer=buffer;src.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=340;const gain=audioContext.createGain();gain.gain.value=.15;src.connect(filter).connect(gain).connect(audioContext.destination);src.start();audioSource=src;}
 if(ambientOn)audioContext.resume();else audioContext.suspend();toast(ambientOn?'AMBIENTE ACTIVADO':'AMBIENTE EN SILENCIO');
};
$('tourBtn').onclick=()=>{tourIndex=(tourIndex+1)%places.length;const p=places[tourIndex];teleport(p);toast('VISITA GUIADA · '+(tourIndex+1)+'/8 · '+p.title)};
$('photoBtn').onclick=()=>{renderer.render(scene,camera);const link=document.createElement('a');link.download='mi-recuerdo-de-la-vecindad.png';link.href=renderer.domElement.toDataURL('image/png');link.click();toast('¡FOTO GUARDADA!')};
function showHelp(){$('helpModal').classList.add('open');paused=true;if(document.pointerLockElement)document.exitPointerLock()}
function hideHelp(){$('helpModal').classList.remove('open');paused=false}
$('helpBtn').onclick=showHelp;$('helpClose').onclick=hideHelp;$('helpDone').onclick=hideHelp;
function resetCamera(){
 camera.position.set(0,1.68,8.5);yaw=0;pitch=-.055;camera.rotation.set(pitch,yaw,0);
 toast('CÁMARA REUBICADA · PATIO DE 1975');
}
$('recenterBtn')?.addEventListener('click',resetCamera);
function enter(){resetCamera();entered=true;$('intro').classList.add('leave');if(mobile)$('mobileHud').classList.add('active');else renderer.domElement.requestPointerLock?.();toast('BIENVENIDO A LA VECINDAD · USA W A S D PARA CAMINAR')}
$('enterBtn').onclick=enter;
renderer.domElement.addEventListener('click',()=>{if(entered&&!mobile&&!paused&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.()});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement&&!paused){yaw-=e.movementX*.0022;pitch=Math.max(-.70,Math.min(.60,pitch-e.movementY*.00185))}});
const keys=new Set();
document.addEventListener('keydown',e=>{
 if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.repeat)return;
 if(e.code==='KeyE'&&entered&&!paused&&nearby)openInfo(nearby);
 if(e.code==='KeyR'&&entered){resetCamera()}
 if(e.code==='KeyM'&&entered){if($('mapDrawer').classList.contains('open'))closeMap();else openMap()}
 if(e.code==='Escape'){closeInfo();closeMap();hideHelp();hideReference()}
});
document.addEventListener('keyup',e=>keys.delete(e.code));
document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear()});
let joyX=0,joyY=0,joyId=null;
const joystick=$('joystick'),knob=$('joystickKnob');
joystick.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;joystick.setPointerCapture(joyId);joystickMove(e)});
function joystickMove(e){if(e.pointerId!==joyId)return;const rect=joystick.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;const dx=e.clientX-cx,dy=e.clientY-cy,m=Math.max(1,Math.hypot(dx,dy));joyX=dx/m*Math.min(1,m/35);joyY=dy/m*Math.min(1,m/35);knob.style.transform='translate('+(joyX*28)+'px,'+(joyY*28)+'px)'}
joystick.addEventListener('pointermove',joystickMove);
function joystickEnd(e){if(e.pointerId!==joyId)return;joyId=null;joyX=joyY=0;knob.style.transform='translate(0,0)'}
joystick.addEventListener('pointerup',joystickEnd);joystick.addEventListener('pointercancel',joystickEnd);
let touchLook=null;
renderer.domElement.addEventListener('pointerdown',e=>{if(!mobile||!entered)return;if(e.clientX<innerWidth*.36)return;touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!touchLook||touchLook.id!==e.pointerId)return;yaw-=(e.clientX-touchLook.x)*.007;pitch=Math.max(-.70,Math.min(.60,pitch-(e.clientY-touchLook.y)*.006));touchLook.x=e.clientX;touchLook.y=e.clientY});
renderer.domElement.addEventListener('pointerup',e=>{if(touchLook?.id===e.pointerId)touchLook=null});
$('mobileInteract').onclick=()=>{if(nearby)openInfo(nearby);else toast('ACÉRCATE A UNA PUERTA O A UN OBJETO BRILLANTE')};
const headSpace=1.7;
function whichApartment(x,z){
 if(z > -11.50||z < -19.01)return null;
 if(x>-10.83&&x<-3.79)return '14';
 if(x>-3.30&&x<2.42)return '71';
 if(x>6.12&&x<11.92)return '72';
 return null;
}
function allowed(x,z){
 // 1. Main courtyard (the original with the barrel). Doors 14,71,72 share its rear facade.
 if(z>=-11.48&&z<=12.2&&x>=-11.45&&x<=11.45){
  if(x<-8.05 && z<-2.1 && z>-10.8)return false; // staircase footprint
  if(Math.hypot(x+.45,z+1.4)<1.09)return false; // barrel
  return true;
 }
 // Thresholds: doors 14, 71, 72 and the CORRIDOR opening, between 71 and 72.
 if(z>=-12.57&&z< -11.48){
  return [[-6.85,.68],[-.8,.68],[9,.68],[4.45,1.13]].some(([cx,half])=>Math.abs(x-cx)<half);
 }
 // Rooms belong to first patio and cannot be reached by cutting through outer walls.
 if(whichApartment(x,z))return true;
 // 2. Narrow first corridor from the courtyard; turn RIGHT at its blind end.
 if(x>3.35&&x<5.55&&z<=-11.8&&z>=-23.14)return true;
 // 3. Covered transverse passage: its 90-degree turn blocks the patio-to-patio view.
 if(x>4.95&&x<16.88&&z<=-20.10&&z>=-23.25)return true;
 // 4. Entrance into second patio. Aligned with the opening in the courtyard facade.
 if(x>14.9&&x<17.8&&z<=-23.15&&z>=-24.65)return true;
 // 5. Distinct second patio, 12 m east and 5 m further back.
 if(z<-24.3&&z>-41.7&&x>7.6&&x<25.25){
  if(Math.hypot(x-16.4,z+34.1)<2.55)return false;
  return true;
 }
 return false;
}
let elapsed=0;
function update(delta,t){
 if(entered&&!paused){let forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-joyY;
 let side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joyX;
 const speed=keys.has('ShiftLeft')?6.0:3.5;const magnitude=Math.hypot(forward,side);
 if(magnitude>0){forward/=Math.max(1,magnitude);side/=Math.max(1,magnitude);
  const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed*delta;
  const dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed*delta;
  const x=camera.position.x,z=camera.position.z;
  if(allowed(x+dx,z))camera.position.x+=dx;
  if(allowed(camera.position.x,z+dz))camera.position.z+=dz;
  camera.position.y=headSpace+Math.sin(t*10)*.025;
 }else camera.position.y=THREE.MathUtils.lerp(camera.position.y,headSpace,Math.min(1,delta*5));
 }
 camera.rotation.set(pitch,yaw,0);
 // Open apartment doors inward when approached; close gradually when leaving.
 for(const entry of entryDoors){
  const d=Math.hypot(camera.position.x-entry.x,camera.position.z-entry.z);
  const target=entered&&entry.num!==23&&d<3.0?1.35:0;
  entry.angle=THREE.MathUtils.damp(entry.angle,target,4.2,delta);
  entry.pivot.rotation.y=entry.angle;
 }
 elapsed+=delta;
 if(elapsed>.1){elapsed=0;nearby=null;let closest=3.6;const dir=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
 for(const p of places){let dx=p.x-camera.position.x,dz=p.z-camera.position.z,dist=Math.hypot(dx,dz);if(dist<closest&&((dx*dir.x+dz*dir.z)/Math.max(dist,.1)>.1||dist<1.65)){nearby=p;closest=dist}}
 $('interaction').classList.toggle('active',!!nearby&&entered&&!paused);if(nearby)$('interactionTitle').textContent=nearby.title;
 const apt=whichApartment(camera.position.x,camera.position.z);
 const other=camera.position.z<-24.15&&camera.position.x>7.6&&!apt;
 $('locationLabel').textContent=apt?'INTERIOR · CASA '+apt:other?'SEGUNDO PATIO':camera.position.z<-11.5?'PASILLO ENTRE 71 Y 72':'PATIO PRINCIPAL';
 $('areaTitle').innerHTML=apt?'Dentro de la casa '+apt+'<span>.</span>':other?'El otro patio<span>.</span>':'El patio de siempre<span>.</span>';
 $('areaText').textContent=apt==='72'?'Don Ramón y la Chilindrina · sala, comedor y dormitorio':apt==='14'?'Doña Florinda y Quico · recreación de época':apt==='71'?'Doña Clotilde · interior de interpretación artística':other?'Más allá del pasillo, otra historia.':'Un lugar pequeño. Un millón de historias.';
 // Architectural map: first patio lower-left, dogleg hallway, separate patio upper-right.
 let mapX,mapY;
 if(other){mapX=242+(camera.position.x-7.25)*7.65;mapY=165+(camera.position.z+23.5)*7.2;}
 else if(camera.position.z<-19.7&&camera.position.x>5.65&&!apt){mapX=142+(camera.position.x-5.65)*8.8;mapY=139+(camera.position.z+21.6)*7.8;}
 else if(camera.position.z<-11.5&&!apt){mapX=128+(camera.position.x-4.45)*6.8;mapY=205+(camera.position.z+11.5)*7.2;}
 else{mapX=22+(camera.position.x+11.45)*6.8;mapY=205+(camera.position.z+11.5)*7.2;}
 $('playerMap').setAttribute('cx',Math.max(12,Math.min(387,mapX)));
 $('playerMap').setAttribute('cy',Math.max(16,Math.min(383,mapY)));
 }
 markers.forEach(({ring,glow},i)=>{const h=Math.sin(t*2+i*.7);ring.scale.setScalar(1+h*.18);glow.material.opacity=.64+h*.18});
 hanging.forEach((obj,i)=>obj.rotation.y=Math.sin(t*1.3+i)*.07);
 const rip=(t*.3)%1;ripple1.scale.setScalar(.8+rip*1.9);ripple1.material.opacity=(1-rip)*.38;
 ripple2.scale.setScalar(.8+((rip+.5)%1)*1.9);
}
function frame(){requestAnimationFrame(frame);const delta=Math.min(clock.getDelta(),.045),t=clock.elapsedTime;update(delta,t);renderer.render(scene,camera)}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
frame();
$('loading').classList.add('hidden');
setTimeout(()=>$('loading').remove(),950);
