/* Original low-poly hobby objects, built locally with Three.js geometry. */
window.createInterestRoomProps=function({scene,renderer,camera,apps,explore}){
 const T=THREE, floor=-3.30, root=new T.Group(), items={}, pickable=[], meshes=[];
 root.name='Zichen — ten interests';root.scale.setScalar(900);scene.add(root);
 const colors={ink:0x303632,cream:0xe2d9c6,rust:0xb45f45,teal:0x527d78,wood:0xb98a5e,metal:0x6f7471,ivory:0xeee7d7,blue:0x6796a8};
 const materials={};
 function mat(color,roughness=.8,metalness=0){const k=color+'-'+roughness+'-'+metalness;return materials[k]||(materials[k]=new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness,metalness,flatShading:true}));}
 function add(g,geometry,color,x=0,y=0,z=0){const m=new T.Mesh(geometry,typeof color==='object'?color:mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);meshes.push(m);return m;}
 function box(g,w,h,d,c,x=0,y=0,z=0){return add(g,new T.BoxGeometry(w,h,d),c,x,y,z);}
 function sphere(g,r,c,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=add(g,new T.SphereGeometry(r,20,14),c,x,y,z);m.scale.set(sx,sy,sz);return m;}
 function cylinder(g,r,h,c,x=0,y=0,z=0,r2=r,segments=24){return add(g,new T.CylinderGeometry(r2,r,h,segments),c,x,y,z);}
 function tube(g,points,r,c,closed=false){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed,'centripetal');return add(g,new T.TubeGeometry(curve,Math.max(12,points.length*5),r,6,closed),c);}
 function bar(g,a,b,r,c){const v=new T.Vector3(...a),w=new T.Vector3(...b),d=w.clone().sub(v);const m=cylinder(g,r,d.length(),c);m.position.copy(v.add(w).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
 function shapeMesh(g,shape,depth,c){const m=add(g,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:20}),c);return m;}
 function disc(g,r,c,x,y,z){const m=add(g,new T.CircleGeometry(r,40),c,x,y,z);return m;}
 function ring(g,r,t,c,x=0,y=0,z=0){return add(g,new T.TorusGeometry(r,t,6,48),c,x,y,z);}
 function group(id,x,z,rot=0){const g=new T.Group();g.name=apps[id].label;g.position.set(x,floor,z);g.rotation.y=rot;root.add(g);items[id]=g;return g;}
 function finish(id){items[id].traverse(m=>{if(m.isMesh){m.userData.interest=id;pickable.push(m);}});}
 function decal(g,text,w,h,x,y,z,fg='#e8e0cb',bg=null){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,512,256)}ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 70px Courier New';ctx.fillText(text,256,130,480);const tex=new T.CanvasTexture(canvas);tex.encoding=T.sRGBEncoding;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));m.position.set(x,y,z);g.add(m);return m;}

 // Lighting affects these original objects; the desk retains its baked materials.
 scene.add(new T.HemisphereLight(0xfff5e6,0x7b8480,.55));
 const sun=new T.DirectionalLight(0xfff4e1,.85);sun.position.set(-5000,11000,7500);sun.target.position.set(0,-1800,0);sun.castShadow=true;
 Object.assign(sun.shadow.camera,{left:-11000,right:11000,top:11000,bottom:-11000,near:100,far:30000});sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00015;sun.shadow.normalBias=7;sun.shadow.radius=4;scene.add(sun,sun.target);
 const fill=new T.DirectionalLight(0xdce4ee,.20);fill.position.set(6000,3000,-3000);scene.add(fill);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const shadow=new T.Mesh(new T.PlaneGeometry(26000,26000),new T.ShadowMaterial({opacity:.18}));shadow.rotation.x=-Math.PI/2;shadow.position.y=floor*900+8;shadow.receiveShadow=true;scene.add(shadow);

 // A full-length snowboard, with a curved waist, twin tips and two bindings.
 {
  const g=group('snow',-5.35,2.0,.35),board=new T.Group();g.add(board);board.rotation.z=-.13;board.rotation.x=-.10;board.position.y=.1;
  const s=new T.Shape();s.moveTo(0,0);s.bezierCurveTo(-.64,0,-.63,.55,-.55,1.3);s.bezierCurveTo(-.43,2.2,-.43,3.2,-.56,4.2);s.bezierCurveTo(-.66,5.25,-.54,5.65,0,5.65);s.bezierCurveTo(.54,5.65,.66,5.25,.56,4.2);s.bezierCurveTo(.43,3.2,.43,2.2,.55,1.3);s.bezierCurveTo(.63,.55,.64,0,0,0);
  shapeMesh(board,s,.11,colors.teal);
  const line=new T.Shape();line.moveTo(-.53,3.8);line.lineTo(.5,4.5);line.lineTo(.53,3.8);line.lineTo(-.46,3.1);line.closePath();const stripe=add(board,new T.ShapeGeometry(line),colors.cream,0,0,.151);stripe.castShadow=false;
  decal(board,'OFF PISTE',.79,.34,0,4.86,.16);decal(board,'ZX',.44,.3,0,.7,.16);
  for(const y of [1.7,3.1]){const bind=new T.Group();bind.position.set(0,y,.25);bind.rotation.z=y<2?-.25:.3;board.add(bind);box(bind,.8,.49,.13,colors.ink);box(bind,.72,.12,.37,colors.ink,0,.23,.14);tube(bind,[[-.34,-.11,.1],[-.29,-.12,.4],[.29,-.12,.4],[.34,-.11,.1]],.07,colors.cream);box(bind,.4,.32,.1,colors.ink,0,.37,.16);}
  finish('snow');
 }
 // The bicycle is a complete frame with spokes, pedals, saddle and drop bars.
 {
  const g=group('cycling',-6.7,3.5,-.12);const r=1.03,fy=1.1,l=-1.62,rr=1.62;
  for(const x of [l,rr]){ring(g,r,.075,colors.ink,x,fy,0);ring(g,.94,.026,colors.metal,x,fy,0);for(let i=0;i<16;i++){const t=i*Math.PI/8;bar(g,[x,fy,0],[x+Math.cos(t)*.94,fy+Math.sin(t)*.94,0],.009,colors.metal);}const hub=cylinder(g,.10,.16,colors.metal,x,fy,0);hub.rotation.x=Math.PI/2;}
  const crank=[-.12,.95,0],seat=[-.69,2.28,0],head=[.97,2.29,0];
  [[ [l,fy,0],seat],[[l,fy,0],crank],[seat,crank],[seat,head],[head,crank],[head,[rr,fy,0]]].forEach(([a,b])=>bar(g,a,b,.065,colors.rust));
  bar(g,[-.69,2.1,0],[-.83,2.62,0],.045,colors.metal);const saddle=sphere(g,.25,colors.ink,-.88,2.65,0,1.6,.32,.72);
  bar(g,[.97,2.29,0],[1.12,2.78,0],.045,colors.metal);tube(g,[[1.12,2.78,-.28],[1.25,2.78,-.31],[1.4,2.59,-.31],[1.22,2.49,-.31]],.053,colors.ink);tube(g,[[1.12,2.78,.28],[1.25,2.78,.31],[1.4,2.59,.31],[1.22,2.49,.31]],.053,colors.ink);bar(g,[1.12,2.78,-.28],[1.12,2.78,.28],.045,colors.metal);
  ring(g,.24,.025,colors.metal,-.12,.95,.12);bar(g,[-.12,.95,.14],[.18,.74,.14],.035,colors.metal);box(g,.32,.08,.2,colors.ink,.22,.72,.14);bar(g,[-.12,.95,-.14],[-.42,1.16,-.14],.035,colors.metal);box(g,.32,.08,.2,colors.ink,-.45,1.18,-.14);
  tube(g,[[l,fy,.13],[-.12,.71,.13],[.08,.95,.13],[-.12,1.19,.13],[l,fy,.13]],.014,colors.ink);bar(g,[.6,1.05,0],[.7,.05,.4],.025,colors.ink);
  finish('cycling');
 }
 // A classical guitar: shaped wooden body, rosette, six strings and tuning pegs.
 {
  const g=group('music',6.30,.55,.32),instrument=new T.Group();g.add(instrument);instrument.rotation.z=-.15;instrument.rotation.x=-.08;instrument.position.y=.12;
  const s=new T.Shape();s.moveTo(0,0);s.bezierCurveTo(-.95,-.02,-1.03,.87,-.63,1.26);s.bezierCurveTo(-.32,1.61,-.71,1.73,-.56,2.07);s.bezierCurveTo(-.46,2.4,.46,2.4,.56,2.07);s.bezierCurveTo(.71,1.73,.32,1.61,.63,1.26);s.bezierCurveTo(1.03,.87,.95,-.02,0,0);
  shapeMesh(instrument,s,.31,colors.wood);box(instrument,.22,1.48,.14,0x6e5039,0,2.83,.2);box(instrument,.31,.69,.18,0x956e4a,0,3.81,.2);disc(instrument,.25,0x302b25,0,1.56,.352);ring(instrument,.28,.016,colors.cream,0,1.56,.36);ring(instrument,.315,.009,0x755637,0,1.56,.36);box(instrument,.53,.13,.065,0x5e4937,0,.66,.37);
  for(let i=0;i<6;i++){const x=(i-2.5)*.028;bar(instrument,[x,.64,.413],[x,4.04,.307],.0035,colors.ivory);}for(let i=0;i<13;i++)bar(instrument,[-.11,2.04+i*.116,.285],[.11,2.04+i*.116,.285],.007,colors.metal);
  for(let i=0;i<3;i++){bar(instrument,[-.25,3.62+i*.19,.2],[.25,3.62+i*.19,.2],.02,colors.metal);sphere(instrument,.045,colors.ivory,-.27,3.62+i*.19,.2,1,1.4,1);sphere(instrument,.045,colors.ivory,.27,3.62+i*.19,.2,1,1.4,1);}
  const stand=cylinder(g,.51,.06,colors.ink,0,.04,0);bar(g,[0,.06,-.2],[0,1.15,-.3],.04,colors.ink);finish('music');
 }
 // Boxing gloves rest on a compact gym bag, with a pair of hand-wrap rolls.
 {
  const g=group('combat',-3.0,3.3,.15);const bag=sphere(g,.65,0x646e63,0,.37,0,1.5,.65,.72);box(g,1.24,.22,.66,0x646e63,0,.4,0);tube(g,[[-.35,.55,-.16],[-.3,.95,-.12],[.3,.95,-.12],[.35,.55,-.16]],.035,colors.ink);decal(g,'TRAIN',.8,.24,0,.4,.47);
  for(const [x,tilt] of [[-.43,-.17],[.43,.22]]){const glove=new T.Group();glove.position.set(x,.65,.12);glove.rotation.z=tilt;g.add(glove);sphere(glove,.39,colors.rust,0,.47,0,1,1.27,.78);sphere(glove,.19,colors.rust,.3,.26,.03,.85,1.35,1);box(glove,.57,.28,.47,0x8d493b,0,.01,.02);box(glove,.57,.13,.018,colors.cream,0,.02,.268);tube(glove,[[-.21,.51,.26],[0,.55,.32],[.21,.5,.26]],.012,0xd4957c);}
  for(const x of [-.71,-.98]){const roll=cylinder(g,.11,.16,colors.cream,x,.12,.65);ring(g,.06,.012,0xb2a48d,x,.205,.65).rotation.x=-Math.PI/2;}
  finish('combat');
 }
 // Fitness has its own corner: a ribbed mat and two hex dumbbells.
 {
  const g=group('fitness',-1.65,5.1,-.2);box(g,2.4,.045,1.48,colors.teal,0,.028,0);for(let i=0;i<18;i++)box(g,.012,.008,1.36,0x688e86,-1.08+i*.127,.054,0);
  for(const z of [-.37,.36]){const d=new T.Group();d.position.set(0,.22,z);d.rotation.y=z<0?.12:-.13;g.add(d);const grip=cylinder(d,.067,.72,mat(colors.metal,.46,.5));grip.rotation.z=Math.PI/2;for(const x of [-.43,.43]){const head=cylinder(d,.23,.28,colors.ink,x,0,0,.23,6);head.rotation.z=Math.PI/2;}for(let i=0;i<5;i++){const band=ring(d,.071,.005,0xa2a5a0,-.21+i*.105,0,0);band.rotation.y=Math.PI/2;}}
  finish('fitness');
 }
 // A small dance practice setup: retro speakers and a pair of sneakers.
 {
  const g=group('dance',1.5,6.0,.12);box(g,1.9,.88,.52,colors.ink,0,.5,0);box(g,1.73,.68,.025,0x4a504c,0,.49,.275);for(const x of [-.59,.59]){disc(g,.28,0x262c29,x,.48,.294);ring(g,.25,.014,colors.metal,x,.48,.301);disc(g,.12,colors.ink,x,.48,.309);disc(g,.047,0x7c8177,x,.48,.313);}box(g,.44,.26,.035,0x252c28,0,.45,.30);decal(g,'PLAY',.34,.14,0,.5,.325);box(g,.37,.07,.025,0xa6b7a0,0,.68,.31);tube(g,[[-.44,.95,0],[-.44,1.15,0],[.44,1.15,0],[.44,.95,0]],.035,colors.ink);bar(g,[.67,.94,-.11],[1.3,1.86,-.11],.013,colors.metal);
  for(const x of [-.40,.39]){const shoe=new T.Group();shoe.position.set(x,.05,.85);shoe.rotation.y=x<0?-.15:.2;g.add(shoe);const sole=box(shoe,.43,.12,.91,colors.ivory,0,.06,0);sphere(shoe,.23,colors.ivory,0,.12,.32,1,.52,.8);box(shoe,.38,.26,.53,colors.rust,0,.24,-.15);sphere(shoe,.21,colors.rust,0,.21,.17,1,.8,1.05);box(shoe,.4,.05,.50,colors.cream,0,.25,-.02);for(let i=0;i<4;i++)bar(shoe,[-.13,.4,-.22+i*.08],[.13,.4,-.22+i*.08],.012,colors.ivory);}
  finish('dance');
 }
 // Pool kit: folded towel, swim cap, clear-rimmed goggles and two short fins.
 {
  const g=group('swimming',6.8,3.55,.35);box(g,1.5,.22,.86,colors.cream,0,.13,0);box(g,1.47,.18,.82,0xd6ceba,.04,.32,-.03);for(const x of [-.51,-.43,.43,.51])box(g,.03,.012,.83,0xb3a789,x,.419,-.03);
  const cap=sphere(g,.43,colors.blue,-.18,.51,-.1,1.16,.55,1);decal(g,'SWIM',.48,.16,-.17,.56,.30);
  const goggles=new T.Group();goggles.position.set(.22,.5,.33);goggles.rotation.x=-.8;g.add(goggles);for(const x of [-.20,.20]){const rim=ring(goggles,.16,.034,colors.ink,x,0,0);rim.scale.y=.72;const glass=disc(goggles,.14,0x95b9c4,x,0,-.008);glass.scale.y=.70;}bar(goggles,[-.045,0,0],[.045,0,0],.025,colors.ink);tube(goggles,[[-.35,0,0],[-.44,0,-.3],[.44,0,-.3],[.35,0,0]],.025,colors.ink);
  for(const x of [-.25,.27]){const fin=new T.Group();fin.position.set(x,.05,1.06);fin.rotation.x=-Math.PI/2;fin.rotation.z=x<0?.12:-.1;g.add(fin);const s=new T.Shape();s.moveTo(-.16,0);s.lineTo(-.30,.85);s.quadraticCurveTo(0,1.04,.30,.85);s.lineTo(.16,0);s.closePath();shapeMesh(fin,s,.06,colors.blue);const opening=ring(fin,.11,.035,colors.ink,0,.16,.08);opening.scale.y=1.4;for(const side of [-1,1])bar(fin,[side*.14,.1,.1],[side*.26,.82,.1],.014,0xa6c6cb);}
  finish('swimming');
 }
 // Each ball has its own geometry and panel pattern, rather than a shared icon.
 {
  const g=group('basketball',3.65,4.65,0),r=.44;sphere(g,r,0xbf7548,0,r,0);const ball=new T.Group();ball.position.y=r;g.add(ball);for(let i=0;i<3;i++){const seam=ring(ball,r+.003,.009,0x523d2e);if(i===1)seam.rotation.x=Math.PI/2;if(i===2)seam.rotation.y=Math.PI/2;}
  for(const sign of [-1,1]){const points=[];for(let i=0;i<=64;i++){const t=i/64*Math.PI*2;const y=Math.sin(t)*r,side=sign*.23*Math.cos(t);const z=Math.sqrt(Math.max(0,r*r-y*y-side*side));points.push([side,y,z+.004]);}tube(ball,points,.008,0x523d2e);}
  finish('basketball');
 }
 {
  const g=group('volleyball',5.05,5.0,.25),r=.43;sphere(g,r,colors.ivory,0,r,0);const ball=new T.Group();ball.position.y=r;g.add(ball);
  // Curved alternating panels follow meridians on the sphere.
  for(let j=0;j<6;j++){const verts=[],idx=[],offset=j*Math.PI/3;for(let i=0;i<=24;i++){const t=.03+i/24*(Math.PI-.06);for(const side of [0,1]){const phi=offset+.34*Math.sin(t)+(side?.42:0);verts.push((r+.003)*Math.sin(t)*Math.cos(phi),(r+.003)*Math.cos(t),(r+.003)*Math.sin(t)*Math.sin(phi));}}for(let i=0;i<24;i++){const a=2*i;idx.push(a,a+1,a+2,a+1,a+3,a+2);}const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(verts,3));geom.setIndex(idx);geom.computeVertexNormals();add(ball,geom,j%2?colors.wood:colors.teal);}
  for(let j=0;j<6;j++){const pts=[];for(let i=0;i<=32;i++){const t=.02+i/32*(Math.PI-.04),phi=j*Math.PI/3+.34*Math.sin(t);pts.push([(r+.006)*Math.sin(t)*Math.cos(phi),(r+.006)*Math.cos(t),(r+.006)*Math.sin(t)*Math.sin(phi)]);}tube(ball,pts,.006,0x9a9b8d);}
  finish('volleyball');
 }
 // Lightweight running shoes and a water bottle form a separate jogging corner.
 {
  const g=group('jogging',3.70,3.0,.28);
  for(const x of [-.34,.34]){
   const shoe=new T.Group();shoe.position.set(x,.03,0);shoe.rotation.y=x<0?-.12:.16;g.add(shoe);
   box(shoe,.47,.16,1.01,colors.ivory,0,.10,0);
   sphere(shoe,.235,colors.ivory,0,.11,.43,1,.36,1.0);
   box(shoe,.41,.26,.62,colors.blue,0,.27,-.17);
   sphere(shoe,.22,colors.blue,0,.25,.27,1,.68,1.38);
   box(shoe,.32,.12,.40,0x446b76,0,.41,-.15);
   for(const side of [-1,1]){
    bar(shoe,[side*.215,.25,.10],[side*.215,.35,-.18],.025,colors.cream);
    bar(shoe,[side*.215,.35,-.18],[side*.215,.23,-.35],.025,colors.cream);
   }
   for(let i=0;i<5;i++)bar(shoe,[-.13,.44,-.30+i*.084],[.13,.44,-.26+i*.084],.010,colors.ivory);
   box(shoe,.13,.20,.04,colors.rust,0,.33,-.50);
   for(let i=0;i<4;i++)box(shoe,.47,.018,.045,colors.ink,0,.035,-.30+i*.22);
  }
  cylinder(g,.14,.60,colors.teal,.92,.32,-.18);
  cylinder(g,.09,.14,colors.ink,.92,.69,-.18);
  finish('jogging');
 }

 const tooltip=document.createElement('div');tooltip.id='room-object-label';tooltip.hidden=true;tooltip.setAttribute('role','status');document.body.appendChild(tooltip);
 const inventory=document.createElement('details');inventory.className='room-inventory';inventory.innerHTML='<summary>'+Object.keys(apps).length+' interests around the desk <span>+</span></summary><div>'+Object.keys(apps).map(id=>'<button data-interest="'+id+'">'+apps[id].label+'</button>').join('')+'</div>';document.body.appendChild(inventory);
 inventory.addEventListener('click',e=>{const b=e.target.closest('[data-interest]');if(b){inventory.open=false;explore(b.dataset.interest);}});
 const info=window.interestRoomProps={count:Object.keys(items).length,ids:Object.keys(items),objects:items,project(id){const g=items[id];if(!g)return null;const b=new T.Box3().setFromObject(g),p=b.getCenter(new T.Vector3()).project(camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2}},samplePoints(id){const points=[];items[id].traverse(m=>{if(!m.isMesh)return;const p=new T.Box3().setFromObject(m).getCenter(new T.Vector3()).project(camera);points.push({x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2});});return points;},bounds(id){const b=new T.Box3().setFromObject(items[id]);return{min:b.min.toArray(),max:b.max.toArray()}}};
 return {pick(raycaster){const hit=raycaster.intersectObjects(pickable,false)[0];return hit?hit.object.userData.interest:null;},hover(id,x,y){tooltip.hidden=!id;if(!id)return;tooltip.innerHTML=apps[id].label+' <span>View photo ↗</span>';tooltip.style.left=Math.min(innerWidth-180,Math.max(12,x+15))+'px';tooltip.style.top=Math.max(12,y-45)+'px';},info};
};
