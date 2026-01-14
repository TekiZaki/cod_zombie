// js/upgradeRegistry.js

export const UPGRADES = [
/* ================= WEAPONS ================= */
{
  id: "weapon_arc7",
  name: 'ARC-7 "Vanguard"',
  description: "Unlock the ARC-7 Vanguard Assault Rifle.",
  category: "weapon_unlock",
  stat: "arc7",
  value: 1000,
  cost: 1000
},

/* ================= PLAYER – SURVIVABILITY ================= */
{
  id: "vitality_1",
  name: "Vitality I",
  description: "Increase Max Health by +25.",
  category: "player",
  type: "add",
  stat: "maxHealth",
  value: 25
},
{
  id: "vitality_2",
  name: "Vitality II",
  description: "Increase Max Health by +50.",
  category: "player",
  type: "add",
  stat: "maxHealth",
  value: 50
},
{
  id: "juggernaut_1",
  name: "Juggernaut I",
  description: "Reduce incoming damage by 10%.",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.9
},
{
  id: "juggernaut_2",
  name: "Juggernaut II",
  description: "Reduce incoming damage by 20%.",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.8
},
{
  id: "regeneration",
  name: "Regeneration",
  description: "Heal +1 HP per second.",
  category: "utility",
  type: "special",
  stat: "regen",
  value: 1
},

/* ================= PLAYER – MOBILITY ================= */
{
  id: "lightweight_1",
  name: "Lightweight I",
  description: "Increase movement speed by 10%.",
  category: "player",
  type: "multiply",
  stat: "speed",
  value: 1.1
},
{
  id: "lightweight_2",
  name: "Lightweight II",
  description: "Increase movement speed by 20%.",
  category: "player",
  type: "multiply",
  stat: "speed",
  value: 1.2
},
{
  id: "adrenaline",
  name: "Adrenaline Rush",
  description: "Gain 30% speed when HP below 30%.",
  category: "utility",
  type: "special",
  stat: "lowHpSpeed",
  value: 1.3
},

/* ================= WEAPON – DAMAGE ================= */
{
  id: "damage_boost_1",
  name: "Hollow Point I",
  description: "Increase weapon damage by 15%.",
  category: "weapon",
  type: "multiply",
  stat: "baseDamage",
  value: 1.15
},
{
  id: "damage_boost_2",
  name: "Hollow Point II",
  description: "Increase weapon damage by 30%.",
  category: "weapon",
  type: "multiply",
  stat: "baseDamage",
  value: 1.3
},
{
  id: "headshot_master",
  name: "Headshot Master",
  description: "Increase headshot multiplier by 25%.",
  category: "weapon",
  type: "multiply",
  stat: "headshotMultiplier",
  value: 1.25
},

/* ================= WEAPON – FIRE RATE ================= */
{
  id: "rapid_fire_1",
  name: "Rapid Fire I",
  description: "Increase fire rate by 15%.",
  category: "weapon",
  type: "multiply",
  stat: "fireRate",
  value: 1.15
},
{
  id: "rapid_fire_2",
  name: "Rapid Fire II",
  description: "Increase fire rate by 30%.",
  category: "weapon",
  type: "multiply",
  stat: "fireRate",
  value: 1.3
},

/* ================= WEAPON – AMMO ================= */
{
  id: "extended_mags_1",
  name: "Extended Mags I",
  description: "Increase magazine capacity by 25%.",
  category: "weapon",
  type: "multiply",
  stat: "magazineCapacity",
  value: 1.25
},
{
  id: "extended_mags_2",
  name: "Extended Mags II",
  description: "Increase magazine capacity by 50%.",
  category: "weapon",
  type: "multiply",
  stat: "magazineCapacity",
  value: 1.5
},
{
  id: "scavenger",
  name: "Scavenger",
  description: "Heal +5 HP on kill.",
  category: "utility",
  type: "special",
  stat: "healOnKill",
  value: 5
},
{
  id: "ammo_surplus",
  name: "Ammo Surplus",
  description: "Gain +50% reserve ammo each wave.",
  category: "utility",
  type: "special",
  stat: "ammoBonus",
  value: 0.5
},

/* ================= CRITICAL & SPECIAL ================= */
{
  id: "double_tap_1",
  name: "Double Tap I",
  description: "10% chance to deal 2x damage.",
  category: "utility",
  type: "special",
  stat: "critChance",
  value: 0.1
},
{
  id: "double_tap_2",
  name: "Double Tap II",
  description: "20% chance to deal 2x damage.",
  category: "utility",
  type: "special",
  stat: "critChance",
  value: 0.2
},
{
  id: "executioner",
  name: "Executioner",
  description: "Deal +50% damage to zombies below 30% HP.",
  category: "utility",
  type: "special",
  stat: "executeBonus",
  value: 1.5
},

/* ================= DEFENSIVE UTILITY ================= */
{
  id: "thick_skin",
  name: "Thick Skin",
  description: "Reduce zombie collision damage by 30%.",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.7
},
{
  id: "second_wind",
  name: "Second Wind",
  description: "Heal 20 HP when taking fatal damage (once per wave).",
  category: "utility",
  type: "special",
  stat: "secondWind",
  value: 20
},

/* ================= ECONOMY ================= */
{
  id: "gold_digger",
  name: "Gold Digger",
  description: "Gain +25% points from kills.",
  category: "utility",
  type: "special",
  stat: "pointBonus",
  value: 1.25
},
{
  id: "headhunter",
  name: "Headhunter",
  description: "Headshots give +10 extra points.",
  category: "utility",
  type: "special",
  stat: "headshotPoints",
  value: 10
},

/* ================= FINAL CHAOS ================= */
{
  id: "berserker",
  name: "Berserker",
  description: "Deal +40% damage but take +20% damage.",
  category: "utility",
  type: "special",
  stat: "berserk",
  value: { damage: 1.4, taken: 1.2 }
},
{
  id: "unstoppable",
  name: "Unstoppable",
  description: "Gain immunity to knockback.",
  category: "utility",
  type: "special",
  stat: "knockbackImmune",
  value: true
}
];
