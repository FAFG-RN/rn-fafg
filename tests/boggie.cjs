const assert=require('node:assert/strict');
const {resolve,topics}=require('../assets/js/boggie.js');
for(const [q,id] of [['¿Dónde veo mi posición?','ranking'],['¿Cómo me inscribo?','torneos'],['¿Dónde veo mis scores?','scores'],['¿Cómo instalar?','ayuda'],['Quiero pagar la cuota','socio'],['¿Cuál es mi HCP?','perfil'],['Hola, necesito otra cosa',null],['No es eso, mi ranking no coincide',null],['¿Va a llover mañana?',null],['<script>alert(1)</script>',null]])assert.equal(resolve(q),id,q);
for(const t of Object.values(topics))for(const r of t.related)assert.ok(topics[r]);
console.log('Respuestas: 10 casos correctos y sugerencias válidas.');
