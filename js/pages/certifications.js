(function () {
  var S = window.Site;
  var TAG_LABELS = {
    ml: "Machine Learning", data: "Data", dev: "Development", devops: "DevOps",
    cloud: "Cloud", security: "Security", pm: "Project Mgmt", design: "Design"
  };
  var certs = [];
  var activeTag = "all";

  function renderFilters() {
    var tags = [];
    certs.forEach(function (c) {
      c.tags.forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
    });
    var chips = ['<button class="filter-chip' + (activeTag === "all" ? " active" : "") + '" data-tag="all">All (' + certs.length + ")</button>"];
    tags.forEach(function (t) {
      var count = certs.filter(function (c) { return c.tags.indexOf(t) !== -1; }).length;
      chips.push('<button class="filter-chip' + (activeTag === t ? " active" : "") + '" data-tag="' + t + '">' + S.escapeHtml(TAG_LABELS[t] || t) + " (" + count + ")</button>");
    });
    var el = document.getElementById("filters");
    el.innerHTML = chips.join("");
    el.querySelectorAll(".filter-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeTag = btn.dataset.tag;
        renderFilters();
        renderList();
      });
    });
  }

  function renderList() {
    var list = activeTag === "all" ? certs : certs.filter(function (c) { return c.tags.indexOf(activeTag) !== -1; });
    // document.getElementById("countLabel").textContent = "Certifications — showing " + list.length + " of " + certs.length;
    if (!list.length) { S.empty(document.getElementById("certList"), "No certifications in this category."); return; }
    document.getElementById("certList").innerHTML = list.map(function (c) {
      var tag = c.link ? "a" : "div";
      var attrs = c.link ? ' href="' + S.escapeHtml(c.link) + '" target="_blank" rel="noreferrer"' : "";
      var title = S.escapeHtml(c.title) + (c.link ? '<span class="cert-arrow">↗</span>' : "");
      return (
        '<li><' + tag + ' class="row-item' + (c.link ? " linkable" : "") + '"' + attrs + ">" +
          '<div><div class="main">' + title + "</div>" +
          '<div class="sub">' + S.escapeHtml(c.issuer) + " · " + c.skills.map(S.escapeHtml).join(", ") + "</div></div>" +
          '<div class="meta">' + S.escapeHtml(c.date) + "</div>" +
        "</" + tag + "></li>"
      );
    }).join("");
  }

  S.init("certifications").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "certifications");
    return S.fetchJSON("data/certifications.json");
  }).then(function (data) {
    certs = data;
    renderFilters();
    renderList();
  }).catch(function (err) {
    S.fail(document.getElementById("certList"), err);
  });
})();
