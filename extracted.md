# Code Dump: cod_zombie

## cod_zombie/game.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>2D Zombies Game</title>
        <link rel="stylesheet" href="assets/style.css" />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
        <div id="gameContainer">
            <canvas id="gameCanvas"></canvas>
            <div id="ui">
                <div class="ui-item weapon-display">
                    <span id="weaponName">VX-9 "Nightfall"</span>
                </div>
                <div class="ui-item">Wave: <span id="wave">1</span></div>
                <div class="ui-item">
                    Zombies: <span id="zombiesLeft">0</span>
                </div>
                <div class="ui-item">Kills: <span id="kills">0</span></div>
                <div class="ui-item">Points: <span id="points">0</span></div>
                <div class="ui-item">
                    Ammo: <span id="ammo">15</span>/<span id="maxAmmo">15</span>
                </div>
                <div class="ui-item">
                    Health: <span id="health">100</span>/100
                </div>
            </div>

            <div id="gameOver">
                <h1>GAME OVER</h1>
                <p>Wave: <span id="finalWave">1</span></p>
                <p>Kills: <span id="finalKills">0</span></p>
                <p>Points: <span id="finalPoints">0</span></p>
                <button onclick="restartGame()">Restart</button>
            </div>
        </div>

        <script type="module" src="main.js"></script>
    </body>
</html>

```

## cod_zombie/main.js

```javascript
// cod_zombie/main.js

import { Game } from "./js/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  // Expose resetGame to the global scope for the restart button
  window.restartGame = () => {
    game.resetGame();
  };
});

```

## cod_zombie/assets/style.css

```css
/* style.css */
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap");

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #0a0a0a;
    font-family: "JetBrains Mono", monospace;
    color: #e0e0e0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}

#gameContainer {
    position: relative;
    width: 100%;
    height: 100%;
    /* Subtle scanline effect for a retro-tactical look */
    background:
        linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
        linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.03),
            rgba(0, 255, 0, 0.01),
            rgba(0, 0, 255, 0.03)
        );
    background-size:
        100% 4px,
        3px 100%;
    border: 4px solid #3d4035; /* Olive drab border */
}

#gameCanvas {
    display: block;
    width: 100%;
    height: 100%;
    background: #121410;
    cursor: crosshair;
}

/* TACTICAL HUD STYLE */

#ui {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    background: rgba(26, 28, 22, 0.9); /* Dark Olive */
    padding: 15px;
    border-left: 4px solid #8ba35d; /* Status Accent */
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 220px;
    box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.5);
}

.ui-item {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8ba35d;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(139, 163, 93, 0.2);
    padding: 4px 0;
}

.ui-item span {
    color: #fff;
    font-weight: 700;
}

/* Warning Colors */
#health {
    border-left: 4px solid #ff4444;
    padding-left: 10px;
    margin-top: 5px;
}
#health span {
    color: #ff4444;
}

#ammo {
    border-left: 4px solid #ffcc00;
    padding-left: 10px;
}
#ammo span {
    color: #ffcc00;
}

/* GAME OVER SCREEN - GRITTY STYLE */

#gameOver {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #1a0a0a;
    border: 2px solid #ff4444;
    padding: 50px;
    text-align: center;
    z-index: 200;
    display: none;
    box-shadow:
        0 0 50px rgba(255, 68, 68, 0.2),
        20px 20px 0px #000;
}

#gameOver h1 {
    font-size: 64px;
    color: #ff4444;
    margin-bottom: 30px;
    letter-spacing: -2px;
    font-weight: 800;
}

#gameOver p {
    font-size: 18px;
    margin-bottom: 10px;
    color: #888;
    text-transform: uppercase;
}

#gameOver span {
    color: #fff;
}

#gameOver button {
    margin-top: 30px;
    padding: 15px 40px;
    background: transparent;
    border: 2px solid #ff4444;
    color: #ff4444;
    font-family: "JetBrains Mono", monospace;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
}

#gameOver button:hover {
    background: #ff4444;
    color: #1a0a0a;
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.4);
}

/* Reload Spinner Animation */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.reloading-icon {
    display: inline-block;
    margin-left: 10px;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 204, 0, 0.3);
    border-top: 2px solid #ffcc00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    vertical-align: middle;
}

/* Optional: Pulse effect for the ammo text while reloading */
.ammo-reloading {
    color: #ff4444 !important;
    font-style: italic;
}

