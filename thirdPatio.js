// Independent third courtyard: artist's architectural interpretation of the supplied
// Celso Bertozzi / Igor C. Barros 3-patio diagram; room positions are approximate.
export function createThirdPatio({THREE,scene,box,mesh,barBetween,door,windowAt,material,sign}){
 const grass=material('#8b9b88'),walls=material('#a8ba9f'),stucco=material('#dfc59a');
 const iron=material('#414747',.6,.5),terracotta=material('#a0694e'),stone=material('#bcb6a7');
 // Covered connector, from north edge of patio 2, before patio 3.
 box(2.85,.12,8.25,16.4,-.05,-45.98,stone);
 box(.36,4.0,8.3,14.9,2,-45.98,walls);
 box(.36,4.0,8.3,17.9,2,-45.98,stucco);
 box(3.5,.17,8.3,16.4,4.05,-45.98,terracotta);
 for(let i=0;i<5;i++)box(3.2,.08,.13,16.4,3.77,-42.7-i*1.65,iron);
 // Courtyard 3 is a closed rectangle, never visible from the first patio.
 // 26m x 18m; west edge x=3.5 east edge x=29.5, north z=-67.5, south z=-49.5
 const floor=box(25.8,.11,18.1,16.4,-.06,-58.55,stone);floor.receiveShadow=true;
 box(.38,6.8,18.4,3.48,3.4,-58.5,stucco);
 box(.38,6.8,18.4,29.4,3.4,-58.5,grass);
 box(26.4,6.8,.4,16.4,3.4,-67.7,walls);
 // South wall with one 2.9m-wide portal from the second patio.
 box(11.20,6.8,.40,9.1,3.4,-49.48,walls);
 box(11.20,6.8,.40,23.7,3.4,-49.48,walls);
 box(3.24,2.35,.4,16.4,5.625,-49.48,grass);
 // Apartment numbers 15,16 at the north facade and 8,87 on the east side.
 door(9.1,-67.33,15,'#684f40');door(20.0,-67.33,16,'#694c3a');
 door(29.13,-55.15,8,'#694e40',0,-Math.PI/2);
 door(29.13,-62.7,87,'#684b3d',0,-Math.PI/2);
 windowAt(12.2,-67.33,1.45,0,2.3);
 windowAt(24.0,-67.33,1.45,0,2.3);
 windowAt(29.12,-58.7,1.3,-Math.PI/2,2.5);
 // Recorded diagram has a small blue circular object in the third patio.
 const pool=mesh(new THREE.CylinderGeometry(1.5,1.7,.31,28),material('#94775b'));
 pool.position.set(11.4,.19,-62.5);
 const blue=mesh(new THREE.CircleGeometry(1.36,28),new THREE.MeshPhysicalMaterial({color:'#367c99',roughness:.18,metalness:.1,clearcoat:.8,side:THREE.DoubleSide}));
 blue.rotation.x=-Math.PI/2;blue.position.set(11.4,.355,-62.5);
 const fence=material('#6a6054');
 for(let xx=4.3;xx<29;xx+=2.3){box(.12,1.15,.12,xx,4.0,-67.23,fence)}
 barBetween(4.3,4.7,-67.23,28.3,4.7,-67.23,.039,fence);
 const hedges=material('#50704d');
 for(let n=0;n<9;n++){
 const x=5.7+(n%3)*8.5,z=-51.2-Math.floor(n/3)*7.1;
 const pot=mesh(new THREE.CylinderGeometry(.32,.25,.44,11),terracotta);pot.position.set(x,.23,z);
 const leaves=mesh(new THREE.SphereGeometry(.48,10,8),hedges);leaves.position.set(x,.88,z);leaves.scale.set(.8,1.2,.8);
 }
 const label=sign('III',.8,.43);label.position.set(16.4,3.20,-49.19);
 return {center:{x:16.4,z:-58.5},limits:{minX:3.7,maxX:29.15,minZ:-67.35,maxZ:-49.75}};
}
