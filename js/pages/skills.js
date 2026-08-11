(function () {
  var S = window.Site;

  function renderGroups(groups) {
    document.getElementById("skillGroups").innerHTML = groups.map(function (g) {
      var items = g.items.map(function (i) { return "<div>" + S.escapeHtml(i) + "</div>"; }).join("");
      return (
        '<div class="skill-group">' +
          '<div class="label">' + S.escapeHtml(g.label) + "</div>" +
          '<div class="items">' + items + "</div>" +
        "</div>"
      );
    }).join("");
  }

  S.init("skills").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "skills");
    return S.fetchJSON("data/skills.json");
  }).then(function (groups) {
    renderGroups(groups);
  }).catch(function (err) {
    S.fail(document.getElementById("skillGroups"), err);
  });
})();
