(function () {
  'use strict';
  const OWNER = '6d2887ea-5b84-4ee3-84d4-8a88a36da00c';
  const profile = document.getElementById('perfil');
  const privateProfile = document.getElementById('private-profile');
  if (!profile || !privateProfile || typeof client === 'undefined' || !client) return;

  const style = document.createElement('style');
  style.textContent = `
    #fafg-tutorials-preview.hidden{display:none!important}
    #fafg-tutorials-preview{margin-top:14px;padding:0;overflow:hidden}
    #fafg-tutorials-open{width:100%;border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:14px;text-align:left;padding:18px 16px;font:inherit;cursor:pointer}
    #fafg-tutorials-open img{width:72px;height:46px;object-fit:contain;flex:none}
    #fafg-tutorials-open .tutorials-copy{flex:1;min-width:0}
    #fafg-tutorials-open strong{display:block;font-size:16px}
    #fafg-tutorials-open small{display:block;margin-top:5px;font-size:12px;line-height:1.4;opacity:.85}
    #fafg-tutorials-open .tutorials-chevron{font-size:25px}
    #fafg-tutorials-dialog{width:min(100vw,900px);max-width:100vw;height:100dvh;max-height:100dvh;margin:auto;padding:0;border:0;border-radius:16px;background:#071b35;color:#fff;overflow:hidden}
    #fafg-tutorials-dialog::backdrop{background:rgba(0,12,30,.8)}
    #fafg-tutorials-dialog .tutorials-toolbar{height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;border-bottom:1px solid #50769a}
    #fafg-tutorials-dialog .tutorials-toolbar strong{font-size:14px}
    #fafg-tutorials-close{font:inherit;padding:10px 15px;border:1px solid #50769a;border-radius:10px;background:#154e7a;color:white;cursor:pointer}
    #fafg-tutorials-dialog iframe{display:block;border:0;width:100%;height:calc(100% - 64px);background:#071b35}
    #fafg-tutorials-status{padding:16px;margin:0;font-size:14px;line-height:1.5}
    #fafg-tutorials-open:focus-visible,#fafg-tutorials-close:focus-visible{outline:3px solid #ffc75a;outline-offset:-4px}
    @media(max-width:600px){#fafg-tutorials-dialog{border-radius:0}}
  `;
  document.head.append(style);
  const card = document.createElement('section');
  card.id = 'fafg-tutorials-preview';
  card.className = 'card hidden';
  card.hidden = true;
  card.innerHTML = '<button type="button" id="fafg-tutorials-open" aria-haspopup="dialog" aria-controls="fafg-tutorials-dialog"><img src="./assets/images/FAFG-Horizontal-2.png" alt="FAFG"><span class="tutorials-copy"><strong>Cómo usar la tarjeta digital</strong><small>Una línea y Live Score con amigos · Vista previa privada</small></span><span class="tutorials-chevron" aria-hidden="true">›</span></button>';
  privateProfile.insertBefore(card, document.getElementById('fafg-admin-entry'));

  const dialog = document.createElement('dialog');
  dialog.id = 'fafg-tutorials-dialog';
  dialog.setAttribute('aria-label', 'Tutoriales de la tarjeta digital · Vista previa privada');
  dialog.innerHTML = '<div class="tutorials-toolbar"><strong>Tutoriales · Vista previa</strong><button type="button" id="fafg-tutorials-close">Volver a mi perfil</button></div><p id="fafg-tutorials-status" role="status" aria-live="polite"></p>';
  profile.append(dialog);
  const trigger = document.getElementById('fafg-tutorials-open');
  const closeButton = document.getElementById('fafg-tutorials-close');
  const status = document.getElementById('fafg-tutorials-status');
  let generation = 0, openGeneration = 0, eligibleUser = null, frame = null;

  function clearPreview() {
    openGeneration++;
    if (frame) { frame.srcdoc = ''; frame.remove(); frame = null; }
    status.hidden = false;
    status.textContent = '';
    trigger.disabled = false;
  }
  function closePreview(restoreFocus = false) {
    clearPreview();
    if (dialog.open) dialog.close();
    if (restoreFocus && !card.hidden) trigger.focus();
  }
  function deny() {
    eligibleUser = null;
    card.hidden = true;
    card.classList.add('hidden');
    closePreview();
  }
  async function refreshAccess() {
    const version = ++generation;
    try {
      const { data, error } = await client.auth.getUser();
      if (version !== generation) return;
      if (error || data?.user?.id !== OWNER) { deny(); return; }
      const result = await client.rpc('is_fafg_admin');
      if (version !== generation) return;
      if (result.error || result.data !== true) { deny(); return; }
      eligibleUser = data.user.id;
      card.hidden = false;
      card.classList.remove('hidden');
    } catch (_) { if (version === generation) deny(); }
  }
  trigger.addEventListener('click', async () => {
    if (eligibleUser !== OWNER || !profile.classList.contains('active')) return;
    closePreview();
    const version = ++openGeneration;
    dialog.showModal();
    closeButton.focus();
    status.textContent = 'Abriendo los tutoriales…';
    trigger.disabled = true;
    try {
      // The server checks the verified user ID and is_fafg_admin before returning any media.
      const { data, error } = await client.functions.invoke('tutoriales-admin-preview', { body: {} });
      if (version !== openGeneration || !dialog.open || eligibleUser !== OWNER) return;
      if (error || typeof data?.html !== 'string') throw new Error('preview-unavailable');
      frame = document.createElement('iframe');
      frame.title = 'Cómo usar la tarjeta digital: videos y práctica';
      // Opaque origin: the guide cannot read the parent account or session storage.
      frame.setAttribute('sandbox', 'allow-scripts allow-modals');
      frame.setAttribute('allow', 'fullscreen');
      frame.srcdoc = data.html;
      status.hidden = true;
      dialog.append(frame);
    } catch (_) {
      if (version === openGeneration && dialog.open) {
        status.textContent = 'No pudimos abrir la vista previa. Revisá tu conexión y volvé a intentarlo desde tu perfil.';
      }
    } finally { if (version === openGeneration) trigger.disabled = false; }
  });
  closeButton.addEventListener('click', () => closePreview(true));
  dialog.addEventListener('cancel', () => { clearPreview(); });
  dialog.addEventListener('close', () => { clearPreview(); });
  new MutationObserver(() => {
    if (!profile.classList.contains('active') || privateProfile.classList.contains('hidden')) closePreview();
  }).observe(profile, { attributes: true, attributeFilter: ['class'], subtree: true });
  client.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' || event === 'PASSWORD_RECOVERY') { generation++; deny(); return; }
    // Supabase auth callbacks must return before starting another auth request.
    setTimeout(refreshAccess, 0);
  });
  void refreshAccess();
})();
