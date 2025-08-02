class Bottle extends MovableObject {
  width = 70;
  height = 70;

  IMAGES_GROUNDBOTTLES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new instance of a ground bottle and initializes its position and animation.
   *
   * The bottle is placed at a random `x` coordinate within the range [250, 1650],
   * fixed vertically at `y = 370`, and marked as uncollected. It loads the initial image,
   * prepares animation frames, and starts animating.
   *
   * @constructor
   * @param {number} y - (Unused) Vertical coordinate passed to constructor (may be used in future or inherited logic).
   */
  constructor(y) {
    super();
    this.x = 250 + Math.random() * 1400;
    this.y = 370;
    this.collected = false;

    this.loadImage(this.IMAGES_GROUNDBOTTLES[0]);
    this.loadImages(this.IMAGES_GROUNDBOTTLES);
    this.animate();
  }

  /**
   * Starts the bottle animation by looping through `IMAGES_GROUNDBOTTLES`.
   *
   * Calls `playAnimation()` every 250ms to update the bottle's frame,
   * giving the appearance of subtle movement on the ground.
   *
   * @method animate
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_GROUNDBOTTLES);
    }, 250);
  }
}
