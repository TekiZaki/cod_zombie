// cod_zombie/js/inputHandler.js

export class InputHandler {
  constructor(player, game, weaponManager) {
    this.player = player;
    this.game = game;
    this.weaponManager = weaponManager;
    this.init();
  }

  init() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.game.canvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this),
    );
    this.game.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.game.canvas.addEventListener("mousemove", (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.player.updateRotation(mouseX, mouseY);
    });
  }

  handleKeyDown(e) {
    if (e.key === "a") this.player.moveLeft = true;
    if (e.key === "d") this.player.moveRight = true;
    if (e.key === "w") this.player.moveUp = true;
    if (e.key === "s") this.player.moveDown = true;

    // reload
    if (e.key === "r" || e.key === "R") {
      this.game.weaponManager.reload();
    }

    // weapon switching
    if (e.key === "q" || e.key === "Q") {
      this.game.weaponManager.switchWeapon();
    }

    // fire mode switching
    if (e.key === "b" || e.key === "B") {
      this.game.weaponManager.switchFireMode();
    }
  }

  handleKeyUp(e) {
    if (e.key === "a") this.player.moveLeft = false;
    if (e.key === "d") this.player.moveRight = false;
    if (e.key === "w") this.player.moveUp = false;
    if (e.key === "s") this.player.moveDown = false;
  }

  handleMouseDown(e) {
    if (this.game.isGameOver) return;
    const rect = this.game.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.weaponManager.startFiring(mouseX, mouseY);
  }

  handleMouseUp(e) {
    if (this.game.isGameOver) return;
    this.weaponManager.stopFiring();
  }
}
