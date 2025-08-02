class Character extends MovableObject {
  width = 120;
  height = 300;
  y = 132.5;
  speed = 3;
  deathAnimationPlayed = false;
  wasFalling = false;
  lastActionTime = new Date().getTime();
  isIdle = false;
  world;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONGIDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Initializes the character by loading all necessary image assets, enabling gravity, and starting animations.
   *
   * This constructor performs the following steps:
   * - Loads the default idle image (first frame from `IMAGES_IDLE`)
   * - Preloads all animation frame sets: idle, long idle, walking, jumping, dead, and hurt
   * - Applies gravity to enable falling/jumping behavior
   * - Starts the character's animation loop
   * - Begins detection for falling behavior (e.g. to trigger jump/fall states)
   *
   * Assumes that all image arrays (`IMAGES_IDLE`, `IMAGES_LONGIDLE`, etc.) are defined
   * as properties of the class or its prototype.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    this.startFallingDetection();
  }

  /**
   * Starts continuous detection of the character's falling state.
   *
   * This method sets up a 60 FPS interval (approx. every 16.67ms) to update the `wasFalling` flag.
   * It checks whether the vertical speed (`speedY`) is negative, which indicates that
   * the character is moving upward or falling (depending on physics logic).
   *
   * The result is stored in `this.wasFalling`, which can be used for triggering fall-specific animations
   * or behaviors elsewhere in the game.
   *
   * @method startFallingDetection
   */
  startFallingDetection() {
    setInterval(() => {
      this.wasFalling = this.speedY < 0;
    }, 1000 / 60);
  }

  /**
   * Starts the main animation loop and movement logic for the character.
   *
   * This method:
   * - Runs a loop at ~60 FPS to:
   *   - Pause walking sound (to prevent looping overlap)
   *   - Detect vertical movement (`wasFalling`) based on `speedY`
   *   - Handle movement logic (`handleRightMovement`, `handleLeftMovement`, `handleJump`)
   *   - Update the camera position relative to the character's x-coordinate
   * - Calls `startCharacterAnimationLoop()` to handle sprite frame animations independently
   *
   * Note: This method assumes the presence of a global `sounds.walking` object and a `world` with `camera_x`.
   *
   * @method animate
   */
  animate() {
    setInterval(() => {
      sounds.walking.pause();
      this.wasFalling = this.speedY < 0;
      let now = new Date().getTime();

      this.handleRightMovement(now);
      this.handleLeftMovement(now);
      this.handleJump(now);
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    this.startCharacterAnimationLoop();
  }

  /**
   * Starts the character's animation loop based on their current state.
   *
   * This method runs at 10 FPS (every 100 ms) and determines which animation
   * sequence to play depending on the character's condition:
   *
   * - If the character is dead, it plays the death animation and triggers lose sounds.
   * - If hurt, it plays the hurt animation and sound effect.
   * - If the character is in the air (`isAboveGround()`), it plays the jump animation.
   * - Otherwise, it decides between idle or walking animation based on `idleTime`.
   *
   * Additionally, the snore sound is paused on each tick to prevent overlap.
   *
   * @method startCharacterAnimationLoop
   */
  startCharacterAnimationLoop() {
    setInterval(() => {
      sounds.snore.pause();
      let now = new Date().getTime();
      let idleTime = (now - this.lastActionTime) / 1000;
      if (this.isDead()) {
        this.playLoseSounds();
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSounds();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        this.playIdleOrWalkAnimation(idleTime);
      }
    }, 100);
  }

  /**
   * Determines and plays the appropriate animation based on player input and idle time.
   *
   * This method:
   * - Plays the walking animation if the player is pressing the left or right arrow keys.
   * - Plays the long idle animation and snore sound if the character has been idle for 10 seconds or more.
   * - Otherwise, plays the standard idle animation.
   *
   * It uses `this.world.keyboard.LEFT` and `this.world.keyboard.RIGHT` to detect movement input,
   * and `idleTime` to evaluate inactivity duration.
   *
   * @method playIdleOrWalkAnimation
   * @param {number} idleTime - The duration in seconds the character has been idle.
   */
  playIdleOrWalkAnimation(idleTime) {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (idleTime >= 10) {
      this.playAnimation(this.IMAGES_LONGIDLE);
      sounds.snore.volume = 0.1;
      sounds.snore.play();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Plays the hurt sound effect with a reduced volume.
   *
   * This method triggers the character's hurt sound (`sounds.hurt`)
   * and sets its volume to 10% to avoid overpowering other audio.
   *
   * @method playHurtSounds
   */
  playHurtSounds() {
    sounds.hurt.play();
    sounds.hurt.volume = 0.1;
  }

  /**
   * Handles audio playback when the player loses the game.
   *
   * This method:
   * - Pauses the endboss theme (`sounds.endbossTime`)
   * - Sets the volume for the lose sound to 10%
   * - Plays the lose sound (`sounds.lose`)
   *
   * @method playLoseSounds
   */
  playLoseSounds() {
    sounds.endbossTime.pause();
    sounds.lose.volume = 0.1;
    sounds.lose.play();
  }

  /**
   * Handles the jump action based on user input and current character state.
   *
   * This method:
   * - Checks if the spacebar (`SPACE`) is pressed and the character is on the ground
   * - If so, triggers the jump via `this.jump()`
   * - Updates `lastActionTime` to track user activity
   * - Plays the jump sound effect at reduced volume
   *
   * @method handleJump
   * @param {number} now - The current timestamp in milliseconds (used to update `lastActionTime`).
   */
  handleJump(now) {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.lastActionTime = now;
      sounds.jump.volume = 0.1;
      sounds.jump.play();
    }
  }

  /**
   * Handles the character's movement to the left based on keyboard input.
   *
   * This method:
   * - Moves the character left if the left arrow key is pressed and `x` position is above -510.
   * - Sets the character's direction to `otherDirection = true` (i.e., facing left).
   * - Updates `lastActionTime` to track recent input.
   * - If the character is on the ground, plays the walking sound at full volume.
   *
   * @method handleLeftMovement
   * @param {number} now - The current timestamp in milliseconds (used to update `lastActionTime`).
   */
  handleLeftMovement(now) {
    if (this.world.keyboard.LEFT && this.x > -510) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastActionTime = now;
      if (!this.isAboveGround()) {
        sounds.walking.volume = 1;
        sounds.walking.play();
      }
    }
  }

  /**
   * Handles the character's movement to the right based on keyboard input.
   *
   * This method:
   * - Moves the character to the right if the right arrow key is pressed
   *   and the character hasn't reached the level's end (`level_end_x`).
   * - Sets the character's direction to `otherDirection = false` (facing right).
   * - Updates `lastActionTime` to track activity for idle detection.
   * - Plays the walking sound at full volume if the character is on the ground.
   *
   * @method handleRightMovement
   * @param {number} now - The current timestamp in milliseconds (used to update `lastActionTime`).
   */
  handleRightMovement(now) {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastActionTime = now;
      if (!this.isAboveGround()) {
        sounds.walking.volume = 1;
        sounds.walking.play();
      }
    }
  }

  /**
   * Determines if the character is above a given enemy in a way that would trigger a stomp interaction.
   *
   * This method checks:
   * - If there is horizontal overlap between the character and the enemy.
   * - If the bottom of the character is vertically within the enemy's body/head zone.
   * - If the character is falling (downward motion or was previously falling).
   *
   * These conditions are commonly used for allowing the player to defeat an enemy by jumping on it.
   *
   * @method isAbove
   * @param {Object} enemy - The enemy object to compare against.
   * @param {number} enemy.x - X-position of the enemy.
   * @param {number} enemy.y - Y-position of the enemy.
   * @param {number} enemy.width - Width of the enemy.
   * @param {number} enemy.height - Height of the enemy.
   * @returns {boolean} `true` if the character is above and falling on the enemy, otherwise `false`.
   */
  isAbove(enemy) {
    let characterBottom = this.y + this.height;
    let enemyTop = enemy.y;
    let enemyHeadZone = enemyTop + enemy.height;
    let horizontalOverlap =
      this.x + this.width > enemy.x && this.x < enemy.x + enemy.width;
    let isAbove = characterBottom <= enemyHeadZone;
    let isFalling = this.speedY > 0 || this.wasFalling;
    let result = horizontalOverlap && isAbove && isFalling;
    return result;
  }

  /**
   * Plays the character's death animation frame by frame and triggers the end of the game.
   *
   * This method:
   * - Prevents the animation from running multiple times by checking `this.deathAnimationPlayed`.
   * - Iterates through the `IMAGES_DEAD` frames at 100ms intervals.
   * - Updates the character's image (`this.img`) using a cached image path.
   * - Once all frames are played, it calls `endGameAfterDelay()` and clears the interval.
   *
   * @method playDeathAnimation
   */
  playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    let i = 0;
    let interval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        let path = this.IMAGES_DEAD[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        this.endGameAfterDelay(interval);
      }
    }, 100);
  }

  /**
   * Ends the game after a short delay and performs cleanup actions.
   *
   * This method:
   * - Clears the animation interval passed to it.
   * - Waits 500 milliseconds before:
   *   - Displaying the game over screen via `showGameOverScreen()`.
   *   - Clearing the global `world` reference.
   *   - Stopping all running intervals via `clearAllInterVals()`.
   *   - Playing the lose sound (`sounds.lose2`) at reduced volume.
   *   - Pausing the main background sound (`sounds.main`).
   *
   * @method endGameAfterDelay
   * @param {number} interval - The interval ID to be cleared before triggering game over.
   */
  endGameAfterDelay(interval) {
    clearInterval(interval);
    setTimeout(() => {
      this.showGameOverScreen();
      world = null;
      clearAllInterVals();
      sounds.lose2.volume = 0.1;
      sounds.lose2.play();
      sounds.main.pause();
    }, 500);
  }

  /**
   * Displays the game over screen and updates UI elements accordingly.
   *
   * This method:
   * - Shows the game over overlay (`#gameOverScreen`).
   * - Hides sound and control icons (`#soundControl`, `#controlIcon`).
   * - Reveals the "Restart" and "Home" buttons (`#restartGame`, `#homeBTN`).
   *
   * It manipulates DOM element classes to control visibility using `classList`.
   *
   * @method showGameOverScreen
   */
  showGameOverScreen() {
    document.getElementById("gameOverScreen").classList.remove("d-none");
    document.getElementById("soundControl").classList.add("d-none");
    document.getElementById("controlIcon").classList.add("d-none");
    document.getElementById("restartGame").classList.remove("d-none");
    document.getElementById("homeBTN").classList.remove("d-none");
  }
}
