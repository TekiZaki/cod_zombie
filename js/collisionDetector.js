// cod_zombie/js/collisionDetector.js

import {
  POINTS_PER_HIT,
  POINTS_PER_KILL,
  HEALTH_LOSS_PER_ZOMBIE_COLLISION,
} from "./constants.js";

export class CollisionDetector {
  checkCollisions(bullets, zombies, player, game) {
    // Bullet-zombie collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = zombies.length - 1; j >= 0; j--) {
        const bullet = bullets[i];
        const zombie = zombies[j];

        if (
          bullet.x > zombie.x &&
          bullet.x < zombie.x + zombie.width &&
          bullet.y > zombie.y &&
          bullet.y < zombie.y + zombie.height
        ) {
          zombie.health -= bullet.damage;
          bullets.splice(i, 1);
          game.points += POINTS_PER_HIT;

          if (zombie.health <= 0) {
            zombies.splice(j, 1);
            game.kills += 1;
            game.points += POINTS_PER_KILL;
          }
          break;
        }
      }
    }

    // Zombie-player collisions
    for (let zombie of zombies) {
      if (
        player.x < zombie.x + zombie.width &&
        player.x + player.width > zombie.x &&
        player.y < zombie.y + zombie.height &&
        player.y + player.height > zombie.y
      ) {
        game.health -= HEALTH_LOSS_PER_ZOMBIE_COLLISION;
        if (game.health <= 0) {
          game.endGame();
        }
      }
    }
  }
}
