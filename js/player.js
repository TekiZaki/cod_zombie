// cod_zombie/js/player.js

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_INITIAL_HEALTH,
} from "./constants.js";

export class Player {
  constructor(worldWidth, worldHeight) {
    this.x = worldWidth / 2;
    this.y = worldHeight / 2;
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
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.9; // Slows down velocity
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

  update(worldWidth, worldHeight) {
    // Apply velocity (from knockback)
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    if (this.moveLeft && this.x > 0) this.x -= this.speed;
    if (this.moveRight && this.x < worldWidth - this.width)
      this.x += this.speed;
    if (this.moveUp && this.y > 0) this.y -= this.speed;
    if (this.moveDown && this.y < worldHeight - this.height)
      this.y += this.speed;
    
    // Boundary checks (in case knockback pushed player out)
    this.x = Math.max(0, Math.min(this.x, worldWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, worldHeight - this.height));
  }

  resetPosition(worldWidth, worldHeight) {
    this.x = worldWidth / 2;
    this.y = worldHeight / 2;
  }
}
