class Endboss extends MovableObject {
  height = 400;
  width = 200;
  y = 50;
  isHurt = false;
  defeated = false;
  alertInterval;
  walking = false;

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Initializes a new instance of a game character or enemy with multiple animation states.
   *
   * This constructor:
   * - Calls the parent constructor via `super()`.
   * - Loads the default alert image (`IMAGES_ALERT[0]`) for initial display.
   * - Preloads image sequences for different states:
   *   - `IMAGES_ALERT`, `IMAGES_HURT`, `IMAGES_DEAD`, and `IMAGES_WALK`.
   * - Sets the initial horizontal position to `x = 2250` (likely off-screen or near level end).
   * - Starts the animation loop via `this.animate()`.
   *
   * Assumes that all image arrays are predefined on the instance or inherited.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_WALK);
    this.x = 2250;
    this.speed = 0.8;
    this.animate();
  }

  /**
   * Starts the alert animation loop for the character (e.g., a boss enemy).
   *
   * This method:
   * - Sets a repeating interval that updates every 250 milliseconds.
   * - If the character is not marked as defeated (`this.defeated === false`)
   *   and not currently hurt (`this.isHurt === false`), it plays the alert animation frames.
   *
   * The interval ID is stored in `this.alertInterval` for later control or cleanup.
   *
   * @method animate
   */
  animate() {
    this.alertInterval = setInterval(() => {
      if (!this.defeated && !this.isHurt) {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 250);
  }

  /**
   * Plays the death animation sequence for the character (e.g., a boss).
   *
   * This method:
   * - Stops the endboss music via `stopEndbossMusic()`.
   * - Marks the character as defeated (`this.defeated = true`).
   * - Clears the alert animation interval (`this.alertInterval`).
   * - Starts a timed animation sequence using `setInterval` (every 300ms).
   *   Each step is handled by `handleDeathAnimationStep(i, deathInterval)`,
   *   which returns the next frame index or clears the interval when done.
   *
   * @method playDeathAnimation
   */
  playDeathAnimation() {
    this.stopEndbossMusic();
    this.defeated = true;

    clearInterval(this.alertInterval);
    let i = 0;

    let deathInterval = setInterval(() => {
      i = this.handleDeathAnimationStep(i, deathInterval);
    }, 300);
  }

  /**
   * Handles one step of the endboss death animation sequence.
   *
   * - Iterates through the `IMAGES_DEAD` array to animate the death.
   * - If all frames have been displayed, clears the interval,
   *   plays the win sound, shows the victory screen, and
   *   initiates final cleanup steps.
   *
   * @param {number} i - Current frame index in the death animation sequence.
   * @param {number} deathInterval - The ID of the interval that runs the animation.
   * @returns {number} - The updated frame index for the next animation step.
   */
  handleDeathAnimationStep(i, deathInterval) {
    if (i < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[i];
      this.img = this.imageCache[path];
      i++;
    } else {
      clearInterval(deathInterval);
      this.playWinSound();
      this.showYouWonScreen();
      this.finalizeGameAfterDelay();
    }
    return i;
  }

  /**
   * Finalizes the game after a short delay once the player has won.
   *
   * This method sets a 3-second timeout after the endboss defeat to:
   * - Show the restart and home buttons by removing the `d-none` class.
   * - Reset the game world by setting `world` to `null`.
   * - Clear all running intervals via `clearAllInterVals()`.
   * - Pause the main background music.
   *
   * This creates a smooth transition from the game ending to the post-game UI.
   *
   * @method finalizeGameAfterDelay
   */
  finalizeGameAfterDelay() {
    setTimeout(() => {
      document.getElementById("restartGame").classList.remove("d-none");
      document.getElementById("homeBTN").classList.remove("d-none");

      world = null;
      clearAllInterVals();
      sounds.main.pause();
    }, 3000);
  }

  /**
   * Stops the endboss theme music by disabling looping and pausing playback.
   *
   * This method:
   * - Sets the `loop` property of the `endbossTime` sound to `false` to prevent repeating.
   * - Pauses the currently playing endboss music.
   *
   * @method stopEndbossMusic
   */
  stopEndbossMusic() {
    sounds.endbossTime.loop = false;
    sounds.endbossTime.pause();
  }

  /**
   * Plays the winning sound effect at a reduced volume.
   *
   * This method sets the volume of the `winning2` sound to 10% and plays it.
   *
   * @method playWinSound
   */
  playWinSound() {
    sounds.winning2.volume = 0.1;
    sounds.winning2.play();
  }

  /**
   * Displays the "You Won" screen and updates the UI to reflect the game completion state.
   *
   * This method:
   * - Shows the victory overlay (`#youWonScreen`).
   * - Hides the sound control and general control icons.
   *
   * @method showYouWonScreen
   */
  showYouWonScreen() {
    document.getElementById("youWonScreen").classList.remove("d-none");
    document.getElementById("soundControl").classList.add("d-none");
    document.getElementById("controlIcon").classList.add("d-none");
  }

  /**
   * Initiates the hurt animation sequence for the character.
   *
   * This method:
   * - Returns immediately if the character is already defeated or currently hurt.
   * - Sets the `isHurt` flag to true to indicate the hurt state.
   * - Clears running intervals related to alert and walking animations.
   * - Stops walking by setting `walking` to false.
   * - Starts a timed animation sequence using `setInterval` to update hurt frames every 100ms.
   * - After 1 second, calls `endHurtAnimation()` to clean up and end the hurt state.
   *
   * @method showHurtAnimation
   */
  showHurtAnimation() {
    if (this.defeated || this.isHurt) return;
    this.isHurt = true;
    clearInterval(this.alertInterval);
    clearInterval(this.walkInterval);
    this.walking = false;
    let i = 0;

    let hurtInterval = setInterval(() => {
      i = this.updateHurtAnimation(i);
    }, 100);

    setTimeout(() => {
      this.endHurtAnimation(hurtInterval);
    }, 1000);
  }

  /**
   * Ends the hurt animation sequence and resumes walking if the character is not defeated.
   *
   * This method:
   * - Clears the interval controlling the hurt animation.
   * - Resets the `isHurt` flag to `false`.
   * - If the character is still alive (`!this.defeated`), it calls `startWalking()` to resume movement.
   *
   * @method endHurtAnimation
   * @param {number} hurtInterval - The interval ID controlling the hurt animation.
   */
  endHurtAnimation(hurtInterval) {
    clearInterval(hurtInterval);
    this.isHurt = false;

    if (!this.defeated) {
      this.startWalking();
    }
  }

  /**
   * Updates the hurt animation frame for the character.
   *
   * This method:
   * - Plays the hurt sound effect at reduced volume.
   * - Sets the character's image to the current frame in the hurt animation sequence.
   * - Increments the frame index `i` to proceed to the next frame.
   * - Loops back to the first frame if the end of the animation sequence is reached.
   *
   * @method updateHurtAnimation
   * @param {number} i - The current frame index.
   * @returns {number} The updated frame index for the next call.
   */
  updateHurtAnimation(i) {
    if (i < this.IMAGES_HURT.length) {
      sounds.endbossHurt.volume = 0.1;
      sounds.endbossHurt.play();
      let path = this.IMAGES_HURT[i];
      this.img = this.imageCache[path];
      i++;
    } else {
      i = 0;
    }
    return i;
  }

  /**
   * Starts the walking behavior and associated music for the character.
   *
   * This method:
   * - Returns early if the character is already defeated or currently walking.
   * - Starts the endboss music playback.
   * - Sets the `walking` flag to true.
   * - Initiates a frequent interval (`walkInterval`) that calls `updateWalkingBehavior()`
   *   approximately every 0.083 milliseconds (10/120 ms).
   *
   * @method startWalking
   */
  startWalking() {
    if (this.defeated || this.walking) return;

    this.startEndbossMusic();
    this.walking = true;
    this.walkInterval = setInterval(() => {
      this.updateWalkingBehavior();
    }, 10 / 120);
  }

  /**
   * Updates the walking behavior of the character.
   *
   * This method:
   * - Moves the character left and plays the walking animation if the character:
   *   - Is not defeated,
   *   - The main character (`world.character`) is not dead,
   *   - Is not currently hurt.
   * - If any of these conditions fail, it stops the walking interval and resets the walking flag.
   *
   * @method updateWalkingBehavior
   */
  updateWalkingBehavior() {
    if (!this.defeated && !world.character.isDead() && !this.isHurt) {
      this.moveLeft();
      this.playAnimation(this.IMAGES_WALK);
    } else {
      clearInterval(this.walkInterval);
      this.walking = false;
    }
  }

  /**
   * Starts the endboss theme music with looping enabled and reduced volume.
   *
   * This method:
   * - Enables looping for the `endbossTime` sound.
   * - Sets its volume to 10%.
   * - Plays the endboss music.
   * - Pauses the main background music (`sounds.main`).
   *
   * @method startEndbossMusic
   */
  startEndbossMusic() {
    sounds.endbossTime.loop = true;
    sounds.endbossTime.volume = 0.1;
    sounds.endbossTime.play();
    sounds.main.pause();
  }
}
