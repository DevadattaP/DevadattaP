(function () {
  var S = window.Site;

  function renderList(posts) {
    document.getElementById("postList").innerHTML = posts.map(function (p) {
      return (
        '<li><a class="row-item linkable" href="blog.html?post=' + encodeURIComponent(p.slug) + '">' +
          '<div><div class="main">' + S.escapeHtml(p.title) + "</div>" +
          '<div class="sub">' + S.escapeHtml(p.excerpt) + "</div>" +
          '<div class="tags-inline">' + S.escapeHtml(p.category) + " · " + S.escapeHtml(p.readTime) + "</div></div>" +
          '<div class="meta">' + S.escapeHtml(p.date) + "</div>" +
        "</a></li>"
      );
    }).join("");
  }

  function renderArticle(post) {
    document.title = post.title + " — Devadatta Pokharanakar";
    document.getElementById("listSection").style.display = "none";
    document.getElementById("articleSection").style.display = "block";
    document.getElementById("articleMeta").textContent = post.category + " · " + post.date + " · " + post.readTime;
    document.getElementById("articleTitle").textContent = post.title;
    document.getElementById("articleBody").innerHTML = post.body;
  }

  var params = new URLSearchParams(location.search);
  var slug = params.get("post");

  S.init("blog").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "blog");
    return S.fetchJSON("data/blog.json");
  }).then(function (posts) {
    if (slug) {
      var post = posts.filter(function (p) { return p.slug === slug; })[0];
      if (post) { renderArticle(post); return; }
    }
    renderList(posts);
  }).catch(function (err) {
    S.fail(document.getElementById("postList"), err);
  });
})();
