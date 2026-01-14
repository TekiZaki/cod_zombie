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
        <link rel="icon" href="assets/icon.png" />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
        <div id="gameContainer">
            <canvas id="gameCanvas"></canvas>
            <div id="ui">
                <!-- Top Left: Stats -->
                <div id="statsTopLeft" class="ui-panel top-left">
                    <div class="ui-item">Zombies: <span id="zombiesLeft">0</span></div>
                    <div class="ui-item">Kills: <span id="kills">0</span></div>
                    <div class="ui-item">Points: <span id="points">0</span></div>
                </div>

                <!-- Top Center: Wave -->
                <div id="waveCenter" class="ui-panel top-center">
                    <div class="wave-label">WAVE</div>
                    <div id="wave">1</div>
                </div>

                <!-- Bottom Left: Health -->
                <div id="healthBottomLeft" class="ui-panel bottom-left">
                    <div class="ui-item health-display">
                        HEALTH: <span id="health">100</span>
                    </div>
                    <div class="health-bar-container">
                        <div id="healthBarFill" class="health-bar-fill"></div>
                    </div>
                </div>

                <!-- Bottom Center: Hints -->
                <div id="controlsHint" class="ui-hints bottom-center">
                    <div class="hint-item"><span class="key">WASD</span> MOVE</div>
                    <div class="hint-item"><span class="key">LMB</span> FIRE</div>
                    <div class="hint-item"><span class="key">R</span> RELOAD</div>
                    <div class="hint-item"><span class="key">Q</span> SWITCH</div>
                    <div class="hint-item"><span class="key">B</span> MODE</div>
                </div>

                <!-- Bottom Right: Weapon & Ammo -->
                <div id="weaponBottomRight" class="ui-panel bottom-right">
                    <div class="weapon-info">
                        <span id="weaponName">VX-9 "Nightfall"</span>
                        <span id="fireMode">[SEMI]</span>
                    </div>
                    <div class="ammo-display">
                        AMMO: <span id="ammo">15</span> / <span id="maxAmmo">15</span>
                    </div>
                </div>
            </div>

            <div id="gameOver">
                <h1>GAME OVER</h1>
                <p>Wave: <span id="finalWave">1</span></p>
                <p>Kills: <span id="finalKills">0</span></p>
                <p>Points: <span id="finalPoints">0</span></p>
                <button onclick="restartGame()">Restart</button>
            </div>

            <div id="storeOverlay" class="store-overlay">
                <div class="store-header">
                    <h2>TACTICAL UPGRADES</h2>
                    <p>Current Points: <span id="storePointsDisplay" style="color: #fff; font-weight: bold;">0</span></p>
                    <p style="font-size: 0.8em; margin-top: 5px;">Each upgrade costs <span id="upgradeCostDisplay" style="color: #ffcc00;">500</span> pts</p>
                </div>
                <div id="upgradeContainer" class="upgrade-container">
                    <!-- Cards will be injected here -->
                </div>
                <div class="store-footer">
                    <button id="refreshBtn" class="refresh-button">
                        REFRESH CHOICES
                        <div id="refreshCost" class="refresh-cost">Cost: 300 pts</div>
                    </button>
                </div>
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
            let damage = bullet.damage;
            
            // Critical Chance (Double Damage)
            if (game.modifiers.critChance && Math.random() < game.modifiers.critChance) {
                damage *= 2;
            }

            zombie.health -= damage;
            bullets.splice(i, 1);
            game.points += POINTS_PER_HIT;

            if (zombie.health <= 0) {
              zombies.splice(j, 1);
              game.kills += 1;
              game.points += POINTS_PER_KILL;

              // Heal on Kill modifier
              if (game.modifiers.healOnKill) {
                  game.health = Math.min(game.player.maxHealth, game.health + game.modifiers.healOnKill);
              }
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
        let damage = HEALTH_LOSS_PER_ZOMBIE_COLLISION;
        if (player.damageReduction) {
            damage *= player.damageReduction;
        }
        game.health -= damage;
        if (game.health <= 0) {
          game.endGame();
        }
      }
    }
  }

  resolveObstacleCollisions(entity, obstacles) {
    for (let obstacle of obstacles) {
      if (
        entity.x < obstacle.x + obstacle.width &&
        entity.x + entity.width > obstacle.x &&
        entity.y < obstacle.y + obstacle.height &&
        entity.y + entity.height > obstacle.y
      ) {
        // Find the overlap on each side
        const overlapLeft = entity.x + entity.width - obstacle.x;
        const overlapRight = obstacle.x + obstacle.width - entity.x;
        const overlapTop = entity.y + entity.height - obstacle.y;
        const overlapBottom = obstacle.y + obstacle.height - entity.y;

        // Find the smallest overlap
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        if (minOverlap === overlapLeft) {
          entity.x -= overlapLeft;
        } else if (minOverlap === overlapRight) {
          entity.x += overlapRight;
        } else if (minOverlap === overlapTop) {
          entity.y -= overlapTop;
        } else if (minOverlap === overlapBottom) {
          entity.y += overlapBottom;
        }
      }
    }
  }

  checkBulletObstacleCollisions(bullets, obstacles) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      for (let obstacle of obstacles) {
        if (
          bullet.x > obstacle.x &&
          bullet.x < obstacle.x + obstacle.width &&
          bullet.y > obstacle.y &&
          bullet.y < obstacle.y + obstacle.height
        ) {
          bullets.splice(i, 1);
          break;
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
export const PLAYER_SPEED = 6;
export const PLAYER_INITIAL_HEALTH = 100;
export const PLAYER_MAX_AMMO = 30;

export const BULLET_SPEED = 25;
export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 10;

export const ZOMBIE_WIDTH = 25;
export const ZOMBIE_HEIGHT = 35;
export const ZOMBIE_INITIAL_SPEED_MULTIPLIER = 0.4;
export const ZOMBIE_INITIAL_HEALTH_MULTIPLIER = 8; // Reduced from 15 to 8
export const ZOMBIE_BASE_COUNT = 6;
export const ZOMBIE_COUNT_PER_WAVE = 4;

export const POINTS_PER_HIT = 2;
export const POINTS_PER_KILL = 20;
export const HEALTH_LOSS_PER_ZOMBIE_COLLISION = 0.25;

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
  obstacle: "#334155", // Slate obstacle
};

```

## cod_zombie/js/game.js

```javascript
// cod_zombie/js/game.js

// weapon
import { WeaponManager } from "./weapon/weaponManager.js";
import { HandgunVX9Nightfall } from "./weapon/handgun_vx-9_nightfall.js";
import { AssaultRifleARC7Vanguard } from "./weapon/assault_rifle_arc-7_vanguard.js";

import { Player } from "./player.js";
import { BulletManager } from "./bulletManager.js";
import { ZombieManager } from "./zombieManager.js";
import { CollisionDetector } from "./collisionDetector.js";
import { WaveManager } from "./waveManager.js";
import { Renderer } from "./renderer.js";
import { UIManager } from "./uiManager.js";
import { InputHandler } from "./inputHandler.js";
import { MapManager } from "./mapManager.js";
import { StoreManager } from "./storeManager.js";
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
    this.isPaused = false;
    this.modifiers = {
        healOnKill: 0,
        ammoBonus: 0,
        critChance: 0
    };

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
    this.mapManager = new MapManager();
    this.storeManager = new StoreManager(this);

    document.getElementById("refreshBtn").addEventListener("click", () => {
        this.storeManager.refresh();
    });

    // Weapon Manager
    this.weaponManager = new WeaponManager();
    this.weaponManager.addWeapon(new HandgunVX9Nightfall());
    this.weaponManager.addWeapon(new AssaultRifleARC7Vanguard());

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
    this.mapManager.generateMap(
      this.canvas.width,
      this.canvas.height,
      this.player.x,
      this.player.y,
    );
    this.zombieManager.spawnZombies(
      this.canvas.width,
      this.canvas.height,
      this.wave,
    );
    
    // Ensure only one loop is running
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }
    this.gameLoop();
  }

  getWeaponInfo() {
    const weapon = this.weaponManager.getCurrentWeapon();
    return weapon ? weapon.getInfo() : null;
  }

  gameLoop() {
    if (this.isGameOver || this.isPaused) return;

    // Use a local variable for the animation frame ID
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));

    // Find nearest zombie for auto-aim
    let nearestZombie = null;
    let minDistance = Infinity;
    const playerCenterX = this.player.x + this.player.width / 2;
    const playerCenterY = this.player.y + this.player.height / 2;

    for (let zombie of this.zombieManager.zombies) {
      const zombieCenterX = zombie.x + zombie.width / 2;
      const zombieCenterY = zombie.y + zombie.height / 2;
      const dist = Math.sqrt(
        Math.pow(zombieCenterX - playerCenterX, 2) +
          Math.pow(zombieCenterY - playerCenterY, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestZombie = zombie;
      }
    }

    if (nearestZombie) {
      const targetX = nearestZombie.x + nearestZombie.width / 2;
      const targetY = nearestZombie.y + nearestZombie.height / 2;
      this.player.updateRotationToTarget(targetX, targetY);
      
      // Update weapon target for auto-aim
      if (this.weaponManager.getCurrentWeapon()) {
        this.weaponManager.getCurrentWeapon()._target = { x: targetX, y: targetY };
      }
    }

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

    // Obstacle collisions
    this.collisionDetector.resolveObstacleCollisions(
      this.player,
      this.mapManager.obstacles,
    );
    this.zombieManager.zombies.forEach((zombie) => {
      this.collisionDetector.resolveObstacleCollisions(
        zombie,
        this.mapManager.obstacles,
      );
    });
    this.collisionDetector.checkBulletObstacleCollisions(
      this.bulletManager.bullets,
      this.mapManager.obstacles,
    );

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
    this.renderer.drawObstacles(this.mapManager.obstacles);
    this.renderer.drawPlayer(this.player);
    this.renderer.drawBullets(this.bulletManager.bullets, this.bulletImage);
    this.renderer.drawZombies(this.zombieManager.zombies, nearestZombie);

    // Update UI
    this.uiManager.updateUI(this);
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
    this.isPaused = false;
    this.modifiers = {
        healOnKill: 0,
        ammoBonus: 0,
        critChance: 0
    };

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
    if (this.game.isPaused) return;
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

    // fire mode switching
    if (e.key === "b" || e.key === "B") {
      this.game.weaponManager.switchFireMode();
    }
  }

  handleKeyUp(e) {
    if (e.key === "a") this.player.moveLeft = false;
    if (e.key === "d") this.player.moveRight = false;
    if (e.key === "w") this.player.moveUp = false;
    if (e.key === "s") this.player.moveDown = false;
  }

  handleMouseDown(e) {
    if (this.game.isGameOver || this.game.isPaused) return;
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

## cod_zombie/js/mapManager.js

```javascript
// cod_zombie/js/mapManager.js

export class MapManager {
  constructor() {
    this.obstacles = [];
    this.obstacleCount = 10;
    this.minSize = 50;
    this.maxSize = 150;
  }

  generateMap(width, height, playerX, playerY, safeDistance = 150) {
    this.obstacles = [];
    for (let i = 0; i < this.obstacleCount; i++) {
      let obstacle;
      let isValid = false;
      let attempts = 0;

      while (!isValid && attempts < 100) {
        const obsWidth = Math.random() * (this.maxSize - this.minSize) + this.minSize;
        const obsHeight = Math.random() * (this.maxSize - this.minSize) + this.minSize;
        const obsX = Math.random() * (width - obsWidth);
        const obsY = Math.random() * (height - obsHeight);

        obstacle = {
          x: obsX,
          y: obsY,
          width: obsWidth,
          height: obsHeight,
        };

        // Check distance from player
        const centerX = obsX + obsWidth / 2;
        const centerY = obsY + obsHeight / 2;
        const dist = Math.sqrt(
          Math.pow(centerX - playerX, 2) + Math.pow(centerY - playerY, 2)
        );

        if (dist > safeDistance) {
          isValid = true;
          // Also check for overlaps with existing obstacles
          for (let other of this.obstacles) {
            if (this.isOverlapping(obstacle, other)) {
              isValid = false;
              break;
            }
          }
        }
        attempts++;
      }

      if (isValid) {
        this.obstacles.push(obstacle);
      }
    }
  }

  isOverlapping(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  clear() {
    this.obstacles = [];
  }
}

```

## cod_zombie/js/player.js

```javascript
// cod_zombie/js/player.js

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_INITIAL_HEALTH,
} from "./constants.js";

export class Player {
  constructor(canvasWidth, canvasHeight) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 50;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_SPEED;
    this.maxHealth = PLAYER_INITIAL_HEALTH;
    this.damageReduction = 1.0;
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

  updateRotationToTarget(targetX, targetY) {
    const dx = targetX - (this.x + this.width / 2);
    const dy = targetY - (this.y + this.height / 2);
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

  drawZombies(zombies, nearestZombie = null) {
    for (let zombie of zombies) {
      this.ctx.fillStyle = COLORS.zombie;
      this.ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

      // Eyes
      this.ctx.fillStyle = COLORS.zombieEye;
      this.ctx.fillRect(zombie.x + 5, zombie.y + 10, 5, 5);
      this.ctx.fillRect(zombie.x + 15, zombie.y + 10, 5, 5);

      // Zombie Health Bar
      this.drawZombieHealthBar(zombie);

      // Draw arrow if this is the nearest zombie
      if (zombie === nearestZombie) {
        this.drawTargetArrow(zombie);
      }
    }
  }

  drawZombieHealthBar(zombie) {
    const barWidth = zombie.width;
    const barHeight = 4;
    const x = zombie.x;
    const y = zombie.y - 8;

    // Background (gray)
    this.ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
    this.ctx.fillRect(x, y, barWidth, barHeight);

    // Health Fill (red)
    const healthPercent = Math.max(0, zombie.health / zombie.maxHealth);
    this.ctx.fillStyle = "#ff4444";
    this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

    // Border
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, barWidth, barHeight);
  }

  drawTargetArrow(zombie) {

    const arrowSize = 10;
    const bounceOffset = Math.sin(Date.now() / 100) * 5;
    const x = zombie.x + zombie.width / 2;
    const y = zombie.y - 15 + bounceOffset;

    this.ctx.save();
    this.ctx.fillStyle = "#ffcc00"; // Gold/Yellow arrow
    this.ctx.beginPath();
    this.ctx.moveTo(x - arrowSize, y - arrowSize);
    this.ctx.lineTo(x + arrowSize, y - arrowSize);
    this.ctx.lineTo(x, y);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add a small stroke for better visibility
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawObstacles(obstacles) {
    this.ctx.fillStyle = COLORS.obstacle;
    for (let obstacle of obstacles) {
      this.ctx.fillRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
      // Optional: Add a border to obstacles
      this.ctx.strokeStyle = "#475569";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    }
  }
}

```

## cod_zombie/js/storeManager.js

```javascript
// js/storeManager.js
import { UPGRADES } from "./upgradeRegistry.js";

export class StoreManager {
  constructor(game) {
    this.game = game;
    this.isOpen = false;
    this.currentChoices = [];
    this.refreshCost = 300;
    this.refreshIncrement = 150;
    this.upgradeCost = 500;
    this.appliedUpgrades = [];
    
    // UI Elements
    this.overlay = document.getElementById("storeOverlay");
    this.upgradeContainer = document.getElementById("upgradeContainer");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.refreshCostDisplay = document.getElementById("refreshCost");
    this.pointsDisplay = document.getElementById("storePointsDisplay");
  }

  open() {
    this.isOpen = true;
    this.game.isPaused = true;
    this.refreshCost = 300;
    this.generateChoices();
    this.updateUI();
    this.overlay.style.display = "flex";
  }

  close() {
    this.isOpen = false;
    this.game.isPaused = false;
    this.overlay.style.display = "none";
    // Wave Manager will handle the next wave spawn
  }

  generateChoices() {
    const shuffled = [...UPGRADES].sort(() => 0.5 - Math.random());
    this.currentChoices = shuffled.slice(0, 3);
  }

  refresh() {
    if (this.game.points >= this.refreshCost) {
      this.game.points -= this.refreshCost;
      this.refreshCost += this.refreshIncrement;
      this.generateChoices();
      this.updateUI();
    }
  }

  selectUpgrade(upgrade) {
    if (this.game.points < this.upgradeCost) return;

    this.game.points -= this.upgradeCost;
    this.applyUpgrade(upgrade);
    this.appliedUpgrades.push(upgrade);
    this.close();
    
    // Trigger next wave
    if (this.game.waveManager) {
        this.game.waveManager.startNextWave(this.game, this.game.zombieManager);
    }
    
    // Restart the game loop since it was paused
    this.game.gameLoop();
  }

  applyUpgrade(upgrade) {
    const { category, stat, value, type } = upgrade;

    if (category === "player") {
      if (type === "add") {
        this.game.player[stat] = (this.game.player[stat] || 0) + value;
        if (stat === "maxHealth") {
            this.game.health += value; // Heal for the bonus amount
        }
      } else if (type === "multiply") {
        this.game.player[stat] = (this.game.player[stat] || 1) * value;
      }
    } else if (category === "weapon") {
      // Apply to all weapons in the manager
      this.game.weaponManager.weapons.forEach(weapon => {
        if (type === "multiply") {
          weapon[stat] = (weapon[stat] || 1) * value;
          // For magazine capacity, we might need to adjust current ammo
          if (stat === "magazineCapacity") {
              weapon.magazineCapacity = Math.round(weapon.magazineCapacity);
          }
        }
      });
    } else if (category === "utility") {
      this.game.modifiers[stat] = (this.game.modifiers[stat] || 0) + value;
    }
  }

  updateUI() {
    this.pointsDisplay.textContent = this.game.points;
    this.upgradeContainer.innerHTML = "";
    
    const canAffordUpgrade = this.game.points >= this.upgradeCost;

    this.currentChoices.forEach(upgrade => {
      const card = document.createElement("div");
      card.className = "upgrade-card";
      if (!canAffordUpgrade) {
        card.style.opacity = "0.5";
        card.style.cursor = "not-allowed";
      }

      card.innerHTML = `
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-description">${upgrade.description}</div>
        <div style="color: #ffcc00; font-size: 0.9em; margin-top: auto;">COST: ${this.upgradeCost} PTS</div>
      `;

      if (canAffordUpgrade) {
        card.onclick = () => this.selectUpgrade(upgrade);
      }
      this.upgradeContainer.appendChild(card);
    });

    this.refreshBtn.disabled = this.game.points < this.refreshCost;
    this.refreshCostDisplay.textContent = `Cost: ${this.refreshCost} pts`;
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
    const weapon = game.weaponManager.getCurrentWeapon();
    const weaponInfo = game.getWeaponInfo();

    if (weaponInfo && weapon) {
      const ammoElement = this.uiElements.ammo;
      const weaponNameElement = document.getElementById("weaponName");
      const fireModeElement = document.getElementById("fireMode");

      if (weaponNameElement) {
        weaponNameElement.textContent = weaponInfo.name;
      }

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

      if (fireModeElement) {
        fireModeElement.textContent = `[${weaponInfo.fireMode.toUpperCase()}]`;
      }
    }

    // Update wave display
    const waveElement = this.uiElements.wave;
    if (game.waveManager.isWaitingForNextWave) {
      waveElement.textContent = "PREPARING...";
      waveElement.style.color = "#ffcc00";
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

    // Update other UI elements
    this.uiElements.kills.textContent = game.kills;
    this.uiElements.points.textContent = game.points;
    const currentHealth = Math.max(0, Math.floor(game.health));
    this.uiElements.health.textContent = currentHealth;

    // Update health bar fill
    const healthBarFill = document.getElementById("healthBarFill");
    if (healthBarFill) {
      const healthPercentage = (currentHealth / game.player.maxHealth) * 100;
      healthBarFill.style.width = `${healthPercentage}%`;
    }
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

## cod_zombie/js/upgradeRegistry.js

```javascript
// js/upgradeRegistry.js

export const UPGRADES = [
  {
    id: "vitality",
    name: "Vitality Boost",
    description: "Permanently increase Max Health by +25.",
    category: "player",
    type: "add",
    stat: "maxHealth",
    value: 25
  },
  {
    id: "lightweight",
    name: "Lightweight",
    description: "Increase movement speed by 15%.",
    category: "player",
    type: "multiply",
    stat: "speed",
    value: 1.15
  },
  {
    id: "juggernaut",
    name: "Juggernaut",
    description: "Reduce incoming damage by 20%.",
    category: "player",
    type: "multiply",
    stat: "damageReduction",
    value: 0.8
  },
  {
    id: "hollow_point",
    name: "Hollow Point",
    description: "Increase all weapon damage by 25%.",
    category: "weapon",
    type: "multiply",
    stat: "baseDamage",
    value: 1.25
  },
  {
    id: "rapid_fire",
    name: "Rapid Fire",
    description: "Increase fire rate by 20%.",
    category: "weapon",
    type: "multiply",
    stat: "fireRate",
    value: 1.2
  },
  {
    id: "sleight_of_hand",
    name: "Sleight of Hand",
    description: "Improve reload speed by 30%.",
    category: "weapon",
    type: "multiply",
    stat: "reloadTime",
    value: 0.7 // Lower is faster
  },
  {
    id: "extended_mags",
    name: "Extended Mags",
    description: "Increase magazine capacity by 40%.",
    category: "weapon",
    type: "multiply",
    stat: "magazineCapacity",
    value: 1.4
  },
  {
    id: "scavenger",
    name: "Scavenger",
    description: "Heal +5 HP on every zombie kill.",
    category: "utility",
    type: "special",
    stat: "healOnKill",
    value: 5
  },
  {
    id: "munitions",
    name: "Munitions Bag",
    description: "Refill 50% extra reserve ammo at the start of each wave.",
    category: "utility",
    type: "special",
    stat: "ammoBonus",
    value: 0.5
  },
  {
    id: "double_tap",
    name: "Double Tap",
    description: "15% chance to deal 2x damage on any shot.",
    category: "utility",
    type: "special",
    stat: "critChance",
    value: 0.15
  }
];

```

## cod_zombie/js/waveManager.js

```javascript
// cod_zombie/js/waveManager.js

export class WaveManager {
  constructor() {
    this.isWaitingForNextWave = false;
    this.waveDelay = 1500; // 1.5 second pause between rounds

    // Initialize the wave sound
    this.waveSound = new Audio("assets/zombie_wave.mp3");
  }

  checkWaveComplete(zombies, game, zombieManager) {
    // If all zombies are dead and we aren't already in the middle of a countdown
    if (zombies.length === 0 && !this.isWaitingForNextWave) {
      this.isWaitingForNextWave = true;

      // Logic for ending current wave
      setTimeout(() => {
        game.wave += 1;

        // Check for Store every 5 waves
        if (game.wave > 1 && (game.wave - 1) % 5 === 0) {
            game.storeManager.open();
            this.isWaitingForNextWave = false;
            return;
        }

        this.startNextWave(game, zombieManager);
        this.isWaitingForNextWave = false;
      }, this.waveDelay);
    }
  }

  startNextWave(game, zombieManager) {
    // Play the wave sound when the new wave officially starts
    this.playWaveSound();

    // Regenerate Map
    game.mapManager.generateMap(
      game.canvas.width,
      game.canvas.height,
      game.player.x,
      game.player.y,
    );

    // Optional: Refill ammo on new round like COD (or keep as is)
    const weapon = game.weaponManager.getCurrentWeapon();
    if (weapon) {
      const bonusMultiplier = 1 + (game.modifiers.ammoBonus || 0);
      weapon.reserveAmmo = Math.round((weapon.maxAmmo - weapon.magazineCapacity) * bonusMultiplier);
    }

    zombieManager.spawnZombies(
      game.canvas.width,
      game.canvas.height,
      game.wave,
    );

    // If game was paused (e.g. by store), resume it
    if (game.isPaused) {
        game.isPaused = false;
        // The game loop will naturally exit when isPaused is true, 
        // and we need to restart it here.
        game.gameLoop();
    }
  }

  playWaveSound() {
    if (!this.waveSound) return;

    // Reset and play
    this.waveSound.currentTime = 0;
    this.waveSound.play().catch((e) => {
      console.log("Wave sound blocked until user interaction.");
    });
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
    this.speed = 2 + wave * ZOMBIE_INITIAL_SPEED_MULTIPLIER;
    this.maxHealth = 1 + wave * ZOMBIE_INITIAL_HEALTH_MULTIPLIER;
    this.health = this.maxHealth;
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

## cod_zombie/js/weapon/assault_rifle_arc-7_vanguard.js

```javascript
// js/weapon/assault_rifle_arc-7_vanguard.js

import { WeaponBase } from "./weaponBase.js";

export class AssaultRifleARC7Vanguard extends WeaponBase {
  constructor() {
    super({
      // Weapon Identity
      name: 'ARC-7 "Vanguard"',
      type: "Assault Rifle / Full-Auto",
      rarity: "Epic",
      description:
        "A reliable, high-output assault rifle designed for front-line suppression. The ARC-7 Vanguard provides sustained fire with manageable recoil, making it ideal for clearing waves of enemies.",

      // Core Stats
      baseDamage: 32,
      headshotMultiplier: 1.5,
      fireRate: 750, // rounds per minute
      bulletSpeed: 1500,
      effectiveRange: 600,
      maxRange: 900,
      armorPenetration: "High",

      // Ammo & Reload
      magazineCapacity: 30,
      maxAmmo: 210,
      reloadTime: 1.8,
      emptyReloadTime: 2.4,

      // Handling & Accuracy
      recoil: "Medium",
      hipFireAccuracy: 0.65,
      adsAccuracy: 0.88,
      movementPenalty: -0.12,
      drawTime: 0.5,

      fireMode: "auto",
      availableFireModes: ["auto", "semi"],

      // Special Effects
      specialEffects: [
        {
          name: "Sustained Fire",
          description:
            "Accuracy gradually increases the longer you hold down the trigger",
          type: "accuracy_boost",
        }
      ],
    });

    this.firingDuration = 0;
    this.maxAccuracyBonus = 0.15;
  }

  _getFireData() {
    const fireData = super._getFireData();
    if (!fireData) {
      this.firingDuration = 0;
      return null;
    }

    // Apply accuracy bonus based on firing duration
    const bonus = Math.min(this.firingDuration * 0.05, this.maxAccuracyBonus);
    fireData.accuracy += bonus;
    
    this.firingDuration += (60 / this.fireRate); // Approximate time in seconds between shots
    
    return fireData;
  }

  stopFiring() {
    super.stopFiring();
    this.firingDuration = 0;
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
      fireRate: 500, // rounds per minute
      bulletSpeed: 1200, // pixels per second (scaled from m/s)
      effectiveRange: 450, // pixels (scaled from 45 meters)
      maxRange: 700, // pixels (scaled from 70 meters)
      armorPenetration: "Medium",

      // Ammo & Reload
      magazineCapacity: 15,
      maxAmmo: 120,
      reloadTime: 1.2, // seconds
      emptyReloadTime: 1.6, // seconds

      // Handling & Accuracy
      recoil: "Low",
      hipFireAccuracy: 0.78,
      adsAccuracy: 0.92,
      movementPenalty: -0.05,
      drawTime: 0.35, // seconds

      fireMode: "semi", // semi, burst, auto
      availableFireModes: ["semi", "burst"],
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
    this.availableFireModes = config.availableFireModes || [this.fireMode];
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

  switchFireMode() {
    if (this.availableFireModes.length <= 1) return false;

    const currentIndex = this.availableFireModes.indexOf(this.fireMode);
    const nextIndex = (currentIndex + 1) % this.availableFireModes.length;
    this.fireMode = this.availableFireModes[nextIndex];
    
    // Reset firing state when switching modes
    this.stopFiring();
    
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
      fireMode: this.fireMode,
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

  switchFireMode() {
    const weapon = this.getCurrentWeapon();
    return weapon ? weapon.switchFireMode() : false;
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

