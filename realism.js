// Production set dressing inspired by the 1975–1977 TV scenery.
// All materials are procedural, generated at runtime; reference photographs are NOT presented as geometry.
export function renovateSet({THREE,scene,renderer,materials,box,mesh,cyl,barBetween,material,hanging,lanterns}){
 const {greenStucco,ochre,beige,redStucco,floorMat,wood,metal}=materials;
 let seed=17351;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const rand=(a,b)=>a+random()*(b-a);
 const color=(hex)=>{const c=new THREE.Color(hex);return [Math.round(c.r*255),Math.round(c.g*255),Math.round(c.b*255)]};
 function canvasTexture(draw,repeatX=1,repeatY=1){
   const c=document.createElement('canvas');c.width=c.height=1024;
   const ctx=c.getContext('2d');draw(ctx);
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
   t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);
   t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   return t;
 }
 function plaster(base,undercoat,repX=2.3,repY=1){
   return canvasTexture(ctx=>{
    ctx.fillStyle=base;ctx.fillRect(0,0,1024,1024);
    // Layered blotchy limewashed stucco: larger patches and subtle grain.
    for(let i=0;i<1950;i++){
      const x=rand(0,1024),y=rand(0,1024),rad=rand(7,77);
      const g=ctx.createRadialGradient(x,y,0,x,y,rad);
      const a=rand(.013,.09);
      g.addColorStop(0,random()>.42?'rgba(42,35,28,'+a+')':'rgba(250,245,221,'+(a*.75)+')');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);
    }
    for(let i=0;i<11000;i++){ctx.fillStyle=random()>.55?'rgba(20,20,15,.028)':'rgba(255,255,236,.038)';ctx.fillRect(rand(0,1024),rand(0,1024),rand(.7,3.5),rand(.7,4))}
    // Rain-runoff stains below the roof line and around the floor.
    for(let i=0;i<80;i++){const x=rand(0,1024);const h=rand(30,340);const g=ctx.createLinearGradient(x,0,x,h);
      g.addColorStop(0,'rgba(55,51,43,.17)');g.addColorStop(1,'rgba(45,39,30,0)');
      ctx.fillStyle=g;ctx.fillRect(x,0,rand(2,13),h);
    }
    const concrete=['#b3a590','#aa9280','#bdad92'];
    for(let i=0;i<33;i++){
       const cx=rand(0,1024),cy=rand(0,1024),rad=rand(7,44),points=7+Math.floor(rand(0,6));
       ctx.beginPath();
       for(let p=0;p<points;p++){let a=p/points*Math.PI*2,rr=rad*rand(.62,1.3);
         if(p===0)ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
         else ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
       }ctx.closePath();ctx.fillStyle=i%4===0?concrete[i%3]:undercoat;ctx.globalAlpha=rand(.22,.55);ctx.fill();ctx.globalAlpha=1;
       ctx.strokeStyle='rgba(61,44,33,.22)';ctx.lineWidth=rand(1,3);ctx.stroke();
    }
    for(let i=0;i<43;i++){
      let x=rand(0,1024),y=rand(0,1024);ctx.beginPath();ctx.moveTo(x,y);
      for(let j=0;j<rand(3,11);j++){x+=rand(-12,17);y+=rand(5,23);ctx.lineTo(x,y)}
      ctx.strokeStyle='rgba(43,38,30,'+rand(.09,.29)+')';ctx.lineWidth=rand(.5,1.65);ctx.stroke();
    }
    // Lower 12% of walls accumulates dark damp grime, as in the original set.
    let gr=ctx.createLinearGradient(0,760,0,1024);gr.addColorStop(0,'rgba(22,24,18,0)');gr.addColorStop(1,'rgba(43,36,29,.12)');
    ctx.fillStyle=gr;ctx.fillRect(0,760,1024,264);
   },repX,repY);
 }
 function stones(){
   return canvasTexture(ctx=>{
      ctx.fillStyle='#868e88';ctx.fillRect(0,0,1024,1024);
      const s=78;
      for(let j=-1;j<15;j++)for(let i=-1;i<15;i++){
       const x=i*s+(j%2)*s*.46, y=j*s;
       const points=[[0,0],[.4,-.09],[.95,.03],[1.11,.4],[.87,.94],[.38,1.08],[-.15,.85],[-.11,.4]];
       ctx.beginPath();
       for(let p=0;p<points.length;p++){
        const xx=x+points[p][0]*s+rand(-7,7), yy=y+points[p][1]*s+rand(-7,7);
        if(p===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
       }
       ctx.closePath();
       let g=Math.floor(rand(162,198));
       ctx.fillStyle='rgb('+g+','+(g+1)+','+(g-7)+')';ctx.fill();
       ctx.lineWidth=rand(2.5,5.2);ctx.strokeStyle='rgba(85,90,83,.56)';ctx.stroke();
       // Stains, scuffs and hairline cracks within stones.
       if(random()>.35){ctx.beginPath();ctx.moveTo(x+rand(0,s),y+rand(0,s));ctx.lineTo(x+rand(0,s),y+rand(0,s));ctx.strokeStyle='rgba(70,70,65,.13)';ctx.lineWidth=.8;ctx.stroke();}
      }
      for(let i=0;i<22000;i++){const x=rand(0,1024),y=rand(0,1024);ctx.fillStyle=random()>.5?'rgba(35,34,29,.07)':'rgba(252,246,221,.08)';ctx.fillRect(x,y,rand(.8,4),rand(.8,5));}
   },7,7);
 }
 greenStucco.map=plaster('#90bda5','#776b5d',2,1);
 ochre.map=plaster('#deb543','#987253',2,1);
 beige.map=plaster('#cabaa0','#b8a78e',2,1);
 redStucco.map=plaster('#844e49','#a17d66',2,1);
 for(const m of [greenStucco,ochre,beige,redStucco]){m.color.set('#ffffff');m.roughness=1;m.needsUpdate=true;}
 floorMat.map=stones();floorMat.color.set('#ffffff');floorMat.needsUpdate=true;
 // The current courtyard floor is tiled; the original's irregular flagstone texture replaces it.
 const matWood=material('#5f4232'),hardened=material('#7a6a59'),bronze=material('#665b4b',.6,.45);
 const rust=material('#674c3b'),white=material('#ded9c5');
 // Window glass gets lace curtains that actually read at a distance.
 const makeLace=()=>canvasTexture(ctx=>{
  ctx.fillStyle='#f0e8d9';ctx.fillRect(0,0,1024,1024);
  for(let i=0;i<1024;i+=46){ctx.fillStyle='rgba(159,140,115,.15)';ctx.fillRect(i,0,2,1024);}
  for(let j=0;j<1024;j+=37)for(let i=0;i<1024;i+=46){
    ctx.strokeStyle='rgba(150,131,102,.28)';ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(i,j,11,16,Math.PI/4,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(i+14,j+15,9,8,0,0,Math.PI*2);ctx.stroke();
  }
 },1,1);
 const laceMat=new THREE.MeshStandardMaterial({map:makeLace(),transparent:true,opacity:.87,side:THREE.DoubleSide,roughness:1,depthWrite:false});
 function curtain(x,y,z,width,turn=0){
   const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=turn;scene.add(g);
   for(let a=0;a<14;a++){
     const xx=-width/2+(a+.5)*width/14;
     const cloth=mesh(new THREE.PlaneGeometry(width/14+0.045,1.4),laceMat,g);
     cloth.position.set(xx,0,.025+Math.sin(a*2.1)*.026);cloth.rotation.y=.06*Math.cos(a*2.4);
   }
   box(width+.24,.06,.13,0,.76,.13,bronze,g);
 }
 curtain(-4.35,2.12,-11.53,1.42);
 curtain(11,2.34,-11.53,1.09);
 // Repeated plaster moldings and water damage at wall-foot level.
 const foundations=[
   [-10.45,-11.44,3.07,'#8a4e46'],
   [-3.85,-11.44,2.23,'#8a4e46'],
   [1.25,-11.44,2.5,'#98503d'],
   [7.02,-11.44,1.23,'#a45943'],
   [11.08,-11.44,1.37,'#a45943']
 ];
 const darkCement=material('#776e63');
 foundations.forEach(([x,z,w])=>{
   for(let n=0;n<13;n++){
     const xx=x-w/2+rand(0,w);
     const patch=box(rand(.065,.20),rand(.02,.14),.02,xx,rand(.23,.85),z,material(n%3===0?'#ae8774':'#75524b'));patch.rotation.z=rand(-.33,.33);
   }
 });
 // Wall pipe down the back facade near the 71/72 section.
 const pipe=material('#30322b',.6,.5);
 barBetween(11.49,5.7,-11.43,11.49,.48,-11.43,.091,pipe);
 barBetween(11.49,5.7,-11.43,11.28,5.9,-11.55,.095,pipe);
 box(.47,.68,.23,10.62,2.25,-11.36,material('#867c61'));
 box(.23,.19,.14,10.57,2.5,-11.20,material('#c5ae7f'));
 // Broom beside Doña Clotilde's door (leaning wooden handle + straw).
 barBetween(10.25,.42,-11.12,10.63,2.12,-11.33,.027,matWood);
 const broom=box(.22,.55,.11,10.25,.29,-11.12,material('#ae9362'));broom.rotation.z=-.18;
 // Additional flowerpots on the stairs, using translucent layered foliage.
 const earth=material('#784936'),soil=material('#39372a'),leafColors=['#42784d','#52845a','#709763','#315a42'].map(v=>material(v));
 function flowerPot(x,y,z,scale=1,flowers=false){
   let g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(scale);scene.add(g);
   const pot=mesh(new THREE.CylinderGeometry(.24,.18,.39,14),earth,g);pot.position.y=.21;
   const dark=mesh(new THREE.CylinderGeometry(.2,.2,.02,14),soil,g);dark.position.y=.41;
   for(let i=0;i<18;i++){const a=rand(0,6.283),h=rand(.28,.83),rr=rand(.15,.53);
      const l=mesh(new THREE.SphereGeometry(.10,9,5),leafColors[i%4],g);
      l.position.set(Math.cos(a)*rr,.42+h,Math.sin(a)*rr);l.scale.set(rand(.7,1.5),rand(1.7,3.3),.4);l.rotation.z=rand(-1.3,1.3);
      if(flowers&&i%3===0){const f=mesh(new THREE.SphereGeometry(.075,9,8),material(i%2?'#ce5a68':'#bd3159'),g);f.position.set(Math.cos(a)*rr,.46+h,Math.sin(a)*rr)}
   }
 }
 for(const [x,y,z,s,bloom] of [
  [-11.18,.42,-1.7,1,true],[-11.12,1.0,-3.04,.8,false],[-11.14,1.64,-4.24,.72,true],
  [-11.13,2.35,-6.14,.85,true],[-11.15,3.22,-9.22,.8,false],
  [-5.7,0,-11.07,1.2,false],[1.64,0,-11.08,1,false],[9.9,0,-11.09,1,true]
 ])flowerPot(x,y,z,s,bloom);
 // Low-profile set pieces: vintage enamel wash-bucket, galvanized pails.
 const galvanized=material('#8b908b',.54,.72);
 for(const [x,z,scale] of [[-6.8,-10.45,1],[-5.9,-10.4,.8]]){
  const b=mesh(new THREE.CylinderGeometry(.18*scale,.16*scale,.37*scale,16),galvanized);
  b.position.set(x,.22*scale,z);
  const rim=mesh(new THREE.TorusGeometry(.18*scale,.02,6,22),white);
  rim.rotation.x=Math.PI/2;rim.position.set(x,.42*scale,z);
 }
 // Age/rust on exposed balustrade rail.
 for(let i=0;i<17;i++){const z=-1.95-i*.48;box(.023,.16,.027,-8.13,.57+i*.17,z,rust)}
 // Clothes: keep the hanging laundry where it belongs, near doors 14 and 71.
 const garmentTexture=canvasTexture(ctx=>{
   ctx.fillStyle='#eab2a3';ctx.fillRect(0,0,1024,1024);
   for(let i=0;i<1024;i+=80){ctx.fillStyle='#b8746f59';ctx.fillRect(i,0,32,1024)}
   for(let i=0;i<1024;i+=90){ctx.fillStyle='#e9ddcc45';ctx.fillRect(0,i,1024,28)}
   for(let i=0;i<1024;i+=12){ctx.fillStyle='rgba(71,45,41,.023)';ctx.fillRect(i,0,2,1024)}
 },1,1);
 if(hanging?.length){hanging[0].material=new THREE.MeshStandardMaterial({map:garmentTexture,side:THREE.DoubleSide,roughness:1});}
 return {name:'SET 1975 RESTAURADO',photoAccurate:false,sceneVersion:2};
}
