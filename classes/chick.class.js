class Chick extends MovableObject {
  y = 379;
  height = 50;
  width = 50;
  isDead = false;

  IMAGES_CHICK_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_CHICK_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Initializes a new instance of a chick enemy with randomized position and speed.
   *
   * - Loads the initial walking image and all walking animation frames.
   * - Places the chick at a random horizontal position between 500 and 2300 pixels.
   * - Assigns a random walking speed between 0.5 and 1.1.
   * - Starts the walking animation automatically after initialization.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_CHICK_WALKING[0]);
    this.loadImages(this.IMAGES_CHICK_WALKING);

    this.x = 500 + Math.random() * 1800;
    this.speed = 0.5 + Math.random() * 0.6;

    this.animate();
  }

  /**
   * Starts the chick's walking behavior and animation once the game has started.
   *
   * This method uses a polling interval to wait until the `gameStarted` flag is true.
   * Once the game begins:
   *
   * - It clears the waiting interval.
   * - Starts moving the chick left continuously at 60 FPS unless it is marked as dead.
   * - Starts playing the walking animation every 200 ms (5 FPS) unless it is dead.
   *
   * The movement and animation intervals are stored for potential later clearing.
   *
   * @method animate
   */
  animate() {
    let waitUntilGameStarts = setInterval(() => {
      if (gameStarted) {
        clearInterval(waitUntilGameStarts);
        this.walkInterval = setInterval(() => {
          if (!this.isDead) {
            this.moveLeft();
          }
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
          if (!this.isDead) {
            this.playAnimation(this.IMAGES_CHICK_WALKING);
          }
        }, 200);
      }
    }, 100);
  }

  /**
   * Triggers the chick's death behavior.
   *
   * When this method is called:
   * - The `isDead` flag is set to `true` to stop further movement or animation.
   * - The first frame of the chick's dead image is loaded and shown.
   * - A "squeeze" sound is played at low volume (0.1).
   * - After a short delay (500 ms), the chick is marked as `collected`, allowing it
   *   to be removed from the level or ignored during rendering.
   *
   * @method die
   */
  die() {
    this.isDead = true;
    this.loadImage(this.IMAGES_CHICK_DEAD[0]);
    sounds.squeeze.volume = 0.1;
    sounds.squeeze.play();

    setTimeout(() => {
      this.collected = true;
    }, 500);
  }
}