#wave {
    transition: all 0.3s ease;
}

/* Add a class for the wave text when waiting */
.wave-waiting {
    animation: pulse-red 1s infinite;
    color: #ff4444 !important;
}

@keyframes pulse-red {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}

```

## cod_zombie/js/bullet.js

```javascript
// cod_zombie/js/bullet.js

import { BULLET_SPEED } from "./constants.js";

export class Bullet {
  constructor(startX, startY, targetX, targetY, weaponData) {
    this.x = startX;
    this.y = startY;
    const dx = targetX - startX;
    const dy = targetY - startY;
    this.angle = Math.atan2(dy, dx);
    this.speed = weaponData.speed / 60; // Convert to pixels per frame
    this.damage = weaponData.damage;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
}

```

## cod_zombie/js/bulletManager.js

```javascript
// cod_zombie/js/bulletManager.js

import { Bullet } from "./bullet.js";

export class BulletManager {
  constructor() {
    this.bullets = [];
  }

  addBullet(startX, startY, targetX, targetY, weaponData) {
    this.bullets.push(new Bullet(startX, startY, targetX, targetY, weaponData));
  }

  update(canvasWidth, canvasHeight) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();

      if (
        bullet.y < 0 ||
        bullet.y > canvasHeight ||
        bullet.x < 0 ||
        bullet.x > canvasWidth
      ) {
        this.bullets.splice(i, 1);
      }
    }
  }

  clear() {
    this.bullets = [];
  }
}

```

## cod_zombie/js/collisionDetector.js

```javascript
// cod_zombie/js/collisionDetector.js

import {
  POINTS_PER_HIT,
  POINTS_PER_KILL,
  HEALTH_LOSS_PER_ZOMBIE_COLLISION,
} from "./constants.js";

export class CollisionDetector {
  checkCollisions(bullets, zombies, player, game) {
    // Bullet-zombie collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = zombies.length - 1; j >= 0; j--) {
        const bullet = bullets[i];
        const zombie = zombies[j];

        if (
          bullet.x > zombie.x &&
          bullet.x < zombie.x + zombie.width &&
          bullet.y > zombie.y &&
          bullet.y < zombie.y + zombie.height
        ) {
          zombie.health -= bullet.damage;
          bullets.splice(i, 1);
          game.points += POINTS_PER_HIT;

          if (zombie.health <= 0) {
            zombies.splice(j, 1);
            game.kills += 1;
            game.points += POINTS_PER_KILL;
          }
          break;
        }
      }
    }

    // Zombie-player collisions
    for (let zombie of zombies) {
      if (
        player.x < zombie.x + zombie.width &&
        player.x + player.width > zombie.x &&
        player.y < zombie.y + zombie.height &&
        player.y + player.height > zombie.y
      ) {
        game.health -= HEALTH_LOSS_PER_ZOMBIE_COLLISION;
        if (game.health <= 0) {
          game.endGame();
        }
      }
    }
  }
}

```

## cod_zombie/js/constants.js

```javascript
// cod_zombie/js/constants.js

export const GAME_CANVAS_ID = "gameCanvas";
export const GAME_CONTAINER_ID = "gameContainer";

export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 4;
export const PLAYER_INITIAL_HEALTH = 100;
export const PLAYER_MAX_AMMO = 30;

export const BULLET_SPEED = 20;
export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 10;

export const ZOMBIE_WIDTH = 25;
export const ZOMBIE_HEIGHT = 35;
export const ZOMBIE_INITIAL_SPEED_MULTIPLIER = 0.1;
export const ZOMBIE_INITIAL_HEALTH_MULTIPLIER = 15; // Increased from 0.5 to 15
export const ZOMBIE_BASE_COUNT = 3;
export const ZOMBIE_COUNT_PER_WAVE = 2;

export const POINTS_PER_HIT = 10;
export const POINTS_PER_KILL = 100;
export const HEALTH_LOSS_PER_ZOMBIE_COLLISION = 1;

export const UI_ELEMENT_IDS = {
  wave: "wave",
  kills: "kills",
  points: "points",
  ammo: "ammo",
  health: "health",
  gameOver: "gameOver",
  finalWave: "finalWave",
  finalKills: "finalKills",
  finalPoints: "finalPoints",
};

