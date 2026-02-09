// cod_zombie/js/zombieManager.js

import { Zombie } from "./zombie.js";
import { Boss } from "./boss.js";
import { ZOMBIE_BASE_COUNT, ZOMBIE_COUNT_PER_WAVE, ZOMBIE_WIDTH, ZOMBIE_HEIGHT } from "./constants.js";

export class ZombieManager {
  constructor() {
    this.zombies = [];
  }

  spawnZombies(worldWidth, worldHeight, wave, game, isBossWave = false) {
    this.zombies = [];
    this.game = game;

    if (isBossWave) {
      this.spawnBoss(worldWidth, worldHeight, wave);
      // Also spawn some regular zombies as minions
      const count = Math.floor((ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE) / 2);
      for (let i = 0; i < count; i++) {
        this.spawnRegularZombie(worldWidth, worldHeight, wave);
      }
    } else {
      // Regular wave logic
      const totalCount = ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE;
      
      // Heavy zombies starting wave 3
      let heavyCount = 0;
      if (wave >= 3) {
        heavyCount = Math.floor(wave / 3) + Math.floor(Math.random() * (wave / 2));
      }
      
      const regularCount = Math.max(0, totalCount - heavyCount);
      
      for (let i = 0; i < regularCount; i++) {
        this.spawnRegularZombie(worldWidth, worldHeight, wave);
      }
      
      for (let i = 0; i < heavyCount; i++) {
        this.spawnHeavyZombie(worldWidth, worldHeight, wave);
      }
    }
  }

  spawnRegularZombie(worldWidth, worldHeight, wave) {
    const { x, y } = this.getRandomEdgePosition(worldWidth, worldHeight);
    const zombie = new Zombie(x, y, wave);
    zombie.setGame(this.game);
    this.zombies.push(zombie);
  }

  spawnHeavyZombie(worldWidth, worldHeight, wave) {
    const { x, y } = this.getRandomEdgePosition(worldWidth, worldHeight);
    const zombie = new Zombie(x, y, wave);
    zombie.type = 'heavy';
    zombie.width = ZOMBIE_WIDTH * 2.5;
    zombie.height = ZOMBIE_HEIGHT * 2.5;
    zombie.maxHealth *= 8; // 8x normal health
    zombie.health = zombie.maxHealth;
    zombie.maxSpeed *= 0.9; // 10% slower but much faster than before
    zombie.setGame(this.game);
    this.zombies.push(zombie);
  }

  spawnBoss(worldWidth, worldHeight, wave) {
    const { x, y } = this.getRandomEdgePosition(worldWidth, worldHeight);
    const boss = new Boss(x, y, wave);
    boss.setGame(this.game);
    this.zombies.push(boss);
  }

  getRandomEdgePosition(worldWidth, worldHeight) {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;

    switch (edge) {
      case 0: // Top
        x = Math.random() * worldWidth;
        y = -100;
        break;
      case 1: // Right
        x = worldWidth + 100;
        y = Math.random() * worldHeight;
        break;
      case 2: // Bottom
        x = Math.random() * worldWidth;
        y = worldHeight + 100;
        break;
      case 3: // Left
        x = -100;
        y = Math.random() * worldHeight;
        break;
    }
    return { x, y };
  }

  update(playerX, playerY, obstacles) {
    for (let zombie of this.zombies) {
      zombie.update(playerX, playerY, obstacles, this.zombies);
    }
  }

  removeZombie(index) {
    this.zombies.splice(index, 1);
  }

  clear() {
    this.zombies = [];
  }
}
