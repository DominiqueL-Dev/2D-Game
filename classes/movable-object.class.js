class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2.5;
  otherDirection = false;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object by updating its vertical position over time.
   *
   * This method:
   * - Sets up an interval running at 25 frames per second (every 40ms).
   * - Updates the vertical position (`y`) based on the current vertical speed (`speedY`).
   * - Decreases the vertical speed by the acceleration due to gravity each tick.
   * - Prevents the object from falling below a ground level (`y = 132.5`), unless it is a `ThrowableObject`.
   * - Resets vertical speed to zero when the object hits the ground.
   *
   * @method applyGravity
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (!(this instanceof ThrowableObject) && this.y >= 132.5) {
        this.y = 132.5;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is currently above the ground level.
   *
   * This method:
   * - Always returns `true` for instances of `ThrowableObject` (e.g., items that can be thrown/fly).
   * - For other objects, returns `true` if the vertical position (`y`) is less than 132.5,
   *   indicating the object is above ground level.
   *
   * @method isAboveGround
   * @returns {boolean} `true` if the object is above ground or is a throwable; otherwise `false`.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 132.5;
    }
  }

  /**
   * Checks whether this object is colliding with another movable object, considering
   * individual collision offsets for both objects.
   *
   * Collision detection uses axis-aligned bounding boxes (AABB) and includes offset
   * margins for finer control of hitbox precision. Offsets are retrieved via
   * `getCollisionOffset()` for both objects.
   *
   * The method returns `true` if the bounding boxes of both objects overlap,
   * indicating a collision.
   *
   * @method isColliding
   * @param {MovableObject} mo - The other object to check collision against.
   * @returns {boolean} `true` if this object collides with `mo`, otherwise `false`.
   */
  isColliding(mo) {
    let offsetThis = this.getCollisionOffset();
    let offsetOther = mo.getCollisionOffset();

    return (
      this.x + offsetThis.left + this.width - offsetThis.right > mo.x + offsetOther.left && 
      this.y + offsetThis.top + this.height - offsetThis.bottom > mo.y + offsetOther.top && 
      this.x + offsetThis.left < mo.x + offsetOther.left + mo.width - offsetOther.right &&
      this.y + offsetThis.top < mo.y + offsetOther.top + mo.height - offsetOther.bottom);
  }

  /**
   * Reduces the object's energy when it takes a hit and updates the last hit timestamp.
   *
   * This method:
   * - Decreases `energy` by 5 points.
   * - Ensures `energy` does not drop below zero.
   * - Updates `lastHit` with the current timestamp if the object still has energy remaining.
   *
   * @method hit
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Determines whether the object is currently in a hurt state.
   *
   * This method:
   * - Calculates the time passed since the last hit in seconds.
   * - Returns `true` if less than 1 second has elapsed since the last hit,
   *   indicating the object is still hurt.
   * - Returns `false` otherwise.
   *
   * @method isHurt
   * @returns {boolean} `true` if the object was hit within the last second, else `false`.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks whether the object is dead based on its energy level.
   *
   * This method returns `true` if the object's energy is exactly zero, indicating death.
   * Otherwise, it returns `false`.
   *
   * @method isDead
   * @returns {boolean} `true` if energy is zero, otherwise `false`.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Updates the current image of the object to the next frame in the provided animation sequence.
   *
   * This method:
   * - Calculates the frame index using modulo to loop through the `images` array.
   * - Sets the object's `img` property to the cached image at the current frame.
   * - Increments the `currentImage` index for the next animation step.
   *
   * @method playAnimation
   * @param {string[]} images - Array of image paths representing animation frames.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right by increasing its x-coordinate based on its speed.
   *
   * @method moveRight
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by decreasing its x-coordinate based on its speed.
   *
   * @method moveLeft
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Initiates a jump by setting the vertical speed to a positive value.
   *
   * This method sets the vertical speed (`speedY`) to 25, which causes the object
   * to move upward on the next physics update.
   *
   * @method jump
   */
  jump() {
    this.speedY = 25;
  }
}
