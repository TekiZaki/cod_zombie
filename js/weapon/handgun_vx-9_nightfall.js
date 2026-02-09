// js/weapon/handgun_vx-9_nightfall.js

import { WeaponBase } from "./weaponBase.js";

export class HandgunVX9Nightfall extends WeaponBase {
  constructor() {
    super({
      // Weapon Identity
      name: 'VX-9 "Nightfall"',
      type: "Handgun / Semi-Automatic Pistol",
      rarity: "Rare",
      description:
        "A compact, high-velocity sidearm developed for close-to-mid range combat. The VX-9 excels in accuracy and quick handling, making it a favorite backup weapon for elite operatives.",

      // Core Stats
      baseDamage: 28,
      headshotMultiplier: 1.8,
      fireRate: 500, // rounds per minute
      bulletSpeed: 1200, // pixels per second (scaled from m/s)
      effectiveRange: 450, // pixels (scaled from 45 meters)
      maxRange: 700, // pixels (scaled from 70 meters)
      armorPenetration: "Medium",

      // Ammo & Reload
      magazineCapacity: 15,
      reloadTime: 1.2, // seconds
      emptyReloadTime: 1.6, // seconds

      // Handling & Accuracy
      recoil: "Low",
      accuracy: 0.78,
      movementPenalty: -0.05,
      drawTime: 0.35, // seconds

      fireMode: "semi", // semi, burst, auto
      availableFireModes: ["semi", "burst"],
      burstCount: 3, // comment this if not burst
      burstDelay: 450, // ms delay between bursts

      // Special Effects
      specialEffects: [
        {
          name: "Precision Burst",
          description:
            "Landing 3 consecutive hits increases damage by +10% for 4 seconds",
          type: "damage_boost",
        },
        {
          name: "Silent Slide",
          description:
            "Suppressor attachment reduces enemy detection radius by 30%",
          type: "stealth",
        },
      ],
    });

    // Special effect state tracking
    this.consecutiveHits = 0;
    this.precisionBurstActive = false;
    this.precisionBurstTimer = null;
    
    // Fire sound
    this.fireSound = new Audio("assets/pistol_sound.mp3");
  }

  // Override fire method to include special effects
  fire() {
    const fireData = super.fire();
    if (!fireData) return null;

    // Apply Precision Burst damage boost
    if (this.precisionBurstActive) {
      fireData.damage *= 1.1;
    }

    return fireData;
  }

  onHit() {
    this.consecutiveHits++;

    // Activate Precision Burst on 3rd consecutive hit
    if (this.consecutiveHits >= 3 && !this.precisionBurstActive) {
      this.precisionBurstActive = true;

      // Clear existing timer if any
      if (this.precisionBurstTimer) {
        clearTimeout(this.precisionBurstTimer);
      }

      // Set 4-second timer
      this.precisionBurstTimer = setTimeout(() => {
        this.precisionBurstActive = false;
        this.consecutiveHits = 0;
      }, 4000);
    }
  }

  onMiss() {
    this.consecutiveHits = 0;
  }
}
