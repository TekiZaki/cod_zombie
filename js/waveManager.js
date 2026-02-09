// cod_zombie/js/waveManager.js
import { WORLD_WIDTH, WORLD_HEIGHT } from "./constants.js";

export class WaveManager {
  constructor() {
    this.isWaitingForNextWave = false;
    this.waveDelay = 1500; // 1.5 second pause between rounds

    // Initialize the wave sound
    this.waveSound = new Audio("assets/zombie_wave.mp3");
  }

  checkWaveComplete(zombies, game, zombieManager) {
    // If all zombies are dead and we aren't already in the middle of a countdown
    if (zombies.length === 0 && !this.isWaitingForNextWave) {
      this.isWaitingForNextWave = true;

      // Logic for ending current wave
      setTimeout(() => {
        game.wave += 1;

        // Check for Store every 5 waves
        if (game.wave > 1 && (game.wave - 1) % 5 === 0) {
            game.storeManager.open();
            this.isWaitingForNextWave = false;
            return;
        }

        this.startNextWave(game, zombieManager);
        this.isWaitingForNextWave = false;
      }, this.waveDelay);
    }
  }

  startNextWave(game, zombieManager) {
    // Play the wave sound when the new wave officially starts
    this.playWaveSound();

    // Regenerate Map
    game.mapManager.generateMap(
      WORLD_WIDTH,
      WORLD_HEIGHT,
      game.player.x,
      game.player.y,
    );

    const isBossWave = game.wave % 5 === 0;

    // Show boss wave UI notification
    if (isBossWave) {
      this.showBossIncomingUI();
    }

    zombieManager.spawnZombies(
      WORLD_WIDTH,
      WORLD_HEIGHT,
      game.wave,
      game,
      isBossWave
    );

    // If game was paused (e.g. by store), resume it
    if (game.isPaused) {
        game.isPaused = false;
        // The game loop will naturally exit when isPaused is true, 
        // and we need to restart it here.
        game.gameLoop();
    }
  }

  showBossIncomingUI() {
    const notification = document.createElement("div");
    notification.id = "bossNotification";
    notification.style.position = "absolute";
    notification.style.top = "20%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.color = "#ff0000";
    notification.style.fontSize = "4em";
    notification.style.fontWeight = "bold";
    notification.style.textShadow = "0 0 20px #ff0000";
    notification.style.zIndex = "1000";
    notification.style.pointerEvents = "none";
    notification.textContent = "BOSS INCOMING";
    notification.style.animation = "pulse 1s infinite alternate";
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  playWaveSound() {
    if (!this.waveSound) return;

    // Reset and play
    this.waveSound.currentTime = 0;
    this.waveSound.play().catch((e) => {
      console.log("Wave sound blocked until user interaction.");
    });
  }
}
