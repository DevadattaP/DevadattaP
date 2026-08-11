(function (global) {
  var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function init(opts) {
    var boardEl = opts.boardEl;
    var cells, turn, over;

    function checkWin() {
      for (var i = 0; i < LINES.length; i++) {
        var a = LINES[i][0], b = LINES[i][1], c = LINES[i][2];
        if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) return cells[a];
      }
      return null;
    }

    function render() {
      boardEl.innerHTML = cells.map(function (v, i) {
        return '<button class="ttt-cell" data-i="' + i + '"' + ((v || over) ? " disabled" : "") + ">" + (v || "") + "</button>";
      }).join("");
      boardEl.querySelectorAll(".ttt-cell").forEach(function (btn) {
        btn.addEventListener("click", function () { play(parseInt(btn.dataset.i, 10)); });
      });
    }

    function play(i) {
      if (over || cells[i]) return;
      cells[i] = turn;
      var winner = checkWin();
      if (winner) {
        over = true;
        opts.onStatus(winner + " wins!");
        render();
        return;
      }
      if (cells.every(Boolean)) {
        over = true;
        opts.onStatus("Draw.");
        render();
        return;
      }
      turn = turn === "X" ? "O" : "X";
      render();
      opts.onStatus(turn + "'s turn");
    }

    function reset() {
      cells = new Array(9).fill(null);
      turn = "X";
      over = false;
      render();
      opts.onStatus("X's turn");
    }

    reset();
    return { restart: reset };
  }

  global.TicTacToeGame = { init: init };
})(window);
