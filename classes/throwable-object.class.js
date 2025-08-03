class ThrowableObject extends MovableObject {
  width = 60;
  height = 60;
  speedY = 30;
  rotationAnimationPlayed = false;
  splashAnimationPlayed = false;
  groundLevel = 380.5;
  hasExploded = false;
  onSplash = null;

  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable object at the specified position.
   *
   * This constructor:
   * - Calls the parent constructor and loads the initial rotation image (`IMAGES_ROTATION[0]`).
   * - Preloads the full rotation and splash animation image sets.
   * - Sets the initial position (`x`, `y`) where the object is created.
   * - Initiates the throwing behavior with `throw()`.
   * - Starts the animation loop via `animate()`.
   *
   * @constructor
   * @param {number} x - The horizontal starting position.
   * @param {number} y - The vertical starting position.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
    this.animate();
  }

  /**
   * Initiates the throw action by setting upward speed, applying gravity,
   * and moving the object horizontally over time.
   *
   * This method:
   * - Sets the vertical speed (`speedY`) to 30 for an upward throw.
   * - Calls `applyGravity()` to simulate falling physics.
   * - Starts an interval (`throwInterval`) that moves the object 10 units to the right every 25 milliseconds.
   *
   * @method throw
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      this.x += 10;
    }, 25);
  }

  /**
   * Starts the animation loop for the throw rotation.
   *
   * This method:
   * - Initializes a frame index `i` at 0.
   * - Sets up an interval (`animationInterval`) that runs every 100 milliseconds.
   * - Calls `animateThrowRotation(i)` on each interval, updating and returning the new frame index.
   *
   * @method animate
   */
  animate() {
    let i = 0;
    this.animationInterval = setInterval(() => {
      i = this.animateThrowRotation(i);
    }, 100);
  }

  /**
   * Animates the rotation of the thrown object while in the air,
   * and triggers splash animation and sound upon hitting the ground.
   *
   * This method:
   * - Updates the current image frame based on rotation images while the object is above the ground.
   * - Plays the throw bottle sound during rotation animation.
   * - When the object reaches or passes the ground level and the splash animation
   *   hasn't played yet, it triggers the splash animation and broken bottle sound.
   * - Returns the updated frame index for the next animation step.
   *
   * @method animateThrowRotation
   * @param {number} i - The current frame index for rotation animation.
   * @returns {number} The updated frame index for the next call.
   */
  animateThrowRotation(i) {
    if (this.y < this.groundLevel) {
      let path = this.IMAGES_ROTATION[i % this.IMAGES_ROTATION.length];
      this.img = this.imageCache[path];
      i++;
      this.playThrowBottleSound();
    }
    if (this.y >= this.groundLevel && !this.splashAnimationPlayed) {
      this.playSplashAnimation();
      this.playBrokenBottleSound();
    }
    return i;
  }

  /**
   * Plays the sound effect for a broken bottle at reduced volume.
   *
   * This method sets the volume of the `brokenBottle` sound to 10% and plays it.
   *
   * @method playBrokenBottleSound
   */
  playBrokenBottleSound() {
    sounds.brokenBottle.volume = 0.1;
    sounds.brokenBottle.play();
  }

  /**
   * Plays the sound effect for throwing a bottle at reduced volume.
   *
   * This method sets the volume of the `throwBottle` sound to 10% and plays it.
   *
   * @method playThrowBottleSound
   */
  playThrowBottleSound() {
    sounds.throwBottle.volume = 0.1;
    sounds.throwBottle.play();
  }

  /**
   * Initiates the splash animation sequence for a throwable object.
   *
   * This method clears all active movement and animation intervals related to the object,
   * then optionally sets the object's Y-position to its ground level unless
   * `skipGroundAdjustment` is set to `true`. It begins a new splash animation loop
   * that cycles through splash images using `updateSplashAnimation()`.
   *
   * @param {boolean} [skipGroundAdjustment=false] - If `true`, the object will not be snapped to the ground before playing the splash.
   *
   * @method playSplashAnimation
   */
  playSplashAnimation(skipGroundAdjustment = false) {
    this.splashAnimationPlayed = true;

    clearInterval(this.throwInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);

    if (!skipGroundAdjustment) {
      this.y = this.groundLevel;
    }

    let i = 0;
    let splashInterval = setInterval(() => {
      i = this.updateSplashAnimation(i, splashInterval);
    }, 10);
  }

  /**
   * Updates the splash animation frame-by-frame.
   *
   * This function is called repeatedly in an interval loop until all splash images
   * have been displayed. Once the final image is shown, it clears the animation interval,
   * removes the bottle from view by setting its position off-screen, and calls
   * the optional `onSplash()` callback if defined (used to signal that a splash has finished).
   *
   * @param {number} i - Current index of the splash animation frame.
   * @param {number} splashInterval - The interval ID used for clearing the animation loop.
   * @returns {number} - The updated index for the next animation frame.
   *
   * @method updateSplashAnimation
   */
  updateSplashAnimation(i, splashInterval) {
    if (i < this.IMAGES_SPLASH.length) {
      let path = this.IMAGES_SPLASH[i];
      this.img = this.imageCache[path];
      i++;
    } else {
      clearInterval(splashInterval);
      this.x = -9999;
      this.y = -9999;
      if (this.onSplash) {
        this.onSplash();
      }
    }
    return i;
  }

  /**
   * Triggers the explosion animation of the bottle at its current position.
   *
   * This method is used when the bottle collides with an enemy or the endboss,
   * causing an immediate explosion without resetting the `groundLevel`.
   * Internally, it delegates to `playSplashAnimation(true)` to prevent
   * repositioning the bottle.
   *
   * @method explodeAt
   */
  explodeAt() {
    this.playSplashAnimation(true); // kein groundLevel setzen
  }
}
