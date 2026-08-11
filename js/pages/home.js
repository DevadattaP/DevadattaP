(function () {
  var S = window.Site;

  function renderBand(site) {
    var words = site.name.split(" ");
    var titleHtml = S.escapeHtml(words[0]) + "<br>" + S.escapeHtml(words.slice(1).join(" "));
    S.renderBand(document.getElementById("band"), {
      kicker: site.kicker,
      titleHtml: titleHtml,
      role: site.role,
      desc: site.bio
    });
  }

  function renderFacts(facts) {
    // facts are optional, so don't render anything if there are none
    if (!facts || !facts.length) {
      // need to hide the facts section if there are no facts, 
      document.getElementById("factsSection").style.display = "none";

      return;
    }
    var html = facts.map(function (f) {
      return "<b>" + S.escapeHtml(f.label) + "</b> — " + S.escapeHtml(f.value);
    }).join(". ") + ".";
    document.getElementById("facts").innerHTML = "<p>" + html + "</p>";
  }

  function renderContents(pages) {
    var leader = S.dotLeader();
    document.getElementById("toc").innerHTML = pages.map(function (p) {
      return '<li><a href="' + S.escapeHtml(p.href) + '">' +
        "<span>" + S.escapeHtml(p.label) + "</span>" +
        '<span class="leader">' + leader + "</span>" +
        '<span class="num">' + S.escapeHtml(p.num) + "</span>" +
        "</a></li>";
    }).join("");
  }

  function renderProjects(projects) {
    document.getElementById("projList").innerHTML = projects.map(function (p, i) {
      var num = String(i + 1).padStart(2, "0");
      return (
        '<div class="idx-row">' +
          '<div class="ghost">' + num + "</div>" +
          "<div>" +
            '<div class="t"><a href="projects.html#' + S.escapeHtml(p.slug) + '">' + S.escapeHtml(p.title) + "</a></div>" +
            '<p class="d">' + S.escapeHtml(p.description) + "</p>" +
            '<div class="tags">' + p.stack.slice(0, 4).map(function (s) { return "<span>" + S.escapeHtml(s) + "</span>"; }).join("") + "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  S.init("home").then(function (site) {
    renderBand(site);
    renderFacts(site.facts);
    renderContents(site.pages);
    return S.fetchJSON("data/projects.json");
  }).then(function (projects) {
    renderProjects(projects);
  }).catch(function (err) {
    S.fail(document.getElementById("facts"), err);
  });
})();
