// cod_zombie/js/mobileControls.js

export class VirtualJoystick {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      baseRadius: options.baseRadius || 60,
      stickRadius: options.stickRadius || 25,
      position: options.position || { x: 100, y: 100 },
      color: options.color || 'rgba(255, 255, 255, 0.3)',
      stickColor: options.color || 'rgba(255, 255, 255, 0.6)',
      deadZone: options.deadZone || 0.1
    };
    
    this.active = false;
    this.touchId = null;
    this.basePos = { ...this.options.position };
    this.stickPos = { ...this.options.position };
    this.delta = { x: 0, y: 0 };
    this.normalized = { x: 0, y: 0 };
    
    this.createElements();
    this.bindEvents();
  }
  
  createElements() {
    this.baseElement = document.createElement('div');
    this.baseElement.className = 'joystick-base';
    this.baseElement.style.cssText = `
      position: absolute;
      width: ${this.options.baseRadius * 2}px;
      height: ${this.options.baseRadius * 2}px;
      border-radius: 50%;
      background: ${this.options.color};
      border: 2px solid rgba(255, 255, 255, 0.5);
      left: ${this.options.position.x - this.options.baseRadius}px;
      top: ${this.options.position.y - this.options.baseRadius}px;
      pointer-events: none;
      z-index: 1000;
      display: none;
    `;
    
    this.stickElement = document.createElement('div');
    this.stickElement.className = 'joystick-stick';
    this.stickElement.style.cssText = `
      position: absolute;
      width: ${this.options.stickRadius * 2}px;
      height: ${this.options.stickRadius * 2}px;
      border-radius: 50%;
      background: ${this.options.stickColor};
      left: ${this.options.position.x - this.options.stickRadius}px;
      top: ${this.options.position.y - this.options.stickRadius}px;
      pointer-events: none;
      z-index: 1001;
      display: none;
    `;
    
    this.container.appendChild(this.baseElement);
    this.container.appendChild(this.stickElement);
  }
  
  bindEvents() {
    const touchZone = document.getElementById('joystickZone');
    if (!touchZone) return;
    
    touchZone.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    touchZone.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    touchZone.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    touchZone.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
  }
  
  handleTouchStart(e) {
    if (this.active) return;
    
    const touch = e.changedTouches[0];
    const rect = this.container.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Check if touch is in joystick zone (left side)
    if (touchX > window.innerWidth * 0.5) return;
    
    this.active = true;
    this.touchId = touch.identifier;
    this.basePos = { x: touchX, y: touchY };
    this.stickPos = { x: touchX, y: touchY };
    
    this.updateVisuals();
    this.baseElement.style.display = 'block';
    this.stickElement.style.display = 'block';
    
    e.preventDefault();
  }
  
  handleTouchMove(e) {
    if (!this.active) return;
    
    const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
    if (!touch) return;
    
    const rect = this.container.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    const dx = touchX - this.basePos.x;
    const dy = touchY - this.basePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = this.options.baseRadius - this.options.stickRadius;
    
    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      this.stickPos.x = this.basePos.x + dx * ratio;
      this.stickPos.y = this.basePos.y + dy * ratio;
    } else {
      this.stickPos.x = touchX;
      this.stickPos.y = touchY;
    }
    
    this.delta = {
      x: this.stickPos.x - this.basePos.x,
      y: this.stickPos.y - this.basePos.y
    };
    
    // Normalize with dead zone
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    if (normalizedDistance > this.options.deadZone) {
      this.normalized.x = (dx / distance) * normalizedDistance;
      this.normalized.y = (dy / distance) * normalizedDistance;
    } else {
      this.normalized.x = 0;
      this.normalized.y = 0;
    }
    
    this.updateVisuals();
    e.preventDefault();
  }
  
  handleTouchEnd(e) {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
    if (!touch) return;
    
    this.active = false;
    this.touchId = null;
    this.delta = { x: 0, y: 0 };
    this.normalized = { x: 0, y: 0 };
    
    this.baseElement.style.display = 'none';
    this.stickElement.style.display = 'none';
  }
  
  updateVisuals() {
    this.baseElement.style.left = `${this.basePos.x - this.options.baseRadius}px`;
    this.baseElement.style.top = `${this.basePos.y - this.options.baseRadius}px`;
    this.stickElement.style.left = `${this.stickPos.x - this.options.stickRadius}px`;
    this.stickElement.style.top = `${this.stickPos.y - this.options.stickRadius}px`;
  }
  
  getInput() {
    return {
      active: this.active,
      x: this.normalized.x,
      y: this.normalized.y
    };
  }
  
  show() {
    const touchZone = document.getElementById('joystickZone');
    if (touchZone) {
      touchZone.style.pointerEvents = 'auto';
      touchZone.style.opacity = '1';
    }
  }
  
  hide() {
    const touchZone = document.getElementById('joystickZone');
    if (touchZone) {
      touchZone.style.pointerEvents = 'none';
      touchZone.style.opacity = '0';
    }
    
    // Reset joystick state when hiding
    this.active = false;
    this.touchId = null;
    this.delta = { x: 0, y: 0 };
    this.normalized = { x: 0, y: 0 };
    this.baseElement.style.display = 'none';
    this.stickElement.style.display = 'none';
  }
  
  destroy() {
    if (this.baseElement) {
      this.baseElement.remove();
    }
    if (this.stickElement) {
      this.stickElement.remove();
    }
  }
}

