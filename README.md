# Tactical Zombie Survival Engine

A sophisticated 2D wave-based survival simulation developed using vanilla JavaScript and HTML5 Canvas. This project demonstrates high-performance rendering, modular system architecture, and advanced gameplay mechanics within a browser environment.

## Project Overview

Tactical Zombie Survival is a comprehensive framework for entity management and real-time state synchronization. It features a robust wave management system, procedural obstacle generation, and a comprehensive economy-based upgrade registry. The engine is designed to scale difficulty dynamically as the simulation progresses.

## Key Technical Features

### Advanced Entity Management

The simulation utilizes specialized managers for Zombies, Bullets, and Map elements. This architecture ensures decoupled logic and optimal performance during high-intensity scenarios, maintaining a consistent frame rate.

### Procedural Environment Generation

Every wave initiates a new cycle of the `MapManager`, which procedurally distributes obstacles across the 2000x2000 world space. This ensures tactical variety and prevents static gameplay patterns.

### High-Fidelity Combat System

* **Variable Fire Modes**: Support for Semi-Automatic, 3-Round Burst, and Full-Automatic fire modes.
* **Adaptive Auto-Aim**: A sophisticated targeting system that automatically prioritizes the nearest threat while allowing for mouse-controlled manual override.
* **Collision Detection**: A custom-built collision engine handling entity-to-entity and entity-to-world interactions with physics-based resolution.

### Tactical Economy

Players earn points through combat proficiency, receiving 2 points per hit and 20 points per kill. These assets can be reinvested in the system via the Tactical Store, which becomes accessible every five waves.

## Arsenal and Upgrades

### Primary Weaponry

* **VX-9 "Nightfall"**: A versatile sidearm featuring selectable fire modes and high reliability.
* **ARC-7 "Vanguard"**: A high-output assault rifle with accuracy that improves under sustained fire.

### Upgrade Registry

The system includes an extensive repository of upgrades categorized by operational functionality:

* **Player Augmentation**: Vitality (Increased Health), Lightweight (Enhanced Mobility), Juggernaut (Damage Mitigation).
* **Weapon Modification**: Hollow Point (Damage Output), Rapid Fire (Cycle Rate), Extended Mags (Magazine Capacity).
* **Tactical Utility**: Deadshot (Critical Hit Probability), Scavenger (Health Recovery), Second Wind (Emergency Resuscitation).
* **Economic Optimization**: Gold Digger (Point Multiplier), Bounty Hunter (Critical Bonuses).

## Control Mapping

| Command | Interaction |
| :--- | :--- |
| **Movement** | W, A, S, D Keys |
| **Primary Fire** | Left Mouse Button (Hold) |
| **Reload** | R Key |
| **Switch Weapon** | Q Key |
| **Fire Mode Toggle** | B Key |
| **Aiming** | Cursor Tracking (Manual Override) |

## System Installation

1. **Repository Acquisition**: Clone the source code to the local directory.
2. **Environment Execution**: Open `index.html` in any modern web browser.
3. **Automated Launch**: Utilize `run.bat` on Windows systems for immediate environment initialization.

## Architecture and Styling

The codebase implements a modular CSS architecture to maintain visual consistency and performance:

* **base.css**: Foundational resets and typography.
* **hud.css**: Dynamic Heads-Up Display and health visualization logic.
* **layout.css**: Spatial positioning and canvas scaling parameters.
* **animations.css**: Keyframe-based UI transitions and state animations.

---

_Technical Implementation facilitated by Antigravity Agentic Framework._
