// cod_zombie/js/waveManager.js

export class WaveManager {
  checkWaveComplete(zombies, game, zombieManager) {
    if (zombies.length === 0 && game.wave > 0) {
      game.wave += 1;
      game.ammo = game.maxAmmo;
      zombieManager.spawnZombies(
        game.canvas.width,
        game.canvas.height,
        game.wave,
      );
    }
  }
}
