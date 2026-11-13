const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../app.html'),'utf8');
const source=html.match(/<script id="fafg-career-screen-v2-js">([\s\S]*?)<\/script>/)[1];
const lifecycle=source.slice(source.indexOf('function resetLegacyCareer()'),source.indexOf('const photoFull='));
const classes=()=>{const values=new Set();return {add:x=>values.add(x),remove:x=>values.delete(x),contains:x=>values.has(x)}};
const details=[{open:true},{open:true}],tile={setAttribute(k,v){this[k]=v}},trigger={...tile},career={classList:classes(),querySelectorAll:()=>details},screen={classList:classes(),querySelectorAll:()=>[],querySelector:()=>({focus(){}})},body={classList:classes()},chevron={},focus={count:0,focus(){this.count++}},pane={querySelectorAll:()=>details};
const context={career,trigger,profile:{querySelector:()=>tile},screen,pane,document:{body,activeElement:focus,getElementById:()=>chevron},previousFocus:null,current:'history',season:'2026',hidePhoto(){},syncHeader(){},render(){}};
vm.createContext(context);vm.runInContext(lifecycle,context);
assert.equal(career.classList.contains('hidden'),true);
for(let i=0;i<3;i++){
 vm.runInContext('open()',context);assert.equal(screen.classList.contains('hidden'),false);assert.equal(career.classList.contains('hidden'),true);assert.equal(body.classList.contains('fafg-career-open'),true);
 details.forEach(d=>d.open=true);vm.runInContext('close()',context);
 assert.equal(screen.classList.contains('hidden'),true);assert.equal(body.classList.contains('fafg-career-open'),false);assert.equal(career.classList.contains('hidden'),true);assert.ok(details.every(d=>!d.open));assert.equal(trigger['aria-expanded'],'false');assert.equal(tile['aria-expanded'],'false');
}
assert.equal(focus.count,3);assert.match(html,/#perfil #career-card\{display:none!important\}/);
assert.equal((html.match(/trigger\.addEventListener\('click'/g)||[]).length,1);
assert.ok(!html.includes("getElementById('career-toggle').addEventListener('click'"));
assert.ok(!html.includes("getElementById('career-content')?.scrollIntoView"));
assert.ok(!html.includes('href="./beneficios.html"'));
console.log('PASS: apertura/cierre repetido, lista antigua oculta, detalles cerrados, foco restituido, un solo manejador y acceso Beneficios eliminado.');
