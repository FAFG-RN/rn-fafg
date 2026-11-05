// GitHub Actions: envío de nuevas solicitudes de alta. Node 20+.
const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','RESEND_API_KEY','FAFG_NOTIFICATION_FROM'];
for(const name of required) if(!process.env[name]) throw new Error('Falta secreto: '+name);
const url=process.env.SUPABASE_URL.replace(/\/$/,'');
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers={apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'};
const response=await fetch(url+'/rest/v1/avisos_altas_fafg?select=usuario_id,correo,creado_en,intentos&enviado_en=is.null&order=creado_en.asc&limit=40',{headers});
if(!response.ok)throw new Error('No se pudo leer la cola: '+response.status+' '+(await response.text()).slice(0,200));
const pending=await response.json();
for(const entry of pending){
 const date=new Date(entry.creado_en).toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'});
 const body={from:process.env.FAFG_NOTIFICATION_FROM,to:['ltrevolazavala@gmail.com'],subject:'FAFG App · Nueva solicitud de alta',text:`Se registró una nueva cuenta en FAFG App.\n\nCorreo: ${entry.correo}\nFecha: ${date} (Argentina)\nEstado: pendiente de validación deportiva.\n\nRevisá la cuenta en Supabase > Authentication > Users.\nNo autorices la vinculación deportiva sin verificar la identidad.\n\nEste correo no contiene contraseñas ni DNI.`};
 try{
  const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'fafg-alta-'+entry.usuario_id},body:JSON.stringify(body)});
  if(!sent.ok)throw new Error('Resend '+sent.status+': '+(await sent.text()).slice(0,180));
  const saved=await fetch(url+'/rest/v1/avisos_altas_fafg?usuario_id=eq.'+encodeURIComponent(entry.usuario_id)+'&enviado_en=is.null',{method:'PATCH',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({enviado_en:new Date().toISOString(),intentos:entry.intentos+1,ultimo_error:null})});
  if(!saved.ok)throw new Error('No se pudo marcar enviado: '+saved.status);
  console.log('Aviso procesado para usuario',entry.usuario_id);
 }catch(err){
  console.error('Aviso fallido',entry.usuario_id,String(err).slice(0,120));
  await fetch(url+'/rest/v1/avisos_altas_fafg?usuario_id=eq.'+encodeURIComponent(entry.usuario_id),{method:'PATCH',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({intentos:entry.intentos+1,ultimo_error:String(err).slice(0,250)})});
  process.exitCode=1;
 }
}
console.log('Solicitudes pendientes revisadas:',pending.length);
