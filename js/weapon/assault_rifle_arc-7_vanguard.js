// js/weapon/assault_rifle_arc-7_vanguard.js

import { WeaponBase } from "./weaponBase.js";

export class AssaultRifleARC7Vanguard extends WeaponBase {
  constructor() {
    super({
      // Weapon Identity
      name: 'ARC-7 "Vanguard"',
      type: "Assault Rifle / Full-Auto",
      rarity: "Epic",
      description:
        "A reliable, high-output assault rifle designed for front-line suppression. The ARC-7 Vanguard provides sustained fire with manageable recoil, making it ideal for clearing waves of enemies.",

      // Core Stats
      baseDamage: 32,
      headshotMultiplier: 1.5,
      fireRate: 750, // rounds per minute
      bulletSpeed: 1500,
      effectiveRange: 600,
      maxRange: 900,
      armorPenetration: "High",

      // Ammo & Reload
      magazineCapacity: 30,
      reloadTime: 1.8,
      emptyReloadTime: 2.4,

      // Handling & Accuracy
      recoil: "Medium",
      accuracy: 0.65,
      movementPenalty: -0.12,
      drawTime: 0.5,

      fireMode: "auto",
      availableFireModes: ["auto", "semi"],

      // Special Effects
      specialEffects: [
        {
          name: "Sustained Fire",
          description:
            "Accuracy gradually increases the longer you hold down the trigger",
          type: "accuracy_boost",
        }
      ],
    });

    this.firingDuration = 0;
    this.maxAccuracyBonus = 0.15;
    
    // Fire sound
    this.fireSound = new Audio("assets/assault_rifle_sound.mp3");
  }

  _getFireData() {
    const fireData = super._getFireData();
    if (!fireData) {
      this.firingDuration = 0;
      return null;
    }

    // Apply accuracy bonus based on firing duration
    const bonus = Math.min(this.firingDuration * 0.05, this.maxAccuracyBonus);
    fireData.accuracy += bonus;
    
    this.firingDuration += (60 / this.fireRate); // Approximate time in seconds between shots
    
    return fireData;
  }

  stopFiring() {
    super.stopFiring();
    this.firingDuration = 0;
  }
}
