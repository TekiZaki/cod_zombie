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
            let damage = bullet.damage;
            
            // Critical Chance (Double Damage)
            if (game.modifiers.critChance && Math.random() < game.modifiers.critChance) {
                damage *= 2;
            }

            zombie.health -= damage;
            bullets.splice(i, 1);
            game.points += POINTS_PER_HIT;

            if (zombie.health <= 0) {
              zombies.splice(j, 1);
              game.kills += 1;
              game.points += POINTS_PER_KILL;

              // Heal on Kill modifier
              if (game.modifiers.healOnKill) {
                  game.health = Math.min(game.player.maxHealth, game.health + game.modifiers.healOnKill);
              }
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
        let damage = HEALTH_LOSS_PER_ZOMBIE_COLLISION;
        if (player.damageReduction) {
            damage *= player.damageReduction;
        }
        game.health -= damage;
        if (game.health <= 0) {
          game.endGame();
        }
      }
    }
  }

  resolveObstacleCollisions(entity, obstacles) {
    for (let obstacle of obstacles) {
      if (
        entity.x < obstacle.x + obstacle.width &&
        entity.x + entity.width > obstacle.x &&
        entity.y < obstacle.y + obstacle.height &&
        entity.y + entity.height > obstacle.y
      ) {
        // Find the overlap on each side
        const overlapLeft = entity.x + entity.width - obstacle.x;
        const overlapRight = obstacle.x + obstacle.width - entity.x;
        const overlapTop = entity.y + entity.height - obstacle.y;
        const overlapBottom = obstacle.y + obstacle.height - entity.y;

        // Find the smallest overlap
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        if (minOverlap === overlapLeft) {
          entity.x -= overlapLeft;
        } else if (minOverlap === overlapRight) {
          entity.x += overlapRight;
        } else if (minOverlap === overlapTop) {
          entity.y -= overlapTop;
        } else if (minOverlap === overlapBottom) {
          entity.y += overlapBottom;
        }
      }
    }
  }

  checkBulletObstacleCollisions(bullets, obstacles) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      for (let obstacle of obstacles) {
        if (
          bullet.x > obstacle.x &&
          bullet.x < obstacle.x + obstacle.width &&
          bullet.y > obstacle.y &&
          bullet.y < obstacle.y + obstacle.height
        ) {
          bullets.splice(i, 1);
          break;
        }
      }
    }
  }
}
