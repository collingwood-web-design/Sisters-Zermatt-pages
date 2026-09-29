(function () {
  if (/\.github\.io$/i.test(location.hostname)) {
    var robots = document.querySelector('meta[name="robots"]') || document.head.appendChild(document.createElement("meta"));
    robots.name = "robots";
    robots.content = "noindex, nofollow";
  }

  var toggle = document.querySelector(".menu-toggle");
  var overlay = document.querySelector(".nav-overlay");
  var closeBtn = document.querySelector(".nav-close");

  function setMenu(open) {
    overlay.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setMenu(true);
  });

  closeBtn.addEventListener("click", function () {
    setMenu(false);
  });

  overlay.addEventListener("click", function (event) {
    if (event.target.closest("a") || event.target === overlay) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    carousel.querySelector(".prev").addEventListener("click", function () {
      track.scrollBy({ left: -Math.round(track.clientWidth * 0.82), behavior: "smooth" });
    });
    carousel.querySelector(".next").addEventListener("click", function () {
      track.scrollBy({ left: Math.round(track.clientWidth * 0.82), behavior: "smooth" });
    });
  });

  var labels = {
    en: { show: "Show photo ", prev: "Previous photo", next: "Next photo" },
    de: { show: "Foto anzeigen ", prev: "Vorheriges Foto", next: "Nächstes Foto" },
    fr: { show: "Afficher la photo ", prev: "Photo précédente", next: "Photo suivante" }
  };
  var t = labels[(document.documentElement.lang || "en").slice(0, 2)] || labels.en;

  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var slides = track.children;
    var count = slides.length;
    var index = 0;
    var timer;

    var dots = document.createElement("div");
    dots.className = "slider-dots";
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", t.show + (i + 1));
      dot.addEventListener("click", go.bind(null, i));
      dots.appendChild(dot);
    }

    ["prev", "next"].forEach(function (dir) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slider-arrow " + dir;
      btn.setAttribute("aria-label", dir === "prev" ? t.prev : t.next);
      btn.innerHTML = dir === "prev" ? "&#10094;" : "&#10095;";
      btn.addEventListener("click", function () {
        go(index + (dir === "prev" ? -1 : 1));
      });
      slider.appendChild(btn);
    });
    slider.appendChild(dots);

    function go(to) {
      index = (to + count) % count;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.classList.toggle("active", n === index);
      });
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 5000);
    }

    go(0);
  });

  var ICONS = "https://media.cwd-cdn.com/Sisters-Zermatt/icons/";
  var SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    return el;
  }

  document.querySelectorAll("[data-room-icons]").forEach(function (list) {
    var defs = svgEl("svg", { class: "ri-defs", "aria-hidden": "true", width: 0, height: 0 });
    var filter = svgEl("filter", { id: "ri-shadow", x: "-40%", y: "-40%", width: "180%", height: "190%" });
    filter.appendChild(svgEl("feDropShadow", { dx: 3, dy: 9, stdDeviation: 7, "flood-color": "#000", "flood-opacity": 0.2 }));
    defs.appendChild(filter);
    list.parentNode.insertBefore(defs, list);

    var count = list.children.length;
    Array.prototype.forEach.call(list.children, function (item, i) {
      var col = i % 3;
      var under = col === 1;
      var sweep = under ? 0 : 1;
      var line = (col === 0 ? "M8,100" : "M0,100") + " H28 A72,72 0 0 " + sweep + " 172,100";
      line += col === 2 || i === count - 1 ? " H194 M188,95 L194,100 L188,105" : " H200 M179,95 l5,5 -5,5 M186,95 l5,5 -5,5";
      var accentY = under ? 162.35 : 37.65;

      var art = svgEl("svg", { class: "ri-art", viewBox: "0 0 200 200", "aria-hidden": "true", focusable: "false" });
      art.appendChild(svgEl("path", { class: "ri-line", pathLength: 1, d: line }));
      if (col === 0) art.appendChild(svgEl("circle", { class: "ri-dot", cx: 5, cy: 100, r: 3 }));
      var lift = svgEl("g", { class: "ri-lift" });
      var disc = svgEl("g", { class: "ri-disc" });
      disc.appendChild(svgEl("circle", { cx: 100, cy: 100, r: 58, filter: "url(#ri-shadow)" }));
      var icon = svgEl("image", { class: "ri-icon", href: ICONS + item.dataset.icon + ".svg?v=4", x: 36.73, y: 36.73, width: 126.55, height: 126.55 });
      icon.addEventListener("error", function () { icon.remove(); });
      disc.appendChild(icon);
      lift.appendChild(disc);
      art.appendChild(lift);
      art.appendChild(svgEl("path", { class: "ri-accent", pathLength: 1, d: "M64," + accentY + " A72,72 0 0 " + sweep + " 136," + accentY }));

      var label = document.createElement("span");
      label.className = "ri-label";
      while (item.firstChild) label.appendChild(item.firstChild);
      item.appendChild(art);
      item.appendChild(label);
      item.classList.toggle("under", under);
      item.style.setProperty("--d", (i * 0.35).toFixed(2) + "s");
    });

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    list.classList.add("ri-ready");
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      list.classList.add("in-view");
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(list);
  });

  var rails = document.querySelectorAll(".social-rail");
  var marker = document.querySelector(".matterhorn");
  if (rails.length && marker) {
    var updateRail = function () {
      var hide = marker.getBoundingClientRect().top < window.innerHeight * 0.55;
      rails.forEach(function (rail) { rail.hidden = hide; });
    };
    updateRail();
    window.addEventListener("scroll", updateRail, { passive: true });
  }

  var stamp = document.querySelector("[data-today]");
  if (stamp) {
    var pageLang = (document.documentElement.lang || "en").slice(0, 2);
    var dateLocale = { de: "de-CH", fr: "fr-CH" }[pageLang] || "en-US";
    stamp.textContent = new Date().toLocaleDateString(dateLocale, {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  var toTop = document.querySelector(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  (function (w, d, s, o, f, js, fjs) {
    w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
    js = d.createElement(s);
    fjs = d.getElementsByTagName(s)[0];
    js.id = o;
    js.src = f;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  })(window, document, "script", "CanaryChatWidget", "https://static.cdn.canarytechnologies.com/dist/web-chat-loader.js");
  window.CanaryChatWidget("init", { slug: "hotel-chesa-valese26", chat_button_bottom_offset: 20 }, "https://eu.canarytechnologies.com");

  var CONSENT_KEY = "sz-consent";
  var CONSENT_DAYS = 365;
  var GA_ID = "G-EFTJQ6CZK9";
  var lang = (document.documentElement.lang || "en").slice(0, 2);

  var consentMessages = {
    de: "Mit „Accept“ oder durch Weitersurfen stimmst du Cookies (auch von Drittanbietern) zu – für bessere Website-Funktionen, Analyse und Marketing.",
    en: "By continuing to browse or by clicking “Accept,” you agree to the storage of first- and third-party cookies on your device to improve website navigation, analyze website usage, and support our marketing efforts.",
    fr: "En continuant à naviguer ou en cliquant sur « Accept », vous autorisez des cookies (y compris de tiers) pour améliorer le site, analyser son utilisation et soutenir nos actions marketing."
  };

  var consentCategories = [
    { id: "functional", name: "Functional", desc: "The technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service explicitly requested by the subscriber or user, or for the sole purpose of carrying out the transmission of a communication over an electronic communications network." },
    { id: "preferences", name: "Preferences", desc: "The technical storage or access is necessary for the legitimate purpose of storing preferences that are not requested by the subscriber or user." },
    { id: "statistics", name: "Statistics", desc: "The technical storage or access that is used exclusively for anonymous statistical purposes. Without a subpoena, voluntary compliance on the part of your Internet Service Provider, or additional records from a third party, information stored or retrieved for this purpose alone cannot usually be used to identify you." },
    { id: "marketing", name: "Marketing", desc: "The technical storage or access is required to create user profiles to send advertising, or to track the user on a website or across several websites for similar marketing purposes." }
  ];

  var settingsLabel = { de: "Cookie-Einstellungen", en: "Cookie settings", fr: "Paramètres des cookies" };

  function readConsent() {
    try {
      var saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (saved && Date.now() - saved.date < CONSENT_DAYS * 864e5) return saved;
    } catch (e) {}
    return null;
  }

  var analyticsLoaded = false;

  function loadAnalytics() {
    if (!/(^|\.)sisterszermatt\.ch$/.test(location.hostname)) return;
    window["ga-disable-" + GA_ID] = false;
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);
  }

  function applyConsent(consent) {
    if (consent.statistics) loadAnalytics();
    else window["ga-disable-" + GA_ID] = true;
  }

  var banner = document.createElement("div");
  banner.className = "consent";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-labelledby", "consent-title");
  banner.hidden = true;

  var head = document.createElement("div");
  head.className = "consent-head";
  head.innerHTML = '<p class="consent-title" id="consent-title">Cookie-Einstellungen verwalten – Manage Your Consent – Gérer vos préférences</p>' +
    '<button type="button" class="consent-close" aria-label="Close">&times;</button>';
  banner.appendChild(head);

  var body = document.createElement("div");
  body.className = "consent-body";

  var message = document.createElement("div");
  message.className = "consent-message";
  ["de", "en", "fr"].forEach(function (code) {
    var p = document.createElement("p");
    p.lang = code;
    p.textContent = consentMessages[code];
    if (code === lang) p.className = "is-page-lang";
    message.appendChild(p);
  });
  body.appendChild(message);

  var cats = document.createElement("div");
  cats.className = "consent-cats";
  var switches = {};
  consentCategories.forEach(function (cat) {
    var row = document.createElement("div");
    row.className = "consent-cat";
    var rowHead = document.createElement("div");
    rowHead.className = "consent-cat-head";
    var name = document.createElement("span");
    name.className = "consent-cat-name";
    name.id = "consent-cat-" + cat.id;
    name.textContent = cat.name;
    rowHead.appendChild(name);
    if (cat.id === "functional") {
      var always = document.createElement("span");
      always.className = "consent-always";
      always.textContent = "Always active";
      rowHead.appendChild(always);
    } else {
      var sw = document.createElement("label");
      sw.className = "consent-switch";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("aria-labelledby", name.id);
      sw.appendChild(input);
      sw.appendChild(document.createElement("span"));
      rowHead.appendChild(sw);
      switches[cat.id] = input;
    }
    var more = document.createElement("button");
    more.type = "button";
    more.className = "consent-more";
    more.setAttribute("aria-expanded", "false");
    more.setAttribute("aria-label", cat.name + " – info");
    rowHead.appendChild(more);
    var desc = document.createElement("p");
    desc.className = "consent-desc";
    desc.textContent = cat.desc;
    desc.hidden = true;
    more.addEventListener("click", function () {
      desc.hidden = !desc.hidden;
      more.setAttribute("aria-expanded", desc.hidden ? "false" : "true");
    });
    row.appendChild(rowHead);
    row.appendChild(desc);
    cats.appendChild(row);
  });
  body.appendChild(cats);

  var buttons = document.createElement("div");
  buttons.className = "consent-buttons";
  buttons.innerHTML = '<button type="button" class="consent-accept" data-consent="accept">Accept</button>' +
    '<button type="button" data-consent="deny">Deny</button>' +
    '<button type="button" class="consent-view" data-consent="view">View preferences</button>' +
    '<button type="button" class="consent-save" data-consent="save">Save preferences</button>';
  body.appendChild(buttons);
  banner.appendChild(body);

  var policyLinks = document.querySelectorAll('nav[aria-label="Policies"] a');
  var links = document.createElement("p");
  links.className = "consent-links";
  Array.prototype.forEach.call(policyLinks, function (a) {
    if (/privacy|imprint|credits/.test(a.getAttribute("href"))) links.appendChild(a.cloneNode(true));
  });
  if (links.children.length) banner.appendChild(links);

  document.body.appendChild(banner);

  function openConsent() {
    var saved = readConsent() || {};
    Object.keys(switches).forEach(function (id) { switches[id].checked = !!saved[id]; });
    banner.classList.remove("show-prefs");
    banner.hidden = false;
    document.body.classList.add("consent-open");
  }

  function saveConsent(choice) {
    var consent = { functional: true, date: Date.now() };
    Object.keys(switches).forEach(function (id) {
      consent[id] = choice === "accept" ? true : choice === "deny" ? false : switches[id].checked;
    });
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (e) {}
    applyConsent(consent);
    banner.hidden = true;
    document.body.classList.remove("consent-open");
  }

  buttons.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-consent]");
    if (!btn) return;
    if (btn.dataset.consent === "view") banner.classList.add("show-prefs");
    else saveConsent(btn.dataset.consent);
  });
  head.querySelector(".consent-close").addEventListener("click", function () { saveConsent("deny"); });

  var policies = document.querySelector('nav[aria-label="Policies"]');
  if (policies) {
    var settings = document.createElement("a");
    settings.href = "#";
    settings.setAttribute("role", "button");
    settings.textContent = settingsLabel[lang] || settingsLabel.en;
    settings.addEventListener("click", function (event) {
      event.preventDefault();
      openConsent();
    });
    policies.appendChild(settings);
  }

  var existing = readConsent();
  if (existing) applyConsent(existing);
  else openConsent();
})();
