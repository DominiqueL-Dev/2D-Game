class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image and assigns it to the object's `img` property.
   *
   * This method:
   * - Creates a new `Image` object.
   * - Sets its `src` to the provided `path`.
   * - Stores the image in `this.img` for rendering.
   *
   * Typically used to load a default or initial image for game entities.
   *
   * @method loadImage
   * @param {string} path - The file path to the image resource.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image of the object onto the canvas.
   *
   * This method uses the 2D rendering context to render the image (`this.img`) at the object's
   * current position (`this.x`, `this.y`) and with its defined size (`this.width`, `this.height`).
   *
   * @method draw
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas to draw on.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preloads multiple images and stores them in the object's image cache.
   *
   * This method:
   * - Iterates over an array of image file paths.
   * - Creates an `Image` object for each path and sets its `src`.
   * - Caches each image in `this.imageCache` using the path as the key.
   *
   * Useful for loading animation frames or sprite sets in advance.
   *
   * @method loadImages
   * @param {string[]} arr - Array of image paths to be loaded and cached.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Returns the collision offset values for different object types.
   *
   * This method customizes the bounding box used in collision detection
   * based on the instance type of the object. Each object type may require
   * different padding around its image for accurate collision handling.
   *
   * The returned offset object includes adjustments for the top, right,
   * bottom, and left sides of the object.
   *
   * @returns {{top: number, right: number, bottom: number, left: number}} An object with offset values for each side.
   *
   * @method getCollisionOffset
   */
  getCollisionOffset() {
    if (this instanceof Character) {
      return { top: 0, right: 50, bottom: 0, left: 30 };
    } else if (this instanceof Chicken) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    } else if (this instanceof Endboss) {
      return { top: 0, right: 40, bottom: 0, left: 30 };
    } else if (this instanceof Chick) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    } else if (this instanceof Bottle) {
      return { top: 0, right: 100, bottom: 10, left: 25 };
    } else if (this instanceof Coins) {
      return { top: 0, right: 100, bottom: 10, left: 25 };
    } else {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
  }
}
