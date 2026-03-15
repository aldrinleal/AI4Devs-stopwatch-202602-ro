// ── State ──────────────────────────────────────────────
let startTime   = 0;   // performance.now() snapshot when started
let elapsedTime = 0;   // accumulated ms before the last pause
let timerID     = null;
let isRunning   = false;

// ── DOM refs ───────────────────────────────────────────
const hoursEl       = document.getElementById('hours');
const minutesEl     = document.getElementById('minutes');
const secondsEl     = document.getElementById('seconds');
const millisecondsEl= document.getElementById('milliseconds');
const startStopBtn  = document.getElementById('startStopBtn');
const clearBtn      = document.getElementById('clearBtn');

// ── Helpers ────────────────────────────────────────────
function pad(value, digits = 2) {
  return String(value).padStart(digits, '0');
}

function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;
  const millis       = Math.floor(ms % 1000);

  hoursEl.textContent        = pad(hours);
  minutesEl.textContent      = pad(minutes);
  secondsEl.textContent      = pad(seconds);
  millisecondsEl.textContent = pad(millis, 3);
}

// ── Core loop ──────────────────────────────────────────
function tick() {
  const now     = performance.now();
  const current = elapsedTime + (now - startTime);
  updateDisplay(current);
  timerID = requestAnimationFrame(tick);
}

// ── Controls ───────────────────────────────────────────
function startStop() {
  if (isRunning) {
    // Pause
    elapsedTime += performance.now() - startTime;
    cancelAnimationFrame(timerID);
    timerID    = null;
    isRunning  = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('running');
  } else {
    // Start / Resume
    startTime = performance.now();
    isRunning = true;
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.add('running');
    timerID = requestAnimationFrame(tick);
  }
}

function clear() {
  cancelAnimationFrame(timerID);
  timerID     = null;
  isRunning   = false;
  elapsedTime = 0;
  startStopBtn.textContent = 'Start';
  startStopBtn.classList.remove('running');
  updateDisplay(0);
}

// ── Event listeners ────────────────────────────────────
startStopBtn.addEventListener('click', startStop);
clearBtn.addEventListener('click', clear);

// ── Init ───────────────────────────────────────────────
updateDisplay(0);
