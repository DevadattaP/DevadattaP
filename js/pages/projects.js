(function () {
  var S = window.Site;

  function renderProjects(projects) {
    document.getElementById("projList").innerHTML = projects.map(function (p, i) {
      var num = String(i + 1).padStart(2, "0");
      var tags = p.stack.map(function (s) { return "<span>" + S.escapeHtml(s) + "</span>"; }).join("");
      var links = [];
      if (p.github) links.push('<a href="' + S.escapeHtml(p.github) + '" target="_blank" rel="noreferrer">GitHub ↗</a>');
      if (p.demo) links.push('<a href="' + S.escapeHtml(p.demo) + '" target="_blank" rel="noreferrer">Live demo ↗</a>');
      return (
        '<div class="idx-row" id="' + S.escapeHtml(p.slug) + '">' +
          '<div class="ghost">' + num + "</div>" +
          "<div>" +
            '<div class="t">' + S.escapeHtml(p.title) + "</div>" +
            '<div class="status">' + S.escapeHtml(p.status) + "</div>" +
            '<p class="d" style="margin-top:8px">' + S.escapeHtml(p.description) + "</p>" +
            '<div class="tags">' + tags + "</div>" +
            (links.length ? '<div class="links">' + links.join("") + "</div>" : "") +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  S.init("projects").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "projects");
    return S.fetchJSON("data/projects.json");
  }).then(function (projects) {
    renderProjects(projects);
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }).catch(function (err) {
    S.fail(document.getElementById("projList"), err);
  });
})();