export class MobileControls {
  constructor(game, player, weaponManager) {
    this.game = game;
    this.player = player;
    this.weaponManager = weaponManager;
    this.isMobile = this.detectMobile();
    
    this.joystick = null;
    this.fireButtonActive = false;
    this.reloadButtonActive = false;
    this.switchButtonActive = false;
    this.fireTouchId = null;
    this.joystickEnabled = true; // Track joystick visibility state
    
    if (this.isMobile) {
      this.init();
    }
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  }
  
  init() {
    this.createMobileUI();
    this.setupJoystick();
    this.setupActionButtons();
    this.setupToggleButton();
    this.hideDesktopHints();
  }
  
  createMobileUI() {
    const gameContainer = document.getElementById('gameContainer');
    
    // Joystick zone (left side)
    const joystickZone = document.createElement('div');
    joystickZone.id = 'joystickZone';
    joystickZone.style.cssText = `
      position: absolute;
      left: 0;
      bottom: 0;
      width: 50%;
      height: 40%;
      z-index: 999;
      touch-action: none;
    `;
    
    // Action buttons zone (right side)
    const actionZone = document.createElement('div');
    actionZone.id = 'actionZone';
    actionZone.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50%;
      height: 50%;
      z-index: 999;
      touch-action: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      padding: 20px;
      gap: 15px;
    `;
    
    // Fire button
    const fireBtn = document.createElement('button');
    fireBtn.id = 'mobileFireBtn';
    fireBtn.className = 'mobile-btn mobile-fire-btn';
    fireBtn.innerHTML = '🔥';
    fireBtn.style.cssText = `
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 80, 80, 0.4);
      border: 3px solid rgba(255, 100, 100, 0.8);
      color: white;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      margin-bottom: 10px;
    `;
    
    // Utility buttons container
    const utilityContainer = document.createElement('div');
    utilityContainer.style.cssText = `
      display: flex;
      gap: 12px;
      margin-bottom: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
      max-width: 200px;
    `;
    
    // Fire mode button
    const fireModeBtn = document.createElement('button');
    fireModeBtn.id = 'mobileFireModeBtn';
    fireModeBtn.className = 'mobile-btn mobile-firemode-btn';
    fireModeBtn.innerHTML = 'B';
    fireModeBtn.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 180, 50, 0.4);
      border: 2px solid rgba(255, 200, 70, 0.8);
      color: white;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Reload button
    const reloadBtn = document.createElement('button');
    reloadBtn.id = 'mobileReloadBtn';
    reloadBtn.className = 'mobile-btn mobile-reload-btn';
    reloadBtn.innerHTML = '🔄';
    reloadBtn.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(100, 150, 255, 0.4);
      border: 2px solid rgba(120, 170, 255, 0.8);
      color: white;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Switch weapon button
    const switchBtn = document.createElement('button');
    switchBtn.id = 'mobileSwitchBtn';
    switchBtn.className = 'mobile-btn mobile-switch-btn';
    switchBtn.innerHTML = '🔫';
    switchBtn.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(100, 200, 100, 0.4);
      border: 2px solid rgba(120, 220, 120, 0.8);
      color: white;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    utilityContainer.appendChild(fireModeBtn);
    utilityContainer.appendChild(reloadBtn);
    utilityContainer.appendChild(switchBtn);
    actionZone.appendChild(utilityContainer);
    actionZone.appendChild(fireBtn);
    
    gameContainer.appendChild(joystickZone);
    gameContainer.appendChild(actionZone);
    
    this.actionZone = actionZone;
  }
  
  setupJoystick() {
    this.joystick = new VirtualJoystick('gameContainer', {
      baseRadius: 65,
      stickRadius: 28,
      color: 'rgba(255, 255, 255, 0.25)',
      deadZone: 0.15
    });
  }
  
  setupActionButtons() {
    const fireBtn = document.getElementById('mobileFireBtn');
    const reloadBtn = document.getElementById('mobileReloadBtn');
    const switchBtn = document.getElementById('mobileSwitchBtn');
    const fireModeBtn = document.getElementById('mobileFireModeBtn');
    
    if (fireBtn) {
      fireBtn.addEventListener('touchstart', (e) => {
        this.fireButtonActive = true;
        fireBtn.style.background = 'rgba(255, 80, 80, 0.7)';
        fireBtn.style.transform = 'scale(0.95)';
        e.preventDefault();
      }, { passive: false });
      
      fireBtn.addEventListener('touchend', (e) => {
        this.fireButtonActive = false;
        fireBtn.style.background = 'rgba(255, 80, 80, 0.4)';
        fireBtn.style.transform = 'scale(1)';
        this.weaponManager.stopFiring();
        e.preventDefault();
      }, { passive: false });
    }
    
    if (reloadBtn) {
      reloadBtn.addEventListener('touchstart', (e) => {
        reloadBtn.style.background = 'rgba(100, 150, 255, 0.7)';
        reloadBtn.style.transform = 'scale(0.95)';
        this.weaponManager.reload();
        e.preventDefault();
      }, { passive: false });
      
      reloadBtn.addEventListener('touchend', (e) => {
        reloadBtn.style.background = 'rgba(100, 150, 255, 0.4)';
        reloadBtn.style.transform = 'scale(1)';
        e.preventDefault();
      }, { passive: false });
    }
    
    if (switchBtn) {
      switchBtn.addEventListener('touchstart', (e) => {
        switchBtn.style.background = 'rgba(100, 200, 100, 0.7)';
        switchBtn.style.transform = 'scale(0.95)';
        this.weaponManager.switchWeapon();
        e.preventDefault();
      }, { passive: false });
      
      switchBtn.addEventListener('touchend', (e) => {
        switchBtn.style.background = 'rgba(100, 200, 100, 0.4)';
        switchBtn.style.transform = 'scale(1)';
        e.preventDefault();
      }, { passive: false });
    }
    
    if (fireModeBtn) {
      fireModeBtn.addEventListener('touchstart', (e) => {
        fireModeBtn.style.background = 'rgba(255, 180, 50, 0.7)';
        fireModeBtn.style.transform = 'scale(0.95)';
        const weapon = this.weaponManager.getCurrentWeapon();
        if (weapon && weapon.switchFireMode()) {
          // Update button text to show current mode
          const mode = weapon.fireMode.toUpperCase();
          fireModeBtn.innerHTML = mode === 'SEMI' ? 'S' : mode === 'AUTO' ? 'A' : 'B';
        }
        e.preventDefault();
      }, { passive: false });
      
      fireModeBtn.addEventListener('touchend', (e) => {
        fireModeBtn.style.background = 'rgba(255, 180, 50, 0.4)';
        fireModeBtn.style.transform = 'scale(1)';
        e.preventDefault();
      }, { passive: false });
    }
    
    // Touch aim zone (right side)
    const actionZone = document.getElementById('actionZone');
    actionZone.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('mobile-btn')) return;
      
      const touch = e.changedTouches[0];
      const rect = this.game.canvas.getBoundingClientRect();
      const mouseX = touch.clientX - rect.left + this.game.camera.x;
      const mouseY = touch.clientY - rect.top + this.game.camera.y;
      this.player.updateRotation(mouseX, mouseY);
    }, { passive: false });
    
    actionZone.addEventListener('touchmove', (e) => {
      if (e.target.classList.contains('mobile-btn')) return;
      
      const touch = e.changedTouches[0];
      const rect = this.game.canvas.getBoundingClientRect();
      const mouseX = touch.clientX - rect.left + this.game.camera.x;
      const mouseY = touch.clientY - rect.top + this.game.camera.y;
      this.player.updateRotation(mouseX, mouseY);
      e.preventDefault();
    }, { passive: false });
  }
  
  hideDesktopHints() {
    const controlsHint = document.getElementById('controlsHint');
    if (controlsHint) {
      controlsHint.style.display = 'none';
    }
  }
  
  setupToggleButton() {
    const toggleBtn = document.getElementById('joystickToggleBtn');
    const toggleContainer = document.getElementById('joystickToggleContainer');
    
    if (!toggleBtn || !toggleContainer) return;
    
    // Only show toggle button on mobile
    if (this.isMobile) {
      toggleContainer.style.display = 'block';
    } else {
      toggleContainer.style.display = 'none';
      return;
    }
    
    toggleBtn.addEventListener('click', () => {
      this.toggleJoystick();
    });
    
    toggleBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.toggleJoystick();
    }, { passive: false });
  }
  
  toggleJoystick() {
    this.joystickEnabled = !this.joystickEnabled;
    
    const toggleBtn = document.getElementById('joystickToggleBtn');
    const gameContainer = document.getElementById('gameContainer');
    
    if (this.joystickEnabled) {
      this.showJoystick();
      if (toggleBtn) {
        toggleBtn.classList.remove('disabled');
        toggleBtn.style.opacity = '1';
      }
      if (gameContainer) {
        gameContainer.classList.remove('joystick-hidden');
      }
    } else {
      this.hideJoystick();
      if (toggleBtn) {
        toggleBtn.classList.add('disabled');
        toggleBtn.style.opacity = '0.5';
      }
      if (gameContainer) {
        gameContainer.classList.add('joystick-hidden');
      }
    }
  }
  
  showJoystick() {
    if (this.joystick) {
      this.joystick.show();
    }
    if (this.actionZone) {
      this.actionZone.style.pointerEvents = 'auto';
      this.actionZone.style.opacity = '1';
    }
  }
  
  hideJoystick() {
    if (this.joystick) {
      this.joystick.hide();
    }
    if (this.actionZone) {
      this.actionZone.style.pointerEvents = 'none';
      this.actionZone.style.opacity = '0.3';
    }
    
    // Reset player movement when hiding joystick
    this.player.moveLeft = false;
    this.player.moveRight = false;
    this.player.moveUp = false;
    this.player.moveDown = false;
    this.fireButtonActive = false;
    this.weaponManager.stopFiring();
  }
  
  update() {
    if (!this.isMobile || !this.joystick) return;
    
    // Disable controls during store or game over
    if (this.game.isPaused || this.game.isGameOver) {
      // Reset all movement when paused
      this.player.moveLeft = false;
      this.player.moveRight = false;
      this.player.moveUp = false;
      this.player.moveDown = false;
      this.fireButtonActive = false;
      this.weaponManager.stopFiring();
      
      // Auto-hide joystick when game over or store opens
      if (this.joystickEnabled) {
        this.hideJoystick();
      }
      return;
    } else {
      // Auto-show joystick when game resumes
      if (this.joystickEnabled && this.actionZone) {
        this.showJoystick();
      }
    }
    
    // Only process input if joystick is enabled
    if (!this.joystickEnabled) return;
    
    const input = this.joystick.getInput();
    
    // Apply joystick input to player movement
    const threshold = 0.2;
    this.player.moveLeft = input.x < -threshold;
    this.player.moveRight = input.x > threshold;
    this.player.moveUp = input.y < -threshold;
    this.player.moveDown = input.y > threshold;
    
    // Handle continuous firing
    if (this.fireButtonActive) {
      this.weaponManager.startFiring();
    }
  }
  
  destroy() {
    if (this.joystick) {
      this.joystick.destroy();
    }
    
    const joystickZone = document.getElementById('joystickZone');
    const actionZone = document.getElementById('actionZone');
    
    if (joystickZone) joystickZone.remove();
    if (actionZone) actionZone.remove();
  }
}
