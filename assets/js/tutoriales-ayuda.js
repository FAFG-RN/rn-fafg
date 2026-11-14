(function () {
  'use strict';
  const help = document.getElementById('instalar');
  const trigger = document.getElementById('fafg-tutorials-open');
  if (!help || !trigger) return;
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
  const dialog = document.createElement('dialog');
  dialog.id = 'fafg-tutorials-dialog';
  dialog.setAttribute('aria-label', 'Cómo usar la tarjeta digital');
  dialog.innerHTML = '<div class="tutorials-toolbar"><strong>Cómo usar la tarjeta digital</strong><button type="button" id="fafg-tutorials-close">Volver a Ayuda</button></div>';
  help.append(dialog);
  const back = document.getElementById('fafg-tutorials-close');
  let frame = null;
  function clear() {
    if (frame) { frame.src = 'about:blank'; frame.remove(); frame = null; }
  }
  function close(restoreFocus = false) {
    clear();
    if (dialog.open) dialog.close();
    if (restoreFocus) trigger.focus();
  }
  trigger.addEventListener('click', () => {
    if (!help.classList.contains('active')) return;
    clear();
    frame = document.createElement('iframe');
    frame.title = 'Videos y práctica de tarjeta digital';
    // The guide never receives the account session or access to parent storage.
    frame.setAttribute('sandbox', 'allow-scripts allow-modals');
    frame.setAttribute('allow', 'fullscreen');
    frame.src = './ayuda-tarjeta-digital.html?v=20261114';
    dialog.append(frame);
    dialog.showModal();
    back.focus();
  });
  back.addEventListener('click', () => close(true));
  dialog.addEventListener('cancel', clear);
  dialog.addEventListener('close', clear);
  new MutationObserver(() => {
    if (!help.classList.contains('active')) close();
  }).observe(help, { attributes: true, attributeFilter: ['class'] });
})();
