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
