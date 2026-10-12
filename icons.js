/* SimpleMermaid icon set — hand-drawn 24px stroke icons, shared by every page.
 *
 * Why a script instead of an external .svg sprite: the editor must keep working when
 * opened straight from disk (file://), where cross-file <use href="icons.svg#x"> is blocked.
 * This file injects one inline sprite, so `<svg class="icon"><use href="#ico-name"/></svg>`
 * works everywhere, and `smIcon('name')` builds the same markup inside JS strings (toasts etc).
 *
 * Load synchronously as the first thing in <body>:  <script src="icons.js"></script>
 * (use ../icons.js from blog/, guides/, for/).
 */
(function () {
  var I = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    rocket: '<path d="M12 2.5c3.4 2.1 5.4 5.4 5.4 9.3L15 15H9l-2.4-3.2c0-3.9 2-7.2 5.4-9.3z"/><circle cx="12" cy="9.2" r="1.7"/><path d="M9 15l-3 3.6 3.6-.6M15 15l3 3.6-3.6-.6M12 17.2V21.5"/>',
    book: '<path d="M4 5.6C4 4.7 4.7 4 5.6 4H12v15H5.6C4.7 19 4 18.3 4 17.4z"/><path d="M20 5.6c0-.9-.7-1.6-1.6-1.6H12v15h6.4c.9 0 1.6-.7 1.6-1.6z"/>',
    sparkles: '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    lock: '<rect x="5" y="11" width="14" height="9.5" rx="2.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.7" r="1.1"/>',
    bolt: '<path d="M13.2 2.5L5.2 13.6h5.9L10.3 21.5l8.5-11.4h-6z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    export: '<path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 15V4M7.6 8.4L12 4l4.4 4.4"/>',
    download: '<path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 4v11M7.6 10.6L12 15l4.4-4.4"/>',
    tag: '<path d="M3 12.6V4.6A1.6 1.6 0 0 1 4.6 3h8l8.4 8.4a1.6 1.6 0 0 1 0 2.2l-7 7a1.6 1.6 0 0 1-2.2 0z"/><circle cx="8" cy="8" r="1.4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16 9.6"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    warning: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.4" r=".6"/>',
    siren: '<path d="M7 18v-5a5 5 0 0 1 10 0v5"/><path d="M5 18h14M12 3v2M4.6 7l1.5 1.2M19.4 7L17.9 8.2"/>',
    wrench: '<path d="M15.5 4.5a4.5 4.5 0 0 0-5.8 5.8L4 16l4 4 5.7-5.7a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-2.4-.6-.6-2.4z"/>',
    clipboard: '<rect x="6" y="5" width="12" height="16" rx="2"/><path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    box: '<path d="M12 3l8 4v10l-8 4-8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    door: '<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".8"/>',
    save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    refresh: '<path d="M20 11A8 8 0 0 0 5.6 7.2L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14.4 3.8L20 15"/><path d="M20 20v-5h-5"/>',
    database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.2 10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    edit: '<path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 0 2 2 0 0 1 0 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M10.5 21v-4h3v4"/>',
    user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    users: '<circle cx="9" cy="8" r="3.3"/><path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.2a5.2 5.2 0 0 1 4.4 5.3"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2.2h5.2c0-1 .4-1.7 1-2.2A6 6 0 0 0 12 3z"/>',
    hourglass: '<path d="M6 3h12M6 21h12"/><path d="M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    megaphone: '<path d="M4 10v4h3l8 4V6L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>',
    skull: '<path d="M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4 3 5v3h8v-3c1.8-1 3-2.6 3-5a7 7 0 0 0-7-7z"/><circle cx="9.5" cy="11" r="1.2"/><circle cx="14.5" cy="11" r="1.2"/><path d="M10.5 18v2M13.5 18v2"/>',
    broom: '<path d="M17 3l4 4-7 7-4-4z"/><path d="M10 10l-5 5-2 6 6-2 5-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    trophy: '<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 14v4M8.5 20h7"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9v5"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    'arrow-right': '<path d="M4 12h16M14 6l6 6-6 6"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5"/>',
    shuffle: '<path d="M3 7h3.5c5 0 5.5 10 10.5 10H21M17 14l4 3-4 3"/><path d="M3 17h3.5c1.8 0 3-1 4-2.4M13.5 8.4C14.5 7.4 15.7 7 17 7h4M17 4l4 3-4 3"/>',
    diamond: '<path d="M12 3l9 9-9 9-9-9z"/>',
    plane: '<path d="M2.5 13.5l8.5-3V5a1.5 1.5 0 0 1 3 0v5.5l8.5 3V16l-8.5-2v4.2l2.2 1.6V22L12.5 21l-4.2 1v-2.2l2.2-1.6V14l-8 2z"/>',
    car: '<path d="M3 15.5l1.4-4.3A2 2 0 0 1 6.3 9.8H15a3 3 0 0 1 2.3 1.1L21 14v1.5z"/><circle cx="7.5" cy="17.2" r="1.8"/><circle cx="16.8" cy="17.2" r="1.8"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5M12 3v3"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.5-1.8-.3-1 .4-2.2 1.6-2.2H17a4 4 0 0 0 4-4C21 6.8 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8"/><circle cx="12" cy="17.2" r=".6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".6"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14c.9 1.4 2.1 2 3.5 2s2.6-.6 3.5-2"/><circle cx="9" cy="9.8" r=".8"/><circle cx="15" cy="9.8" r=".8"/>',
    meh: '<circle cx="12" cy="12" r="9"/><path d="M8.5 15h7"/><circle cx="9" cy="9.8" r=".8"/><circle cx="15" cy="9.8" r=".8"/>',
    frown: '<circle cx="12" cy="12" r="9"/><path d="M8.5 16c.9-1.4 2.1-2 3.5-2s2.6.6 3.5 2"/><circle cx="9" cy="9.8" r=".8"/><circle cx="15" cy="9.8" r=".8"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3.5 3.5 0 0 0 2.5 5.5A3 3 0 0 0 12 19V5a3 3 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3.5 3.5 0 0 1-2.5 5.5A3 3 0 0 1 12 19"/>',
    sound: '<path d="M4 10v4h3.5L12 18V6L7.5 10z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    cat: '<path d="M5 9V4l4 3h6l4-3v5a7 7 0 0 1-14 0z"/><circle cx="9.5" cy="11.5" r=".8"/><circle cx="14.5" cy="11.5" r=".8"/>',
    run: '<circle cx="14" cy="4.8" r="1.8"/><path d="M11 21l2-6-3-2.5 1-4.5 3.5 2 2.5 1M7 12l3-2M13 15l3 5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>'
  };

  var parts = [];
  for (var k in I) parts.push('<symbol id="ico-' + k + '" viewBox="0 0 24 24">' + I[k] + '</symbol>');
  var sprite = '<svg id="sm-icon-sprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + parts.join('') + '</defs></svg>';

  function inject() {
    if (document.getElementById('sm-icon-sprite')) return;
    document.body.insertAdjacentHTML('afterbegin', sprite);
  }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);

  // Base look for every <svg class="icon">; pages can override size/colour in their own CSS.
  if (!document.getElementById('sm-icon-style')) {
    var st = document.createElement('style');
    st.id = 'sm-icon-style';
    st.textContent = '.icon{width:1.15em;height:1.15em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none;vertical-align:-0.2em}';
    (document.head || document.documentElement).appendChild(st);
  }

  window.smIcon = function (name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#ico-' + name + '"/></svg>';
  };
  window.SM_ICONS = I;
})();
