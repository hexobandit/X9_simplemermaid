/**
 * SimpleMermaid cross-promo toast.
 * Shows a small dismissable card promoting sister sites, in rotation.
 * Politeness rules:
 *  - appears only after DWELL_MS of *visible* page time (timer pauses on hidden tab)
 *  - at most once per browser session, and at most once per 12h across pages
 *  - dismissing (×) snoozes all promos for 12h; clicking through snoozes 48h
 *  - never modal, never blocks content, Escape closes it
 * Config: <script src="promo.js" data-delay="60000"> overrides the dwell time.
 */
(function () {
    'use strict';

    var SITES = [
        {
            id: 'defensemodeling',
            url: 'https://defensemodeling.com',
            name: 'DefenseModeling.com',
            tag: 'Threat modeling, reversed',
            desc: 'Answer plain questions about your app or server and get a visual defense diagram. Free, no signup.',
            emoji: '🛡️'
        },
        {
            id: 'aircrafttracker',
            url: 'https://military-aircraft-tracker.com',
            name: 'Military Aircraft Tracker',
            tag: 'Live military & government aircraft',
            desc: 'Watch reconnaissance flights and presidential transports live on a real-time ADS-B map.',
            emoji: '✈️'
        },
        {
            id: 'legenderby',
            url: 'https://legenderby.io',
            name: 'Legenderby.io',
            tag: 'Crash. Smash. Survive.',
            desc: 'A destruction-derby browser game with physics-based mayhem. Take a break, wreck a car.',
            emoji: '🏎️'
        }
    ];

    var LS_SNOOZE = 'simplemermaid-promo-snooze-until';
    var LS_LAST_SHOWN = 'simplemermaid-promo-last-shown';
    var LS_ROTATION = 'simplemermaid-promo-index';
    var SS_SESSION = 'simplemermaid-promo-session';

    var HOUR = 60 * 60 * 1000;
    var SHOW_COOLDOWN = 12 * HOUR;  // min gap between impressions
    var SNOOZE_DISMISS = 12 * HOUR; // after clicking ×
    var SNOOZE_CLICK = 48 * HOUR;   // after clicking through

    var script = document.currentScript;
    var DWELL_MS = (script && parseInt(script.getAttribute('data-delay'), 10)) || 30000;

    function lsGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function lsSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
    }

    function shouldShow() {
        try {
            if (sessionStorage.getItem(SS_SESSION)) return false;
        } catch (e) { /* ignore */ }
        var now = Date.now();
        var snoozeUntil = parseInt(lsGet(LS_SNOOZE), 10) || 0;
        if (now < snoozeUntil) return false;
        var lastShown = parseInt(lsGet(LS_LAST_SHOWN), 10) || 0;
        if (now - lastShown < SHOW_COOLDOWN) return false;
        return true;
    }

    function pickSite() {
        var idx = (parseInt(lsGet(LS_ROTATION), 10) || 0) % SITES.length;
        lsSet(LS_ROTATION, String((idx + 1) % SITES.length));
        return SITES[idx];
    }

    function injectStyles() {
        var css = '' +
            '.sm-promo{position:fixed;bottom:20px;right:20px;z-index:9999;max-width:330px;' +
            'background:var(--bg-primary,#ffffff);color:var(--text-primary,#1f2937);' +
            'border:1px solid var(--border,#e5e7eb);border-radius:var(--radius,12px);' +
            'box-shadow:0 20px 50px rgba(0,0,0,.18);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
            'padding:16px 16px 14px;opacity:0;transform:translateY(16px);' +
            'transition:opacity .35s ease,transform .35s ease}' +
            '.sm-promo.sm-promo-in{opacity:1;transform:translateY(0)}' +
            '.sm-promo-kicker{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}' +
            '.sm-promo-kicker span{font-size:.68rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;' +
            'color:var(--text-muted,#9ca3af)}' +
            '.sm-promo-close{background:none;border:none;cursor:pointer;padding:2px 6px;line-height:1;' +
            'font-size:1.05rem;color:var(--text-muted,#9ca3af);border-radius:6px}' +
            '.sm-promo-close:hover{color:var(--text-primary,#1f2937);background:var(--bg-secondary,#f8fafc)}' +
            '.sm-promo-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:.95rem;margin-bottom:2px}' +
            '.sm-promo-tag{font-size:.78rem;font-weight:600;margin-bottom:6px;' +
            'background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;background-clip:text;' +
            '-webkit-text-fill-color:transparent;color:#6366f1}' +
            '.sm-promo-desc{font-size:.82rem;line-height:1.45;color:var(--text-secondary,#6b7280);margin-bottom:10px}' +
            '.sm-promo-cta{display:inline-block;font-size:.82rem;font-weight:600;text-decoration:none;' +
            'color:#fff;background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:7px 14px;border-radius:8px}' +
            '.sm-promo-cta:hover{filter:brightness(1.08)}' +
            '[data-theme="dark"] .sm-promo{box-shadow:0 20px 50px rgba(0,0,0,.5)}' +
            '@media (max-width:600px){.sm-promo{left:12px;right:12px;bottom:12px;max-width:none}}' +
            '@media (prefers-reduced-motion:reduce){.sm-promo{transition:none;transform:none}}';
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function markShown() {
        try { sessionStorage.setItem(SS_SESSION, '1'); } catch (e) { /* ignore */ }
        lsSet(LS_LAST_SHOWN, String(Date.now()));
    }

    function track(action, siteId) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', action, { event_category: 'cross_promo', event_label: siteId });
        }
    }

    function showToast() {
        var site = pickSite();
        injectStyles();

        var toast = document.createElement('aside');
        toast.className = 'sm-promo';
        toast.setAttribute('aria-label', 'More from the maker of SimpleMermaid');
        toast.innerHTML =
            '<div class="sm-promo-kicker"><span>From the maker of SimpleMermaid</span>' +
            '<button class="sm-promo-close" type="button" aria-label="Dismiss">&times;</button></div>' +
            '<div class="sm-promo-title">' + site.emoji + ' ' + site.name + '</div>' +
            '<div class="sm-promo-tag">' + site.tag + '</div>' +
            '<div class="sm-promo-desc">' + site.desc + '</div>' +
            '<a class="sm-promo-cta" href="' + site.url + '" target="_blank" rel="noopener">Check it out →</a>';
        document.body.appendChild(toast);

        markShown();
        track('promo_impression', site.id);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () { toast.classList.add('sm-promo-in'); });
        });

        function close(snoozeMs) {
            lsSet(LS_SNOOZE, String(Date.now() + snoozeMs));
            toast.classList.remove('sm-promo-in');
            document.removeEventListener('keydown', onKey);
            setTimeout(function () { toast.remove(); }, 400);
        }
        function onKey(e) {
            if (e.key === 'Escape') close(SNOOZE_DISMISS);
        }

        toast.querySelector('.sm-promo-close').addEventListener('click', function () {
            track('promo_dismiss', site.id);
            close(SNOOZE_DISMISS);
        });
        toast.querySelector('.sm-promo-cta').addEventListener('click', function () {
            track('promo_click', site.id);
            close(SNOOZE_CLICK);
        });
        document.addEventListener('keydown', onKey);
    }

    function scheduleShow() {
        // Count only time the tab is actually visible toward the dwell delay.
        var remaining = DWELL_MS;
        var startedAt = null;
        var timer = null;

        function arm() {
            startedAt = Date.now();
            timer = setTimeout(fire, remaining);
        }
        function pause() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                remaining -= Date.now() - startedAt;
            }
        }
        function fire() {
            document.removeEventListener('visibilitychange', onVisibility);
            showToast();
        }
        function onVisibility() {
            if (document.hidden) pause();
            else if (!timer) arm();
        }

        document.addEventListener('visibilitychange', onVisibility);
        if (!document.hidden) arm();
    }

    function init() {
        if (!shouldShow()) return;
        scheduleShow();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
