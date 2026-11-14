const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = require('node:path').join(__dirname, '..');
const source = fs.readFileSync(root + '/assets/js/tutoriales-ayuda.js', 'utf8');
const app = fs.readFileSync(root + '/app.html', 'utf8');
const guide = fs.readFileSync(root + '/ayuda-tarjeta-digital.html', 'utf8');
const elements = new Map();
class Element {
  constructor() { this.classes = new Set(); this.classList = { contains: x => this.classes.has(x) }; this.children = []; this.listeners = {}; }
  set id(x) { elements.set(x, this); }
  set innerHTML(x) { for (const m of x.matchAll(/id="([^"]+)"/g)) { const e = new Element(); e.id = m[1]; } }
  setAttribute(k, v) { this[k] = v; }
  append(e) { this.children.push(e); }
  addEventListener(k, v) { this.listeners[k] = v; }
  showModal() { this.open = true; }
  close() { this.open = false; this.listeners.close?.(); }
  remove() { this.removed = true; }
  focus() { this.focused = true; }
}
for (const id of ['instalar', 'fafg-tutorials-open']) { const e = new Element(); e.id = id; }
const get = x => elements.get(x);
let observer;
// No Supabase client or authenticated session is supplied: Help must work for everyone.
vm.runInNewContext(source, {
  document: { getElementById: get, createElement: () => new Element(), head: new Element() },
  MutationObserver: class { constructor(fn) { observer = fn; } observe() {} },
});
get('instalar').classes.add('active');
for (let i = 0; i < 3; i++) {
  get('fafg-tutorials-open').listeners.click();
  const dialog = get('fafg-tutorials-dialog'), frame = dialog.children.at(-1);
  assert.equal(dialog.open, true); assert.match(frame.src, /ayuda-tarjeta-digital.html/);
  assert.equal(frame.sandbox, 'allow-scripts allow-modals');
  get('fafg-tutorials-close').listeners.click();
  assert.equal(dialog.open, false); assert.equal(frame.src, 'about:blank'); assert.equal(frame.removed, true);
}
get('fafg-tutorials-open').listeners.click();
get('instalar').classes.delete('active'); observer();
assert.equal(get('fafg-tutorials-dialog').open, false);
assert.ok(!app.includes('tutoriales-admin.js'));
assert.equal((app.match(/id="fafg-tutorials-open"/g) || []).length, 1);
assert.ok(app.slice(app.indexOf('<section id="instalar"'), app.indexOf('<nav class="bottom-nav"')).includes('id="fafg-tutorials-help"'));
assert.ok(!guide.includes('VISTA PREVIA PRIVADA'));
assert.match(guide, /connect-src 'none'/);
new vm.Script(guide.slice(guide.indexOf('<script>') + 8, guide.lastIndexOf('</script>')));
console.log('PASS: Ayuda sin sesión, acceso único, reapertura, cierre, navegación, iframe aislado y sintaxis de guía.');
