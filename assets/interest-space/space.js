/* Desk assets: Copyright 2024 Henry Heffernan, MIT. See HENRY-HEFFERNAN-LICENSE.txt. */
(()=>{'use strict';
const $=id=>document.getElementById(id), body=document.body;
const desktop=$('computer-desktop');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const glyphs={
 snow:'<path d="m4 32 13-23 10 17 5-8 9 14M11 20l6 3 4-7M6 39c10-9 19-1 31-12"/>',
 cycling:'<circle cx="10" cy="29" r="8"/><circle cx="34" cy="29" r="8"/><path d="m10 29 8-15 7 15H10l13-11h8l3 11M15 14h7M28 10h5l-2 8"/>',
 music:'<circle cx="16" cy="28" r="11"/><circle cx="16" cy="28" r="4"/><path d="M24 20 38 6m-3-2 5 5M20 24 35 9m-12 18 15-15M10 29l4 4"/>',
 dance:'<circle cx="24" cy="8" r="3"/><path d="M24 12v12l-7 12m7-12 9 9M24 16l-10-5m10 5 10 7"/><circle cx="14" cy="11" r="2"/><circle cx="34" cy="23" r="2"/>',
 swimming:'<path d="M3 27q5-8 10 0t10 0 10 0 10 0M3 35q5-8 10 0t10 0 10 0 10 0M8 18l13-4 9 6"/><circle cx="28" cy="10" r="3"/>',
 combat:'<path d="M11 14c0-5 5-7 10-7s9 3 9 8v9c0 5-5 8-10 8s-9-3-9-8zM12 32v5h17v-5m1-14h3a3 3 0 0 1 0 6h-3M13 15h14m-9-7v7m6-7v7"/>',
 basketball:'<circle cx="22" cy="22" r="15"/><path d="M22 7c-10 8-10 22 0 30M22 7c10 8 10 22 0 30M7 22h30M11 11c11 6 11 16 0 22m22-22c-11 6-11 16 0 22"/>',
 jogging:'<circle cx="28" cy="7" r="3"/><path d="m24 13-6 11 10 7 6 8M18 24l-7 10H4m18-17-8-4-7 5m15-1 8 5 7-5"/>',
 fitness:'<path d="M7 15v14m5-19v24m20-19v14m5-19v24M12 22h20M4 18v8m36-8v8"/>',
 volleyball:'<circle cx="22" cy="22" r="15"/><path d="M22 7c-3 8-1 11 7 15m-7 15c-8-2-13-9-12-17m27 2c-6 4-11 3-16-1M13 10c-3 8-1 15 4 19m17-19c-10 1-15 7-17 19m-5 4c9 2 16-1 21-7"/>',
 welcome:'<path d="M11 5h16l7 7v27H11zM27 5v8h7M16 21h13M16 26h13M16 31h9"/>'
};
const svg=id=>'<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+glyphs[id]+'</svg>';
const apps={"snow":{"label":"Snowboarding"},"cycling":{"label":"Cycling"},"music":{"label":"Classical guitar"},"dance":{"label":"Street dance"},"swimming":{"label":"Swimming"},"combat":{"label":"Boxing & Muay Thai"},"fitness":{"label":"Fitness (gym)"},"basketball":{"label":"Basketball"},"volleyball":{"label":"Volleyball"},"jogging":{"label":"Jogging"}};
const hobbyPhotos={"snow":{"src":"assets/interest-space/photos/snowboarding.jpg","width":1620,"height":1080,"alt":"Snowboarding on an indoor snow slope."},"cycling":{"src":"assets/interest-space/photos/cycling.png","width":583,"height":750,"alt":"An evening bicycle ride along a lit path."},"music":{"src":"assets/interest-space/photos/classical-guitar.jpg","width":1279,"height":1706,"alt":"Playing classical guitar."},"dance":{"src":"assets/interest-space/photos/street-dance.png","width":610,"height":523,"alt":"Street dance with a group in a gymnasium."},"swimming":{"src":"assets/interest-space/photos/swimming.png","width":493,"height":492,"alt":"Swimming freestyle in a pool."},"combat":{"src":"assets/interest-space/photos/boxing-muay-thai.jpg","width":1262,"height":1361,"alt":"Boxing practice with a heavy bag."},"fitness":{"src":"assets/interest-space/photos/fitness.jpg","width":3024,"height":4032,"alt":"A gym photograph with a dumbbell in the foreground."},"basketball":{"src":"assets/interest-space/photos/basketball.jpg","width":548,"height":709,"alt":"Playing basketball on an outdoor court."},"volleyball":{"src":"assets/interest-space/photos/volleyball.jpg","width":1290,"height":1839,"alt":"Playing volleyball at an indoor net."},"jogging":{"src":"assets/interest-space/photos/jogging.png","width":451,"height":420,"alt":"A jogging activity record showing 3.40 km in 16 minutes 44 seconds."}};
Object.keys(hobbyPhotos).forEach(id=>{apps[id].photo=hobbyPhotos[id];});
document.querySelector('.desktop-volume').textContent=Object.keys(apps).length+' interests, one curious person';
const iconButton=id=>'<button data-app="'+id+'" aria-label="Show '+apps[id].label+' photograph">'+svg(id)+'<span>'+apps[id].label+'</span></button>';
$('start-menu-items').innerHTML=Object.keys(apps).map(iconButton).join('');
function closeMenu(){$('start-menu').hidden=true;$('start-button').setAttribute('aria-expanded','false');}
function selectInterest(id){
 if(!apps[id])return;
 closeMenu();
 if(window.interestFilm&&window.interestFilm.ready){window.interestFilm.select(Object.keys(apps).indexOf(id));pendingInterest=null;}
 else pendingInterest=id;
 const stage=document.getElementById('film-stage');if(stage)stage.focus({preventScroll:true});
}
desktop.addEventListener('click',e=>{const b=e.target.closest('[data-app]');if(b)selectInterest(b.dataset.app);});
$('start-button').addEventListener('click',()=>{const show=$('start-menu').hidden;$('start-menu').hidden=!show;$('start-button').setAttribute('aria-expanded',String(show));});
window.addEventListener('interest-film-ready',()=>{if(pendingInterest&&body.dataset.state==='computer')selectInterest(pendingInterest);});
function clock(){$('desktop-clock').textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(new Date());}clock();setInterval(clock,30000);

window.interestDesktop={apps,selectInterest,svg};
let roomProps=null,pendingInterest=null;
let renderer,cssRenderer,scene,cssScene,camera,screenObject,monitorPlane,transition=null,loaded=false,failed=false,needsRender=true;
const target=new THREE.Vector3(),farTarget=new THREE.Vector3(0,-650,0),nearTarget=new THREE.Vector3(0,950,255);
let farPosition=new THREE.Vector3(),nearPosition=new THREE.Vector3();
const computerMeshes=[],raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),mouse=new THREE.Vector2();
const status=window.spaceApp={ready:false,state:'loading',models:0};
function exploreInterest(id){if(!apps[id])return;if(body.dataset.state==='computer'){selectInterest(id);return;}pendingInterest=id;move('computer');}
status.exploreInterest=exploreInterest;
function setState(s){body.dataset.state=s;status.state=s;}
function positions(){
 const aspect=innerWidth/innerHeight;
 const extra=aspect<1?Math.max(1.08,1.10/aspect):1.04;
 farPosition.set(14500*extra,9000*extra,18000*extra);
 const distance=Math.max(1024/(2*Math.tan(35*Math.PI/360)*.77),1280/(2*Math.tan(35*Math.PI/360)*aspect*.82));
 nearPosition.set(0,950,255+distance);
}
function flatMode(){body.classList.toggle('flat-desktop',failed||innerWidth<720);}
function finishEnter(){needsRender=true;setState('computer');desktop.inert=false;flatMode();$('leave-computer').hidden=false;$('monitor-hotspot').hidden=true;if(renderer)renderer.domElement.style.pointerEvents='none';if(pendingInterest)selectInterest(pendingInterest);const stage=document.getElementById('film-stage');if(stage)stage.focus({preventScroll:true});}
function move(to){
 if(!loaded||transition)return;
 if(to==='computer'){
  if(body.dataset.state==='computer')return;
  setState('entering');$('monitor-hotspot').hidden=true;
 }else{
  if(body.dataset.state==='room')return;
  closeMenu();desktop.inert=true;body.classList.remove('flat-desktop');setState('leaving');$('leave-computer').hidden=true;
  if(renderer)renderer.domElement.style.pointerEvents='auto';
 }
 if(failed){if(to==='computer'){$('scene').style.visibility='visible';finishEnter();}else{$('scene').style.visibility='hidden';setState('room');$('enter-computer').focus();}return;}
 positions();
 transition={start:performance.now(),duration:reduce.matches?1:1900,from:camera.position.clone(),fromTarget:target.clone(),to:to==='computer'?nearPosition.clone():farPosition.clone(),toTarget:to==='computer'?nearTarget.clone():farTarget.clone(),state:to};
}
$('enter-computer').addEventListener('click',()=>move('computer'));$('monitor-hotspot').addEventListener('click',()=>move('computer'));
$('leave-computer').addEventListener('click',()=>move('room'));$('direct-desktop').addEventListener('click',()=>move('computer'));
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('start-menu').hidden){closeMenu();return;}if(body.dataset.state==='computer')move('room');});
function showReady(){loaded=true;status.ready=true;setState('room');$('enter-computer').disabled=false;$('loading').hidden=true;}
function loadModel(name){
 const data=window.INTEREST_SCENE_DATA[name];
 const bytes=Uint8Array.from(atob(data.model),c=>c.charCodeAt(0));
 const texture=new THREE.TextureLoader().load(data.texture);texture.flipY=false;texture.encoding=THREE.sRGBEncoding;
 const material=new THREE.MeshBasicMaterial({map:texture});
 return new Promise((resolve,reject)=>new THREE.GLTFLoader().parse(bytes.buffer,'',gltf=>{
  gltf.scene.traverse(m=>{if(m.isMesh){m.scale.setScalar(900);m.material=material;if(name==='computer')computerMeshes.push(m);}});
  scene.add(gltf.scene);status.models++;resolve(gltf.scene);
 },reject));
}
function fallback(error){
 console.warn('3D room unavailable; using the interests desktop.',error);failed=true;
 if(renderer){renderer.domElement.remove();renderer.dispose();}
 if(!cssRenderer){const wrapper=document.createElement('div');wrapper.className='css-world';wrapper.appendChild(desktop);$('scene').appendChild(wrapper);}
 else if(!cssRenderer.domElement.contains(desktop))cssRenderer.domElement.appendChild(desktop);
 $('scene').style.visibility='hidden';
 $('loading-label').textContent='The interests desktop is ready.';showReady();$('enter-computer').textContent='Explore my interests ↗';
}
function projectPoint(){
 if(!monitorPlane||!camera)return null;
 const p=new THREE.Vector3(0,950,255).project(camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};
}
status.enter=()=>move('computer');status.leave=()=>move('room');status.screenPoint=projectPoint;
function resize(){
 needsRender=true;positions();if(!camera)return;
 camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);cssRenderer.setSize(innerWidth,innerHeight);
 if(!transition){const close=body.dataset.state==='computer';camera.position.copy(close?nearPosition:farPosition);target.copy(close?nearTarget:farTarget);camera.lookAt(target);if(close)flatMode();}
}
function render(now){
 requestAnimationFrame(render);if(!renderer||failed||document.hidden)return;
 if(!transition&&body.dataset.state==='computer'&&!needsRender)return;
 if(transition){
  const t=Math.min(1,(now-transition.start)/transition.duration),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  camera.position.lerpVectors(transition.from,transition.to,ease);target.lerpVectors(transition.fromTarget,transition.toTarget,ease);
  if(t===1){const next=transition.state;transition=null;if(next==='computer')finishEnter();else{setState('room');$('monitor-hotspot').hidden=false;$('enter-computer').focus({preventScroll:true});}}
 }else if(body.dataset.state==='room'&&!reduce.matches){
  camera.position.x+=(farPosition.x+mouse.x*160-camera.position.x)*.035;camera.position.y+=(farPosition.y+mouse.y*100-camera.position.y)*.035;
 }
 camera.lookAt(target);camera.updateMatrixWorld();cssRenderer.render(cssScene,camera);renderer.render(scene,camera);needsRender=false;
 if(loaded&&body.dataset.state==='room'){
  const p=projectPoint();$('monitor-hotspot').hidden=false;$('monitor-hotspot').style.left=p.x+'px';$('monitor-hotspot').style.top=(p.y-30)+'px';
 }
}
function init(){
 scene=new THREE.Scene();cssScene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,10,900000);positions();camera.position.copy(farPosition);target.copy(farTarget);camera.lookAt(target);
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.outputEncoding=THREE.sRGBEncoding;renderer.setClearColor(0xdedcd7,0);renderer.domElement.setAttribute('aria-hidden','true');
 cssRenderer=new THREE.CSS3DRenderer();cssRenderer.setSize(innerWidth,innerHeight);cssRenderer.domElement.className='css-world';$('scene').appendChild(cssRenderer.domElement);$('scene').appendChild(renderer.domElement);
 screenObject=new THREE.CSS3DObject(desktop);screenObject.position.copy(nearTarget);screenObject.rotation.x=-3*Math.PI/180;cssScene.add(screenObject);
 monitorPlane=new THREE.Mesh(new THREE.PlaneGeometry(1280,1024),new THREE.MeshBasicMaterial({opacity:0,transparent:true,blending:THREE.NoBlending,side:THREE.DoubleSide}));monitorPlane.position.copy(screenObject.position);monitorPlane.rotation.copy(screenObject.rotation);scene.add(monitorPlane);
 if(window.createInterestRoomProps)roomProps=window.createInterestRoomProps({scene,renderer,camera,apps,explore:exploreInterest});
 const canvas=renderer.domElement;
 canvas.addEventListener('pointermove',e=>{
  mouse.set(e.clientX/innerWidth-.5,.5-e.clientY/innerHeight);if(body.dataset.state!=='room'||!loaded)return;
  pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);raycaster.setFromCamera(pointer,camera);const hit=roomProps&&roomProps.pick(raycaster);canvas.style.cursor=hit||raycaster.intersectObjects(computerMeshes,false).length?'pointer':'default';if(roomProps)roomProps.hover(hit,e.clientX,e.clientY);
 });
 canvas.addEventListener('pointerleave',()=>{if(roomProps)roomProps.hover(null);});
 canvas.addEventListener('click',e=>{if(body.dataset.state!=='room'||!loaded)return;pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);raycaster.setFromCamera(pointer,camera);const hit=roomProps&&roomProps.pick(raycaster);if(hit){exploreInterest(hit);roomProps.hover(null);return;}if(raycaster.intersectObjects([...computerMeshes,monitorPlane],false).length)move('computer');});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('graphics context lost');});
 Promise.all(['environment','computer','decor'].map(loadModel)).then(()=>{showReady();window.INTEREST_SCENE_DATA=null;}).catch(fallback);
 addEventListener('resize',resize);requestAnimationFrame(render);
}
try{init();}catch(e){fallback(e);}
})();
