const SIZE = 4;
let grid = [];
let score = 0;

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('game-over');

// Initialize a blank grid and spawn two starting tiles
function initGrid() {
  grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score = 0;
  spawnTile();
  spawnTile();
  render();
}

// Spawn a 2 (90%) or 4 (10%) in a random empty cell
function spawnTile() {
  const empties = [];
  grid.forEach((row, r) => row.forEach((v, c) => {
    if (v === 0) empties.push([r, c]);
  }));
  if (!empties.length) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// Render the board and score
function render() {
  boardEl.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const val = grid[r][c];
      const cell = document.createElement('div');
      cell.className = 'cell' + (val ? ' tile-' + val : '');
      cell.textContent = val || '';
      boardEl.appendChild(cell);
    }
  }
  scoreEl.textContent = score;
}

// Slide & merge one row/column array to the left
function slide(arr) {
  const filtered = arr.filter(v => v);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  const merged = filtered.filter(v => v);
  return merged.concat(Array(SIZE - merged.length).fill(0));
}

// Handle a move in one of the four directions
function move(dir) {
  let moved = false;
  let temp;

  if (dir === 'ArrowLeft') {
    for (let r = 0; r < SIZE; r++) {
      temp = slide(grid[r]);
      moved ||= temp.some((v,i) => v !== grid[r][i]);
      grid[r] = temp;
    }
  }

  if (dir === 'ArrowRight') {
    for (let r = 0; r < SIZE; r++) {
      temp = slide(grid[r].slice().reverse()).reverse();
      moved ||= temp.some((v,i) => v !== grid[r][i]);
      grid[r] = temp;
    }
  }

  if (dir === 'ArrowUp') {
    for (let c = 0; c < SIZE; c++) {
      const col = slide(grid.map(r => r[c]));
      for (let r = 0; r < SIZE; r++) {
        if (grid[r][c] !== col[r]) moved = true;
        grid[r][c] = col[r];
      }
    }
  }

  if (dir === 'ArrowDown') {
    for (let c = 0; c < SIZE; c++) {
      const col = slide(grid.map(r => r[c]).reverse()).reverse();
      for (let r = 0; r < SIZE; r++) {
        if (grid[r][c] !== col[r]) moved = true;
        grid[r][c] = col[r];
      }
    }
  }

  if (moved) {
    spawnTile();
    render();
    if (isGameOver()) showGameOver();
  }
}

// Check if no moves remain
function isGameOver() {
  if (grid.some(row => row.includes(0))) return false;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) return false;
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 1; r++) {
      if (grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

// Show the “Game Over” overlay
function showGameOver() {
  gameOverEl.style.display = 'flex';
}

// Listen for arrow keys
document.addEventListener('keydown', e => {
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
    move(e.key);
  }
});

// Kick things off on page load
window.onload = initGrid;
