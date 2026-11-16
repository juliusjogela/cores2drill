// Cores2Drill — cookie consent and Google Ads conversion tracking.
//
// Nothing here runs until ADS.id is filled in. Until then there is no tracking,
// no banner and no cookies.
//
// To switch it on, paste the values from Google Ads (Goals > Conversions > each
// action > Tag setup > "Use Google tag" / "Install the tag yourself"):
//   id     -> the "AW-..." conversion ID (the same for all three actions)
//   labels -> the "send_to" label after the slash, one per conversion action
//
// Google's tag only loads after the visitor presses Accept. Reject means no
// Google tag and no cookies. The choice is remembered for 6 months, and the
// "Cookie settings" link in the footer reopens the banner.
(function () {
  var ADS = {
    id: '', // e.g. 'AW-123456789'
    labels: {
      call: '',     // e.g. 'AbCdEfGhIjKlMn'
      whatsapp: '',
      email: ''
    }
  };

  if (!ADS.id) return;

  var KEY = 'c2d-consent';
  var MAX_AGE = 182 * 24 * 60 * 60 * 1000; // ~6 months, per Data Protection Commission guidance
  var loaded = false;

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && (saved.v === 'granted' || saved.v === 'denied') && Date.now() - saved.t < MAX_AGE) {
        return saved.v;
      }
    } catch (e) {}
    return null;
  }

  function saveChoice(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'denied', // no remarketing
      analytics_storage: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', ADS.id);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS.id);
    document.head.appendChild(s);
  }

  // Count taps on the phone, WhatsApp and email links as Google Ads conversions.
  document.addEventListener('click', function (e) {
    if (!loaded) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var kind = null;
    if (/^tel:/i.test(href)) kind = 'call';
    else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) kind = 'whatsapp';
    else if (/^mailto:/i.test(href)) kind = 'email';
    if (kind && ADS.labels[kind]) {
      window.gtag('event', 'conversion', { send_to: ADS.id + '/' + ADS.labels[kind] });
    }
  });

  // ---- Banner ----
  var banner = document.createElement('div');
  banner.className = 'consent';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie choice');
  banner.hidden = true;
  banner.innerHTML =
    '<div class="wrap consent__inner">' +
      '<p>We use Google Ads cookies to see which of our ads lead to calls. ' +
      'They are only set if you accept. <a href="privacy.html">Privacy &amp; cookies</a></p>' +
      '<div class="consent__buttons">' +
        '<button type="button" class="btn btn--sm consent__btn" data-consent="denied">Reject</button>' +
        '<button type="button" class="btn btn--sm consent__btn" data-consent="granted">Accept</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);

  banner.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-consent]');
    if (!btn) return;
    var v = btn.getAttribute('data-consent');
    var had = readChoice();
    saveChoice(v);
    banner.hidden = true;
    if (v === 'granted') {
      loadGoogle();
    } else if (had === 'granted' || loaded) {
      // Withdrawing consent: delete Google's cookies and reload so its tag is gone.
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (/^(_gcl|_ga|_gid)/.test(name)) {
          ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
          });
        }
      });
      location.reload();
    }
  });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () { banner.hidden = false; });
  });

  var choice = readChoice();
  if (choice === 'granted') loadGoogle();
  else if (choice === null) banner.hidden = false;
})();
