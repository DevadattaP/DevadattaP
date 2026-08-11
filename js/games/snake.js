/* Minimal snake game. Colors are read from the canvas's computed CSS color so
   it always matches the current ink/paper (invert) state — no hardcoded hues. */
(function (global) {
  function init(opts) {
    var canvas = opts.canvas;
    var ctx = canvas.getContext("2d");
    var cell = 18;
    var cols = Math.floor(canvas.width / cell);
    var rows = Math.floor(canvas.height / cell);
    var snake, dir, nextDir, apple, score, best, running, timer;

    best = parseInt(localStorage.getItem("dp_snake_best") || "0", 10);
    opts.onBest(best);

    function ink() { return getComputedStyle(canvas).color; }

    function placeApple() {
      var free = [];
      for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
          if (!snake.some(function (s) { return s.x === x && s.y === y; })) free.push({ x: x, y: y });
        }
      }
      apple = free[Math.floor(Math.random() * free.length)];
    }

    function reset() {
      snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
      dir = { x: 1, y: 0 };
      nextDir = dir;
      score = 0;
      running = true;
      placeApple();
      opts.onScore(score);
      opts.onRunning(true);
      draw();
    }

    function tick() {
      if (!running) return;
      dir = nextDir;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      var hitWall = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
      var hitSelf = snake.some(function (s) { return s.x === head.x && s.y === head.y; });
      if (hitWall || hitSelf) {
        running = false;
        best = Math.max(best, score);
        localStorage.setItem("dp_snake_best", String(best));
        opts.onBest(best);
        opts.onRunning(false);
        draw();
        return;
      }
      snake.unshift(head);
      if (head.x === apple.x && head.y === apple.y) {
        score++;
        opts.onScore(score);
        placeApple();
      } else {
        snake.pop();
      }
      draw();
    }

    function draw() {
      var color = ink();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      for (var x = 1; x < cols; x++) {
        ctx.beginPath(); ctx.moveTo(x * cell, 0); ctx.lineTo(x * cell, canvas.height); ctx.stroke();
      }
      for (var y = 1; y < rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * cell); ctx.lineTo(canvas.width, y * cell); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      snake.forEach(function (s, i) {
        var pad = i === 0 ? 1 : 2;
        ctx.fillRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(apple.x * cell + 4, apple.y * cell + 4, cell - 8, cell - 8);
    }

    function setDir(x, y) {
      if (dir.x === -x && dir.y === -y) return; // no reversing into self
      nextDir = { x: x, y: y };
    }

    document.addEventListener("keydown", function (e) {
      if (!canvas.offsetParent) return; // only when the panel is visible
      var map = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
      };
      if (map[e.key]) { setDir(map[e.key][0], map[e.key][1]); e.preventDefault(); }
      if (e.key === " " && !running) reset();
    });

    reset();
    timer = setInterval(tick, 110);

    return { restart: reset, destroy: function () { clearInterval(timer); } };
  }

  global.SnakeGame = { init: init };
})(window);