export const COLORS = {
  player: "#4adeff", // Cyan player
  playerStroke: "#22d3ee",
  gunBarrel: "#ffde59", // Yellow gun
  bullet: "#ffde59", // Yellow bullets
  zombie: "#94a3b8", // Grayish zombie
  zombieEye: "#ef4444", // Red eyes
  canvasBackground: "#0f172a", // Dark blue background
};

```

## cod_zombie/js/game.js

```javascript
// cod_zombie/js/game.js

// weapon
import { WeaponManager } from "./weapon/weaponManager.js";
import { HandgunVX9Nightfall } from "./weapon/handgun_vx-9_nightfall.js";

import { Player } from "./player.js";
import { BulletManager } from "./bulletManager.js";
import { ZombieManager } from "./zombieManager.js";
import { CollisionDetector } from "./collisionDetector.js";
import { WaveManager } from "./waveManager.js";
import { Renderer } from "./renderer.js";
import { UIManager } from "./uiManager.js";
import { InputHandler } from "./inputHandler.js";
import {
  GAME_CANVAS_ID,
  GAME_CONTAINER_ID,
  PLAYER_INITIAL_HEALTH,
  PLAYER_MAX_AMMO,
} from "./constants.js";

export class Game {
  constructor() {
    this.wave = 1;
    this.kills = 0;
    this.points = 0;
    this.health = PLAYER_INITIAL_HEALTH;
    this.isGameOver = false;

    this.canvas = document.getElementById(GAME_CANVAS_ID);
    this.ctx = this.canvas.getContext("2d");
    this.gameContainer = document.getElementById(GAME_CONTAINER_ID);

    this.player = new Player(this.canvas.width, this.canvas.height);
    this.bulletManager = new BulletManager();
    this.zombieManager = new ZombieManager();
    this.collisionDetector = new CollisionDetector();
    this.waveManager = new WaveManager();
    this.renderer = new Renderer(this.ctx);
    this.uiManager = new UIManager();

    // Weapon Manager
    this.weaponManager = new WeaponManager();
    this.weaponManager.addWeapon(new HandgunVX9Nightfall());

    this.inputHandler = new InputHandler(this.player, this, this.weaponManager);

    // In game.js constructor
    const svgString = `
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="99.578"
          height="99.578"
          viewBox="0 0 99.578 99.578"
          xml:space="preserve"
          fill="yellow"
      >
        <path
              d="M48.199 45.317c-.672-2.817-1.922-4.717-3.357-4.717v18.844c1.436 0 2.686-1.899 3.357-4.717v4.722h34.66v-3.308H58.891a3.13 3.13 0 1 1 0-6.261H82.86v-1.063H58.004a.708.708 0 1 1 0-1.417h24.855v-7.088h-34.66zm36.905-5.189v18.957c7.996 0 14.475-4.243 14.475-9.479s-6.479-9.478-14.475-9.478m-84.04.539H34.73v1.418H1.064zm13.112 6.379h24.453v1.417H14.176zm1.24 3.012h16.125v1.418H15.416zM0 54.312h30.125v1.416H0z"
          />
      </svg>
    `;
    this.bulletImage = new Image();
    this.bulletImage.src = "data:image/svg+xml;base64," + btoa(svgString);

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    window.addEventListener("load", () => this.initGame());
    this.initGame();
  }

  resizeCanvas() {
    this.canvas.width = this.gameContainer.clientWidth;
    this.canvas.height = this.gameContainer.clientHeight;
    this.player.resetPosition(this.canvas.width, this.canvas.height);
  }

  initGame() {
    this.player.resetPosition(this.canvas.width, this.canvas.height);
    this.zombieManager.spawnZombies(
      this.canvas.width,
      this.canvas.height,
      this.wave,
    );
    this.gameLoop();
  }

  getWeaponInfo() {
    const weapon = this.weaponManager.getCurrentWeapon();
    return weapon ? weapon.getInfo() : null;
  }

