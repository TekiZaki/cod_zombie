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
