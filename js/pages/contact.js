(function () {
  var S = window.Site;
  var FIELD_LABELS = { name: "Your name", email: "Your email", domain: "Project domain (e.g. ML, Web Dev, Android)" };

  function renderSocial(site) {
    document.getElementById("socialRows").innerHTML = site.social.map(function (s) {
      var external = s.href.indexOf("http") === 0;
      return (
        '<li><a class="row-item linkable" href="' + S.escapeHtml(s.href) + '"' + (external ? ' target="_blank" rel="noreferrer"' : "") + ">" +
          '<div class="main">' + S.escapeHtml(s.label) + "</div>" +
          '<div class="meta">' + (external ? "↗" : "→") + "</div>" +
        "</a></li>"
      );
    }).join("");
  }

  function fieldHtml(topicKey, field, placeholder) {
    if (field === "message") {
      return '<textarea id="' + topicKey + "-message" + '" placeholder="' + S.escapeHtml(placeholder) + '"></textarea>';
    }
    var type = field === "email" ? "email" : "text";
    return '<input type="' + type + '" id="' + topicKey + "-" + field + '" placeholder="' + S.escapeHtml(FIELD_LABELS[field] || field) + '" />';
  }

  function renderForms(site, topics) {
    document.getElementById("topicTabs").innerHTML = topics.map(function (t, i) {
      return '<button class="topic-tab' + (i === 0 ? " active" : "") + '" data-topic="' + t.key + '">' + S.escapeHtml(t.label) + "</button>";
    }).join("");

    document.getElementById("formPanels").innerHTML = topics.map(function (t, i) {
      var fields = t.fields.map(function (f) { return fieldHtml(t.key, f, t.messagePlaceholder); }).join("");
      return (
        '<div class="form-panel' + (i === 0 ? " active" : "") + '" id="form-' + t.key + '">' +
          '<div class="contact-form">' +
            fields +
            '<button class="btn-solid" data-submit="' + t.key + '">' + S.escapeHtml(t.submitLabel) + "</button>" +
            '<p class="form-note">Sends via your email client to ' + S.escapeHtml(site.email) + ".</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    document.querySelectorAll(".topic-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".topic-tab").forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll(".form-panel").forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        document.getElementById("form-" + btn.dataset.topic).classList.add("active");
      });
    });

    topics.forEach(function (t) {
      var btn = document.querySelector('[data-submit="' + t.key + '"]');
      btn.addEventListener("click", function () {
        var get = function (f) {
          var el = document.getElementById(t.key + "-" + f);
          return el ? el.value.trim() : "";
        };
        var name = get("name"), email = get("email"), domain = get("domain"), message = get("message");
        var subject = "[" + t.label + "] from " + (name || "your site");
        var bodyLines = [];
        if (name) bodyLines.push("Name: " + name);
        if (email) bodyLines.push("Email: " + email);
        if (domain) bodyLines.push("Domain: " + domain);
        bodyLines.push("");
        bodyLines.push(message);
        var mailto = "mailto:" + encodeURIComponent(site.email) +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(bodyLines.join("\n"));
        window.location.href = mailto;
      });
    });
  }

  S.init("contact").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "contact");
    renderSocial(site);
    return S.fetchJSON("data/contact.json").then(function (data) {
      renderForms(site, data.topics);
    });
  }).catch(function (err) {
    S.fail(document.getElementById("socialRows"), err);
  });
})();
