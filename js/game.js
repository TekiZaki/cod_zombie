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
    this.mapManager = new MapManager();

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
    this.gameLoop();
  }

  getWeaponInfo() {
    const weapon = this.weaponManager.getCurrentWeapon();
    return weapon ? weapon.getInfo() : null;
  }

  gameLoop() {
    if (this.isGameOver) return;

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
