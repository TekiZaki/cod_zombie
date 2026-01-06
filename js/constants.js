// cod_zombie/js/constants.js

export const GAME_CANVAS_ID = "gameCanvas";
export const GAME_CONTAINER_ID = "gameContainer";

export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 4;
export const PLAYER_INITIAL_HEALTH = 100;
export const PLAYER_MAX_AMMO = 30;

export const BULLET_SPEED = 20;
export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 10;

export const ZOMBIE_WIDTH = 25;
export const ZOMBIE_HEIGHT = 35;
export const ZOMBIE_INITIAL_SPEED_MULTIPLIER = 0.1;
export const ZOMBIE_INITIAL_HEALTH_MULTIPLIER = 15; // Increased from 0.5 to 15
export const ZOMBIE_BASE_COUNT = 3;
export const ZOMBIE_COUNT_PER_WAVE = 2;

export const POINTS_PER_HIT = 10;
export const POINTS_PER_KILL = 100;
export const HEALTH_LOSS_PER_ZOMBIE_COLLISION = 1;

export const UI_ELEMENT_IDS = {
  wave: "wave",
  kills: "kills",
  points: "points",
  ammo: "ammo",
  health: "health",
  gameOver: "gameOver",
  finalWave: "finalWave",
  finalKills: "finalKills",
  finalPoints: "finalPoints",
};

export const COLORS = {
  player: "#4adeff", // Cyan player
  playerStroke: "#22d3ee",
  gunBarrel: "#ffde59", // Yellow gun
  bullet: "#ffde59", // Yellow bullets
  zombie: "#94a3b8", // Grayish zombie
  zombieEye: "#ef4444", // Red eyes
  canvasBackground: "#0f172a", // Dark blue background
};
