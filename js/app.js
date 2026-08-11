/* Shared utilities used by every page: JSON loading, nav/footer render, invert toggle. */
(function (global) {
  "use strict";

  var LEADER = "·".repeat(80);

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fetchJSON(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path + " (" + res.status + ")");
      return res.json();
    }).catch(function (err) {
      console.error(err);
      throw err;
    });
  }

  function initInvertToggle() {
    var html = document.documentElement;
    var btn = document.getElementById("invertBtn");
    if (!btn) return;
    var saved = localStorage.getItem("colorMode");
    if (saved === "inverted") {
      html.classList.add("inverted");
      btn.setAttribute("aria-pressed", "true");
    }
    btn.addEventListener("click", function () {
      var on = html.classList.toggle("inverted");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      localStorage.setItem("colorMode", on ? "inverted" : "normal");
    });
  }

  function renderTopbar(site, currentKey) {
    var el = document.getElementById("topbar");
    if (!el) return;
    var links = (site.pages || []).map(function (p) {
      var active = p.key === currentKey ? ' class="active"' : "";
      return '<li><a href="' + escapeHtml(p.href) + '"' + active + ">" + escapeHtml(p.label) + "</a></li>";
    }).join("");
    el.innerHTML =
      '<a class="brand" href="index.html">' + escapeHtml(site.shortName || site.name) + "</a>" +
      '<ul class="topbar-nav">' + links + "</ul>" +
      '<div class="topbar-right">' +
        (site.resumeUrl ? '<a class="cv-link" href="' + escapeHtml(site.resumeUrl) + '" download>Download CV</a>' : "") +
        '<button class="invert-btn" id="invertBtn" aria-pressed="false" aria-label="Invert page colors"></button>' +
      "</div>";
    initInvertToggle();
  }

  function renderFooter(site) {
    var el = document.getElementById("siteFooter");
    if (!el) return;
    var social = (site.social || []).map(function (s) {
      return '<a href="' + escapeHtml(s.href) + '"' + (s.href.indexOf("http") === 0 ? ' target="_blank" rel="noreferrer"' : "") + ">" + escapeHtml(s.label) + "</a>";
    }).join(" · ");
    el.innerHTML =
      "<span>" + escapeHtml(site.copyright || "") + "</span>" +
      "<span>" + social + "</span>";
  }

  function dotLeader() {
    return LEADER;
  }

  function pageMeta(site, key) {
    var found = null;
    (site.pages || []).forEach(function (p) { if (p.key === key) found = p; });
    return found || {};
  }

  /** Renders the standard sub-page band (kicker w/ number, title, intro) straight from site.json. */
  function renderPageBand(el, site, key) {
    var meta = pageMeta(site, key);
    renderBand(el, {
      kicker: meta.num + " — " + meta.label,
      titleHtml: escapeHtml(meta.title || meta.label),
      desc: meta.intro,
      small: true
    });
  }

  /**
   * Renders the inverted "band" header used at the top of every page.
   * opts: { kicker, titleHtml, role, desc }
   * titleHtml is inserted as-is (so callers can add <br>), everything else is escaped.
   */
  function renderBand(el, opts) {
    var html = '<div class="wrap">';
    if (opts.kicker) html += '<div class="kicker">' + escapeHtml(opts.kicker) + "</div>";
    html += "<h1>" + opts.titleHtml + "</h1>";
    if (opts.role) html += '<p class="role">' + escapeHtml(opts.role) + "</p>";
    if (opts.role) html += '<div class="rule"></div>';
    if (opts.desc) html += '<p class="desc">' + escapeHtml(opts.desc) + "</p>";
    html += "</div>";
    el.className = "band" + (opts.small ? " band-sm" : "");
    el.innerHTML = html;
  }

  function loading(container, msg) {
    container.innerHTML = '<div class="loading">' + escapeHtml(msg || "Loading…") + "</div>";
  }

  function empty(container, msg) {
    container.innerHTML = '<div class="empty">' + escapeHtml(msg || "Nothing here yet.") + "</div>";
  }

  function fail(container, err) {
    var msg = "Could not load data. If you opened this file directly (file://), " +
      "the browser blocks JSON fetches from local files — serve the folder with " +
      "a local HTTP server instead, e.g. <code>python3 -m http.server</code>, then open " +
      "http://localhost:8000/.";
    container.innerHTML = '<div class="empty">' + msg + "</div>";
    console.error(err);
  }

  /**
   * Boot a page: loads site.json, renders topbar + footer, wires the invert
   * toggle, and hands the site data back so the page can render its band and
   * page-specific content.
   */
  function init(pageKey) {
    return fetchJSON("data/site.json").then(function (site) {
      renderTopbar(site, pageKey);
      renderFooter(site);
      return site;
    });
  }

  global.Site = {
    escapeHtml: escapeHtml,
    fetchJSON: fetchJSON,
    initInvertToggle: initInvertToggle,
    renderTopbar: renderTopbar,
    renderFooter: renderFooter,
    dotLeader: dotLeader,
    renderBand: renderBand,
    pageMeta: pageMeta,
    renderPageBand: renderPageBand,
    loading: loading,
    empty: empty,
    fail: fail,
    init: init
  };
})(window);
