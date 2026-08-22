(function () {
  var S = window.Site;
  var initialized = {};

  function panelHtml(game) {
    if (game.key === "snake") {
      return (
        '<div class="game-panel" id="panel-snake">' +
          '<div class="game-stage">' +
            '<div class="game-hud"><span>Score: <b id="snakeScore">0</b></span><span>Best: <b id="snakeBest">0</b></span></div>' +
            '<canvas id="snakeCanvas" width="360" height="360"></canvas>' +
            '<p class="game-note" id="snakeNote">' + S.escapeHtml(game.controls) + "</p>" +
            '<button class="game-btn" id="snakeRestart">Restart</button>' +
          "</div>" +
        "</div>"
      );
    }
    if (game.key === "tictactoe") {
      return (
        '<div class="game-panel" id="panel-tictactoe">' +
          '<div class="game-stage">' +
            '<div class="game-hud"><span id="tttStatus">X\'s turn</span></div>' +
            '<div class="ttt-board" id="tttBoard"></div>' +
            '<p class="game-note">' + S.escapeHtml(game.controls) + "</p>" +
            '<button class="game-btn" id="tttRestart">New Game</button>' +
          "</div>" +
        "</div>"
      );
    }
    return "";
  }

  function startGame(key) {
    if (initialized[key]) return;
    initialized[key] = true;
    if (key === "snake") {
      var engine = window.SnakeGame.init({
        canvas: document.getElementById("snakeCanvas"),
        onScore: function (s) { document.getElementById("snakeScore").textContent = s; },
        onBest: function (b) { document.getElementById("snakeBest").textContent = b; },
        onRunning: function (running) {
          document.getElementById("snakeNote").textContent = running
            ? "Arrow keys or WASD to move."
            : "Game over — press Space or Restart to try again.";
        }
      });
      document.getElementById("snakeRestart").addEventListener("click", engine.restart);
    }
    if (key === "tictactoe") {
      var ttt = window.TicTacToeGame.init({
        boardEl: document.getElementById("tttBoard"),
        onStatus: function (msg) { document.getElementById("tttStatus").textContent = msg; }
      });
      document.getElementById("tttRestart").addEventListener("click", ttt.restart);
    }
  }

  function selectGame(key) {
    document.querySelectorAll(".game-tab").forEach(function (t) { t.classList.toggle("active", t.dataset.key === key); });
    document.querySelectorAll(".game-panel").forEach(function (p) { p.classList.toggle("active", p.id === "panel-" + key); });
    startGame(key);
  }

  S.init("games").then(function (site) {
    S.renderPageBand(document.getElementById("band"), site, "games");
    return S.fetchJSON("data/games.json");
  }).then(function (allGames) {
    var isMobile = window.matchMedia("(max-width: 640px)").matches;
    var games = isMobile ? allGames.filter(function (g) { return g.showOnMobile !== false; }) : allGames;
    var hidden = allGames.length - games.length;

    if (!games.length) {
      S.empty(document.getElementById("gamePicker"), "These games aren't available on mobile — try again on a larger screen.");
      document.getElementById("gamePanels").innerHTML = "";
      return;
    }

    document.getElementById("gamePicker").innerHTML = games.map(function (g, i) {
      return '<button class="game-tab' + (i === 0 ? " active" : "") + '" data-key="' + g.key + '">' + S.escapeHtml(g.title) + "</button>";
    }).join("") + (hidden ? '<p class="game-note" style="width:100%">Some games are hidden on mobile for a better experience.</p>' : "");
    document.getElementById("gamePanels").innerHTML = games.map(panelHtml).join("");
    document.querySelectorAll(".game-tab").forEach(function (btn) {
      btn.addEventListener("click", function () { selectGame(btn.dataset.key); });
    });
    selectGame(games[0].key);
  }).catch(function (err) {
    S.fail(document.getElementById("gamePicker"), err);
  });
})();
