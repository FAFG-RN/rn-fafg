/* One public source for approved snapshots; existing files remain the fallback. */
(function(root){
 const origin='https://kkrzqxiomkorxyjlnjqc.supabase.co';
 const key='sb_publishable_9BJJ0ZYFX1B6hkmG-wUbhg_llNAeGc5';
 let pending;
 async function latest(){if(!pending)pending=(async()=>{try{const response=await fetch(origin+'/rest/v1/rpc/get_fafg_ranking',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(7000),cache:'no-store'});if(!response.ok)return null;const value=await response.json();return value?.payload?.schema==='fafg-ranking-v1'&&Array.isArray(value.payload.players)?value:null}catch{return null}})();return pending}
 function rank(players){let last=null,position=0;return players.filter(p=>p.active!==false).slice().sort((a,b)=>b.points-a.points||a.name.localeCompare(b.name,'es')).map((p,i)=>{if(p.points!==last)position=i+1;last=p.points;return {...p,position}})}
 const fmt=n=>Number(n).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
 function categories(payload){return [...new Set(payload.players.filter(p=>p.active!==false&&!/juvenil|junior|sin categor/i.test(p.category)).map(p=>p.category))].map(name=>({name,players:rank(payload.players.filter(p=>p.category===name)).map(p=>({...p,pos:p.position,points:fmt(p.points)}))}))}
 function general(payload,division='Caballeros'){return rank(payload.players.filter(p=>p.division===division)).map(p=>({position:p.position,name:p.name,points:p.points.toFixed(2),hcp:Number(p.hcp)||0,tournaments:Number(p.events)||0,origin:p.city||'',card15:Number(p.card15)||0,card16:Number(p.card16)||0,pointsLost:Number(p.pointsLost)||0,changes:Number(p.changes)||0,lastUpdate:payload.updated,columns:[]}))}
 root.FAFGPublishedRanking={latest,rank,categories,general};
})(window);
