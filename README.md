# 2D Tactical Zombie Survival

A fast-paced, wave-based zombie survival game built with vanilla JavaScript and HTML5 Canvas. Battle endless waves of zombies, manage your arsenal, and survive as long as possible in a dynamically changing environment.

## 🚀 Features

- **Dynamic Environments**: The map is randomly generated with obstacles every wave, forcing you to adapt your tactics.
- **Advanced Weapon System**:
    - **ARC-7 "Vanguard"**: An Epic assault rifle with full-auto fire and accuracy that improves during sustained fire.
    - **VX-9 "Nightfall"**: A versatile sidearm with selectable Semi-Auto and 3-Round Burst fire modes.
- **Auto-Aim Intelligence**: Tactical assistance system that automatically targets the nearest threat, marked with a visual indicator.
- **Tactical HUD**: A modern, spread-out interface providing real-time data on health, ammo, wave progress, and kill counts.
- **Progression**: Zombies grow stronger with every wave, increasing in both health and speed.
- **Modular Architecture**: Clean, object-oriented code structure with separated managers for weapons, bullets, zombies, and collisions.

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W, A, S, D** | Move Character |
| **LMB (Hold)** | Fire Weapon |
| **R** | Reload |
| **Q** | Switch Weapon |
| **B** | Toggle Fire Mode (Semi/Burst/Auto) |
| **Mouse** | Rotation (Override Auto-Aim) |

## 🛠️ Technical Overview

### Core Components
- **Game Engine (`js/game.js`)**: Orchestrates the main loop, state management, and interaction between managers.
- **Map Manager (`js/mapManager.js`)**: Handles procedural generation of the tactical environment.
- **Weapon System**: Extensible base class (`weaponBase.js`) allowing for complex weapon behaviors, special effects, and multiple fire modes.
- **Collision Detector**: Custom physics resolution for entity-to-obstacle and entity-to-entity interactions.

### UI & Styling
The styling is modularized for easy maintenance:
- `base.css`: Core resets and fonts.
- `hud.css`: Tactical interface and health bars.
- `layout.css`: Canvas and container positioning.
- `animations.css`: Reloading and UI effects.

## 📦 Installation

1. Clone the repository.
2. Open `game.html` in any modern web browser.
3. (Optional) Use `run.bat` if on Windows to quickly launch the environment.

---
*Built as a demonstration of agentic coding and modular software design.*
