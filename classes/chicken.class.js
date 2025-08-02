class Chicken extends MovableObject {
  y = 360;
  height = 70;
  width = 70;
  isDead = false;
  
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Initializes a new instance of an animated walking object (e.g. an enemy or NPC).
   *
   * This constructor:
   * - Loads the initial walking frame and preloads all walking animation images.
   * - Sets a random horizontal start position (`x`) between 500 and 2300.
   * - Assigns a random movement speed between 0.15 and 0.6.
   * - Starts the walking animation by calling `this.animate()`.
   *
   * Assumes `IMAGES_WALKING` is defined in the class or inherited.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);

    this.x = 500 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.45;

    this.animate();
  }

  /**
   * Starts the movement and animation loop for the character once the game begins.
   *
   * This method:
   * - Waits until `gameStarted` is `true` (checked every 100ms).
   * - Once the game has started:
   *   - Starts a movement loop (`walkInterval`) that moves the character left at ~60 FPS.
   *   - Starts an animation loop (`animationInterval`) that plays walking frames every 200ms.
   * - Both loops stop updating if the character is marked as dead (`this.isDead === true`).
   *
   * The interval IDs are stored on the instance for potential cleanup later.
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
            this.playAnimation(this.IMAGES_WALKING);
          }
        }, 200);
      }
    }, 100);
  }

  /**
   * Handles the death behavior of the character or enemy.
   *
   * This method:
   * - Sets the `isDead` flag to `true`, preventing further movement or animation.
   * - Loads the first frame of the death animation (`IMAGES_DEAD[0]`).
   * - Plays the "squeeze" death sound at reduced volume.
   * - After a short delay (500ms), sets `collected = true` — useful for removal or collection logic.
   *
   * @method die
   */
  die() {
    this.isDead = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    sounds.squeeze.volume = 0.1;
    sounds.squeeze.play();

    setTimeout(() => {
      this.collected = true;
    }, 500);
  }
}
