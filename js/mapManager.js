// cod_zombie/js/mapManager.js

export class MapManager {
  constructor() {
    this.obstacles = [];
    this.obstacleCount = 45;
    this.minSize = 50;
    this.maxSize = 150;
  }

  generateMap(width, height, playerX, playerY) {
    this.obstacles = [];

    // "The High-Sec Outpost" - A unique fixed layout
    const layout = [
      // Central Hub
      { x: width / 2 - 100, y: height / 2 - 100, w: 200, h: 200 },
      
      // Perimeter Walls (Upper)
      { x: 200, y: 300, w: 400, h: 40 },
      { x: width - 600, y: 300, w: 400, h: 40 },
      
      // Perimeter Walls (Lower)
      { x: 200, y: height - 340, w: 400, h: 40 },
      { x: width - 600, y: height - 340, w: 400, h: 40 },
      
      // Left Defensive Wing
      { x: 400, y: 500, w: 40, h: 600 },
      
      // Right Defensive Wing
      { x: width - 440, y: 500, w: 40, h: 600 },

      // Corner Bunkers
      { x: 100, y: 100, w: 120, h: 120 },
      { x: width - 220, y: 100, w: 120, h: 120 },
      { x: 100, y: height - 220, w: 120, h: 120 },
      { x: width - 220, y: height - 220, w: 120, h: 120 },
      
      // Scatter defenses
      { x: width / 2 - 30, y: 150, w: 60, h: 60 },
      { x: width / 2 - 30, y: height - 210, w: 60, h: 60 },
      { x: 150, y: height / 2 - 30, w: 60, h: 60 },
      { x: width - 210, y: height / 2 - 30, w: 60, h: 60 },
    ];

    for (let item of layout) {
      this.obstacles.push({
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      });
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
