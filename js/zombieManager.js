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
