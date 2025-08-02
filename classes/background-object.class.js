class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Constructs a new background object and positions it at the bottom of the canvas.
   *
   * Loads the image using `loadImage()` from the parent `MovableObject` class,
   * sets the horizontal position (`x`), and calculates the vertical position (`y`)
   * so the object aligns with the bottom edge of a 480px tall canvas.
   *
   * @constructor
   * @param {string} imagePath - The path to the image file used for the background.
   * @param {number} x - The horizontal position where the background should be placed.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