  gameLoop() {
    if (this.isGameOver) return;

    this.player.update(this.canvas.width, this.canvas.height);

    const fireDataArray = this.weaponManager.update();
    if (fireDataArray) {
      fireDataArray.forEach((fireData) => {
        // Add null check here
        if (fireData) {
          this.bulletManager.addBullet(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            fireData.target.x,
            fireData.target.y,
            fireData,
          );
        }
      });
    }

    this.bulletManager.update(this.canvas.width, this.canvas.height);
    this.zombieManager.update(this.player.x, this.player.y);
    this.collisionDetector.checkCollisions(
      this.bulletManager.bullets,
      this.zombieManager.zombies,
      this.player,
      this,
    );
    this.waveManager.checkWaveComplete(
      this.zombieManager.zombies,
      this,
      this.zombieManager,
    );

    // Draw
    this.renderer.clearCanvas(this.canvas.width, this.canvas.height);
    this.renderer.drawPlayer(this.player);
    this.renderer.drawBullets(this.bulletManager.bullets, this.bulletImage);
    this.renderer.drawZombies(this.zombieManager.zombies);

    // Update UI
    this.uiManager.updateUI(this);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  endGame() {
    this.isGameOver = true;
    this.uiManager.showGameOver(this);
  }

  resetGame() {
    this.wave = 1;
    this.kills = 0;
    this.points = 0;
    this.health = PLAYER_INITIAL_HEALTH;
    this.ammo = PLAYER_MAX_AMMO;
    this.isGameOver = false;

    this.bulletManager.clear();
    this.zombieManager.clear();
    this.player.resetPosition(this.canvas.width, this.canvas.height);
    this.uiManager.hideGameOver();
    this.initGame();
  }
}

```

## cod_zombie/js/inputHandler.js

```javascript
// cod_zombie/js/inputHandler.js

export class InputHandler {
  constructor(player, game, weaponManager) {
    this.player = player;
    this.game = game;
    this.weaponManager = weaponManager;
    this.init();
  }

  init() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.game.canvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this),
    );
    this.game.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.game.canvas.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.player.updateRotation(mouseX, mouseY);
    });
  }

  handleKeyDown(e) {
    if (e.key === "a") this.player.moveLeft = true;
    if (e.key === "d") this.player.moveRight = true;
    if (e.key === "w") this.player.moveUp = true;
    if (e.key === "s") this.player.moveDown = true;

    // reload
    if (e.key === "r" || e.key === "R") {
      this.game.weaponManager.reload();
    }

    // weapon switching
    if (e.key === "q" || e.key === "Q") {
      this.game.weaponManager.switchWeapon();
    }
  }

  handleKeyUp(e) {
    if (e.key === "a") this.player.moveLeft = false;
    if (e.key === "d") this.player.moveRight = false;
    if (e.key === "w") this.player.moveUp = false;
    if (e.key === "s") this.player.moveDown = false;
  }

  handleMouseDown(e) {
    if (this.game.isGameOver) return;
    const rect = this.game.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.weaponManager.startFiring(mouseX, mouseY);
  }

  handleMouseUp(e) {
    if (this.game.isGameOver) return;
    this.weaponManager.stopFiring();
  }
}

```

## cod_zombie/js/player.js

```javascript
// cod_zombie/js/player.js

import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED } from "./constants.js";

export class Player {
  constructor(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 50;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_SPEED;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    // Add this to the constructor in player.js
    this.angle = 0;
  }

  // Add this method to update the angle based on mouse coordinates
  updateRotation(mouseX, mouseY) {
    const dx = mouseX - (this.x + this.width / 2);
    const dy = mouseY - (this.y + this.height / 2);
    this.angle = Math.atan2(dy, dx);
  }

  update(canvasWidth, canvasHeight) {
    if (this.moveLeft && this.x > 0) this.x -= this.speed;
    if (this.moveRight && this.x < canvasWidth - this.width)
      this.x += this.speed;
    if (this.moveUp && this.y > 0) this.y -= this.speed;
    if (this.moveDown && this.y < canvasHeight - this.height)
      this.y += this.speed;
  }

  resetPosition(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 50;
  }
}

```

## cod_zombie/js/renderer.js

```javascript
// cod_zombie/js/renderer.js

