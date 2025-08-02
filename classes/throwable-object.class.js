class ThrowableObject extends MovableObject {
  width = 60;
  height = 60;
  speedY = 30;
  rotationAnimationPlayed = false;
  splashAnimationPlayed = false;
  groundLevel = 380.5;
  hasExploded = false;

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
   * Plays the splash animation sequence when the thrown object hits the ground.
   *
   * This method:
   * - Sets the flag `splashAnimationPlayed` to true to prevent re-triggering.
   * - Clears ongoing intervals related to throwing, animation, and gravity.
   * - Sets the vertical position `y` to the ground level.
   * - Starts a rapid interval (`splashInterval`) that updates splash animation frames every 10ms.
   * - Uses `updateSplashAnimation(i, splashInterval)` to advance the animation frames.
   *
   * @method playSplashAnimation
   */
  playSplashAnimation() {
    this.splashAnimationPlayed = true;

    clearInterval(this.throwInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);

    this.y = this.groundLevel;
    let i = 0;
    let splashInterval = setInterval(() => {
      i = this.updateSplashAnimation(i, splashInterval);
    }, 10);
  }

  /**
   * Updates the splash animation frame for the thrown object.
   *
   * This method:
   * - Sets the current image frame from the splash images based on index `i`.
   * - Increments the frame index `i`.
   * - Clears the animation interval and moves the object off-screen when the animation completes.
   *
   * @method updateSplashAnimation
   * @param {number} i - The current frame index of the splash animation.
   * @param {number} splashInterval - The interval ID controlling the splash animation loop.
   * @returns {number} The updated frame index for the next animation step.
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
    }
    return i;
  }
}
