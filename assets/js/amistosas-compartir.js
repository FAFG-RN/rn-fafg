function updatePublicControls(){
 if(!data||!user)return;
 const owner=data.ronda.creador===user.id,enabled=!!data.ronda.publico&&!!data.ronda.enlace_publico;
 $('togglePublic').classList.toggle('hidden',!owner);
 $('togglePublic').textContent=enabled?'Desactivar acceso público':'Activar acceso público';
 $('shareLive').disabled=!enabled&&!owner;
 $('publicState').textContent=enabled?'Enlace público activo · Solo lectura · Sin iniciar sesión':'Acceso público desactivado';
}
async function setPublic(enabled){
 const result=await rpc('amistosa_publicar',{p_codigo:code,p_publico:enabled});
 Object.assign(data.ronda,result);updatePublicControls();return result;
}
$('togglePublic').onclick=async()=>{const button=$('togglePublic');button.disabled=true;try{await setPublic(!data.ronda.publico);msg(data.ronda.publico?'Acceso público activado':'Acceso público desactivado. Los enlaces anteriores dejaron de funcionar.')}catch(e){msg(e.message,true)}finally{button.disabled=false}};
$('shareLive').onclick=async()=>{
 const button=$('shareLive');button.disabled=true;
 try{
  if(!data.ronda.publico||!data.ronda.enlace_publico)await setPublic(true);
  const url=new URL('live-scores.html',location.href);url.searchParams.set('ronda',data.ronda.enlace_publico);
  const text='Seguí '+data.ronda.nombre+' en vivo · FAFG. Sin instalar la app ni iniciar sesión.';
  if(navigator.share){try{await navigator.share({title:'FAFG · Live Scores',text,url:url.href});return}catch(e){if(e.name==='AbortError')return}}
  try{await navigator.clipboard.writeText(url.href);msg('Enlace público copiado. Pegalo en WhatsApp.')}catch{
   const box=document.createElement('input');box.readOnly=true;box.value=url.href;box.setAttribute('aria-label','Enlace público para copiar');$('publicState').replaceChildren(box);box.focus();box.select();msg('Copiá este enlace para compartir los resultados.');
  }
 }catch(e){msg(e.message,true)}finally{updatePublicControls()}
};

updatePublicControls();
