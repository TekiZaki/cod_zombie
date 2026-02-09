// cod_zombie/js/boss.js
import { Zombie } from "./zombie.js";
import { 
  ZOMBIE_WIDTH, 
  ZOMBIE_HEIGHT,
  ZOMBIE_INITIAL_SPEED_MULTIPLIER,
  ZOMBIE_INITIAL_HEALTH_MULTIPLIER
} from "./constants.js";

export class Boss extends Zombie {
  constructor(x, y, wave) {
    super(x, y, wave);
    
    // Boss specific scaling
    this.width = ZOMBIE_WIDTH * 5;
    this.height = ZOMBIE_HEIGHT * 5;
    
    // Boss Stats: Faster and much Tankier
    this.maxHealth = (1 + wave * ZOMBIE_INITIAL_HEALTH_MULTIPLIER) * 45; // 45x normal health
    this.health = this.maxHealth;
    this.maxSpeed = 2.5; // Faster boss
    this.maxForce = 0.3; // Slightly more agile
    
    this.isBoss = true;
  }
}
