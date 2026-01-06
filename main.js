// cod_zombie/main.js

import { Game } from "./js/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  // Expose resetGame to the global scope for the restart button
  window.restartGame = () => {
    game.resetGame();
  };
});
