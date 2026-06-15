const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 600;

const PW = 14, PH = 90;
const MARGIN = 40;
const BR = 9;
const PADDLE_SPEED = 6;
const AI_SPEED = 4.5;
const BALL_SPEED_INIT = 5;
const SPEED_MULT = 1.07;
const MAX_SPEED_MULT = 2.8;
const MAX_ANGLE = 65 * Math.PI / 180;
const REWIND_SPEED_MULT = 5;

const player = { x: MARGIN, y: H/2 - PH/2, w: PW, h: PH, score: 0 };
const ai = { x: W - MARGIN - PW, y: H/2 - PH/2, w: PW, h: PH, score: 0 };
const ball = { x: W/2, y: H/2, r: BR, vx: 0, vy: 0, speed: BALL_SPEED_INIT };

let state = 'start';
let keys = {};
let glitchTimeout = null;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPaddle(p, color, glowColor) {
  ctx.save();
  ctx.shadowBlur = 25;
  ctx.shadowColor = glowColor;
  ctx.fillStyle = color;
  roundRect(ctx, p.x, p.y, p.w, p.h, 5);
  ctx.fill();
  ctx.shadowBlur = 40;
  ctx.shadowColor = glowColor;
  ctx.globalAlpha = 0.3;
  roundRect(ctx, p.x - 2, p.y - 2, p.w + 4, p.h + 4, 6);
  ctx.fill();
  ctx.restore();
}

