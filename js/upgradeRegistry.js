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
  value: 25,
  cost: 400,
  level: 1
},
{
  id: "vitality_2",
  name: "Vitality II",
  description: "Increase Max Health by another +50.",
  category: "player",
  type: "add",
  stat: "maxHealth",
  value: 50,
  cost: 800,
  level: 2,
  requiredId: "vitality_1"
},
{
  id: "juggernaut_1",
  name: "Juggernaut I",
  description: "Reduce incoming damage by 10%.",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.9,
  cost: 500,
  level: 1
},
{
  id: "juggernaut_2",
  name: "Juggernaut II",
  description: "Reduce incoming damage by another 10% (stacking).",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.9,
  cost: 1000,
  level: 2,
  requiredId: "juggernaut_1"
},
{
  id: "regeneration",
  name: "Regeneration",
  description: "Heal +1 HP per second.",
  category: "utility",
  type: "special",
  stat: "regen",
  value: 1,
  cost: 600
},

/* ================= PLAYER – MOBILITY ================= */
{
  id: "lightweight_1",
  name: "Lightweight I",
  description: "Increase movement speed by 10%.",
  category: "player",
  type: "multiply",
  stat: "speed",
  value: 1.1,
  cost: 300,
  level: 1
},
{
  id: "lightweight_2",
  name: "Lightweight II",
  description: "Increase movement speed by another 10%.",
  category: "player",
  type: "multiply",
  stat: "speed",
  value: 1.1,
  cost: 600,
  level: 2,
  requiredId: "lightweight_1"
},
{
  id: "adrenaline",
  name: "Adrenaline Rush",
  description: "Gain 30% speed when HP below 30%.",
  category: "utility",
  type: "special",
  stat: "lowHpSpeed",
  value: 1.3,
  cost: 500
},

/* ================= WEAPON – DAMAGE ================= */
{
  id: "damage_boost_1",
  name: "Hollow Point I",
  description: "Increase weapon damage by 15%.",
  category: "weapon",
  type: "multiply",
  stat: "baseDamage",
  value: 1.15,
  cost: 450,
  level: 1
},
{
  id: "damage_boost_2",
  name: "Hollow Point II",
  description: "Increase weapon damage by another 15%.",
  category: "weapon",
  type: "multiply",
  stat: "baseDamage",
  value: 1.15,
  cost: 900,
  level: 2,
  requiredId: "damage_boost_1"
},

/* ================= WEAPON – PRECISION (CRITS) ================= */
{
  id: "deadshot_1",
  name: "Deadshot I",
  description: "15% chance to deal 2x critical damage.",
  category: "utility",
  type: "special",
  stat: "critChance",
  value: 0.15,
  cost: 500,
  level: 1
},
{
  id: "deadshot_2",
  name: "Deadshot II",
  description: "Increase critical chance by another 15%.",
  category: "utility",
  type: "special",
  stat: "critChance",
  value: 0.15,
  cost: 1000,
  level: 2,
  requiredId: "deadshot_1"
},
{
  id: "deadshot_3",
  name: "Deadshot III",
  description: "Increase critical chance by another 15% (Total 45%).",
  category: "utility",
  type: "special",
  stat: "critChance",
  value: 0.15,
  cost: 1500,
  level: 3,
  requiredId: "deadshot_2"
},

/* ================= WEAPON – FIRE RATE ================= */
{
  id: "rapid_fire_1",
  name: "Rapid Fire I",
  description: "Increase fire rate by 15%.",
  category: "weapon",
  type: "multiply",
  stat: "fireRate",
  value: 1.15,
  cost: 500,
  level: 1
},
{
  id: "rapid_fire_2",
  name: "Rapid Fire II",
  description: "Increase fire rate by another 15%.",
  category: "weapon",
  type: "multiply",
  stat: "fireRate",
  value: 1.15,
  cost: 1000,
  level: 2,
  requiredId: "rapid_fire_1"
},

/* ================= WEAPON – AMMO ================= */
{
  id: "extended_mags_1",
  name: "Extended Mags I",
  description: "Increase magazine capacity by 25%.",
  category: "weapon",
  type: "multiply",
  stat: "magazineCapacity",
  value: 1.25,
  cost: 400,
  level: 1
},
{
  id: "extended_mags_2",
  name: "Extended Mags II",
  description: "Increase magazine capacity by another 25%.",
  category: "weapon",
  type: "multiply",
  stat: "magazineCapacity",
  value: 1.25,
  cost: 800,
  level: 2,
  requiredId: "extended_mags_1"
},
{
  id: "scavenger",
  name: "Scavenger",
  description: "Heal +5 HP on kill.",
  category: "utility",
  type: "special",
  stat: "healOnKill",
  value: 5,
  cost: 700
},
/* ================= SPECIAL UTILITY ================= */
{
  id: "executioner",
  name: "Executioner",
  description: "Deal +50% damage to zombies below 30% HP.",
  category: "utility",
  type: "special",
  stat: "executeBonus",
  value: 1.5,
  cost: 800
},
{
  id: "thick_skin",
  name: "Thick Skin",
  description: "Reduce zombie collision damage by 30%.",
  category: "player",
  type: "multiply",
  stat: "damageReduction",
  value: 0.7,
  cost: 600
},
{
  id: "second_wind",
  name: "Second Wind",
  description: "Heal 20 HP when taking fatal damage (once per wave).",
  category: "utility",
  type: "special",
  stat: "secondWind",
  value: 20,
  cost: 1200
},

/* ================= ECONOMY ================= */
{
  id: "gold_digger",
  name: "Gold Digger",
  description: "Gain +25% points from kills.",
  category: "utility",
  type: "special",
  stat: "pointBonus",
  value: 1.25,
  cost: 600
},
{
  id: "bounty_hunter",
  name: "Bounty Hunter",
  description: "Every critical hit gives +10 extra points.",
  category: "utility",
  type: "special",
  stat: "critBonusPoints",
  value: 10,
  cost: 700
},

/* ================= FINAL CHAOS ================= */
{
  id: "berserker",
  name: "Berserker",
  description: "Deal +40% damage but take +20% damage.",
  category: "utility",
  type: "special",
  stat: "berserk",
  value: { damage: 1.4, taken: 1.2 },
  cost: 1500
},
{
  id: "unstoppable",
  name: "Unstoppable",
  description: "Gain immunity to knockback.",
  category: "utility",
  type: "special",
  stat: "knockbackImmune",
  value: true,
  cost: 2000
}
];
