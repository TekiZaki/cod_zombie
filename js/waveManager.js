// cod_zombie/js/waveManager.js

export class WaveManager {
  constructor() {
    this.isWaitingForNextWave = false;
    this.waveDelay = 3000; // 3 second pause between rounds
  }

  checkWaveComplete(zombies, game, zombieManager) {
    // If all zombies are dead and we aren't already in the middle of a countdown
    if (zombies.length === 0 && !this.isWaitingForNextWave) {
      this.isWaitingForNextWave = true;

      // Logic for ending current wave
      setTimeout(() => {
        game.wave += 1;

        // Optional: Refill ammo on new round like COD (or keep as is)
        const weapon = game.weaponManager.getCurrentWeapon();
        if (weapon) {
          weapon.reserveAmmo = weapon.maxAmmo - weapon.magazineCapacity;
        }

        zombieManager.spawnZombies(
          game.canvas.width,
          game.canvas.height,
          game.wave,
        );

        this.isWaitingForNextWave = false;
      }, this.waveDelay);
    }
  }
}
