const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=fs.existsSync(path.join(__dirname,'js','ranking-public.js'))?__dirname:path.resolve(__dirname,'..');
const lib=fs.readFileSync(path.join(root,'js','ranking-public.js'),'utf8');
const categories=JSON.parse(fs.readFileSync(path.join(root,'data','ranking-categorias-2026.json'),'utf8'));
function runtime(snapshot,data=categories,failure=false){let files=0;const context={window:{},AbortSignal,fetch:async url=>{if(url.includes('/rpc/'))return {ok:true,json:async()=>snapshot};files++;if(failure)return {ok:false};return {ok:true,json:async()=>data};}};vm.createContext(context);vm.runInContext(lib,context);return {api:context.window.FAFGPublishedRanking,fileCalls:()=>files};}
const numeric=value=>Number(String(value).replace(/\./g,'').replace(',','.'));
(async()=>{
 const local=runtime(null);const result=await local.api.profile('TREVOLAZAVALA LUCIANO','General Caballeros');
 assert.equal(result.status,'matched');assert.equal(result.player.points,'2.220,75');assert.equal(result.player.pos,2);assert.equal(result.player.events,'15');
 const csv=fs.readFileSync(path.join(root,'data','ranking-general-2026.csv'),'utf8');const row=csv.split('\n').find(l=>l.includes('TREVOLAZAVALA LUCIANO')).split(',');assert.equal(numeric(result.player.points),Number(row[2]));assert.equal(Number(row[0]),3);
 assert.equal((await local.api.profile('  Luciano   Trevolazavala (43)  ','General Caballeros')).player.points,result.player.points);
 assert.equal((await local.api.profile('Sin jugador correspondiente','General Caballeros')).status,'missing');
 assert.equal((await local.api.profile('','General Caballeros')).status,'missing');
 let matched=0,ambiguous=0;for(const group of categories.categories)for(const player of group.players){const found=await local.api.profile(player.name,group.name);if(player.name==='MORALEDA ANDRES'){assert.equal(found.status,'ambiguous');ambiguous++;continue;}assert.equal(found.status,'matched',player.name);assert.equal(found.player.points,player.points);assert.equal(found.player.hcp,player.hcp);assert.equal(found.player.events,player.events);matched++;}
 assert.equal(local.fileCalls(),1,'one shared fallback snapshot per page');
 const approved=runtime({payload:{schema:'fafg-ranking-v1',updated:'2026-11-14',players:[{name:'TREVOLAZAVALA LUCIANO',category:'General Caballeros',division:'Caballeros',points:3000,hcp:0,events:15,active:true}]}});
 assert.equal((await approved.api.profile('Luciano Trevolazavala','General Caballeros')).player.points,'3.000,00');assert.equal(approved.fileCalls(),0);
 const duplicate=runtime(null,{categories:[{name:'General Caballeros',players:[{name:'José Pérez',points:'0,00'},{name:'PEREZ JOSE',points:'1,00'}]}]});assert.equal((await duplicate.api.profile('Jose Perez','General Caballeros')).status,'ambiguous');
 const scoped=runtime(null,{categories:[{name:'General Damas',players:[{name:'Ana Pérez',points:'0,00'}]},{name:'General Caballeros',players:[{name:'Ana Pérez',points:'1,00'}]}]});assert.equal((await scoped.api.profile('Perez Ana','General Damas')).player.points,'0,00');
 await assert.rejects(()=>runtime(null,categories,true).api.profile('Luciano Trevolazavala','General Caballeros'));
 const app=fs.readFileSync(path.join(root,'app.html'),'utf8');assert.ok(!app.includes("from('rankings')"));let scripts=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(!/src\s*=/.test(m[1])&&m[2].trim()){new vm.Script(m[2]);scripts++;}}
 console.log('PASS: puntos de Luciano iguales al ranking público; '+matched+' coincidencias y '+ambiguous+' filas duplicadas bloqueadas; nombres, categorías, homónimos, ceros, nueva versión, fallos y '+scripts+' scripts inline.');
})().catch(e=>{console.error(e);process.exitCode=1;});
