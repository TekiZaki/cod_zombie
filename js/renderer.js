// cod_zombie/js/renderer.js

import { COLORS } from "./constants.js";

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clearCanvas(width, height) {
    this.ctx.fillStyle = COLORS.canvasBackground;
    this.ctx.fillRect(0, 0, width, height);
  }

  drawWorldBoundary(worldWidth, worldHeight) {
    this.ctx.strokeStyle = "#1e293b";
    this.ctx.lineWidth = 5;
    this.ctx.strokeRect(0, 0, worldWidth, worldHeight);

    // Draw grid
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    this.ctx.lineWidth = 1;
    const gridSize = 100;
    
    for (let x = 0; x <= worldWidth; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, worldHeight);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= worldHeight; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(worldWidth, y);
      this.ctx.stroke();
    }
  }

  drawPlayer(player) {
    this.ctx.save();

    // Move the canvas origin to the center of the player
    this.ctx.translate(
      player.x + player.width / 2,
      player.y + player.height / 2,
    );

    // Rotate the canvas context
    this.ctx.rotate(player.angle);

    // Draw the player body (centered at 0,0)
    this.ctx.fillStyle = COLORS.player;
    this.ctx.fillRect(
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height,
    );

    // Draw the gun barrel (now points toward the cursor)
    this.ctx.strokeStyle = COLORS.gunBarrel;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(25, 0); // Draws the gun facing right (0 radians)
    this.ctx.stroke();

    this.ctx.restore();
  }

  // In renderer.js
  drawBullets(bullets, bulletImage) {
    for (let bullet of bullets) {
      if (bulletImage.complete) {
        // Draw image centered on bullet position
        this.ctx.drawImage(
          bulletImage,
          bullet.x - 5, // Adjust offset based on your image size
          bullet.y - 10,
          10, // Width
          20, // Height
        );
      } else {
        // Fallback while image loads
        this.ctx.fillStyle = COLORS.bullet;
        this.ctx.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
      }
    }
  }

  drawZombies(zombies, nearestZombie = null) {
    for (let zombie of zombies) {
      this.ctx.fillStyle = zombie.isBoss ? "#4a0404" : COLORS.zombie;
      this.ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

      // Eyes
      this.ctx.fillStyle = COLORS.zombieEye;
      const eyeSize = zombie.isBoss ? 15 : 5;
      const eyeOffset = zombie.isBoss ? 15 : 5;
      this.ctx.fillRect(zombie.x + eyeOffset, zombie.y + eyeOffset * 2, eyeSize, eyeSize);
      this.ctx.fillRect(zombie.x + zombie.width - eyeOffset - eyeSize, zombie.y + eyeOffset * 2, eyeSize, eyeSize);

      // Zombie Health Bar
      this.drawZombieHealthBar(zombie);

      // Draw arrow if this is the nearest zombie
      if (zombie === nearestZombie) {
        this.drawTargetArrow(zombie);
      }
    }
  }

  drawZombieHealthBar(zombie) {
    const barWidth = zombie.width;
    const barHeight = 4;
    const x = zombie.x;
    const y = zombie.y - 8;

    // Background (gray)
    this.ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
    this.ctx.fillRect(x, y, barWidth, barHeight);

    // Health Fill (red)
    const healthPercent = Math.max(0, zombie.health / zombie.maxHealth);
    this.ctx.fillStyle = "#ff4444";
    this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

    // Border
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, barWidth, barHeight);
  }

  drawTargetArrow(zombie) {

    const arrowSize = 10;
    const bounceOffset = Math.sin(Date.now() / 100) * 5;
    const x = zombie.x + zombie.width / 2;
    const y = zombie.y - 15 + bounceOffset;

    this.ctx.save();
    this.ctx.fillStyle = "#ffcc00"; // Gold/Yellow arrow
    this.ctx.beginPath();
    this.ctx.moveTo(x - arrowSize, y - arrowSize);
    this.ctx.lineTo(x + arrowSize, y - arrowSize);
    this.ctx.lineTo(x, y);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add a small stroke for better visibility
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawObstacles(obstacles) {
    this.ctx.fillStyle = COLORS.obstacle;
    for (let obstacle of obstacles) {
      this.ctx.fillRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
      // Optional: Add a border to obstacles
      this.ctx.strokeStyle = "#475569";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    }
  }
}
