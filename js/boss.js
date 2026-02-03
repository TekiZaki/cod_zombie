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
    this.width = ZOMBIE_WIDTH * 3;
    this.height = ZOMBIE_HEIGHT * 3;
    
    // Boss Stats: Slower but Tankier
    this.maxHealth = (1 + wave * ZOMBIE_INITIAL_HEALTH_MULTIPLIER) * 15; // 15x normal health
    this.health = this.maxHealth;
    this.maxSpeed = 1.2; // Constant slow speed
    this.maxForce = 0.2; // Less agile
    
    this.isBoss = true;
  }
}
