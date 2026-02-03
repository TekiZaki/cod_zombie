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
  WORLD_WIDTH,
  WORLD_HEIGHT,
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
        critChance: 0,
        regen: 0
    };
    this.lastRegenTime = 0;

    this.canvas = document.getElementById(GAME_CANVAS_ID);
    this.ctx = this.canvas.getContext("2d");
    this.gameContainer = document.getElementById(GAME_CONTAINER_ID);

    this.camera = { x: 0, y: 0 };

    this.player = new Player(WORLD_WIDTH, WORLD_HEIGHT);
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

    // Weapon Manager - Start with only Handgun
    this.weaponManager = new WeaponManager();
    this.weaponManager.addWeapon(new HandgunVX9Nightfall());
    // ARC-7 Vanguard removed from default loadout - now must be purchased in store

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
  }

  initGame() {
    this.player.resetPosition(WORLD_WIDTH, WORLD_HEIGHT);
    this.mapManager.generateMap(
      WORLD_WIDTH,
      WORLD_HEIGHT,
      this.player.x,
      this.player.y,
    );
    this.zombieManager.spawnZombies(
      WORLD_WIDTH,
      WORLD_HEIGHT,
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

    this.player.update(WORLD_WIDTH, WORLD_HEIGHT);

    // Health Regeneration
    if (this.modifiers.regen > 0) {
      const now = Date.now();
      if (now - this.lastRegenTime >= 1000) {
        if (this.health < this.player.maxHealth) {
          this.health = Math.min(this.player.maxHealth, this.health + this.modifiers.regen);
        }
        this.lastRegenTime = now;
      }
    }

    // Update camera
    this.camera.x = this.player.x + this.player.width / 2 - this.canvas.width / 2;
    this.camera.y = this.player.y + this.player.height / 2 - this.canvas.height / 2;

    // Optional: Clamp camera to world boundaries
    this.camera.x = Math.max(0, Math.min(this.camera.x, WORLD_WIDTH - this.canvas.width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, WORLD_HEIGHT - this.canvas.height));

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

    this.bulletManager.update(WORLD_WIDTH, WORLD_HEIGHT);
    this.zombieManager.update(this.player.x, this.player.y, this.mapManager.obstacles);

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

    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.renderer.drawWorldBoundary(WORLD_WIDTH, WORLD_HEIGHT);
    this.renderer.drawObstacles(this.mapManager.obstacles);
    this.renderer.drawPlayer(this.player);
    this.renderer.drawBullets(this.bulletManager.bullets, this.bulletImage);
    this.renderer.drawZombies(this.zombieManager.zombies, nearestZombie);

    this.ctx.restore();

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
    this.isGameOver = false;
    this.isPaused = false;
    this.modifiers = {
        healOnKill: 0,
        critChance: 0,
        regen: 0
    };
    this.lastRegenTime = 0;

    this.bulletManager.clear();
    this.zombieManager.clear();
    this.player.resetPosition(WORLD_WIDTH, WORLD_HEIGHT);
    this.uiManager.hideGameOver();
    this.initGame();
  }
}
