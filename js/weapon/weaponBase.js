// js/weapon/weaponBase.js

export class WeaponBase {
  constructor(config) {
    // Weapon Identity
    this.name = config.name;
    this.type = config.type;
    this.rarity = config.rarity;
    this.description = config.description;

    // Core Stats
    this.baseDamage = config.baseDamage;
    this.headshotMultiplier = config.headshotMultiplier || 1.5;
    this.fireRate = config.fireRate; // rounds per minute
    this.bulletSpeed = config.bulletSpeed;
    this.effectiveRange = config.effectiveRange;
    this.maxRange = config.maxRange;
    this.armorPenetration = config.armorPenetration;

    // Ammo & Reload
    this.magazineCapacity = config.magazineCapacity;
    this.maxAmmo = config.maxAmmo;
    this.currentAmmo = config.magazineCapacity;
    this.reserveAmmo = config.maxAmmo - config.magazineCapacity;
    this.reloadTime = config.reloadTime;
    this.emptyReloadTime = config.emptyReloadTime;

    // Handling
    this.recoil = config.recoil;
    this.hipFireAccuracy = config.hipFireAccuracy;
    this.adsAccuracy = config.adsAccuracy;
    this.movementPenalty = config.movementPenalty;
    this.drawTime = config.drawTime;

    // Special Effects
    this.specialEffects = config.specialEffects || [];

    // Fire Mode
    this.fireMode = config.fireMode || "semi"; // 'semi', 'auto', 'burst'
    this.burstCount = config.burstCount || 3;

    // Internal State
    this.isReloading = false;
    this.lastFireTime = 0;
    this.isADS = false; // aim down sights

    // Fire Mode State
    this.isFiring = false;
    this._target = { x: 0, y: 0 };
    this._burstsLeft = 0;
    this._isBursting = false;
    this._hasFiredInSemi = false;
  }

  canFire() {
    if (this.isReloading || this.currentAmmo <= 0 || this._isBursting) {
      return false;
    }
    const now = Date.now();
    const fireInterval = 60000 / this.fireRate;
    return now - this.lastFireTime >= fireInterval;
  }

  startFiring(targetX, targetY) {
    this.isFiring = true;
    this._target.x = targetX;
    this._target.y = targetY;

    if (this.fireMode === "semi" && !this._hasFiredInSemi) {
      this._hasFiredInSemi = true;
    }

    if (this.fireMode === "burst" && !this._isBursting) {
      this._isBursting = true;
      this._burstsLeft = this.burstCount;
    }
  }

  stopFiring() {
    this.isFiring = false;
    this._hasFiredInSemi = false;
  }

  _getFireData() {
    this.currentAmmo--;
    this.lastFireTime = Date.now();
    return {
      damage: this.baseDamage,
      speed: this.bulletSpeed,
      accuracy: this.isADS ? this.adsAccuracy : this.hipFireAccuracy,
      target: this._target,
    };
  }

  update() {
    const fireDataArray = [];
    const now = Date.now();

    switch (this.fireMode) {
      case "semi":
        if (this.isFiring && this._hasFiredInSemi && this.canFire()) {
          fireDataArray.push(this._getFireData());
          this._hasFiredInSemi = false; // Reset so they must click again
          this.isFiring = false;
        }
        break;

      case "auto":
        if (this.isFiring && this.canFire()) {
          fireDataArray.push(this._getFireData());
        }
        break;

      case "burst":
        // Logic: If we are currently in the middle of a burst sequence
        if (this._isBursting && this._burstsLeft > 0) {
          if (this.canFire()) {
            fireDataArray.push(this._getFireData());
            this._burstsLeft--;

            if (this._burstsLeft === 0 || this.currentAmmo === 0) {
              this._isBursting = false;
              // Optional: Add a longer delay here for "between bursts"
              this.lastFireTime = now;
            }
          }
        }
        break;
    }

    return fireDataArray.length > 0 ? fireDataArray : null;
  }

  reload() {
    if (
      this.isReloading ||
      this.reserveAmmo <= 0 ||
      this.currentAmmo === this.magazineCapacity
    )
      return false;

    this.isReloading = true;
    const reloadDuration =
      this.currentAmmo === 0 ? this.emptyReloadTime : this.reloadTime;

    setTimeout(() => {
      const ammoNeeded = this.magazineCapacity - this.currentAmmo;
      const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);

      this.currentAmmo += ammoToReload;
      this.reserveAmmo -= ammoToReload;
      this.isReloading = false;
    }, reloadDuration * 1000);

    return true;
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      currentAmmo: this.currentAmmo,
      reserveAmmo: this.reserveAmmo,
      magazineCapacity: this.magazineCapacity,
    };
  }
}
