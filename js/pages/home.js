(function () {
  var S = window.Site;

  function renderBand(site) {
    var words = site.name.split(" ");
    var titleHtml = S.escapeHtml(words[0]) + "<br>" + S.escapeHtml(words.slice(1).join(" "));
    S.renderBand(document.getElementById("band"), {
      titleHtml: titleHtml,
      role: site.role,
      desc: site.bio,
      avatar: site.avatar
    });
  }

  function renderHighlights(highlights) {
    var el = document.getElementById("highlights");
    if (!highlights || !highlights.length) {
      document.getElementById("highlightsSection").style.display = "none";
      return;
    }
    el.innerHTML = highlights.map(function (h) {
      var tag = h.href ? "a" : "div";
      var hrefAttr = h.href ? ' href="' + S.escapeHtml(h.href) + '"' : "";
      return "<" + tag + ' class="highlight"' + hrefAttr + '><div class="v">' + S.escapeHtml(h.value) + '</div><div class="l">' + S.escapeHtml(h.label) + "</div></" + tag + ">";
    }).join("");
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

  function renderUpdates(updates) {
    var section = document.getElementById("updatesSection");
    if (!updates || !updates.length) {
      section.style.display = "none";
      return;
    }
    document.getElementById("updates").innerHTML = updates.map(function (u) {
      return "<li>" + S.escapeHtml(u) + "</li>";
    }).join("");
  }

  function renderQuote(quote) {
    var el = document.getElementById("quoteBlock");
    if (!quote || !quote.text) {
      el.style.display = "none";
      return;
    }
    el.innerHTML =
      '<p class="q-text">“' + S.escapeHtml(quote.text) + '”</p>' +
      (quote.author ? '<p class="q-author">— ' + S.escapeHtml(quote.author) + "</p>" : "");
  }

  S.init("home").then(function (site) {
    renderBand(site);
    renderFacts(site.facts);
    renderHighlights(site.highlights);
    renderUpdates(site.updates);
    renderQuote(site.quote);
  }).catch(function (err) {
    S.fail(document.getElementById("facts"), err);
  });
})();
