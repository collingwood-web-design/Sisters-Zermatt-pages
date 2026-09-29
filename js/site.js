(function () {
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
    stamp.textContent = new Date().toLocaleDateString("en-US", {
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
})();
