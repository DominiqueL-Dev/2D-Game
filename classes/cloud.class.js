class Cloud extends MovableObject {
  y = 20;
  width = 400;
  height = 205;

  IMAGES_CLOUDS = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * Initializes a cloud object with randomized position and movement speed.
   *
   * This constructor:
   * - Loads the initial cloud image and preloads the full cloud animation set (`IMAGES_CLOUDS`).
   * - Sets a random horizontal position between `0` and `2000`.
   * - Assigns a random speed between `0.15` and `0.4` for slow parallax-style movement.
   * - Starts the cloud's animation loop via `animate()`.
   *
   * Assumes `IMAGES_CLOUDS` is defined on the instance or its prototype.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_CLOUDS[0]);
    this.loadImages(this.IMAGES_CLOUDS);
    this.x = 0 + Math.random() * 2000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Starts the animation loop for the object (e.g., a cloud), causing it to move left continuously.
   *
   * This method:
   * - Moves the object to the left at a fixed interval (~60 FPS).
   * - If the object moves completely out of view on the left side (i.e., offscreen),
   *   it resets its `x` position to a new random value far to the right, creating a looping effect.
   *
   * Useful for background elements like clouds in parallax scrolling.
   *
   * @method animate
   */
  animate() {
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = 700 + Math.random() * 1700; // neue Position weit rechts
      }
    }, 1000 / 60);
  }
}
