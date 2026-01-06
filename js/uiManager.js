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
    const weaponInfo = game.getWeaponInfo();

    if (weaponInfo) {
      this.uiElements.ammo.textContent = weaponInfo.currentAmmo;
      const maxAmmoElement = document.getElementById("maxAmmo");
      if (maxAmmoElement) {
        maxAmmoElement.textContent = weaponInfo.magazineCapacity;
      }

      // Add weapon name display (update HTML to include this)
      const weaponNameElement = document.getElementById("weaponName");
      if (weaponNameElement) {
        weaponNameElement.textContent = weaponInfo.name;
      }
    }

    this.uiElements.wave.textContent = game.wave;
    this.uiElements.kills.textContent = game.kills;
    this.uiElements.points.textContent = game.points;
    this.uiElements.health.textContent = Math.max(0, Math.floor(game.health));
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
