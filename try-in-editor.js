/**
 * "Try in Editor" links for Mermaid code examples.
 * Scans .code-block elements, detects real Mermaid content by its first
 * keyword (skips bash/YAML/JS/markdown examples), and appends a button that
 * deep-links into the editor via the #diagram=<lzstring> share format.
 * LZ-String is loaded on demand from the same CDN build the editor uses.
 * Skips blocks that already have a hand-authored try/example link nearby.
 */
(function () {
    'use strict';

    var LZ_SRC = 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js';
    var LZ_SRI = 'sha384-0d+Gr7vM4Drod8E3hXKgciWJSWbjD/opKLLygI9ktiWbuvlDwQLzU46wJ9s5gsp7';

    var MERMAID_KEYWORDS = /^(graph|flowchart(-elk)?|sequenceDiagram|classDiagram(-v2)?|stateDiagram(-v2)?|erDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|sankey(-beta)?|xychart(-beta)?|block-beta|kanban|packet(-beta)?|architecture(-beta)?|radar-beta|treemap(-beta)?|venn-beta|ishikawa|eventmodeling|cynefin-beta|swimlane-beta|railroad(-ebnf|-abnf|-peg)?-beta|treeView-beta|wardley-beta)\b/;

    // Editor path relative to the current page, derived from this script's src
    // ("try-in-editor.js" at root, "../try-in-editor.js" from blog/ etc.)
    var script = document.currentScript;
    var base = script ? script.getAttribute('src').replace(/try-in-editor\.js.*$/, '') : '';
    var EDITOR = base + 'mermaid-tool.html';

    function firstMeaningfulLine(text) {
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line && line.indexOf('%%') !== 0) return line;
        }
        return '';
    }

    function isMermaid(text) {
        return MERMAID_KEYWORDS.test(firstMeaningfulLine(text));
    }

    // Skip blocks with a hand-authored editor link in the next couple of
    // elements (e.g. the learn page's "Try It Live" example headers).
    function hasNearbyManualLink(block) {
        var el = block;
        for (var i = 0; i < 2; i++) {
            el = el.nextElementSibling;
            if (!el || el.classList.contains('code-block')) return false;
            if (el.querySelector('a[href*="#diagram="], a[href*="?example="]')) return true;
        }
        return false;
    }

    function dedent(text) {
        var lines = text.replace(/^\n+|\s+$/g, '').split('\n');
        var indent = null;
        lines.forEach(function (line) {
            if (!line.trim()) return;
            var lead = line.match(/^[ \t]*/)[0].length;
            indent = indent === null ? lead : Math.min(indent, lead);
        });
        return lines.map(function (line) { return line.slice(indent || 0); }).join('\n');
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.textContent =
            '.try-editor-row{text-align:right;margin:-0.75rem 0 1.25rem}' +
            '.try-editor-link{display:inline-block;background:var(--primary,#6366f1);color:#fff;' +
            'padding:0.4rem 0.9rem;border-radius:8px;text-decoration:none;font-weight:500;' +
            'font-size:0.85rem;transition:all .2s ease}' +
            '.try-editor-link:hover{background:var(--primary-hover,#4f46e5);transform:translateY(-1px)}';
        document.head.appendChild(style);
    }

    function addLinks() {
        var blocks = document.querySelectorAll('.code-block');
        var added = 0;
        blocks.forEach(function (block) {
            var code = dedent(block.textContent);
            if (!isMermaid(code) || hasNearbyManualLink(block)) return;
            var row = document.createElement('div');
            row.className = 'try-editor-row';
            var a = document.createElement('a');
            a.className = 'try-editor-link';
            a.href = EDITOR + '#diagram=' + window.LZString.compressToEncodedURIComponent(code);
            a.textContent = 'Try in Editor →';
            a.addEventListener('click', function () {
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'try_in_editor', { event_category: 'engagement', event_label: location.pathname });
                }
            });
            row.appendChild(a);
            block.insertAdjacentElement('afterend', row);
            added++;
        });
        return added;
    }

    function ensureLZString(cb) {
        if (window.LZString) { cb(); return; }
        var s = document.createElement('script');
        s.src = LZ_SRC;
        s.integrity = LZ_SRI;
        s.crossOrigin = 'anonymous';
        s.onload = cb;
        document.head.appendChild(s);
    }

    function init() {
        var hasCandidate = Array.prototype.some.call(
            document.querySelectorAll('.code-block'),
            function (b) { return isMermaid(b.textContent); }
        );
        if (!hasCandidate) return;
        injectStyles();
        ensureLZString(addLinks);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
