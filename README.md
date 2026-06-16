# VHS Pong

A retro, VHS-styled Pong clone with rewind effects, match modifiers, and both Player vs AI and Player vs Friend modes. Built with HTML, CSS, and JavaScript using OpenCode as an AI coding assistant. 

## 🎮 Features

- **VHS / CRT aesthetic** – scanlines, flicker, curvature, static, neon colors.
- **Two game modes**:
  - Player vs AI
  - Player vs Friend (local 2‑player, shared keyboard)
- **Win / loss system** – first to N points triggers a VHS-style game over screen.
- **Rewind reset effect** – when someone scores, the ball “rewinds” dramatically before the next serve.
- **Match modifiers** (optional, can be expanded):
  - Big Ball / Small Paddles
  - Speed‑up rounds
  - Visual effects like fog or extra VHS glitches
- Designed as a small, beginner‑friendly game project inspired by classic Pong tutorials [web:19][web:41].

## 🕹️ Controls

### Menus
- `1` – Start **Player vs AI** mode  
- `2` – Start **Player vs Friend** mode  
- `R` – Restart after game over (returns to mode select screen)

### In‑game

**Player vs AI**
- Player (left paddle): `W` = up, `S` = down  
- AI (right paddle): moves automatically following the ball

**Player vs Friend**
- Player 1 (left paddle): `W` = up, `S` = down  
- Player 2 (right paddle): `↑` (Up Arrow) = up, `↓` (Down Arrow) = down  

## 🏁 Win / Lose Rules

- Default rule: **first to 5 points wins** (you can change this in the code).
- When someone wins:
  - Game pauses and shows a VHS‑style **GAME OVER** overlay.
  - Message depends on mode:
    - Vs AI: `"YOU WIN!"` or `"YOU LOSE!"`
    - Vs Friend: `"PLAYER 1 WINS!"` or `"PLAYER 2 WINS!"`
  - Final score is displayed.
  - Press `R` to restart and go back to the mode select screen.

## 🚀 Getting Started

### Prerequisites

You only need:

- A modern web browser (Chrome, Edge, Firefox, Safari).
 - https://rcream.github.io/VHS_pong/
- To run locally from files: just open `index.html`.

If you want to hack on the project with OpenCode (AI coding agent), follow an OpenCode setup guide [web:22], then edit the project via your editor + OpenCode.


## 🧩 Project Structure

```text
.
├── index.html      # Main HTML file, loads the game
├── style.css       # VHS / CRT visual styling and layout
├── game.js         # Core game logic (paddles, ball, scoring, modes, modifiers)
├── assets/         # (Optional) sounds, fonts, images, etc.
└── README.md       # This file
```

Your exact filenames may differ; update this tree to match your project.

## 🛠️ Built With

- **HTML5 Canvas** – rendering the game field and objects [web:41].
- **CSS** – VHS / CRT effects (scanlines, glow, flicker).
- **JavaScript** – game loop, physics, AI, modifiers, input handling.
- **OpenCode** – open‑source AI coding agent used to generate and iterate on the code [web:22].

## 🎚️ Modifiers

The game supports match modifiers that are randomly applied each round:

Examples:

- **Big Ball** – larger ball hitbox.
- **Small Paddles** – more precise movement required.
- **Speed Up** – ball accelerates more after paddle hits.
- **Fog / Glitch Zone** – harder to track the ball visually.
- **Multi‑ball** – extra ball for chaotic rounds.

See the `modifiers` or settings section in `game.js` to enable/disable or add your own.

## 🙏 Acknowledgments

- Classic Pong and various VHS aesthetics for inspiration.
- OpenCode Desktop.
- Perplexity Ai 
