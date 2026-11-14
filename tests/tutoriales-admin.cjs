const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/js/tutoriales-admin.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.html'), 'utf8');
const OWNER = '6d2887ea-5b84-4ee3-84d4-8a88a36da00c';

function setup(userId, admin = true) {
  const elements = new Map();
  class Element {
    constructor() {
      this.hidden = false; this.open = false; this.listeners = {}; this.children = []; this.classes = new Set();
      this.classList = { add: x => this.classes.add(x), remove: x => this.classes.delete(x), contains: x => this.classes.has(x) };
    }
    set id(value) { this._id = value; elements.set(value, this); }
    get id() { return this._id; }
    set className(value) { this.classes = new Set(value.split(' ')); }
    set innerHTML(value) { for (const m of value.matchAll(/id="([^"]+)"/g)) { const e = new Element(); e.id = m[1]; } }
    setAttribute(k, v) { this[k] = v; }
    append(e) { this.children.push(e); }
    insertBefore(e) { this.children.push(e); }
    addEventListener(k, fn) { this.listeners[k] = fn; }
    showModal() { this.open = true; }
    close() { this.open = false; this.listeners.close?.(); }
    remove() { this.removed = true; }
    focus() { this.focused = true; }
  }
  for (const id of ['perfil', 'private-profile', 'fafg-admin-entry']) { const e = new Element(); e.id = id; }
  elements.get('perfil').classes.add('active');
  const state = { userId, admin, invokeCount: 0, observers: [] };
  const client = {
    auth: { getUser: async () => ({ data: { user: state.userId ? { id: state.userId } : null } }), onAuthStateChange: fn => { state.authEvent = fn; } },
    rpc: async () => ({ data: state.admin }),
    functions: { invoke: async () => { state.invokeCount++; return { data: { html: '<html>DEMO</html>' } }; } },
  };
  const document = { getElementById: id => elements.get(id), createElement: () => new Element(), head: new Element() };
  vm.runInNewContext(script, { document, client, setTimeout, MutationObserver: class { constructor(fn) { state.observers.push(fn); } observe() {} } });
  return { state, elements };
}
const tick = () => new Promise(r => setImmediate(r));
(async () => {
  const { createPreviewHandler } = await import('../supabase/functions/tutoriales-admin-preview/handler.ts');
  const html = '<html>PRIVATE_MEDIA</html>';
  async function request({ id = OWNER, admin = true, token = 'user-token', origin = 'https://fafg-rn.github.io', method = 'POST', throws = false } = {}) {
    const handler = createPreviewHandler({ url: 'https://example.supabase.co', anonKey: 'public-key', html, fetcher: async url => {
      if (throws) throw Error('network');
      return new Response(JSON.stringify(url.endsWith('/auth/v1/user') ? { id } : admin));
    } });
    const headers = { Origin: origin }; if (token) headers.Authorization = 'Bearer ' + token;
    return handler(new Request('https://example.test', { method, headers }));
  }
  assert.equal((await request({ token: '' })).status, 401);
  for (const config of [{ id: 'another-admin' }, { admin: false }, { origin: 'https://other.test' }]) {
    const res = await request(config); assert.equal(res.status, 403); assert.ok(!(await res.text()).includes('PRIVATE_MEDIA'));
  }
  assert.equal((await request({ method: 'GET' })).status, 405);
  assert.equal((await request({ throws: true })).status, 503);
  const valid = await request(); assert.equal(valid.status, 200); assert.equal((await valid.json()).html, html);
  assert.match(valid.headers.get('cache-control'), /no-store/);
  assert.equal((await request({ method: 'OPTIONS', token: '' })).status, 204);

  for (const [id, admin] of [[null, true], ['ordinary-player', true], [OWNER, false]]) {
    const env = setup(id, admin); await tick();
    assert.equal(env.elements.get('fafg-tutorials-preview').hidden, true);
    assert.equal(env.state.invokeCount, 0);
  }
  const env = setup(OWNER); await tick();
  const get = id => env.elements.get(id);
  assert.equal(get('fafg-tutorials-preview').hidden, false);
  await get('fafg-tutorials-open').listeners.click();
  assert.equal(get('fafg-tutorials-dialog').open, true);
  assert.equal(env.state.invokeCount, 1);
  const frame = get('fafg-tutorials-dialog').children.find(x => x.title);
  assert.equal(frame.sandbox, 'allow-scripts allow-modals'); assert.ok(!frame.sandbox.includes('allow-same-origin'));
  get('fafg-tutorials-close').listeners.click(); assert.equal(frame.removed, true); assert.equal(frame.srcdoc, '');
  await get('fafg-tutorials-open').listeners.click();
  env.state.userId = null; env.state.authEvent('SIGNED_OUT');
  assert.equal(get('fafg-tutorials-preview').hidden, true); assert.equal(get('fafg-tutorials-dialog').open, false);

  const race = setup(OWNER); race.state.authEvent('SIGNED_OUT'); await tick();
  assert.equal(race.elements.get('fafg-tutorials-preview').hidden, true);
  assert.equal((app.match(/tutoriales-admin\.js/g) || []).length, 0);
  assert.ok(app.includes('tutoriales-ayuda.js'));
  assert.ok(!app.includes('PRIVATE_MEDIA'));
  const previewPath = path.join(root, 'supabase/functions/tutoriales-admin-preview/preview.ts');
  if (fs.existsSync(previewPath)) {
  const preview = fs.readFileSync(previewPath, 'utf8');
  const source = JSON.parse(preview.slice(preview.indexOf(' = ') + 3).trim().replace(/;$/, ''));
  const inline = source.slice(source.indexOf('<script>') + 8, source.lastIndexOf('</script>'));
  new vm.Script(inline);
  assert.match(source, /connect-src 'none'/);
  assert.match(source, /data:image\/png;base64,/);
  assert.ok(!source.includes('api.qrserver.com'));
  }
  console.log('PASS: permisos de servidor, cuenta única, cierre, salida de sesión, respuesta tardía, iframe aislado y guía sin red.');
})().catch(e => { console.error(e.message); process.exit(1); });
