(function () {
  var S = window.Site;

  function renderRoles(roles) {
    document.getElementById("roles").innerHTML = roles.map(function (r) {
      var bullets = r.bullets.map(function (b) { return "<li>" + S.escapeHtml(b) + "</li>"; }).join("");
      return (
        '<div class="exp-block">' +
          '<div class="exp-top">' +
            "<div>" +
              '<div class="role">' + S.escapeHtml(r.role) + "</div>" +
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
          "<div><div class=\"name\">" + S.escapeHtml(t.name) + "</div>" +
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
