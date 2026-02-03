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
    this.maxSpeed = 2 + wave * ZOMBIE_INITIAL_SPEED_MULTIPLIER;
    this.maxHealth = 1 + wave * ZOMBIE_INITIAL_HEALTH_MULTIPLIER;
    this.health = this.maxHealth;

    // Physics vector properties
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.maxForce = 0.4; // Limits the steering force (turning capability)
  }

  update(playerX, playerY, obstacles, zombies) {
    // Reset acceleration
    this.ax = 0;
    this.ay = 0;

    // Calculate steering forces
    const seekForce = this.seek(playerX, playerY);
    const avoidForce = this.avoid(obstacles);
    const separateForce = this.separate(zombies);

    // Apply weights to forces
    seekForce.x *= 1.0;
    seekForce.y *= 1.0;
    avoidForce.x *= 4.0; // High priority to avoid obstacles
    avoidForce.y *= 4.0;
    separateForce.x *= 1.5;
    separateForce.y *= 1.5;

    // Apply accumulated forces
    this.applyForce(seekForce);
    this.applyForce(avoidForce);
    this.applyForce(separateForce);

    // Update velocity
    this.vx += this.ax;
    this.vy += this.ay;

    // Limit speed
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;
  }

  applyForce(force) {
    this.ax += force.x;
    this.ay += force.y;
  }

  seek(targetX, targetY) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    // Desired velocity vector (straight to target)
    let dx = targetX - cx;
    let dy = targetY - cy;
    const dist = Math.hypot(dx, dy);

    // Normalize and scale to maxSpeed
    if (dist > 0) {
      dx = (dx / dist) * this.maxSpeed;
      dy = (dy / dist) * this.maxSpeed;
    }

    // Steering = Desired - Velocity
    let steerX = dx - this.vx;
    let steerY = dy - this.vy;

    // Limit to maxForce
    const steerMag = Math.hypot(steerX, steerY);
    if (steerMag > this.maxForce) {
      steerX = (steerX / steerMag) * this.maxForce;
      steerY = (steerY / steerMag) * this.maxForce;
    }

    return { x: steerX, y: steerY };
  }

  avoid(obstacles) {
    if (!obstacles || obstacles.length === 0) return { x: 0, y: 0 };

    const lookAhead = 45; // Detection range
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    const speed = Math.hypot(this.vx, this.vy);
    if (speed < 0.001) return { x: 0, y: 0 };

    // "Feeler" point ahead of the zombie
    const feelerX = cx + (this.vx / speed) * lookAhead;
    const feelerY = cy + (this.vy / speed) * lookAhead;

    // Find the first obstacle our feeler hits
    // Note: Simple point-based check. For better accuracy, we could check the line segment.
    let targetObstacle = null;
    for (const obs of obstacles) {
      if (
        feelerX > obs.x &&
        feelerX < obs.x + obs.width &&
        feelerY > obs.y &&
        feelerY < obs.y + obs.height
      ) {
        targetObstacle = obs;
        break;
      }
    }

    if (targetObstacle) {
      const obsCx = targetObstacle.x + targetObstacle.width / 2;
      const obsCy = targetObstacle.y + targetObstacle.height / 2;

      // Steering away from the center of the obstacle
      let desiredX = feelerX - obsCx;
      let desiredY = feelerY - obsCy;

      const dist = Math.hypot(desiredX, desiredY);
      if (dist > 0) {
        desiredX = (desiredX / dist) * this.maxSpeed;
        desiredY = (desiredY / dist) * this.maxSpeed;

        let steerX = desiredX - this.vx;
        let steerY = desiredY - this.vy;

        const steerMag = Math.hypot(steerX, steerY);
        if (steerMag > this.maxForce) {
          steerX = (steerX / steerMag) * this.maxForce;
          steerY = (steerY / steerMag) * this.maxForce;
        }
        return { x: steerX, y: steerY };
      }
    }

    return { x: 0, y: 0 };
  }

  separate(zombies) {
    if (!zombies) return { x: 0, y: 0 };

    const desiredSeparation = 40; // Approx ZOMBIE_WIDTH * 1.5
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    for (const other of zombies) {
      if (other === this) continue;

      const otherCx = other.x + other.width / 2;
      const otherCy = other.y + other.height / 2;

      const d = Math.hypot(cx - otherCx, cy - otherCy);

      if (d > 0 && d < desiredSeparation) {
        // Calculate vector pointing away from neighbor
        let diffX = cx - otherCx;
        let diffY = cy - otherCy;

        // Weight by distance (closer = strong repulsion)
        diffX /= d;
        diffY /= d;

        sumX += diffX;
        sumY += diffY;
        count++;
      }
    }

    if (count > 0) {
      sumX /= count;
      sumY /= count;

      // Implement Reynolds: Steering = Desired - Velocity
      const mag = Math.hypot(sumX, sumY);
      if (mag > 0) {
        sumX = (sumX / mag) * this.maxSpeed;
        sumY = (sumY / mag) * this.maxSpeed;

        let steerX = sumX - this.vx;
        let steerY = sumY - this.vy;

        const steerMag = Math.hypot(steerX, steerY);
        if (steerMag > this.maxForce) {
          steerX = (steerX / steerMag) * this.maxForce;
          steerY = (steerY / steerMag) * this.maxForce;
        }
        return { x: steerX, y: steerY };
      }
    }
    return { x: 0, y: 0 };
  }
}
