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

  drawZombies(zombies) {
    for (let zombie of zombies) {
      this.ctx.fillStyle = COLORS.zombie;
      this.ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

      // Eyes
      this.ctx.fillStyle = COLORS.zombieEye;
      this.ctx.fillRect(zombie.x + 5, zombie.y + 10, 5, 5);
      this.ctx.fillRect(zombie.x + 15, zombie.y + 10, 5, 5);
    }
  }
}
