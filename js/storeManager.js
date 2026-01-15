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
    this.purchaseLimit = 3;
    this.purchasesInVisit = 0;
    
    // UI Elements
    this.overlay = document.getElementById("storeOverlay");
    this.upgradeContainer = document.getElementById("upgradeContainer");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.refreshCostDisplay = document.getElementById("refreshCost");
    this.pointsDisplay = document.getElementById("storePointsDisplay");
    this.purchaseLimitDisplay = document.getElementById("purchaseLimitDisplay");
    this.continueBtn = document.getElementById("continueBtn");


    if (this.continueBtn) {
        this.continueBtn.addEventListener("click", () => this.closeAndContinue());
    }
  }

  open() {
    this.isOpen = true;
    this.game.isPaused = true;
    this.refreshCost = 300;
    this.purchasesInVisit = 0;
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
    // Filter out weapon unlocks if already owned
    const availableUpgrades = UPGRADES.filter(u => {
        if (u.category === "weapon_unlock") {
            const hasWeapon = this.game.weaponManager.weapons.some(w => w instanceof AssaultRifleARC7Vanguard);
            return !hasWeapon;
        }
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
    if (this.purchasesInVisit >= this.purchaseLimit) return;
    
    const cost = upgrade.cost || this.upgradeCost;
    if (this.game.points < cost) return;

    this.game.points -= cost;
    this.applyUpgrade(upgrade);
    this.appliedUpgrades.push(upgrade);
    this.purchasesInVisit++;
    
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
    if (this.purchaseLimitDisplay) {
        this.purchaseLimitDisplay.textContent = `UPGRADES REMAINING: ${this.purchaseLimit - this.purchasesInVisit}`;
        if (this.purchasesInVisit >= this.purchaseLimit) {
            this.purchaseLimitDisplay.style.color = "#ff4444";
            this.purchaseLimitDisplay.textContent = "MAX UPGRADES REACHED FOR THIS VISIT";
        } else {
            this.purchaseLimitDisplay.style.color = "#4adeff";
        }
    }
    
    this.upgradeContainer.innerHTML = "";
    
    const limitReached = this.purchasesInVisit >= this.purchaseLimit;
    
    this.currentChoices.forEach(upgrade => {
      const cost = upgrade.cost || this.upgradeCost;
      const canAffordUpgrade = this.game.points >= cost && !limitReached;
      
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

    this.refreshBtn.disabled = this.game.points < this.refreshCost || limitReached;
    this.refreshCostDisplay.textContent = `Cost: ${this.refreshCost} pts`;
  }

}
