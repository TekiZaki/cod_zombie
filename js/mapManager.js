// cod_zombie/js/mapManager.js

export class MapManager {
  constructor() {
    this.obstacles = [];
    this.obstacleCount = 45;
    this.minSize = 50;
    this.maxSize = 150;
  }

  generateMap(width, height, playerX, playerY, safeDistance = 150) {
    this.obstacles = [];
    for (let i = 0; i < this.obstacleCount; i++) {
      let obstacle;
      let isValid = false;
      let attempts = 0;

      while (!isValid && attempts < 100) {
        const obsWidth = Math.random() * (this.maxSize - this.minSize) + this.minSize;
        const obsHeight = Math.random() * (this.maxSize - this.minSize) + this.minSize;
        const obsX = Math.random() * (width - obsWidth);
        const obsY = Math.random() * (height - obsHeight);

        obstacle = {
          x: obsX,
          y: obsY,
          width: obsWidth,
          height: obsHeight,
        };

        // Check distance from player
        const centerX = obsX + obsWidth / 2;
        const centerY = obsY + obsHeight / 2;
        const dist = Math.sqrt(
          Math.pow(centerX - playerX, 2) + Math.pow(centerY - playerY, 2)
        );

        if (dist > safeDistance) {
          isValid = true;
          // Also check for overlaps with existing obstacles
          for (let other of this.obstacles) {
            if (this.isOverlapping(obstacle, other)) {
              isValid = false;
              break;
            }
          }
        }
        attempts++;
      }

      if (isValid) {
        this.obstacles.push(obstacle);
      }
    }
  }

  isOverlapping(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  clear() {
    this.obstacles = [];
  }
}
