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
}
