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