import { COLORS } from "./constants.js";

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clearCanvas(width, height) {
    this.ctx.fillStyle = COLORS.canvasBackground;
    this.ctx.fillRect(0, 0, width, height);
  }

  drawPlayer(player) {
    this.ctx.save();

    // Move the canvas origin to the center of the player
    this.ctx.translate(
      player.x + player.width / 2,
      player.y + player.height / 2,
    );

    // Rotate the canvas context
    this.ctx.rotate(player.angle);

    // Draw the player body (centered at 0,0)
    this.ctx.fillStyle = COLORS.player;
    this.ctx.fillRect(
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height,
    );

    // Draw the gun barrel (now points toward the cursor)
    this.ctx.strokeStyle = COLORS.gunBarrel;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(25, 0); // Draws the gun facing right (0 radians)
    this.ctx.stroke();

    this.ctx.restore();
  }

  // In renderer.js
  drawBullets(bullets, bulletImage) {
    for (let bullet of bullets) {
      if (bulletImage.complete) {
        // Draw image centered on bullet position
        this.ctx.drawImage(
          bulletImage,
          bullet.x - 5, // Adjust offset based on your image size
          bullet.y - 10,
          10, // Width
          20, // Height
        );
      } else {
        // Fallback while image loads
        this.ctx.fillStyle = COLORS.bullet;
        this.ctx.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
      }
    }
  }

  drawZombies(zombies) {
    for (let zombie of zombies) {
      this.ctx.fillStyle = COLORS.zombie;
      this.ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

      // Eyes
      this.ctx.fillStyle = COLORS.zombieEye;
      this.ctx.fillRect(zombie.x + 5, zombie.y + 10, 5, 5);
      this.ctx.fillRect(zombie.x + 15, zombie.y + 10, 5, 5);
    }
  }
}

```

## cod_zombie/js/uiManager.js

```javascript
// cod_zombie/js/uiManager.js

import { UI_ELEMENT_IDS } from "./constants.js";

export class UIManager {
  constructor() {
    this.uiElements = {};
    for (const key in UI_ELEMENT_IDS) {
      this.uiElements[key] = document.getElementById(UI_ELEMENT_IDS[key]);
    }
  }

  updateUI(game) {
    const weapon = game.weaponManager.getCurrentWeapon(); //
    const weaponInfo = game.getWeaponInfo(); //

    if (weaponInfo && weapon) {
      const ammoElement = this.uiElements.ammo;

      // Check if the weapon is currently in its reloading state
      if (weapon.isReloading) {
        ammoElement.innerHTML = `RELOADING <span class="reloading-icon"></span>`;
        ammoElement.classList.add("ammo-reloading");
      } else {
        ammoElement.textContent = weaponInfo.currentAmmo;
        ammoElement.classList.remove("ammo-reloading");
      }

      const maxAmmoElement = document.getElementById("maxAmmo");
      if (maxAmmoElement) {
        maxAmmoElement.textContent = weaponInfo.magazineCapacity;
      }

      const weaponNameElement = document.getElementById("weaponName");
      if (weaponNameElement) {
        weaponNameElement.textContent = weaponInfo.name;
      }
    }

    const waveElement = this.uiElements.wave;
    if (game.waveManager.isWaitingForNextWave) {
      waveElement.textContent = "PREPARING...";
      waveElement.style.color = "#ffcc00"; // Turn yellow during pause
      waveElement.classList.add("wave-waiting");
    } else {
      waveElement.textContent = game.wave;
      waveElement.style.color = "#fff";
      waveElement.classList.remove("wave-waiting");
    }

    // Update remaining zombies
    const zombiesLeftElement = document.getElementById("zombiesLeft");
    if (zombiesLeftElement) {
      zombiesLeftElement.textContent = game.zombieManager.zombies.length;
    }

    this.uiElements.wave.textContent = game.wave; //
    this.uiElements.kills.textContent = game.kills; //
    this.uiElements.points.textContent = game.points; //
    this.uiElements.health.textContent = Math.max(0, Math.floor(game.health)); //
  }

  showGameOver(game) {
    this.uiElements.gameOver.style.display = "block";
    this.uiElements.finalWave.textContent = game.wave;
    this.uiElements.finalKills.textContent = game.kills;
    this.uiElements.finalPoints.textContent = game.points;
  }

  hideGameOver() {
    this.uiElements.gameOver.style.display = "none";
  }
}

```

## cod_zombie/js/waveManager.js

```javascript
// cod_zombie/js/waveManager.js

export class WaveManager {
  constructor() {
    this.isWaitingForNextWave = false;
    this.waveDelay = 3000; // 3 second pause between rounds
  }

