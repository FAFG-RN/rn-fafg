const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),M=require('../assets/js/carreras-model.js');
const root=path.resolve(__dirname,'..');
function runtime(failure=null,user=null,options={}){
 const ids=new Map();let focused=null,authChange,queries=0;
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.listeners={};this.value='';this.open=false;}
  set id(v){this._id=v;ids.set(v,this);}get id(){return this._id;}
  set textContent(v){this._text=String(v);this.children=[];}get textContent(){return(this._text||'')+this.children.map(c=>c.textContent).join('');}
  append(...n){this.children.push(...n);}replaceChildren(...n){this.children=n;this._text='';}
  setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  querySelectorAll(selector){const found=[];for(const n of this.children){if(selector==='summary'&&n.tag==='summary'||selector==='details[open]'&&n.tag==='details'&&n.open)found.push(n);found.push(...n.querySelectorAll(selector));}return found;}
  focus(){focused=this;}showModal(){this.open=true;}close(){this.open=false;this.listeners.close?.();}
 }
 const body=new Node('body'),ranking=new Node('section');ranking.id='ranking';body.append(ranking);const name=new Node('h2');name.id='profile-name';name.textContent=options.displayName??'Luciano Trevolazavala';
 const document={baseURI:'https://example.test/app.html',body,createElement:t=>new Node(t),getElementById:id=>ids.get(id),get activeElement(){return focused;}};
 const fakeClient={auth:{onAuthStateChange:fn=>{authChange=fn;},getSession:async()=>({data:{session:user?{user:{id:user}}:null}}),getUser:async()=>({data:{user:user?{id:user,user_metadata:{nombre_completo:options.declared??'Luciano Trevolazavala'}}:null}})},from(table){queries++;return {select(){return this;},order(){return this;},eq(){return this;},maybeSingle:async()=>({data:options.profile||null,error:null}),range:async()=>({data:[],error:null})};}};
 const window={FAFGCareerModel:M,FAFGPublishedRanking:{latest:async()=>null}};const context={window,document,URL,client:fakeClient,console,fetch:async url=>{const p=new URL(url).pathname.slice(1);return {ok:p!==failure,text:async()=>fs.readFileSync(path.join(root,p),'utf8'),json:async()=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))};}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/carreras.js'),'utf8'),context);authChange('INITIAL_SESSION',user?{user:{id:user}}:null);
 return {api:window.FAFGCareers,dialog:ids.get('fafg-careers'),body:ids.get('fafg-careers').children[1],ids,queryCount:()=>queries,signOut(){user=null;authChange('SIGNED_OUT',null);}};
}
(async()=>{
 const r=runtime();await r.api.openDirectory();assert(r.dialog.open);assert(r.body.textContent.includes('372 fichas'));const search=r.body.children.find(n=>n.tag==='input');search.value='trevolazavala';search.oninput();const list=r.body.children.find(n=>n.className==='cc-list');assert.equal(list.children.length,1);list.children[0].onclick();assert(r.body.textContent.includes('TREVOLAZAVALA LUCIANO'));assert(r.body.textContent.includes('1366')===false);assert(r.body.textContent.includes('Liga 1'));const details=r.body.querySelectorAll('details[open]');assert.equal(details.length,0,'Carrera compacta, sin desplegables abiertos por defecto');assert.equal(r.queryCount(),0,'Sin sesión no consulta resultados protegidos');
 r.dialog.children[0].children[0].onclick();assert(r.body.textContent.includes('372 fichas'));r.dialog.children[0].children[1].onclick();assert(!r.dialog.open);await r.api.openMine(()=>{});assert(r.dialog.open);assert(r.body.textContent.includes('Iniciá sesión'));assert(!r.body.children.some(n=>n.tag==='input'));r.dialog.listeners.cancel();r.dialog.close();assert(!r.dialog.open);
 const partial=runtime('data/tour-sudoeste-2026-re1-re7.json');await partial.api.openDirectory();assert(partial.body.textContent.includes('Carga incompleta'));assert(partial.body.textContent.includes('Resultados Sudoeste'));
 const auth=runtime(null,'test-user');await auth.api.openDirectory();assert.equal(auth.queryCount(),1);auth.signOut();assert(!auth.dialog.open);assert.equal(auth.body.children.length,0,'Limpia DOM privado al cerrar sesión');await auth.api.openDirectory();assert.equal(auth.queryCount(),1,'No reconsulta historial sin sesión');
 const sofia=runtime(null,'sofia-test',{declared:'Sofía Salom',displayName:'Mi perfil'});await sofia.api.openMine(()=>{});assert(sofia.body.textContent.includes('SALOM SOFIA'));assert(sofia.body.textContent.includes('Tour de Santa Fe'));assert(!sofia.body.children.some(n=>n.tag==='input'),'Mi carrera abre ficha sin buscador');
 const linked=runtime(null,'linked-test',{declared:'Luciano Trevolazavala',displayName:'¡Hola, Sofía!',profile:{jugador_id:'linked-sofia',jugadores:{nombre_completo:'SALOM SOFIA'}}});await linked.api.openMine();assert(linked.body.children.some(n=>n.tag==='h2'&&n.textContent==='SALOM SOFIA'));
 const missing=runtime(null,'missing-test',{declared:'',displayName:'Mi perfil'});await missing.api.openMine();assert(!missing.body.children.some(n=>n.tag==='input'));assert(missing.body.textContent.includes('vinculación queda pendiente'));
 console.log('PASS UI: directorio, búsqueda, ficha individual, volver, cerrar/reabrir, mi carrera, fuente fallida, lectura por sesión y limpieza al salir.');
})().catch(e=>{console.error(e);process.exitCode=1;});
