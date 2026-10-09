/**
 * La Vecindad 3D — Casas visitables, reconstrucción artística de 1975–1977.
 * Referencias: blog.chespirito.com/la_vecindad_segunda-parte/ y fotos aportadas.
 * No se inventa que las habitaciones fueran una reproducción exacta del set.
 */
export function addInteriors({THREE,scene,mesh,box,cyl,material,barBetween}){
 const clay=material('#a94f3a'),iron=material('#42382e',.66,.38),
 pine=material('#795338'),brown=material('#55412e'),paint=material('#d5c2a4'),
 glass=material('#9cae9f',.19,.15),fabric=material('#c0a17f'),
 mint=material('#86ba94'),mintPale=material('#b7d5aa'),cream=material('#dfd4b9'),
 purple=material('#9e9896'),yellow=material('#e3c18d');
 const tex=(paintFunc)=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d');paintFunc(ctx);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t;
 };
 const gingham=tex(ctx=>{
  ctx.fillStyle='#f4f1da';ctx.fillRect(0,0,512,512);
  for(let x=0;x<512;x+=40){ctx.fillStyle='#77a06f98';ctx.fillRect(x,0,18,512)}
  for(let y=0;y<512;y+=40){ctx.fillStyle='#67a367aa';ctx.fillRect(0,y,512,18)}
  for(let x=0;x<512;x+=40)for(let y=0;y<512;y+=40){ctx.fillStyle='#5c8a579e';ctx.fillRect(x,y,18,18)}
  for(let i=0;i<1300;i++){const x=Math.random()*512,y=Math.random()*512;ctx.fillStyle='rgba(96,67,37,.035)';ctx.fillRect(x,y,Math.random()*3,Math.random()*2)}
 });
 const floral=tex(ctx=>{
  ctx.fillStyle='#dbcaad';ctx.fillRect(0,0,512,512);
  for(let i=0;i<90;i++){const x=Math.random()*512,y=Math.random()*512;ctx.fillStyle=['#a96f5a','#bb918a','#70805c','#9a996d'][i%4];for(let a=0;a<5;a++){ctx.beginPath();ctx.ellipse(x+Math.cos(a*1.256)*8,y+Math.sin(a*1.256)*8,5,10,a,0,Math.PI*2);ctx.fill()}}
 });
 const wornTiles=tex(ctx=>{
   ctx.fillStyle='#c0bca9';ctx.fillRect(0,0,512,512);
   for(let y=0;y<512;y+=64)for(let x=0;x<512;x+=64){const v=Math.round(160+Math.random()*51);ctx.fillStyle='rgb('+v+','+(v-7)+','+(v-16)+')';ctx.fillRect(x+2,y+2,61,61)}
   for(let i=0;i<2500;i++){const x=Math.random()*512,y=Math.random()*512;ctx.fillStyle='rgba(41,32,20,.05)';ctx.fillRect(x,y,Math.random()*8,Math.random()*4)}
 });
 const wallMint=new THREE.MeshStandardMaterial({color:'#a8d4a9',roughness:.97});
 const greenCheck=new THREE.MeshStandardMaterial({map:gingham,roughness:1,side:THREE.DoubleSide});
 const floralFabric=new THREE.MeshStandardMaterial({map:floral,roughness:1,side:THREE.DoubleSide});
 const tileMat=new THREE.MeshStandardMaterial({map:wornTiles,roughness:.96});
 const sofaFabric=material('#bf9c7e'),sofaShadow=material('#917560'),linen=material('#d6c8ae');
 const roomLight=[];
 function piece(w,h,d,x,y,z,m=paint){return box(w,h,d,x,y,z,m)}
 function light(x,y,z,power=2.5){
  let l=new THREE.PointLight(0xffce83,power,12,2);l.position.set(x,y,z);scene.add(l);roomLight.push(l);
  piece(.22,.14,.22,x,y+.12,z,material('#7a604a'));
  const bulb=mesh(new THREE.SphereGeometry(.14,16,12),material('#f2d7a0',.28));bulb.position.set(x,y,z);
 }
 function ceiling(cx,cz,sx,sz,top=4.3){piece(sx,.17,sz,cx,top,cz,material('#e6d2ad'))}
 function room(x1,x2,z1,z2,walls='#bbc3a5',top=4.3) {
  const w=material(walls);
  piece(x2-x1,.12,z2-z1,(x1+x2)/2,.04,(z1+z2)/2,tileMat);
  piece(x2-x1,top,.18,(x1+x2)/2,top/2,z1,w);
  piece(.22,top,z2-z1,x1,top/2,(z1+z2)/2,w);
  piece(.22,top,z2-z1,x2,top/2,(z1+z2)/2,w);
  ceiling((x1+x2)/2,(z1+z2)/2,x2-x1,z2-z1,top);
  // Baseboards along back and sides
  piece(x2-x1,.15,.06,(x1+x2)/2,.11,z1+.11,brown);
  piece(.08,.15,z2-z1,x1+.12,.11,(z1+z2)/2,brown);
  piece(.08,.15,z2-z1,x2-.12,.11,(z1+z2)/2,brown);
 }
 function chair(x,z,angle=0,col=brown){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);
  const p=(w,h,d,xx,yy,zz,m=col)=>box(w,h,d,xx,yy,zz,m,g);
  p(.78,.1,.75,0,.87,0);for(let xx of [-.29,.29])for(let zz of [-.27,.27])p(.095,.86,.095,xx,.44,zz);
  for(let yy of [1.26,1.58])p(.72,.085,.08,0,yy,-.31);
  for(let xx of [-.32,.32])p(.085,1.03,.1,xx,1.31,-.32);
 }
 function diningTable(x,z,m=greenCheck,wide=2.15,deep=1.45){
  for(const xx of [-wide*.38,wide*.38])for(const zz of [-deep*.32,deep*.32])piece(.11,.81,.11,x+xx,.42,z+zz,brown);
  piece(wide,.1,deep,x,.86,z,pine);
  piece(wide+.09,.045,deep+.1,x,.95,z,m);
  piece(wide+.06,.32,.05,x,.76,z+deep/2,m);
  piece(wide+.06,.32,.05,x,.76,z-deep/2,m);
  piece(.05,.32,deep+.05,x+wide/2,.76,z,m);piece(.05,.32,deep+.05,x-wide/2,.76,z,m);
 }
 function dresser(x,z,angle=0,drawers=3,w=1.25){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);
  const p=(a,b,c,xx,yy,zz,m=pine)=>box(a,b,c,xx,yy,zz,m,g);
  p(w,1.15,.5,0,.63,0);p(w+.13,.12,.62,0,1.24,0,brown);
  for(let i=0;i<drawers;i++){const y=.28+i*.3;p(w-.14,.22,.037,0,y,.272,material('#815c43'));p(.11,.05,.025,0,y,.3,iron)}
  for(let xx of [-w*.4,w*.4])p(.1,.12,.1,xx,.06,0);
  return g;
 }
 function picture(x,y,z,text,rot=0,w=.8,h=.75){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#aa9980';ctx.fillRect(0,0,256,256);
  ctx.fillStyle='#f1e6cc';ctx.fillRect(13,13,230,230);
  ctx.fillStyle='#6b665f';ctx.beginPath();ctx.ellipse(128,105,40,50,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(128,211,72,63,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#463c36';ctx.font='14px serif';ctx.textAlign='center';ctx.fillText(text,128,237);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;scene.add(g);
  box(w+.11,h+.13,.067,0,0,0,brown,g);
  box(w,h,.015,0,0,.044,new THREE.MeshStandardMaterial({map,roughness:.85}),g);
 }
 function calendar(x,y,z,rot=0){
  const c=document.createElement('canvas');c.width=256;c.height=370;const a=c.getContext('2d');
  a.fillStyle='#efe8d5';a.fillRect(0,0,256,370);a.fillStyle='#63866b';a.fillRect(0,0,256,110);
  a.fillStyle='#f7e4bb';a.textAlign='center';a.font='bold 46px Georgia';a.fillText('1976',128,68);
  a.fillStyle='#4c534b';a.font='bold 16px Arial';a.fillText('CALENDARIO',128,140);
  a.font='12px monospace';for(let row=0;row<6;row++)for(let col=0;col<7;col++){a.fillText(String((row*7+col)%31+1).padStart(2,'0'),22+col*35,173+row*28)}
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  const p=new THREE.Mesh(new THREE.PlaneGeometry(.74,1.12),new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide}));p.position.set(x,y,z);p.rotation.y=rot;scene.add(p);
 }
 function pennant(x,y,z,color='#597c9b',rot=0) {
  const shape=new THREE.Shape();shape.moveTo(-.47,0);shape.lineTo(.46,0);shape.lineTo(-.47,-.34);shape.closePath();
  const m=mesh(new THREE.ShapeGeometry(shape),material(color));m.position.set(x,y,z);m.rotation.y=rot;
  const dot=mesh(new THREE.CircleGeometry(.065,12),material('#e8d6bc'));dot.position.set(x-.25,y-.1,z+.012);
 }
 function curtainWindow(x,y,z,width=1.65,rot=0){
  const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rot;scene.add(group);
  const p=(w,h,d,a,b,c,m)=>box(w,h,d,a,b,c,m,group);
  p(width,1.5,.07,0,0,0,brown);
  p(width-.16,1.33,.04,0,0,.052,glass);
  p(.1,1.5,.09,0,0,.08,pine);p(width,.1,.09,0,0,.08,pine);
  const shapeMaterial=floralFabric;
  for(let side of [-1,1])for(let i=0;i<6;i++){
   let offset=side*(width*.33)+i*.035;
   p(.085,1.52,.045,offset,0,.16,shapeMaterial);
  }
  p(width+.25,.1,.2,0,-.82,.14,cream);
 }
 function couch(x,z,col=sofaFabric,wide=2.8){
  piece(wide,.3,.87,x,.48,z,col);piece(wide,.9,.32,x,.89,z-.37,col);
  piece(wide*.98,.16,.72,x,.69,z+.06,col);
  piece(.27,.67,.98,x-wide/2+.14,.67,z,col);piece(.27,.67,.98,x+wide/2-.14,.67,z,col);
  // concrete blocks supporting the old, repaired sofas
  for(let xx of [-wide*.38,wide*.38])for(let zz of [-.31,.31])piece(.24,.26,.29,x+xx,.13,z+zz,material('#868781'));
  for(let i=0;i<3;i++)piece(wide/3-.03,.1,.57,x-wide/3+i*(wide/3),.8,z+.12,sofaShadow);
 }
 function guitar(x,z,rot=0){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.z=rot;scene.add(g);
  const wood=material('#c79857'),dark=material('#6c4129'),string=material('#cac7af',.25,.65);
  let body=mesh(new THREE.SphereGeometry(.3,20,16),wood,g);body.position.set(0,.54,0);body.scale.set(.9,1.3,.2);
  let body2=mesh(new THREE.SphereGeometry(.21,16,12),wood,g);body2.position.set(0,.84,0);body2.scale.set(.9,1.1,.28);
  let hole=mesh(new THREE.CircleGeometry(.095,24),dark,g);hole.position.set(0,.76,.069);
  box(.115,.83,.075,0,1.19,0,dark,g);
  box(.18,.17,.07,0,1.66,0,dark,g);
  for(let j=0;j<5;j++)barBetween(-.033+j*.016,.53,.085,-.033+j*.016,1.63,.052,.0035,string).position.add(new THREE.Vector3(x,0,z));
 }
 function oldTV(x,z,angle=0){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);
  box(.62,.48,.51,0,.26,0,brown,g);
  box(.42,.29,.035,-.07,.31,.27,material('#93aaa6',.18),g);
  for(let i=0;i<2;i++){const knob=mesh(new THREE.CylinderGeometry(.045,.045,.03,10),iron,g);knob.rotation.x=Math.PI/2;knob.position.set(.24,.22+i*.18,.279)}
  barBetween(x-.14,.52,z,x,.9,z,.01,iron);
 }
 function stove(x,z,rotate=0) {
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotate;scene.add(g);
  box(1.04,1.0,.74,0,.5,0,material('#d5cab8'),g);
  box(.76,.53,.036,0,.39,.38,material('#35322c'),g);
  for(let xx of [-.27,.27])for(let zz of [-.17,.17]){const burner=mesh(new THREE.CylinderGeometry(.14,.14,.022,12),iron,g);burner.position.set(xx,1.02,zz)}
  for(let i=0;i<4;i++){const k=mesh(new THREE.SphereGeometry(.035,8,8),iron,g);k.position.set(-.3+i*.2,.82,.41)}
 }
 function shelf(x,z,level=3){
  for(let y=1.6;y<1.6+level*.43;y+=.43)piece(1.5,.075,.3,x,y,z,pine);
  for(let i=0;i<level*4;i++){
   const xx=x-.56+(i%4)*.36, y=1.72+Math.floor(i/4)*.43;
   const jar=mesh(new THREE.CylinderGeometry(.07,.065,.17,10),material(['#be855e','#b7b4a6','#7b8c67','#c5a87d'][i%4]));jar.position.set(xx,y,z);
  }
 }
 function smallRug(x,z,w=2.3,d=1.6,col='#cbbda0'){
  const m=material(col);piece(w,.017,d,x,.105,z,m);
  for(let i=0;i<8;i++){piece(w,.009,.02,x,.116,z-d/2+i*d/8,material('#8e8676'))}
 }
 function basket(x,z){const m=material('#97795b');cyl(.29,.24,.43,x,.23,z,m,16);for(let a=0;a<7;a++){let angle=a*Math.PI/3;let o=box(.045,.46,.06,x+Math.cos(angle)*.27,.23,z+Math.sin(angle)*.27,m);o.rotation.y=-angle}}
 function room72(){
  // Don Ramón y La Chilindrina, based on supplied visual reference and Chespirito's description.
  room(5.88,12.04,-19.05,-12.20,'#9ac69e',4.24);
  // Ceiling decorative beams and warm overhead lighting
  piece(5.95,.15,.24,8.95,4.03,-16.1,material('#bfb79e'));
  light(9.1,3.82,-15.6,2.9);
  // worn sofa with cinderblock supports, small separate bench
  couch(7.55,-17.15,sofaFabric,2.5);
  piece(1.18,.28,.67,7.3,.37,-15.92,sofaFabric);
  for(let xx of [6.85,7.8])piece(.20,.19,.26,xx,.1,-15.92,material('#9b968b'));
  guitar(7.2,-16.08,-.14);
  diningTable(10,-14.8,greenCheck,1.73,1.23);
  chair(9.2,-14.55,-.08);chair(10.83,-14.56,.3);chair(10.05,-13.65,.3);
  const mat=material('#92846f');smallRug(7.7,-15,2.1,.9,'#c9c2af');
  dresser(11.1,-17.15,-Math.PI/2,4,1.15);
  oldTV(10.95,-17.55,0);
  picture(7.45,2.65,-18.94,'DON RAMÓN',0,.56,.65);
  pennant(6.55,2.44,-18.935,'#698eaa');
  pennant(8.1,2.2,-18.93,'#bb7769');
  picture(10.6,2.45,-18.94,'CHILINDRINA',0,.56,.65);
  curtainWindow(6.9,2.45,-18.84,1.55);
  // Calendar, a key detail from user's 1976 reference
  calendar(11.88,2.58,-15.55,-Math.PI/2);
  shelf(9.95,-18.66,2);
  basket(11.21,-13.1);
  // modest inner sleeping alcove, Chilindrina's room is accessible by an inner doorway
  // create transverse partial partition with a 1.08 m opening in center-right
  piece(2.65,3.0,.12,7.34,1.5,-17.82,mint);
  piece(1.15,3.0,.12,11.45,1.5,-17.82,mint);
  piece(1.52,.46,.12,10.05,2.77,-17.82,mint);
  piece(.12,2.46,.22,9.28,1.23,-17.82,pine);
  piece(.12,2.46,.22,10.79,1.23,-17.82,pine);
  const bedCover=material('#dbc6ba');
  piece(1.2,.34,.92,9.9,.57,-18.34,bedCover);
  piece(1.2,.18,.92,9.9,.76,-18.34,material('#ecd6ba'));
  piece(.18,.8,1.03,9.24,.74,-18.34,brown);
  piece(.33,.13,.35,9.55,.85,-18.13,cream);
  light(10.8,2.72,-18.43,1.1);
 }
 function room14(){
  room(-10.92,-3.67,-19.30,-12.19,'#d6c6b3',4.24);
  // Doña Florinda and Quico: vintage floral upholstery, tidy but modest living room
  light(-7,3.75,-15.6,2.8);
  curtainWindow(-9.1,2.4,-19.13,1.7);
  couch(-8.57,-17.38,material('#9a9d8e'),2.75);
  smallRug(-7.3,-15.5,2.75,1.9,'#ba8f75');
  diningTable(-5.5,-14.45,floralFabric,1.63,1.13);
  chair(-6.3,-14.38,.1);chair(-4.62,-14.35,-.2);
  dresser(-4.6,-17.1,-Math.PI/2,3,1.2);
  picture(-6.3,2.6,-19.14,'FAMILIA',0,.68,.68);
  shelf(-6.2,-18.98,3);
  piece(.7,.85,.64,-10.1,.52,-13.6,material('#b8ad99'));
  piece(.64,.07,.58,-10.1,.96,-13.6,material('#d1bfa4'));
  for(let i=0;i<5;i++){const jar=mesh(new THREE.CylinderGeometry(.08,.1,.2,10),material('#d8d1c1'));jar.position.set(-4.15+i*.13,1.31,-17.1)}
 }
 function room71(){
  // This interior was rarely seen in the original series; interpretive room.
  room(-3.4,2.55,-18.88,-12.19,'#b5aab0',4.18);
  light(-.35,3.66,-15.4,1.6);
  curtainWindow(-2,2.36,-18.7,1.48);
  couch(-1.6,-17.0,material('#816c75'),2.36);
  diningTable(.92,-14.6,floralFabric,1.25,1.04);
  chair(1.5,-14.1,Math.PI);chair(-.05,-14.4,0);
  dresser(1.86,-17.2,-Math.PI/2,3,1.15);
  picture(-.8,2.4,-18.72,'RETRATO',0,.73,.83);
  shelf(.5,-18.54,2);
  const vase=cyl(.19,.12,.31,.75,1.05,-14.5,clay,16);
  let bloom=mesh(new THREE.SphereGeometry(.16,10,8),material('#a47688'));bloom.position.set(.75,1.42,-14.5);
  smallRug(-.55,-15,1.65,1.25,'#afa397');
 }
 room14();room71();room72();
 // Patio details remembered from reference — tricycle, birdcage, brooms and hanging linen
 const wheel=material('#2a2928',.85),hub=material('#bbb4a9',.4,.45),red=material('#c73733',.56,.24);
 const trike=new THREE.Group();trike.position.set(7.72,0,-1.15);trike.rotation.y=-.47;scene.add(trike);
 function trikeTire(x,z,rad=.31){const tire=mesh(new THREE.TorusGeometry(rad,.07,12,22),wheel,trike);tire.position.set(x,rad+.07,z);tire.rotation.y=Math.PI/2;const axle=mesh(new THREE.CylinderGeometry(.08,.08,.15,12),hub,trike);axle.position.set(x,rad+.07,z);axle.rotation.z=Math.PI/2;}
 trikeTire(0,-.42,.35);trikeTire(-.46,.66,.22);trikeTire(.46,.66,.22);
 const rod=(a,b,r,m)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b);const v=bv.clone().sub(av);const o=mesh(new THREE.CylinderGeometry(r,r,v.length(),8),m,trike);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize())};
 rod([0,.44,-.42],[0,.72,.49],.04,red);rod([0,.72,.49],[0,.93,.48],.045,red);rod([0,.72,.49],[-.4,.35,.66],.04,red);rod([0,.72,.49],[.4,.35,.66],.04,red);
 rod([0,.35,-.42],[0,1.04,-.42],.045,material('#eeede2'));rod([-.5,1.03,-.42],[.5,1.03,-.42],.038,material('#e8e3d8'));
 for(let a of [-.5,.5])rod([a,1.03,-.42],[a*1.18,1.03,-.42],.07,red);
 piece(.48,.08,.3,7.8,.73,-.79,red);
 const cage=new THREE.Group();cage.position.set(11.5,2.85,-11.37);scene.add(cage);
 for(let i=0;i<15;i++){const a=i*Math.PI*2/15;barBetween(11.5+Math.cos(a)*.34,1.95,-11.37+Math.sin(a)*.34,11.5+Math.cos(a)*.34,2.9,-11.37+Math.sin(a)*.34,.009,iron)}
 for(let j=0;j<3;j++){const y=2.0+j*.38;const ring=mesh(new THREE.TorusGeometry(.34,.015,6,30),iron);ring.position.set(11.5,y,-11.37);ring.rotation.x=Math.PI/2}
 const broom=()=>{barBetween(11.1,.18,-11.48,11.4,2.15,-11.4,.028,material('#9f7f5b'));const end=box(.25,.6,.16,11.12,.28,-11.49,material('#ae9168'));end.rotation.z=-.18};broom();
 // Wall scuffs, pipes, clothesline pegs
 for(let i=0;i<55;i++){
   const x=-11.6+i*.42;
   const fleck=material(i%4===0?'#7c6453':'#a8896b');
   if(i%5===0)piece(.08,.02,.045,x,.45,-11.69,fleck);
 }
 return {roomLight};
}
