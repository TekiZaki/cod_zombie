// js/storeManager.js
import { UPGRADES } from "./upgradeRegistry.js";
import { AssaultRifleARC7Vanguard } from "./weapon/assault_rifle_arc-7_vanguard.js";

export class StoreManager {
  constructor(game) {
    this.game = game;
    this.isOpen = false;
    this.currentChoices = [];
    this.refreshCost = 300;
    this.refreshIncrement = 150;
    this.upgradeCost = 500;
    this.appliedUpgrades = [];
    
    // UI Elements
    this.overlay = document.getElementById("storeOverlay");
    this.upgradeContainer = document.getElementById("upgradeContainer");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.refreshCostDisplay = document.getElementById("refreshCost");
    this.pointsDisplay = document.getElementById("storePointsDisplay");
    this.continueBtn = document.getElementById("continueBtn");

    if (this.continueBtn) {
        this.continueBtn.addEventListener("click", () => this.closeAndContinue());
    }
  }

  open() {
    this.isOpen = true;
    this.game.isPaused = true;
    this.refreshCost = 300;
    this.generateChoices();
    this.updateUI();
    this.overlay.style.display = "flex";
  }

  close() {
    this.isOpen = false;
    this.game.isPaused = false;
    this.overlay.style.display = "none";
  }

  closeAndContinue() {
    this.close();
    // Trigger next wave
    if (this.game.waveManager) {
        this.game.waveManager.startNextWave(this.game, this.game.zombieManager);
    }
    // Restart the game loop since it was paused
    this.game.gameLoop();
  }

  generateChoices() {
    const availableUpgrades = UPGRADES.filter(u => {
        // Filter out weapon unlocks if already owned
        if (u.category === "weapon_unlock") {
            const hasWeapon = this.game.weaponManager.weapons.some(w => w instanceof AssaultRifleARC7Vanguard);
            return !hasWeapon;
        }

        // 1. If we already have THIS specific upgrade, don't show it again
        if (this.appliedUpgrades.some(applied => applied.id === u.id)) return false;

        // 2. If it has a requirement, check if we have it
        if (u.requiredId && !this.appliedUpgrades.some(applied => applied.id === u.requiredId)) return false;

        // 3. If it's a leveled upgrade (Level > 1) and we don't have the prerequisite, it was handled above.
        // If it's Level 1, it should show up. 
        // We also want to avoid showing Level 2 if Level 1 is available but not yet bought.
        // Actually, the above logic handles this if Level 2 has requiredId: Level 1.

        return true;
    });

    const shuffled = [...availableUpgrades].sort(() => 0.5 - Math.random());
    this.currentChoices = shuffled.slice(0, 3);
  }

  refresh() {
    if (this.game.points >= this.refreshCost) {
      this.game.points -= this.refreshCost;
      this.refreshCost += this.refreshIncrement;
      this.generateChoices();
      this.updateUI();
    }
  }

  selectUpgrade(upgrade) {
    const cost = upgrade.cost || this.upgradeCost;
    if (this.game.points < cost) return;

    this.game.points -= cost;
    this.applyUpgrade(upgrade);
    this.appliedUpgrades.push(upgrade);
    
    // Instead of closing, we just update UI to allow more purchases
    this.generateChoices();
    this.updateUI();
  }

  applyUpgrade(upgrade) {
    const { category, stat, value, type } = upgrade;

    if (category === "player") {
      if (type === "add") {
        this.game.player[stat] = (this.game.player[stat] || 0) + value;
        if (stat === "maxHealth") {
            this.game.health += value; // Heal for the bonus amount
        }
      } else if (type === "multiply") {
        this.game.player[stat] = (this.game.player[stat] || 1) * value;
      }
    } else if (category === "weapon") {
      // Apply to all weapons in the manager
      this.game.weaponManager.weapons.forEach(weapon => {
        if (type === "multiply") {
          weapon[stat] = (weapon[stat] || 1) * value;
          // For magazine capacity, we might need to adjust current ammo
          if (stat === "magazineCapacity") {
              weapon.magazineCapacity = Math.round(weapon.magazineCapacity);
          }
        }
      });
    } else if (category === "utility") {
      this.game.modifiers[stat] = (this.game.modifiers[stat] || 0) + value;
    } else if (category === "weapon_unlock") {
        if (stat === "arc7") {
            this.game.weaponManager.addWeapon(new AssaultRifleARC7Vanguard());
        }
    }
  }

  updateUI() {
    this.pointsDisplay.textContent = Math.floor(this.game.points);
    this.upgradeContainer.innerHTML = "";
    
    this.currentChoices.forEach(upgrade => {
      const cost = upgrade.cost || this.upgradeCost;
      const canAffordUpgrade = this.game.points >= cost;
      
      const card = document.createElement("div");
      card.className = "upgrade-card";
      if (!canAffordUpgrade) {
        card.style.opacity = "0.5";
        card.style.cursor = "not-allowed";
      }

      card.innerHTML = `
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-description">${upgrade.description}</div>
        <div style="color: #ffcc00; font-size: 0.9em; margin-top: auto;">COST: ${cost} PTS</div>
      `;

      if (canAffordUpgrade) {
        card.onclick = () => this.selectUpgrade(upgrade);
      }
      this.upgradeContainer.appendChild(card);
    });

    this.refreshBtn.disabled = this.game.points < this.refreshCost;
    this.refreshCostDisplay.textContent = `Cost: ${this.refreshCost} pts`;
  }
}
