// cod_zombie/js/uiManager.js

import { UI_ELEMENT_IDS } from "./constants.js";

export class UIManager {
  constructor() {
    this.uiElements = {};
    for (const key in UI_ELEMENT_IDS) {
      this.uiElements[key] = document.getElementById(UI_ELEMENT_IDS[key]);
    }
  }

  updateUI(game) {
    const weapon = game.weaponManager.getCurrentWeapon();
    const weaponInfo = game.getWeaponInfo();

    if (weaponInfo && weapon) {
      const ammoElement = this.uiElements.ammo;
      const weaponNameElement = document.getElementById("weaponName");
      const fireModeElement = document.getElementById("fireMode");

      if (weaponNameElement) {
        weaponNameElement.textContent = weaponInfo.name;
      }

      // Check if the weapon is currently in its reloading state
      if (weapon.isReloading) {
        ammoElement.innerHTML = `RELOADING <span class="reloading-icon"></span>`;
        ammoElement.classList.add("ammo-reloading");
      } else {
        ammoElement.textContent = weaponInfo.currentAmmo;
        ammoElement.classList.remove("ammo-reloading");
      }

      const maxAmmoElement = document.getElementById("maxAmmo");
      if (maxAmmoElement) {
        maxAmmoElement.textContent = weaponInfo.magazineCapacity;
      }

      if (fireModeElement) {
        fireModeElement.textContent = `[${weaponInfo.fireMode.toUpperCase()}]`;
      }
    }

    // Update wave display
    const waveElement = this.uiElements.wave;
    if (game.waveManager.isWaitingForNextWave) {
      waveElement.textContent = "PREPARING...";
      waveElement.style.color = "#ffcc00";
      waveElement.classList.add("wave-waiting");
    } else {
      waveElement.textContent = game.wave;
      waveElement.style.color = "#fff";
      waveElement.classList.remove("wave-waiting");
    }

    // Update remaining zombies
    const zombiesLeftElement = document.getElementById("zombiesLeft");
    if (zombiesLeftElement) {
      zombiesLeftElement.textContent = game.zombieManager.zombies.length;
    }

    // Update other UI elements
    this.uiElements.kills.textContent = game.kills;
    this.uiElements.points.textContent = game.points;
    const currentHealth = Math.max(0, Math.floor(game.health));
    this.uiElements.health.textContent = currentHealth;

    // Update health bar fill
    const healthBarFill = document.getElementById("healthBarFill");
    if (healthBarFill) {
      const healthPercentage = (currentHealth / game.player.maxHealth) * 100;
      healthBarFill.style.width = `${healthPercentage}%`;
    }
  }

  showGameOver(game) {
    this.uiElements.gameOver.style.display = "block";
    this.uiElements.finalWave.textContent = game.wave;
    this.uiElements.finalKills.textContent = game.kills;
    this.uiElements.finalPoints.textContent = game.points;
  }

  hideGameOver() {
    this.uiElements.gameOver.style.display = "none";
  }
}