  checkWaveComplete(zombies, game, zombieManager) {
    // If all zombies are dead and we aren't already in the middle of a countdown
    if (zombies.length === 0 && !this.isWaitingForNextWave) {
      this.isWaitingForNextWave = true;

      // Logic for ending current wave
      setTimeout(() => {
        game.wave += 1;

        // Optional: Refill ammo on new round like COD (or keep as is)
        const weapon = game.weaponManager.getCurrentWeapon();
        if (weapon) {
          weapon.reserveAmmo = weapon.maxAmmo - weapon.magazineCapacity;
        }

        zombieManager.spawnZombies(
          game.canvas.width,
          game.canvas.height,
          game.wave,
        );

        this.isWaitingForNextWave = false;
      }, this.waveDelay);
    }
  }
}

```

## cod_zombie/js/zombie.js

```javascript
// cod_zombie/js/zombie.js

import {
  ZOMBIE_WIDTH,
  ZOMBIE_HEIGHT,
  ZOMBIE_INITIAL_SPEED_MULTIPLIER,
  ZOMBIE_INITIAL_HEALTH_MULTIPLIER,
} from "./constants.js";

export class Zombie {
  constructor(x, y, wave) {
    this.x = x;
    this.y = y;
    this.width = ZOMBIE_WIDTH;
    this.height = ZOMBIE_HEIGHT;
    this.speed = 1 + wave * ZOMBIE_INITIAL_SPEED_MULTIPLIER;
    this.health = 1 + wave * ZOMBIE_INITIAL_HEALTH_MULTIPLIER;
  }

  update(playerX, playerY) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }
}

```

## cod_zombie/js/zombieManager.js

```javascript
// cod_zombie/js/zombieManager.js

import { Zombie } from "./zombie.js";
import { ZOMBIE_BASE_COUNT, ZOMBIE_COUNT_PER_WAVE } from "./constants.js";

export class ZombieManager {
  constructor() {
    this.zombies = [];
  }

  spawnZombies(canvasWidth, canvasHeight, wave) {
    const count = ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE;
    this.zombies = [];
    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? "left" : "right";
      const x = side === "left" ? -20 : canvasWidth + 20;
      const y = Math.random() * (canvasHeight - 100);
      this.zombies.push(new Zombie(x, y, wave));
    }
  }

  update(playerX, playerY) {
    for (let zombie of this.zombies) {
      zombie.update(playerX, playerY);
    }
  }

  removeZombie(index) {
    this.zombies.splice(index, 1);
  }

  clear() {
    this.zombies = [];
  }
}

```

## cod_zombie/js/weapon/handgun_vx-9_nightfall.js

```javascript
// js/weapon/handgun_vx-9_nightfall.js

import { WeaponBase } from "./weaponBase.js";

export class HandgunVX9Nightfall extends WeaponBase {
  constructor() {
    super({
      // Weapon Identity
      name: 'VX-9 "Nightfall"',
      type: "Handgun / Semi-Automatic Pistol",
      rarity: "Rare",
      description:
        "A compact, high-velocity sidearm developed for close-to-mid range combat. The VX-9 excels in accuracy and quick handling, making it a favorite backup weapon for elite operatives.",

      // Core Stats
      baseDamage: 28,
      headshotMultiplier: 1.8,
      fireRate: 420, // rounds per minute
      bulletSpeed: 520, // pixels per second (scaled from m/s)
      effectiveRange: 450, // pixels (scaled from 45 meters)
      maxRange: 700, // pixels (scaled from 70 meters)
      armorPenetration: "Medium",

      // Ammo & Reload
      magazineCapacity: 15,
      maxAmmo: 120,
      reloadTime: 1.6, // seconds
      emptyReloadTime: 2.1, // seconds

      // Handling & Accuracy
      recoil: "Low",
      hipFireAccuracy: 0.78,
      adsAccuracy: 0.92,
      movementPenalty: -0.05,
      drawTime: 0.35, // seconds

      fireMode: "burst", // semi, burst, auto
      burstCount: 3, // comment this if not burst

      // Special Effects
      specialEffects: [
        {
          name: "Precision Burst",
          description:
            "Landing 3 consecutive hits increases damage by +10% for 4 seconds",
          type: "damage_boost",
        },
        {
          name: "Silent Slide",
          description:
            "Suppressor attachment reduces enemy detection radius by 30%",
          type: "stealth",
        },
      ],
    });

    // Special effect state tracking
    this.consecutiveHits = 0;
    this.precisionBurstActive = false;
    this.precisionBurstTimer = null;
  }

