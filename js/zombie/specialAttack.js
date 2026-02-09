// js/zombie/specialAttack.js

class SlamAttack {
  constructor(game, zombie) {
    this.game = game;
    this.zombie = zombie;
    this.x = zombie.x + zombie.width / 2;
    this.y = zombie.y + zombie.height / 2;
    this.radius = 100;
    this.progress = 0;
    this.state = 'warning'; // warning, tracking, windup, impact, aftermath
    this.timer = 0;

    // Timing (in seconds)
    this.warningDuration = 1.0;    // How long before tracking starts
    this.trackingDuration = 1.5;   // How long it tracks player
    this.windupDuration = 0.8;     // Windup before impact
    this.impactDuration = 0.3;     // Impact visual effect
    this.aftermathDuration = 0.5;  // Lingering effect

    this.isDead = false;
    this.hasDamaged = false;
    
    // Play warning sound at start
    this.playWarningSound();
  }

  update(deltaTime) {
    this.timer += deltaTime;

    switch (this.state) {
      case 'warning':
        if (this.timer >= this.warningDuration) {
          this.state = 'tracking';
          this.timer = 0;
        }
        break;
      case 'tracking':
        // Update position to player's current position while tracking
        this.x = this.game.player.x + this.game.player.width / 2;
        this.y = this.game.player.y + this.game.player.height / 2;
        
        if (this.timer >= this.trackingDuration) {
          this.state = 'windup';
          this.timer = 0;
        }
        break;
      case 'windup':
        if (this.timer >= this.windupDuration) {
          this.state = 'impact';
          this.timer = 0;
          this.performImpact();
        }
        break;
      case 'impact':
        if (this.timer >= this.impactDuration) {
          this.state = 'aftermath';
          this.timer = 0;
        }
        break;
      case 'aftermath':
        if (this.timer >= this.aftermathDuration) {
          this.isDead = true;
        }
        break;
    }
  }

  performImpact() {
    this.playImpactSound();
    this.game.screenShake = 0.5; // Trigger screen shake in game

    const dx = (this.game.player.x + this.game.player.width / 2) - this.x;
    const dy = (this.game.player.y + this.game.player.height / 2) - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= this.radius) {
      // Direct hit or near miss
      const damage = Math.floor(40 * (1 - distance / (this.radius * 1.5)));
      if (damage > 0) {
        this.game.health -= damage;
        
        // Knockback effect
        const knockbackForce = 15 * (1 - distance / (this.radius * 2));
        const angle = Math.atan2(dy, dx);
        this.game.player.velocity.x += Math.cos(angle) * knockbackForce;
        this.game.player.velocity.y += Math.sin(angle) * knockbackForce;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Draw AOE circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    if (this.state === 'warning' || this.state === 'tracking') {
      const pulse = Math.sin(Date.now() / 100) * 0.2 + 0.8;
      ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      
      // Fill with very light red
      ctx.fillStyle = `rgba(255, 0, 0, 0.1)`;
      ctx.fill();
    } else if (this.state === 'windup') {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 5;
      ctx.stroke();
      
      // Countdown visually
      const remaining = 1 - (this.timer / this.windupDuration);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.arc(this.x, this.y, this.radius, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * remaining));
      ctx.closePath();
      ctx.fill();
    } else if (this.state === 'impact') {
      const scale = this.timer / this.impactDuration;
      ctx.fillStyle = `rgba(255, 255, 255, ${1 - scale})`;
      ctx.fill();
      
      ctx.strokeStyle = `rgba(255, 200, 0, ${1 - scale})`;
      ctx.lineWidth = 10 * (1 - scale);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * (1 + scale * 0.5), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  playWarningSound() {
    const audio = new Audio('assets/slam_warning.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio wait for interaction'));
  }

  playImpactSound() {
    const audio = new Audio('assets/slam_impact.mp3');
    audio.volume = 0.7;
    audio.play().catch(e => console.log('Audio wait for interaction'));
  }
}

export class SpecialAttackSystem {
  constructor(game) {
    this.game = game;
    this.attacks = [];
  }

  createSlamAttack(zombie) {
    this.attacks.push(new SlamAttack(this.game, zombie));
  }

  update(deltaTime) {
    for (let i = this.attacks.length - 1; i >= 0; i--) {
      this.attacks[i].update(deltaTime);
      if (this.attacks[i].isDead) {
        this.attacks.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.attacks.forEach(attack => attack.draw(ctx));
  }
}
