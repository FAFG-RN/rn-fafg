const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const E=require('../js/admin/ranking-engine.js');
const base=JSON.parse(fs.readFileSync('data/ranking-admin-base-2026.json')).players;
assert.equal(base.length,278);assert.equal(new Set(base.map(p=>p.id)).size,278);
const mario=base.find(p=>p.name==='BOERO MARIO');assert.ok(mario);assert.equal(mario.points,1871.18);
let review=E.compare(base,[{name:'Mário Boero (45)',points:1900,category:mario.category}]);let r=review.find(r=>r.incoming);assert.equal(r.before.id,mario.id);assert.equal(r.status,'changed');
assert.throws(()=>E.candidate(base,review),/sin confirmar/);review.forEach(r=>r.status='confirmed');const result=E.candidate(base,review);assert.equal(result.find(p=>p.id===mario.id).points,1900);assert.equal(mario.points,1871.18);
const original={id:'one',name:'Jugador',points:1,category:'Senior Caballeros',division:'Caballeros',cards:[{scores:[3,4]}],profile:{city:'Tandil'}};review=E.compare([original],[{name:'Jugador',points:2,category:'Senior Caballeros'}]);review[0].status='confirmed';assert.deepEqual(E.candidate([original],review)[0].cards,original.cards);assert.deepEqual(E.candidate([original],review)[0].profile,original.profile);
assert.ok(!('cards' in E.publicPayload([original]).players[0]));assert.ok(!('profile' in E.publicPayload([original]).players[0]));
assert.equal(E.compare([original],[{name:'Jugador',points:NaN}])[0].locked,true);
assert.equal(E.compare([original],[{name:'Jugador',points:1},{name:'Jugador',points:1}])[0].locked,true);
assert.equal(E.compare([original,{...original,id:'two'}],[{name:'Jugador',points:1}])[0].status,'pending');assert.equal(E.compare([original,{...original,id:'two'}],[{name:'Jugador',points:1}])[0].before,null);
assert.equal(E.compare([original],[])[0].status,'pending');assert.equal(E.number('1.234,56'),1234.56);assert.ok(Number.isNaN(E.number('')));assert.ok(Number.isNaN(E.number(-3)));
assert.deepEqual(E.rank([{name:'A',points:2},{name:'B',points:2},{name:'C',points:1}]).map(p=>p.position),[1,1,3]);
const ctx={window:{},AbortSignal,fetch:async()=>({ok:false})};vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/ranking-public.js','utf8'),ctx);const publicApi=ctx.window.FAFGPublishedRanking;
assert.equal(publicApi.general(E.publicPayload(base)).length,262);assert.equal(publicApi.general(E.publicPayload(base),'Damas').length,16);assert.equal(publicApi.categories(E.publicPayload(base)).length,6);
const missing=E.compare([original],[]);missing[0].status='confirmed';missing[0].action='exclude';assert.equal(E.candidate([original],missing)[0].active,false);assert.deepEqual(E.candidate([original],missing)[0].cards,original.cards);
// Round-trip the actual Excel library, not a mock parser.
const sheetContext={};vm.createContext(sheetContext);vm.runInContext(fs.readFileSync('vendor/xlsx-0.20.3.min.js','utf8'),sheetContext);const X=sheetContext.XLSX;const wb=X.utils.book_new();X.utils.book_append_sheet(wb,X.utils.json_to_sheet([{Nombre:'BOERO MARIO',Puntos:1900}]),'General');const bytes=X.write(wb,{type:'array',bookType:'xlsx'});const restored=X.read(bytes,{type:'array'});assert.equal(X.utils.sheet_to_json(restored.Sheets.General)[0].Puntos,1900);
console.log('Ranking tests passed: current 278-player base, Mario, identity, homonyms, cards, profiles, exclusions, ties, public views and XLSX round-trip.');
