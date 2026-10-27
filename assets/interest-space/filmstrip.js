/* Original curved filmstrip implementation. Visual reference: https://www.shader.se/#selected-work */
(async()=>{'use strict';
const desktop=document.getElementById('computer-desktop'), api=window.interestDesktop;
if(!desktop||!api)return;
const apps=api.apps,ids=Object.keys(apps),N=ids.length,TAU=Math.PI*2,step=TAU/N;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
desktop.classList.add('film-mode');
const gallery=document.createElement('div');gallery.className='interest-film';gallery.setAttribute('aria-label','Rotating filmstrip of '+N+' personal interests');
gallery.innerHTML='<div class="film-heading"><span class="film-eyebrow">INTERESTS & HOBBIES / A PERSONAL REEL</span><h2 id="film-title">Snowboarding</h2></div><div class="film-stage" id="film-stage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Drag, scroll, or use the left and right arrow keys to rotate the interest filmstrip"></div><div class="film-controls"><button class="film-arrow" id="film-prev" aria-label="Previous interest">←</button><div class="film-dots" role="group" aria-label="Choose an interest"></div><button class="film-arrow" id="film-next" aria-label="Next interest">→</button></div><div class="film-bottomline"><span>DRAG / SCROLL / SELECT A PHOTO</span><span class="film-count" id="film-count" aria-live="polite">01 / 10</span><button class="film-autoplay" id="film-autoplay" aria-pressed="true">Pause rotation Ⅱ</button></div>';
desktop.insertBefore(gallery,desktop.querySelector('.desktop-taskbar'));
const stage=document.getElementById('film-stage'),title=document.getElementById('film-title');
const dots=gallery.querySelector('.film-dots');
dots.innerHTML=ids.map((id,i)=>'<button class="film-dot" data-index="'+i+'" aria-label="Show '+apps[id].label.replace(/\n/g,' ')+'" '+(i===0?'aria-current="true"':'')+'></button>').join('');
const state=window.interestFilm={ready:false,selected:0,angle:0,auto:!reduced.matches,frames:N,fallback:false};
let current=0,target=0,selected=-1,auto=!reduced.matches,holdUntil=0,over=false,drag=null,velocity=0,last=performance.now(),lastRender=0,dirty=true,renderer,scene,camera,belt,rotor,raycaster;
const posters=[],palettes=[['#d9e7e4','#233c48','#e98d65'],['#e3df9b','#203d32','#ea7b53'],['#ba6545','#f3dfb7','#392c27'],['#301c49','#f1b8d4','#e55f8b'],['#286b9a','#c3e9df','#e9c881'],['#d3b78e','#a84238','#2c3635'],['#6d8d83','#f0e2c3','#34443f'],['#1e4944','#eaa56f','#d9d0ac'],['#dce1cb','#345b61','#caad71'],['#dce6dc','#31554d','#cb7958']];
function line(ctx,points,color,width=4){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}
function circle(c,x,y,r,color,stroke){c.beginPath();c.arc(x,y,r,0,TAU);if(color){c.fillStyle=color;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}}
function art(c,id,p){
 const [bg,fg,accent]=p;c.save();c.translate(384,299);c.lineCap='round';c.lineJoin='round';
 if(id==='snow'){
  circle(c,174,-111,52,accent);c.fillStyle='#f1f0e3';c.beginPath();c.moveTo(-370,190);c.lineTo(-130,-155);c.lineTo(47,77);c.lineTo(175,-74);c.lineTo(380,190);c.fill();
  line(c,[[-226,-16],[-130,-155],[-90,-64],[-137,-82],[-164,-28]],fg,4);
  c.strokeStyle=accent;c.lineWidth=10;c.beginPath();c.moveTo(177,170);c.bezierCurveTo(192,87,-90,151,-54,54);c.stroke();
  c.strokeStyle='#64848c';c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-340,170+i*16);c.bezierCurveTo(-145,63+i*20,160,235+i*10,350,115+i*20);c.stroke()}
 }else if(id==='cycling'){
  c.strokeStyle=fg;c.lineWidth=9;circle(c,-174,49,110,null,fg);circle(c,166,49,110,null,fg);
  line(c,[[-174,49],[-74,-96],[30,49],[-174,49],[-19,-59],[129,-59],[166,49]],fg,9);line(c,[[-98,-97],[-44,-97]],fg,13);line(c,[[94,-129],[142,-129],[129,-59]],fg,9);
  circle(c,30,49,16,accent);circle(c,-174,49,9,accent);circle(c,166,49,9,accent);
  c.strokeStyle=fg;c.lineWidth=2;for(let i=0;i<12;i++){const t=i*TAU/12;line(c,[[-174,49],[-174+108*Math.cos(t),49+108*Math.sin(t)]],fg,1);line(c,[[166,49],[166+108*Math.cos(t),49+108*Math.sin(t)]],fg,1)}
  line(c,[[-350,212],[320,212]],accent,4);
 }else if(id==='music'){
  c.rotate(.29);c.fillStyle=fg;c.beginPath();c.moveTo(-19,-90);c.bezierCurveTo(-117,-150,-160,-80,-120,-17);c.bezierCurveTo(-207,74,-132,190,0,180);c.bezierCurveTo(133,190,202,74,115,-17);c.bezierCurveTo(155,-82,114,-147,19,-90);c.closePath();c.fill();
  c.fillStyle=accent;c.fillRect(-19,-246,38,197);c.fillRect(-28,-283,56,63);circle(c,0,24,41,accent);circle(c,0,24,32,'#171a1c');
  c.fillStyle=accent;c.fillRect(-48,108,96,14);for(let i=0;i<6;i++)line(c,[[-10+i*4,-268],[-10+i*4,118]],'#c7ae8a',1.4);
  for(let i=0;i<10;i++)line(c,[[-18,-234+i*18],[18,-234+i*18]],'#ba9c75',1);
 }else if(id==='dance'){
  for(let i=0;i<5;i++){c.strokeStyle=i%2?accent:fg;c.globalAlpha=.24+i*.14;c.lineWidth=20-i*2;c.beginPath();c.moveTo(-320+i*26,155);c.bezierCurveTo(220,-300,-240,230,310-i*15,-120);c.stroke()}
  c.globalAlpha=1;circle(c,23,-138,24,fg);line(c,[[18,-104],[-19,-7],[63,53],[118,159]],fg,16);line(c,[[-19,-7],[-95,71],[-162,139]],fg,15);line(c,[[3,-76],[-87,-104],[-134,-190]],fg,13);line(c,[[3,-76],[89,-51],[163,-116]],fg,13);
  c.fillStyle=accent;for(let i=0;i<14;i++){c.save();c.translate(-300+i*48,(i%3)*70-130);c.rotate(.5);c.fillRect(-2,-9,4,18);c.restore()}
 }else if(id==='swimming'){
  c.fillStyle='#195782';c.fillRect(-380,-240,760,480);
  for(let row=0;row<7;row++){c.strokeStyle=row%2?fg:'#72b7c2';c.lineWidth=4;c.beginPath();for(let x=-380;x<385;x+=5){const y=-175+row*57+Math.sin((x+row*15)/42)*13;x===-380?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()}
  c.lineWidth=12;circle(c,88,-71,22,accent);line(c,[[-116,17],[-11,-18],[86,23]],accent,14);line(c,[[-11,-18],[22,-96],[-52,-133]],accent,11);line(c,[[-116,17],[-208,56],[-268,30]],accent,11);
 }else if(id==='combat'){
  c.rotate(-.2);c.fillStyle=fg;c.beginPath();c.moveTo(-99,-96);c.bezierCurveTo(-102,-218,89,-241,115,-132);c.lineTo(116,-13);c.bezierCurveTo(178,-20,189,62,126,69);c.lineTo(120,126);c.lineTo(-98,126);c.closePath();c.fill();
  c.fillStyle=accent;c.fillRect(-102,104,224,73);c.strokeStyle='#e3af96';c.lineWidth=4;c.beginPath();c.moveTo(-65,-96);c.bezierCurveTo(-8,-140,56,-121,77,-71);c.stroke();line(c,[[-82,122],[104,122]],'#d6bd9b',3);line(c,[[-82,157],[104,157]],'#d6bd9b',3);
  c.globalAlpha=.22;c.strokeStyle=accent;c.lineWidth=1;for(let i=0;i<5;i++)circle(c,0,-20,230+i*25,null,accent);
 }else if(id==='basketball'){
  circle(c,81,0,166,fg);c.lineWidth=5;c.strokeStyle='#573d2d';circle(c,81,0,164,null,'#573d2d');line(c,[[81,-165],[81,165]],'#573d2d',5);line(c,[[-84,0],[246,0]],'#573d2d',5);
  c.beginPath();c.ellipse(81,0,72,165,0,0,TAU);c.stroke();c.beginPath();c.moveTo(-60,-96);c.bezierCurveTo(63,27,120,45,222,98);c.stroke();
  circle(c,-158,105,87,accent);c.strokeStyle='#7d8b74';c.lineWidth=3;c.beginPath();c.arc(-158,105,63,0,TAU);c.stroke();line(c,[[-245,105],[-118,27],[-91,164]],'#7d8b74',3);
 }else if(id==='fitness'){
  c.save();c.rotate(-.25);c.fillStyle=accent;c.fillRect(-244,94,488,50);c.fillStyle=fg;c.fillRect(-173,-25,346,27);for(const x of [-200,200]){c.fillRect(x-38,-125,76,220);c.fillRect(x-65,-86,130,145)}c.restore();
  for(let i=0;i<5;i++)line(c,[[-300,184+i*7],[290,184+i*7]],fg,1);
 }else if(id==='jogging'){
  circle(c,80,-151,27,fg);line(c,[[61,-104],[3,-1],[84,63],[144,151]],fg,20);line(c,[[3,-1],[-74,91],[-184,91]],fg,19);line(c,[[44,-72],[-48,-96],[-106,-34]],fg,16);line(c,[[44,-72],[128,-13],[201,-72]],fg,16);
  line(c,[[-207,100],[-177,100]],accent,15);line(c,[[129,158],[173,158]],accent,15);
  for(let i=0;i<3;i++)line(c,[[-299,-80+i*40],[-175+i*19,-80+i*40]],accent,5);line(c,[[-290,196],[300,196]],accent,3);
 }else if(id==='volleyball'){
  circle(c,0,0,182,fg);c.save();c.beginPath();c.arc(0,0,182,0,TAU);c.clip();for(let i=0;i<6;i++){c.save();c.rotate(i*TAU/6);c.fillStyle=i%2?accent:bg;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(125,43,195,-45,180,-137);c.lineTo(260,-155);c.lineTo(265,95);c.closePath();c.fill();c.strokeStyle=bg;c.lineWidth=3;c.stroke();c.restore()}c.restore();circle(c,0,0,182,null,bg);
 }
 c.restore();
}
function buildPosters(){
 const atlas=document.createElement('canvas'),frameWidth=Math.min(768,Math.floor(8192/N));atlas.width=frameWidth*N;atlas.height=640;const a=atlas.getContext('2d');a.scale(frameWidth/768,1);
 ids.forEach((id,i)=>{
  const c=document.createElement('canvas');c.width=768;c.height=640;const x=c.getContext('2d'),p=palettes[i];
  x.fillStyle=p[0];x.fillRect(0,0,768,640);art(x,id,p);
  x.fillStyle=p[1];x.font='13px Courier New';x.fillText('ZICHEN XU / PERSONAL ARCHIVE',29,36);x.textAlign='right';x.fillText(String(i+1).padStart(2,'0')+' — '+String(N).padStart(2,'0'),739,36);x.textAlign='left';
  let label=apps[id].label.replace(/\n/g,' ');x.font=(label.length>20?'58':'72')+'px Georgia';x.fillText(label,28,563,712);
  if(photos[id]){
   x.fillStyle='#12141a';x.fillRect(0,0,768,640);
   const photo=photos[id],area={x:16,y:49,w:736,h:459},fit=Math.min(area.w/photo.naturalWidth,area.h/photo.naturalHeight),w=photo.naturalWidth*fit,h=photo.naturalHeight*fit;
   x.drawImage(photo,area.x+(area.w-w)/2,area.y+(area.h-h)/2,w,h);
   x.fillStyle='#adb0bb';x.font='12px Courier New';x.textAlign='left';x.fillText('ZICHEN XU / PERSONAL ARCHIVE',24,29);x.textAlign='right';x.fillText(String(i+1).padStart(2,'0')+' / '+String(N).padStart(2,'0'),744,29);x.textAlign='left';
   x.fillStyle='#f1ede3';x.font=(label.length>20?'48':'58')+'px Georgia';x.fillText(label,26,568,716);
  }
  posters.push(c.toDataURL('image/png'));
  const off=i*768;a.fillStyle='#030309';a.fillRect(off,0,768,640);a.drawImage(c,off+13,45,742,548);
  for(let hole=0;hole<23;hole++){a.clearRect(off+12+hole*33,10,16,23);a.clearRect(off+12+hole*33,608,16,23)}
  a.fillStyle='#8b8a9c';a.font='7px Courier New';a.fillText('ZX-'+String(i+1).padStart(2,'0')+' / PERSONAL REEL',off+14,603);
 });return atlas;
}
const photos={};
await Promise.all(ids.map(id=>new Promise(resolve=>{const source=window.INTEREST_PHOTO_DATA&&window.INTEREST_PHOTO_DATA[id];if(!source){resolve();return;}const img=new Image();img.onload=()=>{photos[id]=img;resolve();};img.onerror=()=>resolve();img.src=source;})));
window.INTEREST_PHOTO_DATA=null;
const atlas=buildPosters();
state.photos=Object.keys(photos).length;
function updateSelection(index){
 index=((index%N)+N)%N;if(index===selected)return;selected=index;state.selected=index;
 const id=ids[index],a=apps[id];title.textContent=a.label.replace(/\n/g,' ');document.getElementById('taskbar-file').textContent=a.label;
 document.getElementById('film-count').textContent=String(index+1).padStart(2,'0')+' / '+String(N).padStart(2,'0');
 dots.querySelectorAll('button').forEach((d,i)=>{if(i===index)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
 if(state.fallback)renderFallback();
}
function keepStill(){holdUntil=performance.now()+6500;velocity=0;dirty=true;}
function goTo(index){keepStill();let desired=-index*step;desired+=Math.round((target-desired)/TAU)*TAU;target=desired;if(reduced.matches||state.fallback)current=target;if(reduced.matches||state.fallback)updateSelection(index)}
function change(direction){keepStill();const absolute=Math.round(-target/step)+direction;target=-absolute*step;if(reduced.matches||state.fallback)current=target;if(reduced.matches||state.fallback)updateSelection(absolute)}
document.getElementById('film-prev').addEventListener('click',()=>change(-1));document.getElementById('film-next').addEventListener('click',()=>change(1));
dots.addEventListener('click',e=>{const dot=e.target.closest('[data-index]');if(dot)goTo(Number(dot.dataset.index))});
const autoButton=document.getElementById('film-autoplay');
function autoLabel(){autoButton.textContent=auto?'Pause rotation Ⅱ':'Play rotation ▷';autoButton.setAttribute('aria-pressed',String(auto));state.auto=auto}
autoButton.addEventListener('click',()=>{auto=!auto;autoLabel();holdUntil=performance.now()+1000});autoLabel();
gallery.addEventListener('pointerenter',()=>over=true);gallery.addEventListener('pointerleave',()=>over=false);
stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}if(e.key==='Enter'||e.key===' '){e.preventDefault();keepStill();}});
stage.addEventListener('wheel',e=>{if(document.body.dataset.state!=='computer')return;e.preventDefault();keepStill();target-=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*.0028;},{passive:false});
stage.addEventListener('pointerdown',e=>{if(document.body.dataset.state!=='computer')return;keepStill();stage.setPointerCapture(e.pointerId);drag={x:e.clientX,lastX:e.clientX,time:e.timeStamp,moved:0};});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lastX,dt=Math.max(1,e.timeStamp-drag.time);target+=dx/stage.getBoundingClientRect().width*TAU*.82;velocity=dx/dt*.009;drag.moved+=Math.abs(dx);drag.lastX=e.clientX;drag.time=e.timeStamp;dirty=true});
stage.addEventListener('pointerup',e=>{
 if(!drag)return;const clicked=drag.moved<7;drag=null;holdUntil=performance.now()+6500;
 if(clicked){velocity=0;let index=selected;if(renderer&&belt){const r=stage.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);raycaster.setFromCamera(p,camera);const hit=raycaster.intersectObject(belt,false)[0];if(hit)index=Math.min(N-1,Math.floor(hit.uv.x*N));else return;}goTo(index);}
});
stage.addEventListener('pointercancel',()=>{drag=null;velocity=0});
function renderFallback(){
 const indices=[(selected+N-1)%N,selected,(selected+1)%N];stage.innerHTML='<div class="film-fallback">'+indices.map((i,k)=>'<img src="'+posters[i]+'" class="'+['is-before','is-active','is-after'][k]+'" alt="'+apps[ids[i]].label.replace(/\n/g,' ')+' film frame">').join('')+'</div>';
}
function fallback(){state.fallback=true;state.ready=true;if(renderer)renderer.domElement.remove();renderer=null;renderFallback()}
function geometry(){
 const segments=512,R=5.35,H=3.35,positions=[],uvs=[],indices=[];
 for(let i=0;i<=segments;i++){const t=i/segments*TAU-step/2;for(let j=0;j<2;j++){positions.push(Math.sin(t)*R,(j-.5)*H,Math.cos(t)*R);uvs.push(i/segments,j)}}
 for(let i=0;i<segments;i++){const a=i*2,b=a+2;indices.push(a,b,a+1,b,b+1,a+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function resize(){
 dirty=true;if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 if(rotor){rotor.scale.setScalar(document.body.classList.contains('flat-desktop')?1.07:1.2);rotor.position.y=.35;}
}
updateSelection(0);
try{
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=THREE.sRGBEncoding;renderer.setClearColor(0x000000,0);renderer.domElement.setAttribute('aria-hidden','true');stage.appendChild(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,2.2,14.5);camera.lookAt(0,.15,0);
 const tex=new THREE.CanvasTexture(atlas);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const material=new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,alphaTest:.08});
 material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','gl_FragColor.rgb *= gl_FrontFacing ? 1.0 : 0.24;\n#include <dithering_fragment>')};
 belt=new THREE.Mesh(geometry(),material);rotor=new THREE.Group();rotor.rotation.z=.13;rotor.rotation.x=.07;rotor.add(belt);scene.add(rotor);raycaster=new THREE.Raycaster();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback()});
 new ResizeObserver(resize).observe(stage);resize();state.ready=true;
}catch(e){fallback()}
if(renderer)renderer.render(scene,camera);
function frame(now){
 requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(document.hidden||document.body.dataset.state!=='computer')return;
 if(!drag&&Math.abs(velocity)>.0002){target+=velocity*dt*60;velocity*=Math.pow(.9,dt*60);dirty=true}
 if(auto&&!reduced.matches&&!over&&!drag&&now>holdUntil){target-=dt*.08;dirty=true}
 const delta=target-current;if(reduced.matches||state.fallback)current=target;else if(Math.abs(delta)>.00001){current+=delta*(1-Math.pow(.001,dt));dirty=true}
 updateSelection(Math.round(-current/step));state.angle=current;
 if(!renderer){dirty=false;return}
 if(!dirty&&now-lastRender<500)return;
 if(now-lastRender<30)return;lastRender=now;
 belt.rotation.y=current;renderer.render(scene,camera);dirty=false;
}
requestAnimationFrame(frame);
state.next=()=>change(1);state.previous=()=>change(-1);state.select=goTo;
window.dispatchEvent(new Event('interest-film-ready'));
})();
