(function () {
  var S = window.Site;

  function certLink(text, url) {
    var label = S.escapeHtml(text);
    if (!url) return label;
    return '<a class="cert-link" href="' + S.escapeHtml(url) + '" target="_blank" rel="noreferrer">' +
      label + '<span class="cert-arrow">↗</span></a>';
  }

  function renderDegrees(degrees) {
    document.getElementById("degrees").innerHTML = degrees.map(function (d) {
      var badges = (d.badges || []).map(function (b) {
        return '<span class="badge">' + S.escapeHtml(b) + "</span>";
      }).join("");
      return (
        '<div class="field-row">' +
          '<div class="y">' + S.escapeHtml(d.year) + "</div>" +
          "<div>" +
            '<div class="inst">' + S.escapeHtml(d.institution) + "</div>" +
            '<div class="deg">' + certLink(d.degree, d.certUrl) + "</div>" +
            badges +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderHonours(honours) {
    document.getElementById("honours").innerHTML = honours.map(function (h) {
      return (
        '<div class="award-row">' +
          "<div><span class=\"name\">" + certLink(h.name, h.certUrl) + "</span>" +
          '<span class="sub">' + S.escapeHtml(h.sub) + "</span></div>" +
          '<div class="year">' + S.escapeHtml(h.year) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  S.init("education").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "education");
    return S.fetchJSON("data/education.json");
  }).then(function (data) {
    renderDegrees(data.degrees);
    renderHonours(data.honours);
  }).catch(function (err) {
    S.fail(document.getElementById("degrees"), err);
  });
})();
