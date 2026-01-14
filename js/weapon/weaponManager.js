// js/weapon/weaponManager.js

export class WeaponManager {
  constructor() {
    this.weapons = [];
    this.currentWeaponIndex = 0;
    this.isSwapping = false;
  }

  addWeapon(weapon) {
    if (this.weapons.length < 2) {
      // Limit to 2 weapons
      this.weapons.push(weapon);
      return true;
    }
    return false;
  }

  getCurrentWeapon() {
    return this.weapons[this.currentWeaponIndex] || null;
  }

  switchWeapon() {
    if (this.weapons.length <= 1 || this.isSwapping) return false;

    this.isSwapping = true;
    const currentWeapon = this.getCurrentWeapon();

    setTimeout(() => {
      this.currentWeaponIndex =
        (this.currentWeaponIndex + 1) % this.weapons.length;
      const newWeapon = this.getCurrentWeapon();

      setTimeout(() => {
        this.isSwapping = false;
      }, newWeapon.drawTime * 1000);
    }, currentWeapon.drawTime * 500); // Half draw time for holstering

    return true;
  }

  reload() {
    const weapon = this.getCurrentWeapon();
    return weapon ? weapon.reload() : false;
  }

  switchFireMode() {
    const weapon = this.getCurrentWeapon();
    return weapon ? weapon.switchFireMode() : false;
  }

  startFiring(targetX, targetY) {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      weapon.startFiring(targetX, targetY);
    }
  }

  stopFiring() {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      weapon.stopFiring();
    }
  }

  update() {
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      return weapon.update();
    }
    return null;
  }
}
