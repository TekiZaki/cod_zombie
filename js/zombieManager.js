// cod_zombie/js/zombieManager.js

import { Zombie } from "./zombie.js";
import { ZOMBIE_BASE_COUNT, ZOMBIE_COUNT_PER_WAVE } from "./constants.js";

export class ZombieManager {
  constructor() {
    this.zombies = [];
  }

  spawnZombies(worldWidth, worldHeight, wave) {
    const count = ZOMBIE_BASE_COUNT + wave * ZOMBIE_COUNT_PER_WAVE;
    this.zombies = [];
    for (let i = 0; i < count; i++) {
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;

      switch (edge) {
        case 0: // Top
          x = Math.random() * worldWidth;
          y = -50;
          break;
        case 1: // Right
          x = worldWidth + 50;
          y = Math.random() * worldHeight;
          break;
        case 2: // Bottom
          x = Math.random() * worldWidth;
          y = worldHeight + 50;
          break;
        case 3: // Left
          x = -50;
          y = Math.random() * worldHeight;
          break;
      }
      this.zombies.push(new Zombie(x, y, wave));
    }
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
