// cod_zombie/js/zombieManager.js

import { Zombie } from "./zombie.js";
import { Boss } from "./boss.js";
import { ZOMBIE_BASE_COUNT, ZOMBIE_COUNT_PER_WAVE } from "./constants.js";

export class ZombieManager {
  constructor() {
    this.zombies = [];
  }

  spawnZombies(worldWidth, worldHeight, wave, isBossWave = false) {
    this.zombies = [];

    if (isBossWave) {
      this.spawnBoss(worldWidth, worldHeight, wave);
      // Also spawn some regular zombies as minions
      const count = Math.floor((ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE) / 2);
      for (let i = 0; i < count; i++) {
        this.spawnRegularZombie(worldWidth, worldHeight, wave);
      }
    } else {
      const count = ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE;
      for (let i = 0; i < count; i++) {
        this.spawnRegularZombie(worldWidth, worldHeight, wave);
      }
    }
  }

  spawnRegularZombie(worldWidth, worldHeight, wave) {
    const { x, y } = this.getRandomEdgePosition(worldWidth, worldHeight);
    this.zombies.push(new Zombie(x, y, wave));
  }

  spawnBoss(worldWidth, worldHeight, wave) {
    const { x, y } = this.getRandomEdgePosition(worldWidth, worldHeight);
    this.zombies.push(new Boss(x, y, wave));
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
