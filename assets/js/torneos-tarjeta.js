(()=>{
'use strict';
const panel=document.createElement('details');panel.className='accordion-panel';panel.id='torneos-fafg';
panel.innerHTML='<summary><span>🏆 Mis torneos e inscripciones</span><span class="accordion-chevron" aria-hidden="true">⌄</span></summary><div class="accordion-content"></div>';
const root=document.createElement('section');root.className='card';
panel.querySelector('.accordion-content').append(root);
document.querySelector('.app>header').after(panel);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db,user,admin=false,tab='proximos',events=[],entries=[],busy=false;
const date=x=>new Date(x+'T12:00:00').toLocaleDateString('es-AR');
const available=e=>e.abierto&&new Date(e.cierre)>new Date();
const query=async p=>{const r=await p;if(r.error)throw r.error;return r.data};
function message(s){root.querySelector('[role=status]').textContent=s}
function render(){
root.innerHTML=`<nav class="tournament-tabs" aria-label="Torneos FAFG"><button data-tab="proximos" aria-pressed="${tab==='proximos'}">Próximos torneos</button><button data-tab="mios" aria-pressed="${tab==='mios'}">Mis torneos</button>${admin?'<button data-tab="admin">Gestionar</button>':''}</nav><p role="status" aria-live="polite"></p><div id="event-list"></div>`;
root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
const list=root.querySelector('#event-list');
if(tab==='mios'&&!user){list.innerHTML='<p>Ingresá con tu cuenta FAFG para ver tus inscripciones.</p><a class="btn" href="./app.html#perfil">Ingresar a FAFG</a>';return}
if(tab==='admin'&&admin){renderAdmin(list);return}
const shown=tab==='mios'?events.filter(e=>entries.some(i=>i.evento_id===e.id&&i.user_id===user.id)):events.filter(e=>e.publicado&&available(e));
list.innerHTML=shown.length?'':`<p class="muted">${tab==='mios'?'Todavía no tenés inscripciones registradas en FAFG.':'No hay torneos con inscripción abierta.'}</p>`;
for(const e of shown){const i=entries.find(i=>i.evento_id===e.id&&i.user_id===user?.id);const card=document.createElement('article');card.className='event-item';card.innerHTML=`<h2>${esc(e.nombre)}</h2><p>${date(e.fecha)} · ${esc(e.sede)}</p>${i?`<p><strong>Inscripción ${esc(i.estado)}</strong> · ${esc(i.categoria)}</p><p>${i.salida?'Salida: '+esc(i.salida):'Salida pendiente de publicación por la organización.'}</p>${i.live_codigo&&i.estado==='confirmada'?`<a class="btn" href="./ronda-amigos.html?codigo=${encodeURIComponent(i.live_codigo)}&vista=live">Ver Live Score</a> <a class="btn secondary" href="./ronda-amigos.html?codigo=${encodeURIComponent(i.live_codigo)}">Entrar a mi línea</a>`:''}`:`<p class="muted">Cierre: ${new Date(e.cierre).toLocaleString('es-AR')}</p><button data-register>Inscribirme</button>`}`;
list.append(card);card.querySelector('[data-register]')?.addEventListener('click',()=>form(card,e));}
list.insertAdjacentHTML('beforeend','<p class="muted">Las inscripciones realizadas en otros formularios no se importan automáticamente. La organización verifica cada solicitud. El Live Score es provisional; la tarjeta en papel es el documento oficial.</p>');
}
function form(card,e){if(!user){card.insertAdjacentHTML('beforeend','<p>Ingresá a FAFG para inscribirte.</p><a class="btn" href="./app.html#perfil">Ingresar</a>');return}
card.querySelector('[data-register]').disabled=true;
card.insertAdjacentHTML('beforeend',`<form><label>Nombre y apellido<input class="field" name="nombre" required minlength="3" maxlength="150" autocomplete="name"></label><label>Categoría solicitada<input class="field" name="categoria" required maxlength="80" placeholder="Ej.: Caballeros Senior"></label><p class="muted">La categoría y la inscripción quedan sujetas a confirmación de FAFG.</p><button>Confirmar solicitud</button> <button type="button" class="secondary" data-cancel>Cancelar</button></form>`);
card.querySelector('[data-cancel]').onclick=render;
card.querySelector('form').onsubmit=async ev=>{ev.preventDefault();if(busy)return;busy=true;const f=ev.target;f.querySelector('button').disabled=true;try{await query(db.from('fafg_inscripciones').insert({evento_id:e.id,user_id:user.id,nombre:f.nombre.value.trim(),categoria:f.categoria.value.trim()}));tab='mios';await load();message('Solicitud guardada. Pendiente de confirmación de la organización.')}catch(err){message(err.code==='23505'?'Ya estás inscripto. Abrí Mis torneos.':'No se pudo guardar: '+err.message);f.querySelector('button').disabled=false}finally{busy=false}};
}
function renderAdmin(list){
list.innerHTML='<h2>Organización FAFG</h2><form id="new-event"><label>Torneo<input class="field" name="nombre" required maxlength="150"></label><label>Sede<input class="field" name="sede" required></label><label>Fecha<input class="field" name="fecha" type="date" required></label><label>Cierre de inscripción<input class="field" name="cierre" type="datetime-local" required></label><button>Publicar y abrir inscripción</button></form>';
list.querySelector('form').onsubmit=async ev=>{ev.preventDefault();const f=ev.target;await action(()=>query(db.from('fafg_eventos').insert({nombre:f.nombre.value.trim(),sede:f.sede.value.trim(),fecha:f.fecha.value,cierre:new Date(f.cierre.value).toISOString(),publicado:true,abierto:true})))};
for(const e of events){const box=document.createElement('article');box.className='event-item';box.innerHTML=`<h2>${esc(e.nombre)}</h2><button class="secondary">${e.abierto?'Cerrar':'Abrir'} inscripción</button>`;box.querySelector('button').onclick=()=>action(()=>query(db.from('fafg_eventos').update({abierto:!e.abierto}).eq('id',e.id)));list.append(box);
for(const i of entries.filter(i=>i.evento_id===e.id)){const f=document.createElement('form');f.className='event-entry';f.innerHTML=`<strong>${esc(i.nombre)}</strong> · ${esc(i.categoria)}<label>Estado<select class="field" name="estado">${['pendiente','confirmada','rechazada'].map(s=>`<option ${s===i.estado?'selected':''}>${s}</option>`).join('')}</select></label><label>Salida / horario / línea<input class="field" name="salida" value="${esc(i.salida)}"></label><label>Código de Live Score FAFG (opcional)<input class="field" name="codigo" pattern="[a-zA-Z0-9-]{0,40}" value="${esc(i.live_codigo)}"></label><p class="muted">Vinculá únicamente una ronda ya creada en FAFG. Esto publica su consulta; los anotadores se asignan en la ronda.</p><button>Guardar</button>`;f.onsubmit=ev=>{ev.preventDefault();action(()=>query(db.from('fafg_inscripciones').update({estado:f.estado.value,salida:f.salida.value.trim(),live_codigo:f.codigo.value.trim()}).eq('id',i.id)))};box.append(f)}}
}
async function action(fn){if(busy)return;busy=true;root.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();await load();message('Guardado.')}catch(e){render();message('No se pudo guardar: '+e.message)}finally{busy=false}}
async function load(){events=await query(db.from('fafg_eventos').select('*').order('fecha'));entries=user?await query(db.from('fafg_inscripciones').select('*').order('creado')):[];render()}
async function start(){root.innerHTML='<p role="status">Cargando torneos…</p>';try{if(!window.supabase)throw Error('No se pudo conectar. Revisá tu conexión y recargá.');db=window.supabase.createClient('https://kkrzqxiomkorxyjlnjqc.supabase.co','sb_publishable_9BJJ0ZYFX1B6hkmG-wUbhg_llNAeGc5',{auth:{persistSession:true,storageKey:'fafg-app-auth'}});const r=await db.auth.getUser();user=r.data?.user||null;if(user){const a=await db.rpc('is_fafg_admin');admin=!a.error&&a.data===true}await load()}catch(e){root.innerHTML='<p role="status"></p><button>Reintentar</button>';message('No se pudieron cargar los torneos. '+e.message);root.querySelector('button').onclick=start}}
start();
})();
