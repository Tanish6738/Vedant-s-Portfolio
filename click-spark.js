// Vanilla JS Click Spark Effect
(function(){
  const sparkColor = '#fff';
  const sparkSize = 10;
  const sparkRadius = 18;
  const sparkCount = 10;
  const duration = 420;
  const extraScale = 1.0;
  let sparks = [];
  let canvas, ctx, animationId;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function ease(t) {
    // ease-out
    return t * (2 - t);
  }

  function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks = sparks.filter(spark => {
      const elapsed = now - spark.startTime;
      if (elapsed >= duration) return false;
      const progress = elapsed / duration;
      const eased = ease(progress);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);
      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return true;
    });
    if (sparks.length > 0) {
      animationId = requestAnimationFrame(draw);
    } else {
      animationId = null;
    }
  }

  function handleClick(e) {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x, y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      });
    }
    // Draw the first frame immediately for instant feedback
    draw(now);
    if (!animationId) {
      animationId = requestAnimationFrame(draw);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('DOMContentLoaded', function() {
    createCanvas();
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches.length > 0) {
        handleClick(e.touches[0]);
      }
    });
  });
})();
