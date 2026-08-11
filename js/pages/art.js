(function () {
  var S = window.Site;
  var CAT_LABELS = { sketch: "Sketches", painting: "Paintings", handcraft: "Handcrafts", digital: "Digital", tabla: "Tabla" };
  var pieces = [];
  var visible = [];
  var activeCat = "all";
  var lbIndex = 0;

  function monogram(title) {
    var words = title.split(/[\s—-]+/).filter(Boolean);
    return ((words[0] || "?")[0] + (words[1] ? words[1][0] : "")).toUpperCase();
  }

  function renderFilters() {
    var cats = [];
    pieces.forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });
    var chips = ['<button class="filter-chip' + (activeCat === "all" ? " active" : "") + '" data-cat="all">All (' + pieces.length + ")</button>"];
    cats.forEach(function (c) {
      var count = pieces.filter(function (p) { return p.cat === c; }).length;
      chips.push('<button class="filter-chip' + (activeCat === c ? " active" : "") + '" data-cat="' + c + '">' + S.escapeHtml(CAT_LABELS[c] || c) + " (" + count + ")</button>");
    });
    var el = document.getElementById("filters");
    el.innerHTML = chips.join("");
    el.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCat = btn.dataset.cat;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    visible = activeCat === "all" ? pieces : pieces.filter(function (p) { return p.cat === activeCat; });
    document.getElementById("countLabel").textContent = "Art Gallery — showing " + visible.length + " of " + pieces.length;
    if (!visible.length) { S.empty(document.getElementById("artGrid"), "No pieces in this category."); return; }
    document.getElementById("artGrid").innerHTML = visible.map(function (p, i) {
      var thumb = p.img
        ? '<img src="' + S.escapeHtml(p.img) + '" alt="' + S.escapeHtml(p.title) + '" loading="lazy" />'
        : '<span class="mono">' + S.escapeHtml(monogram(p.title)) + "</span>";
      return (
        '<button class="art-cell" data-index="' + i + '">' +
          '<div class="art-thumb">' + thumb + "</div>" +
          '<div class="cap"><div class="t">' + S.escapeHtml(p.title) + "</div>" +
          '<div class="m">' + S.escapeHtml(CAT_LABELS[p.cat] || p.cat) + " · " + S.escapeHtml(p.date) + "</div></div>" +
        "</button>"
      );
    }).join("");
    document.querySelectorAll(".art-cell").forEach(function (cell) {
      cell.addEventListener("click", function () { openLightbox(parseInt(cell.dataset.index, 10)); });
    });
  }

  function openLightbox(index) {
    lbIndex = index;
    document.getElementById("lightbox").classList.add("open");
    renderLightbox();
  }
  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
  }
  function renderLightbox() {
    var p = visible[lbIndex];
    document.getElementById("lbCounter").textContent = (lbIndex + 1) + " / " + visible.length;
    document.getElementById("lbStage").innerHTML = p.img
      ? '<img src="' + S.escapeHtml(p.img) + '" alt="' + S.escapeHtml(p.title) + '" />'
      : '<span class="mono">' + S.escapeHtml(monogram(p.title)) + "</span>";
    document.getElementById("lbTitle").textContent = p.title;
    document.getElementById("lbDesc").textContent = p.desc;
    document.getElementById("lbTools").textContent = p.tools.join(" · ") + " · " + p.date;
  }
  function step(delta) {
    lbIndex = (lbIndex + delta + visible.length) % visible.length;
    renderLightbox();
  }

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
  document.getElementById("lbNext").addEventListener("click", function () { step(1); });
  document.getElementById("lightbox").addEventListener("click", function (e) {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!document.getElementById("lightbox").classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  S.init("art").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "art");
    return S.fetchJSON("data/art.json");
  }).then(function (data) {
    pieces = data;
    renderFilters();
    renderGrid();
  }).catch(function (err) {
    S.fail(document.getElementById("artGrid"), err);
  });
})();