function drawBall() {
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#ff0066';
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ff0040';
  ctx.beginPath();
  ctx.arc(ball.x + 3, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#0066ff';
  ctx.fillStyle = '#0040ff';
  ctx.beginPath();
  ctx.arc(ball.x - 3, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ff88cc';
  ctx.fillStyle = '#fff0f5';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffffff';
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(ball.x - 2, ball.y - 2, ball.r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBg() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1a0a2e');
  grad.addColorStop(0.5, '#231240');
  grad.addColorStop(1, '#2d1b4e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.setLineDash([8, 12]);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W/2, 0);
  ctx.lineTo(W/2, H);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(W/2, H/2, 80, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawScores() {
  ctx.save();
  const pStr = String(player.score).padStart(2, '0');
  const aStr = String(ai.score).padStart(2, '0');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '42px "Press Start 2P", monospace';
  const cx = W / 2;
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,0,0,0.25)';
  ctx.fillText(pStr, cx - 95 + 2, 28);
  ctx.fillStyle = 'rgba(0,100,255,0.25)';
  ctx.fillText(pStr, cx - 95 - 2, 28);
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#00ffff';
  ctx.fillStyle = '#00ffff';
  ctx.fillText(pStr, cx - 95, 28);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,0,0,0.25)';
  ctx.fillText(aStr, cx + 95 + 2, 28);
  ctx.fillStyle = 'rgba(0,100,255,0.25)';
  ctx.fillText(aStr, cx + 95 - 2, 28);
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#ff00ff';
  ctx.fillStyle = '#ff00ff';
  ctx.fillText(aStr, cx + 95, 28);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '32px "Press Start 2P", monospace';
  ctx.fillText(':', cx, 30);
  ctx.restore();
}

function drawStartScreen() {
  drawBg();
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '76px "Press Start 2P", monospace';
  const cx = W/2, cy = H/2 - 50;
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,0,0,0.3)';
  ctx.fillText('P0NG', cx + 4, cy);
  ctx.fillStyle = 'rgba(0,100,255,0.3)';
  ctx.fillText('P0NG', cx - 4, cy);
  ctx.shadowBlur = 35;
  ctx.shadowColor = '#ff66ff';
  ctx.fillStyle = '#fff0f5';
  ctx.fillText('P0NG', cx, cy);
  ctx.shadowBlur = 0;
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(Date.now() / 400))})`;
  ctx.fillText('PRESS ANY KEY', cx, cy + 70);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.fillText('W / S TO MOVE', cx, cy + 110);
  ctx.restore();
}

function handlePaddleHit(paddle) {
  const center = paddle.y + paddle.h / 2;
  const relHit = (ball.y - center) / (paddle.h / 2);
  const clamped = Math.max(-1, Math.min(1, relHit));
  const angle = clamped * MAX_ANGLE;
  const dir = paddle === player ? 1 : -1;
  ball.speed = Math.min(ball.speed * SPEED_MULT, BALL_SPEED_INIT * MAX_SPEED_MULT);
  ball.vx = dir * ball.speed * Math.cos(angle);
  ball.vy = ball.speed * Math.sin(angle);
}

function resetBall(direction) {
  ball.x = W / 2;
  ball.y = H / 2;
  ball.speed = BALL_SPEED_INIT;
  const angle = (Math.random() - 0.5) * 0.8;
  ball.vx = direction * ball.speed * Math.cos(angle);
  ball.vy = ball.speed * Math.sin(angle);
}

function triggerGlitch() {
  const screen = document.getElementById('crtScreen');
  const flash = document.getElementById('glitchFlash');
  screen.classList.remove('glitching');
  void screen.offsetWidth;
  screen.classList.add('glitching');
  flash.classList.add('active');
  if (glitchTimeout) clearTimeout(glitchTimeout);
  glitchTimeout = setTimeout(() => {
    screen.classList.remove('glitching');
    flash.classList.remove('active');
    glitchTimeout = null;
  }, 250);
}

function startRewind(serveDir) {
  state = 'rewind';
  const angle = Math.atan2(ball.vy, ball.vx);
  const rewindAngle = angle + Math.PI;
  ball.vx = Math.cos(rewindAngle) * BALL_SPEED_INIT * REWIND_SPEED_MULT;
  ball.vy = Math.sin(rewindAngle) * BALL_SPEED_INIT * REWIND_SPEED_MULT;
  const screen = document.getElementById('crtScreen');
  screen.classList.remove('shaking');
  void screen.offsetWidth;
  screen.classList.add('shaking');
  const nc = document.getElementById('noiseCanvas');
  nc.classList.add('burst');
  setTimeout(() => {
    nc.classList.remove('burst');
  }, 100);
  setTimeout(() => {
    ball.x = W / 2;
    ball.y = H / 2;
    ball.speed = BALL_SPEED_INIT;
    const serveAngle = (Math.random() - 0.5) * 0.8;
    ball.vx = serveDir * ball.speed * Math.cos(serveAngle);
    ball.vy = ball.speed * Math.sin(serveAngle);
    screen.classList.remove('shaking');
    state = 'play';
  }, 300);
}

function update() {
  player.vy = 0;
  if (keys['w']) player.vy = -PADDLE_SPEED;
  if (keys['s']) player.vy = PADDLE_SPEED;
  if (state === 'start') return;
  player.y += player.vy;
  player.y = Math.max(0, Math.min(H - player.h, player.y));
  const targetY = ball.y - ai.h / 2;
  const diff = targetY - ai.y;
  if (Math.abs(diff) > 6) {
    ai.y += Math.sign(diff) * Math.min(Math.abs(diff), AI_SPEED);
  }
  ai.y = Math.max(0, Math.min(H - ai.h, ai.y));
  if (state !== 'play' && state !== 'rewind') return;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) { ball.vy = Math.abs(ball.vy); ball.y = ball.r; }
  if (ball.y + ball.r >= H) { ball.vy = -Math.abs(ball.vy); ball.y = H - ball.r; }
  if (state !== 'play') return;
  if (ball.vx < 0 &&
      ball.x - ball.r <= player.x + player.w &&
      ball.x + ball.r >= player.x &&
      ball.y + ball.r >= player.y &&
      ball.y - ball.r <= player.y + player.h) {
    handlePaddleHit(player);
    triggerGlitch();
    ball.x = player.x + player.w + ball.r;
  }
  if (ball.vx > 0 &&
      ball.x + ball.r >= ai.x &&
      ball.x - ball.r <= ai.x + ai.w &&
      ball.y + ball.r >= ai.y &&
      ball.y - ball.r <= ai.y + ai.h) {
    handlePaddleHit(ai);
    triggerGlitch();
    ball.x = ai.x - ball.r;
  }
  if (ball.x + ball.r < 0) {
    ai.score++;
    startRewind(-1);
  }
  if (ball.x - ball.r > W) {
    player.score++;
    startRewind(1);
  }
}

function render() {
  if (state === 'start') { drawStartScreen(); return; }
  drawBg();
  drawPaddle(player, '#00ffff', 'rgba(0,255,255,0.5)');
  drawPaddle(ai, '#ff00ff', 'rgba(255,0,255,0.5)');
  drawBall();
  drawScores();
  if (state === 'rewind') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('\u23ea', ball.x - 25, ball.y);
    ctx.restore();
  }
}

const noiseCanvas = document.getElementById('noiseCanvas');
const nctx = noiseCanvas.getContext('2d');
const NW = 100, NH = 75;

function generateNoise() {
  const imageData = nctx.createImageData(NW, NH);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = v; d[i+1] = v; d[i+2] = v; d[i+3] = 255;
  }
  nctx.putImageData(imageData, 0, 0);
}

generateNoise();
setInterval(generateNoise, 80);

document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (state === 'start') { state = 'play'; resetBall(Math.random() > 0.5 ? 1 : -1); }
  if (k === 'w' || k === 's') e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();