  // Override fire method to include special effects
  fire() {
    const fireData = super.fire();
    if (!fireData) return null;

    // Apply Precision Burst damage boost
    if (this.precisionBurstActive) {
      fireData.damage *= 1.1;
    }

    return fireData;
  }

  onHit() {
    this.consecutiveHits++;

    // Activate Precision Burst on 3rd consecutive hit
    if (this.consecutiveHits >= 3 && !this.precisionBurstActive) {
      this.precisionBurstActive = true;

      // Clear existing timer if any
      if (this.precisionBurstTimer) {
        clearTimeout(this.precisionBurstTimer);
      }

      // Set 4-second timer
      this.precisionBurstTimer = setTimeout(() => {
        this.precisionBurstActive = false;
        this.consecutiveHits = 0;
      }, 4000);
    }
  }

  onMiss() {
    this.consecutiveHits = 0;
  }
}

```

## cod_zombie/js/weapon/weaponBase.js

```javascript
// js/weapon/weaponBase.js

export class WeaponBase {
  constructor(config) {
    // Weapon Identity
    this.name = config.name;
    this.type = config.type;
    this.rarity = config.rarity;
    this.description = config.description;

    // Core Stats
    this.baseDamage = config.baseDamage;
    this.headshotMultiplier = config.headshotMultiplier || 1.5;
    this.fireRate = config.fireRate; // rounds per minute
    this.bulletSpeed = config.bulletSpeed;
    this.effectiveRange = config.effectiveRange;
    this.maxRange = config.maxRange;
    this.armorPenetration = config.armorPenetration;

    // Ammo & Reload
    this.magazineCapacity = config.magazineCapacity;
    this.maxAmmo = config.maxAmmo;
    this.currentAmmo = config.magazineCapacity;
    this.reserveAmmo = config.maxAmmo - config.magazineCapacity;
    this.reloadTime = config.reloadTime;
    this.emptyReloadTime = config.emptyReloadTime;

    // Handling
    this.recoil = config.recoil;
    this.hipFireAccuracy = config.hipFireAccuracy;
    this.adsAccuracy = config.adsAccuracy;
    this.movementPenalty = config.movementPenalty;
    this.drawTime = config.drawTime;

    // Special Effects
    this.specialEffects = config.specialEffects || [];

    // Fire Mode
    this.fireMode = config.fireMode || "semi"; // 'semi', 'auto', 'burst'
    this.burstCount = config.burstCount || 3;

    // Internal State
    this.isReloading = false;
    this.lastFireTime = 0;
    this.isADS = false; // aim down sights

    // Fire Mode State
    this.isFiring = false;
    this._target = { x: 0, y: 0 };
    this._burstsLeft = 0;
    this._isBursting = false;
    this._hasFiredInSemi = false;

    // Reload Sound
    this.reloadSound = new Audio("assets/handgun_reload.mp3");
  }

  canFire() {
    if (this.isReloading || this.currentAmmo <= 0) {
      return false;
    }
    const now = Date.now();
    const fireInterval = 60000 / this.fireRate;
    return now - this.lastFireTime >= fireInterval;
  }

  startFiring(targetX, targetY) {
    // Allow the firing state to start even with 0 ammo to trigger the auto-reload
    if (this.currentAmmo <= 0) {
      this.reload();
    }

    this.isFiring = true;
    this._target.x = targetX;
    this._target.y = targetY;

    if (this.fireMode === "semi" && !this._hasFiredInSemi) {
      this._hasFiredInSemi = true;
    }

    if (this.fireMode === "burst" && !this._isBursting) {
      this._isBursting = true;
      this._burstsLeft = this.burstCount;
    }
  }

  stopFiring() {
    this.isFiring = false;
    this._hasFiredInSemi = false;
  }

  _getFireData() {
    // If we have no ammo left in the magazine
    if (this.currentAmmo <= 0) {
      this.reload(); // Automatically trigger the reload process
      this.stopFiring(); // Stop the current firing sequence
      return null;
    }

    this.currentAmmo--; // Deduct ammo
    this.lastFireTime = Date.now(); // Record the fire time

    // If the last bullet was just fired, trigger an automatic empty reload
    if (this.currentAmmo <= 0) {
      this.reload(); // Start the emptyReloadTime duration
      this._isBursting = false;
      this._burstsLeft = 0;
    }

    return {
      damage: this.baseDamage,
      speed: this.bulletSpeed,
      accuracy: this.isADS ? this.adsAccuracy : this.hipFireAccuracy,
      target: this._target,
    };
  }

