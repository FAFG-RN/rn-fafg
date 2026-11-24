/* Boggie: ayuda guiada basada en las funciones publicadas de FAFG. */
(function () {
  'use strict';
  const topics = {
    torneos: {label:'Próximos torneos', words:/\b(torneo|torneos|calendario|fecha|fechas|copa|inscripcion|inscribirme|inscribo|inscribir|anotarme|anotar)\b/, text:'En el calendario de Inicio podés consultar las competencias publicadas. Para inscribirte, usá el acceso oficial de inscripción de la app y revisá allí las condiciones vigentes.', action:'Ver calendario', target:'calendar', related:['ranking','ayuda']},
    ranking: {label:'Mi ranking', words:/\b(ranking|posicion|puntos|categoria|categorias)\b/, text:'En Ranking encontrás el Top 10 nacional y el acceso al ranking por categorías. Para consultar tu posición y tus puntos personales, entrá a Mi perfil con tu cuenta. Si falta tu ficha o detectás una diferencia, escribinos para que FAFG la revise.', action:'Abrir Ranking', target:'ranking', related:['perfil','scores']},
    reglamento: {label:'Reglamento', words:/\b(reglamento|regla|reglas|penalidad|penalizacion|desempate|obstaculo)\b/, text:'Podés consultar el reglamento FAFG 2026 publicado en la app. Para una situación de juego específica, confirmá el criterio con la organización; no tengo una resolución verificada para cada caso.', action:'Leer reglamento FAFG 2026', href:'./REGLAMENTO%20FAFG-2026.pdf', related:['torneos','tarjeta']},
    ayuda: {label:'Cómo usar la app', words:/\b(ayuda|usar|instalar|instalacion|iphone|android|aplicacion|app)\b/, text:'En Ayuda tenés instrucciones para instalar la app, usar Mi perfil, consultar scores y aprender a usar la Tarjeta Digital. En iPhone: Safari, Compartir y Agregar a pantalla de inicio. En Android: Chrome y la opción Instalar aplicación.', action:'Abrir Ayuda', target:'instalar', related:['perfil','tarjeta']},
    perfil: {label:'Mi perfil y acceso', words:/\b(perfil|cuenta|contrasena|ingresar|sesion|dni|correo|hcp|handicap|credencial)\b/, text:'Entrá a Mi perfil para iniciar sesión y consultar tu ficha deportiva, HCP y credencial cuando estén vinculados. Si no podés acceder o tus datos no coinciden, escribí a FAFG. No compartas tu contraseña en este chat.', action:'Abrir Mi perfil', target:'perfil', related:['scores','ranking']},
    scores: {label:'Mis scores por torneo', words:/\b(score|scores|golpes|resultado|resultados|historial|carrera)\b/, text:'En Mi perfil, iniciá sesión y abrí Mis scores por torneo o Mi carrera deportiva. Allí se muestran los resultados disponibles de tu ficha. Si falta una participación, enviá a FAFG el torneo, la fecha y el dato que querés revisar.', action:'Abrir Mi perfil', target:'perfil', related:['ranking','tarjeta']},
    tarjeta: {label:'Tarjeta Digital y Live Score', words:/\b(tarjeta|digital|live|ronda|amigos|anotador|hoyo|hoyos)\b/, text:'Desde Inicio podés abrir Tarjeta Digital. En Ayuda encontrás videos y práctica para una línea y Live Score con amigos. En torneos oficiales, el Live Score es provisional hasta su validación; la tarjeta en papel es el documento oficial.', action:'Ver ayuda de Tarjeta Digital', href:'./ayuda-tarjeta-digital.html', related:['scores','reglamento']},
    socio: {label:'Hacete socio', words:/\b(socio|socios|cuota|pago|pagar|afiliacion)\b/, text:'En Inicio, Hacete socio abre el formulario de Paypertic. Revisá allí los importes vigentes. Si ya pagaste y necesitás verificar tu estado, escribinos: desde este asistente no confirmo pagos ni afiliaciones.', action:'Ir a Inicio', target:'inicio', related:['perfil','torneos']}
  };
  function resolve(query) {
    const q = String(query).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if (/\b(no me sirve|no responde|otra cosa|no es eso|ninguna|no encontre|no esta|hablar con|contacto|email|mail)\b/.test(q)) return null;
    let matches = Object.keys(topics).filter(id=>topics[id].words.test(q));
    if(matches.length>1) matches=matches.filter(id=>id!=='ayuda');
    return matches.length === 1 ? matches[0] : null;
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports={resolve,topics}; return; }
  if (document.getElementById('boggie-launcher')) return;
  const launcher=document.createElement('button'); launcher.id='boggie-launcher'; launcher.type='button';
  launcher.setAttribute('aria-label','Preguntale a Boggie'); launcher.setAttribute('aria-haspopup','dialog'); launcher.setAttribute('aria-controls','boggie-dialog'); launcher.setAttribute('aria-expanded','false');
  launcher.innerHTML='<span class="boggie-ball" aria-hidden="true"></span><span class="boggie-hint" hidden>Preguntale a Boggie</span>';
  const dialog=document.createElement('dialog'); dialog.id='boggie-dialog'; dialog.setAttribute('aria-labelledby','boggie-title');
  dialog.innerHTML='<header class="boggie-header"><div class="boggie-avatar" role="img" aria-label="Boggie con chomba FAFG, sosteniendo la Jabulani y apoyado en el borde del chat"><svg class="boggie-character" viewBox="0 0 1053 1494" aria-hidden="true" focusable="false"><defs><clipPath id="boggie-body-clip"><path d="M0 337 H1053 V1494 H0Z"/></clipPath><clipPath id="boggie-head-clip"><path d="M0 0 H1053 V339 H0Z"/></clipPath></defs><g class="boggie-body"><image href="./assets/images/boggie-copa-mundial.png" width="1053" height="1494" clip-path="url(#boggie-body-clip)"/></g><g class="boggie-head"><image href="./assets/images/boggie-copa-mundial.png" width="1053" height="1494" clip-path="url(#boggie-head-clip)"/><g class="boggie-blink" fill="#08111a"><path d="M450 170 Q496 135 541 181 L546 218 Q497 205 452 207Z"/><path d="M563 194 Q608 160 653 202 L653 241 Q611 226 564 226Z"/></g></g></svg></div><div><h2 id="boggie-title">Boggie</h2><p>Tu asistente FAFG</p></div><button type="button" class="boggie-close" aria-label="Cerrar Boggie">×</button></header><div class="boggie-scroll"><p class="boggie-welcome">¡Hola! 👋 Soy Boggie.<br>¿En qué puedo ayudarte?</p><div class="boggie-topics" aria-label="Consultas frecuentes"></div><div class="boggie-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversación con Boggie"></div><div class="boggie-suggestions" aria-label="Sugerencias relacionadas"></div></div><form class="boggie-form"><label class="boggie-sr" for="boggie-question">Escribí tu consulta</label><input id="boggie-question" placeholder="Escribí tu consulta…" maxlength="500" autocomplete="off" enterkeyhint="send"><button type="submit">Enviar</button></form><footer>¿No encontraste lo que buscabas?<br><a href="mailto:fafootgolf@gmail.com">fafootgolf@gmail.com</a></footer>';
  document.body.append(launcher,dialog);
  const log=dialog.querySelector('.boggie-messages'), suggestions=dialog.querySelector('.boggie-suggestions'), input=dialog.querySelector('input'), scroll=dialog.querySelector('.boggie-scroll');
  let previousFocus, previousOverflow;
  const close=()=>dialog.close();
  function open(){previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';launcher.setAttribute('aria-expanded','true');launcher.querySelector('.boggie-hint').hidden=true;dialog.querySelector('.boggie-close').focus();}
  launcher.addEventListener('click',e=>{if(suppressClick && e.detail!==0){e.preventDefault();return;}open();});dialog.querySelector('.boggie-close').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';launcher.setAttribute('aria-expanded','false');previousFocus?.focus();});
  function message(text,kind){const p=document.createElement('p');p.className='boggie-message '+kind;p.textContent=text;log.append(p);while(log.children.length>24)log.firstElementChild.remove();return p;}
  function ask(question,id){
    message(question,'boggie-user'); const topic=topics[id];
    const response=message(topic?topic.text:'No tengo información verificada para responder esa consulta. Podés probar alguna sugerencia o escribirnos a fafootgolf@gmail.com para que FAFG te ayude.','boggie-answer');
    if(topic){const action=document.createElement(topic.href?'a':'button');action.className='boggie-action';action.textContent=topic.action;if(topic.href){action.href=topic.href;action.target='_blank';action.rel='noopener noreferrer';}else{action.type='button';action.addEventListener('click',()=>{close();document.querySelector('.bottom-nav [data-go="'+(topic.target==='calendar'?'inicio':topic.target)+'"]')?.click();if(topic.target==='calendar'){const trigger=document.getElementById('fafg-calendar-open');if(trigger?.getAttribute('aria-expanded')!=='true')trigger?.click();}});}response.append(action);}
    else {const contact=document.createElement('a');contact.href='mailto:fafootgolf@gmail.com';contact.className='boggie-action';contact.textContent='Escribir a FAFG';response.append(contact);}
    suggestions.replaceChildren();for(const next of topic?topic.related:['socio','perfil'])addChoice(suggestions,next);
    scroll.scrollTop=scroll.scrollHeight;
  }
  function addChoice(parent,id){const b=document.createElement('button');b.type='button';b.textContent=topics[id].label;b.addEventListener('click',()=>ask(topics[id].label,id));parent.append(b);}
  for(const id of ['torneos','ranking','reglamento','ayuda'])addChoice(dialog.querySelector('.boggie-topics'),id);
  dialog.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';ask(q,resolve(q));});
  const nav=document.querySelector('.bottom-nav');
  const positionKey='fafg-boggie-position';
  let savedPosition=null, drag=null, suppressClick=false;
  try {const p=JSON.parse(localStorage.getItem(positionKey));if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))savedPosition=p;} catch (_) {}
  function bounds(){
    const v=window.visualViewport, left=v?.offsetLeft||0, top=v?.offsetTop||0;
    const width=v?.width||window.innerWidth, height=v?.height||window.innerHeight;
    const navTop=nav?.getBoundingClientRect().top;
    const bottom=Number.isFinite(navTop)&&navTop>top?Math.min(top+height,navTop):top+height;
    return {left:left+12,top:top+12,right:Math.max(left+12,left+width-72),bottom:Math.max(top+12,bottom-76)};
  }
  function place(x,y){
    const b=bounds();x=Math.max(b.left,Math.min(b.right,x));y=Math.max(b.top,Math.min(b.bottom,y));
    launcher.style.left=x+'px';launcher.style.top=y+'px';launcher.style.right='auto';launcher.style.bottom='auto';
    launcher.classList.toggle('boggie-hint-right',x<b.left+180);
    return {x,y};
  }
  function fitDialog(){
    const v=window.visualViewport;
    const compact=!!v && (v.height<500 || window.innerHeight-v.height>150);
    dialog.classList.toggle('boggie-keyboard',compact);
    dialog.style.setProperty('--boggie-viewport-height',(v?.height||window.innerHeight)+'px');
    dialog.style.setProperty('--boggie-viewport-top',(v?.offsetTop||0)+'px');
  }
  function position(){
    fitDialog();
    const b=bounds();
    if(savedPosition){place(b.left+savedPosition.x*(b.right-b.left),b.top+savedPosition.y*(b.bottom-b.top));}
    else place(Math.min(b.right-4,(window.innerWidth+680)/2-76),b.bottom);
  }
  launcher.addEventListener('pointerdown',e=>{
    if(!e.isPrimary||e.button!==0||drag)return;
    suppressClick=false;
    const r=launcher.getBoundingClientRect();
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left,top:r.top,moved:false};
    launcher.setPointerCapture(e.pointerId);
  });
  launcher.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<7)return;
    drag.moved=true;suppressClick=true;
    launcher.classList.add('boggie-dragging');launcher.querySelector('.boggie-hint').hidden=true;
    place(drag.left+dx,drag.top+dy);
  });
  function endDrag(e){
    if(!drag||drag.id!==e.pointerId)return;
    if(drag.moved){
      const b=bounds(),r=launcher.getBoundingClientRect(),p=place(r.left,r.top);
      savedPosition={x:(p.x-b.left)/(b.right-b.left||1),y:(p.y-b.top)/(b.bottom-b.top||1)};
      try{localStorage.setItem(positionKey,JSON.stringify(savedPosition));}catch(_){}
    }
    drag=null;launcher.classList.remove('boggie-dragging');
    if(launcher.hasPointerCapture(e.pointerId))launcher.releasePointerCapture(e.pointerId);
  }
  launcher.addEventListener('pointerup',endDrag);
  launcher.addEventListener('pointercancel',endDrag);
  launcher.addEventListener('lostpointercapture',endDrag);
  launcher.addEventListener('dragstart',e=>e.preventDefault());
  position();if(nav&&typeof ResizeObserver!=='undefined')new ResizeObserver(position).observe(nav);
  window.addEventListener('resize',position);
  window.visualViewport?.addEventListener('resize',position);
  window.visualViewport?.addEventListener('scroll',position);
  setTimeout(()=>{if(!dialog.open&&!drag&&!savedPosition){launcher.querySelector('.boggie-hint').hidden=false;setTimeout(()=>{launcher.querySelector('.boggie-hint').hidden=true;},5500);}},3500);
})();
