(function () {
  var S = window.Site;

  function certLink(text, url) {
    var label = S.escapeHtml(text);
    if (!url) return label;
    return '<a class="cert-link" href="' + S.escapeHtml(url) + '" target="_blank" rel="noreferrer">' +
      label + '<span class="cert-arrow">↗</span></a>';
  }

  function renderBullet(b) {
    if (typeof b === "string") return "<li>" + S.escapeHtml(b) + "</li>";
    var sub = (b.details || []).map(function (d) { return "<li>" + S.escapeHtml(d) + "</li>"; }).join("");
    return "<li>" + S.escapeHtml(b.text) + (sub ? "<ul>" + sub + "</ul>" : "") + "</li>";
  }

  function renderRoles(roles) {
    document.getElementById("roles").innerHTML = roles.map(function (r) {
      var bullets = r.bullets.map(renderBullet).join("");
      return (
        '<div class="exp-block">' +
          '<div class="exp-top">' +
            "<div>" +
              '<div class="role">' + certLink(r.role, r.certUrl) + "</div>" +
              '<div class="company">' + S.escapeHtml(r.company) + "</div>" +
            "</div>" +
            '<div class="date">' + S.escapeHtml(r.date) + "</div>" +
          "</div>" +
          "<ul>" + bullets + "</ul>" +
        "</div>"
      );
    }).join("");
  }

  function renderTrainings(trainings) {
    document.getElementById("trainings").innerHTML = trainings.map(function (t) {
      return (
        '<div class="train-row">' +
          "<div><div class=\"name\">" + certLink(t.name, t.certUrl) + "</div>" +
          '<div class="issuer">' + S.escapeHtml(t.issuer) + "</div></div>" +
          '<div class="date">' + S.escapeHtml(t.date) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  S.init("experience").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "experience");
    return S.fetchJSON("data/experience.json");
  }).then(function (data) {
    renderRoles(data.roles);
    renderTrainings(data.trainings);
  }).catch(function (err) {
    S.fail(document.getElementById("roles"), err);
  });
})();