  update() {
    const fireDataArray = [];
    const now = Date.now();

    switch (this.fireMode) {
      case "semi":
        if (this.isFiring && this._hasFiredInSemi && this.canFire()) {
          fireDataArray.push(this._getFireData());
          this._hasFiredInSemi = false; // Reset so they must click again
          this.isFiring = false;
        }
        break;

      case "auto":
        if (this.isFiring && this.canFire()) {
          fireDataArray.push(this._getFireData());
        }
        break;

      case "burst":
        if (this.isFiring && !this._isBursting) {
          this._isBursting = true;
          this._burstsLeft = this.burstCount;
        }

        // Logic: If we are currently in the middle of a burst sequence
        if (this._isBursting && this._burstsLeft > 0) {
          if (this.canFire()) {
            fireDataArray.push(this._getFireData());
            this._burstsLeft--;

            if (this._burstsLeft === 0 || this.currentAmmo === 0) {
              this._isBursting = false;
              // Optional: Add a longer delay here for "between bursts"
              this.lastFireTime = now;
            }
          }
        }
        break;
    }

    return fireDataArray.length > 0 ? fireDataArray : null;
  }

  reload() {
    if (
      this.isReloading ||
      this.reserveAmmo <= 0 ||
      this.currentAmmo === this.magazineCapacity
    )
      return false;

    this.isReloading = true;

    // Determine which duration to use
    const isEmpty = this.currentAmmo === 0;
    const reloadDuration = isEmpty ? this.emptyReloadTime : this.reloadTime;

    // Play Sound with adjusted speed
    this.playReloadSound(reloadDuration);

    setTimeout(() => {
      const ammoNeeded = this.magazineCapacity - this.currentAmmo;
      const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);

      this.currentAmmo += ammoToReload;
      this.reserveAmmo -= ammoToReload;
      this.isReloading = false;
    }, reloadDuration * 1000);

    return true;
  }

  playReloadSound(targetDuration) {
    if (!this.reloadSound) return;

    // Reset sound if it was already playing
    this.reloadSound.pause();
    this.reloadSound.currentTime = 0;

    // Calculate playback rate: (Original Duration / Target Duration)
    // Note: This requires the metadata to be loaded to get duration accurately
    if (this.reloadSound.duration) {
      this.reloadSound.playbackRate =
        this.reloadSound.duration / targetDuration;
    }

    this.reloadSound
      .play()
      .catch((e) => console.log("Audio play blocked until user interaction."));
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      currentAmmo: this.currentAmmo,
      reserveAmmo: this.reserveAmmo,
      magazineCapacity: this.magazineCapacity,
    };
  }
}

```

## cod_zombie/js/weapon/weaponManager.js

```javascript
// js/weapon/weaponManager.js

export class WeaponManager {
  constructor() {
    this.weapons = [];
    this.currentWeaponIndex = 0;
    this.isSwapping = false;
  }

  addWeapon(weapon) {
    if (this.weapons.length < 2) {
      // Limit to 2 weapons
      this.weapons.push(weapon);
      return true;
    }
    return false;
  }

  getCurrentWeapon() {
    return this.weapons[this.currentWeaponIndex] || null;
  }

  switchWeapon() {
    if (this.weapons.length <= 1 || this.isSwapping) return false;

    this.isSwapping = true;
    const currentWeapon = this.getCurrentWeapon();

    setTimeout(() => {
      this.currentWeaponIndex =
        (this.currentWeaponIndex + 1) % this.weapons.length;
      const newWeapon = this.getCurrentWeapon();

      setTimeout(() => {
        this.isSwapping = false;
      }, newWeapon.drawTime * 1000);
    }, currentWeapon.drawTime * 500); // Half draw time for holstering

    return true;
  }

  reload() {
    const weapon = this.getCurrentWeapon();
    return weapon ? weapon.reload() : false;
  }

  startFiring(targetX, targetY) {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      weapon.startFiring(targetX, targetY);
    }
  }

  stopFiring() {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      weapon.stopFiring();
    }
  }

  update() {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      return weapon.update();
    }
    return null;
  }
}

```

