const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

// canvas settings
const viewWidth = 2560;
const viewHeight = 1600;
const drawingCanvas = document.getElementById("drawing_canvas");
let ctx;
const timeStep = 1 / 60;

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

class Particle {
  constructor(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.time = 0;
    this.duration = 3 + Math.random() * 2;
    this.color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);

    this.w = 8;
    this.h = 6;

    this.complete = false;
  }

  update() {
    this.time = Math.min(this.duration, this.time + timeStep);

    const f = Ease.outCubic(this.time, 0, 1, this.duration);
    const p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);

    const dx = p.x - this.x;
    const dy = p.y - this.y;

    this.r = Math.atan2(dy, dx) + HALF_PI;
    this.sy = Math.sin(Math.PI * f * 10);
    this.x = p.x;
    this.y = p.y;

    this.complete = this.time === this.duration;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
    ctx.scale(1, this.sy);

    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);

    ctx.restore();
  }
}

class Loader {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.r = 24;
    this._progress = 0;

    this.complete = false;
  }

  reset() {
    this._progress = 0;
    this.complete = false;
  }

  set progress(p) {
    this._progress = p < 0 ? 0 : p > 1 ? 1 : p;

    this.complete = this._progress === 1;
  }

  get progress() {
    return this._progress;
  }

  draw() {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.r,
      -HALF_PI,
      TWO_PI * this._progress - HALF_PI
    );
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.fill();
  }
}

// pun intended
class Exploader {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.startRadius = 24;

    this.time = 0;
    this.duration = 0.4;
    this.progress = 0;

    this.complete = false;
  }

  reset() {
    this.time = 0;
    this.progress = 0;
    this.complete = false;
  }

  update() {
    this.time = Math.min(this.duration, this.time + timeStep);
    this.progress = Ease.inBack(this.time, 0, 1, this.duration);

    this.complete = this.time === this.duration;
  }

  draw() {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.startRadius * (1 - this.progress), 0, TWO_PI);
    ctx.fill();
  }
}

const particles = [];
let loader;
let exploader;
let phase = 0;

function initDrawingCanvas() {
  drawingCanvas.width = viewWidth;
  drawingCanvas.height = viewHeight;
  ctx = drawingCanvas.getContext("2d");

  createLoader();
  createExploader();
  createParticles();
}
