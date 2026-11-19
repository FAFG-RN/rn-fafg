(function(){
 'use strict';
 const $=id=>document.getElementById(id),token=new URLSearchParams(location.search).get('ronda')||'';
 const endpoint='https://kkrzqxiomkorxyjlnjqc.supabase.co/rest/v1/rpc/amistosa_publica';
 const key='sb_publishable_9BJJ0ZYFX1B6hkmG-wUbhg_llNAeGc5';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function standings(data){return data.jugadores.map(j=>{const strokes=j.golpes||[],played=strokes.filter(v=>v>0).length,total=strokes.reduce((s,v)=>s+(v>0?v:0),0),par=strokes.reduce((s,v,i)=>s+(v>0?data.pares[i]:0),0);return {...j,played,total,diff:total-par}}).sort((a,b)=>Number(!!a.npt)-Number(!!b.npt)||Number(!a.played)-Number(!b.played)||a.diff-b.diff||b.played-a.played||a.linea-b.linea)}
 function render(data){
  const expanded=new Set(Array.from(document.querySelectorAll('details[open]')).map(el=>el.dataset.key));
  const focused=document.activeElement?.closest('details')?.dataset.key;
  const scrolls=new Map(Array.from(document.querySelectorAll('.card-scroll')).map(el=>[el.closest('details').dataset.key,el.scrollLeft]));
  $('name').textContent=data.nombre;$('course').textContent=data.cancha+' · '+data.pares.length+' hoyos · Par '+data.pares.reduce((a,b)=>a+b,0);$('roundStatus').textContent=data.estado==='finalizada'?'Ronda finalizada':'En vivo';
  const players=standings(data);
  $('leaderboard').innerHTML=players.map(p=>{const place=p.npt||!p.played?'—':players.findIndex(x=>!x.npt&&x.played&&x.diff===p.diff)+1,diff=p.npt?'NPT':!p.played?'—':p.diff===0?'E':p.diff>0?'+'+p.diff:p.diff;
   return '<details data-key="'+esc(p.clave)+'" '+(expanded.has(p.clave)?'open':'')+'><summary><span>'+place+'</span><span class="player-name"><strong>'+esc(p.nombre)+'</strong><small>Línea '+p.linea+'</small></span><span>'+(p.played?p.total:'—')+'</span><span>'+p.played+'/18</span><b>'+diff+'</b></summary><div class="card-scroll"><table><caption>Tarjeta de '+esc(p.nombre)+'</caption><thead><tr><th>Hoyo</th>'+data.pares.map((_,h)=>'<th>'+(h+1)+'</th>').join('')+'</tr></thead><tbody><tr><th>Par</th>'+data.pares.map(v=>'<td>'+v+'</td>').join('')+'</tr><tr><th>Golpes</th>'+data.pares.map((par,h)=>{const v=p.golpes[h],d=v-par,cls=!v?'':d<=-2?'eagle':d===-1?'birdie':d===1?'bogey':d>=2?'double-bogey':'';return '<td><span class="hole-score '+cls+'">'+(v||'—')+'</span></td>'}).join('')+'</tr></tbody></table></div><p class="legend">Círculo: birdie · Doble círculo: eagle · Cuadrado: bogey · Doble cuadrado: doble bogey o más · NPT: no presenta tarjeta</p></details>';
  }).join('')||'<p>Todavía no hay jugadores cargados.</p>';
  document.querySelectorAll('details').forEach(el=>{if(el.dataset.key===focused)el.querySelector('summary').focus({preventScroll:true});el.querySelector('.card-scroll').scrollLeft=scrolls.get(el.dataset.key)||0});
  $('results').hidden=false;$('status').textContent='';$('updated').textContent='Última consulta: '+new Date().toLocaleTimeString('es-AR')+' · Actualización automática cada 12 segundos';
 }
 let busy=false,loaded=false;
 async function load(){
  if(busy)return;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)){$('status').textContent='Abrí el enlace de Live Scores compartido por el organizador.';return}
  busy=true;const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{const response=await fetch(endpoint,{method:'POST',credentials:'omit',cache:'no-store',signal:controller.signal,headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_enlace:token})});if(!response.ok)throw Error('No se pudieron actualizar los resultados.');const data=await response.json();if(!data.disponible){$('results').hidden=true;$('leaderboard').replaceChildren();$('status').textContent='Este enlace no está disponible o el organizador desactivó el acceso público.';loaded=false;return}render(data);loaded=true}
  catch(e){$('status').textContent=(loaded?'No se pudo actualizar. Los resultados visibles son de la última consulta correcta. ':'No se pudieron cargar los resultados. ')+'Revisá tu conexión; volveremos a intentar automáticamente.'}
  finally{clearTimeout(timeout);busy=false}
 }
 load();setInterval(()=>{if(!document.hidden)load()},12000);window.addEventListener('online',load);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
})();
