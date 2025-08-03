class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBarHealth();
  StatusBarBottles = new StatusBarBottles();
  StatusBarCoin = new StatusBarCoin();
  StatusBarEndbossHealth = new StatusBarEndbossHealth();
  collectedBottles = [];
  throwableObjects = [];
  collectedCoins = [];
  canThrowBottle = true;

  /**
   * Creates a new instance of the game world.
   *
   * Initializes the rendering context, canvas reference, keyboard input,
   * generates random bottle objects, starts the drawing process, and sets up
   * the game world and its update loop.
   *
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element used to render the game.
   * @param {object} keyboard - The object that tracks user input via keyboard.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level.bottles = this.generateRandomBottles(11);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Assigns the current world instance to the character.
   *
   * This allows the character to reference and interact with the world context,
   * enabling features like camera tracking, environment awareness, or physics interactions.
   *
   * @method setWorld
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the game logic loop.
   *
   * This method runs a repeating interval that:
   * - Checks for collisions between objects (e.g., character and enemies or items).
   * - Monitors user input to trigger throwing objects.
   *
   * The loop runs every 200 milliseconds.
   *
   * @method run
   */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  /**
   * Checks whether the player can throw a bottle and handles the throw action.
   *
   * Conditions for throwing:
   * - The `UP` key is pressed.
   * - The player has at least one bottle collected.
   * - No other bottle is currently in flight (`canThrowBottle` is `true`).
   *
   * When conditions are met:
   * - A bottle is removed from the inventory.
   * - A new `ThrowableObject` is instantiated and thrown from the character’s position.
   * - The `onSplash` callback is assigned to re-enable bottle throwing after the splash animation.
   * - The bottle is added to the `throwableObjects` array.
   * - The UI bottle status bar is updated.
   *
   * @method checkThrowObjects
   */
  checkThrowObjects() {
    if (this.keyboard.UP && this.collectedBottles.length > 0 && this.canThrowBottle) {
      this.canThrowBottle = false;
      this.collectedBottles.pop();
      let thrownBottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );

      thrownBottle.onSplash = () => {
        this.canThrowBottle = true;};
      this.throwableObjects.push(thrownBottle);
      this.StatusBarBottles.setPercentage(this.collectedBottles.length * 20);
    }
  }

  /**
   * Renders the current game frame by drawing all visible objects and UI elements.
   *
   * This method:
   * - Clears the canvas for a fresh frame.
   * - Translates the camera for side-scrolling effect.
   * - Renders all game objects (backgrounds, enemies, items, etc.).
   * - Resets the camera translation.
   * - Renders status bars (e.g., health, bottles, coins).
   * - Draws the main character with camera adjustment.
   * - Schedules the next animation frame.
   *
   * @method draw
   */
  draw() {
    let self = this;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.renderAllObjects();
    this.ctx.translate(-this.camera_x, 0);

    this.renderStatusBars();

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.scheduleNextFrame(self);
  }

  /**
   * Schedules the next frame to be drawn using `requestAnimationFrame`.
   *
   * This creates a continuous animation loop by recursively calling `draw()`
   * on the provided game context (`self`), ensuring smooth rendering at optimal frame rates.
   *
   * @param {Object} self - The context (typically the game instance) on which to call `draw()`.
   */
  scheduleNextFrame(self) {
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Renders all status bars on the canvas by adding them to the map.
   *
   * This includes:
   * - Health bar of the character
   * - Bottle collection status bar
   * - Coin collection status bar
   * - Endboss health bar
   *
   * Uses `addToMap()` to draw each status bar in the correct rendering order.
   */
  renderStatusBars() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.StatusBarBottles);
    this.addToMap(this.StatusBarCoin);
    this.addToMap(this.StatusBarEndbossHealth);
  }

  /**
   * Renders all game objects onto the canvas in the correct visual order.
   *
   * The objects are added in layers to ensure proper depth perception:
   * 1. Background objects
   * 2. Throwable objects (e.g. bottles in motion)
   * 3. Clouds
   * 4. Bottles on the ground
   * 5. Coins
   * 6. Enemies
   *
   * Uses `addObjectsToMap()` to draw each group of objects.
   *
   * @function renderAllObjects
   */
  renderAllObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   * Adds a list of game objects to the canvas map for rendering.
   *
   * Iterates over the given array of objects and adds each one to the map,
   * unless the object has the `collected` flag set to `true`. This is useful
   * for filtering out items like collected coins or bottles that should no longer be displayed.
   *
   * @function addObjectsToMap
   * @param {Object[]} objects - Array of game objects to be rendered.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (!o.collected) {
        this.addToMap(o);
      }
    });
  }

  /**
   * Renders a movable object (`mo`) onto the canvas context, handling its direction.
   *
   * If the object is facing the opposite direction (`otherDirection` is `true`),
   * it flips the image horizontally before drawing and then flips it back afterward
   * to maintain correct rendering orientation.
   *
   * @function addToMap
   * @param {Object} mo - The movable object to render, must implement a `draw(ctx)` method and optionally have an `otherDirection` property.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the rendering context horizontally to draw the object (`mo`) mirrored.
   *
   * This is useful when an object should face the opposite direction (e.g., moving left).
   * The transformation affects the canvas, so the object's `x` coordinate is also negated.
   * `ctx.save()` is called to preserve the original context state.
   *
   * @function flipImage
   * @param {Object} mo - The movable object to flip. Must have `x` and `width` properties.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas rendering context to its previous state
   * and reverts the horizontal flip of the object's `x` coordinate.
   *
   * This method should always be called after `flipImage()` to avoid
   * unwanted transformations on subsequent drawings.
   *
   * @function flipImageBack
   * @param {Object} mo - The movable object that was previously flipped.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Generates an array of bottle objects positioned at a fixed vertical position.
   *
   * This function creates a specified number of `Bottle` instances and
   * returns them in an array. Each bottle is placed at the y-coordinate `370`.
   *
   * @function generateRandomBottles
   * @param {number} count - The number of bottle objects to generate.
   * @returns {Bottle[]} An array of generated bottle objects.
   */
  generateRandomBottles(count) {
    let bottles = [];
    for (let i = 0; i < count; i++) {
      bottles.push(new Bottle(370));
    }
    return bottles;
  }

  /**
   * Checks all relevant collision interactions in the game.
   *
   * This includes:
   * - Character vs. regular enemies
   * - Character vs. endboss
   * - Thrown bottles vs. enemies
   * - Character collecting bottles
   * - Character collecting coins
   * - Triggering endboss activation when conditions are met
   *
   * Also filters out enemies that have been marked as collected (i.e., defeated).
   *
   * @function checkCollisions
   */
  checkCollisions() {
    this.checkCharacterEnemyCollisions();
    this.checkCharacterEndbossCollision();
    this.checkBottleEnemyCollisions();
    this.collectBottles();
    this.collectCoins();
    this.checkEndbossActivation();

    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.collected);
  }

  /**
   * Checks for collisions between the character and each enemy in the level.
   *
   * - If the character is above the enemy and falling, the enemy dies and the character bounces.
   * - Otherwise, the character takes damage.
   * - If the character’s energy reaches 0, the death animation is triggered.
   *
   * This function also updates the health status bar after damage.
   *
   * @function checkCharacterEnemyCollisions
   */
  checkCharacterEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        let isAbove = this.character.isAbove(enemy);
        if (isAbove) {
          enemy.die();
          this.character.speedY = 10;
        } else {
          this.character.hit();
          this.statusBarHealth.setPercentage(this.character.energy);
          if (this.character.isDead()) {
            this.character.playDeathAnimation();
          }
        }
      }
    });
  }

  /**
   * Checks if the character collides with the Endboss.
   *
   * - If a collision is detected, the character takes damage.
   * - The health status bar is updated accordingly.
   * - If the character’s energy falls to 0, the death animation is triggered.
   *
   * This function assumes the Endboss is a subclass of the enemy class.
   *
   * @function checkCharacterEndbossCollision
   */
  checkCharacterEndbossCollision() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && this.character.isColliding(endboss)) {
      this.character.hit();
      this.statusBarHealth.setPercentage(this.character.energy);
      if (this.character.isDead()) {
        this.character.playDeathAnimation();
      }
    }
  }

  /**
   * Checks for collisions between thrown bottles and enemies, including the endboss.
   *
   * This method iterates through all active throwable objects and:
   * - If a bottle collides with the endboss, delegates handling to `handleEndbossHit`.
   * - Otherwise, checks for collisions with all regular enemies and calls `handleBottleEnemyCollision`.
   *
   * It ensures that each bottle is evaluated once per frame and properly applies effects
   * such as reducing health, triggering animations, and removing defeated enemies.
   *
   * @method checkBottleEnemyCollisions
   */
  checkBottleEnemyCollisions() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      let bottle = this.throwableObjects[i];

      if (endboss && bottle.isColliding(endboss)) {
        this.handleEndbossHit(endboss, bottle);
        continue;
      }
      this.level.enemies.forEach((enemy) => {
        this.handleBottleEnemyCollision(enemy, bottle);
      });
    }
  }

  /**
   * Handles the impact of a thrown bottle on the endboss.
   *
   * This method performs the following actions:
   * - Reduces the endboss's energy by 20 points.
   * - Updates the endboss health bar UI accordingly.
   * - Triggers appropriate animations or end sequence based on the endboss's remaining health.
   * - Triggers the splash explosion of the bottle at the point of contact.
   * - Calls the `onSplash` callback if it exists to notify other systems (e.g., to re-enable throwing).
   *
   * @param {Endboss} endboss - The endboss object being hit.
   * @param {ThrowableObject} bottle - The thrown bottle that collided with the endboss.
   *
   * @method handleEndbossHit
   */
  handleEndbossHit(endboss, bottle) {
    endboss.energy -= 20;
    this.updateEndbossHealthUI(endboss);
    this.checkAndAnimateEndboss(endboss);
    bottle.explodeAt();
    if (bottle.onSplash) {
      bottle.onSplash();
    }
  }

  /**
   * Updates the Endboss's health bar UI based on current energy level.
   *
   * - Ensures the Endboss’s energy does not drop below 0.
   * - Updates the `StatusBarEndbossHealth` to reflect the current energy.
   *
   * @param {Endboss} endboss - The Endboss object whose energy is being updated.
   */
  updateEndbossHealthUI(endboss) {
    if (endboss.energy < 0) endboss.energy = 0;
    this.StatusBarEndbossHealth.setPercentage(endboss.energy);
  }

  /**
   * Checks the Endboss's current energy and triggers the appropriate animation.
   *
   * - If the Endboss's energy is 0 or less and not already defeated, it triggers the death animation.
   * - Otherwise, it triggers the hurt animation.
   *
   * @param {Endboss} endboss - The Endboss object to check and animate.
   */
  checkAndAnimateEndboss(endboss) {
    if (endboss.energy <= 0 && !endboss.defeated) {
      endboss.playDeathAnimation();
    } else {
      endboss.showHurtAnimation();
    }
  }

  /**
   * Handles the collision between a thrown bottle and a regular enemy.
   *
   * If the enemy is still alive and the bottle collides with it:
   * - The enemy is marked as dead and its death animation is triggered.
   * - The bottle triggers its splash explosion using `explodeAt()`.
   * - If an `onSplash` callback is defined on the bottle, it is executed (e.g., to re-enable bottle throwing).
   *
   * @param {MovableObject} enemy - The enemy that may collide with the bottle.
   * @param {ThrowableObject} bottle - The thrown bottle potentially colliding with the enemy.
   *
   * @method handleBottleEnemyCollision
   */
  handleBottleEnemyCollision(enemy, bottle) {
    if (!enemy.isDead && bottle.isColliding(enemy)) {
      enemy.die();

      bottle.explodeAt(); // 💥 neue Methode nutzen

      if (bottle.onSplash) {
        bottle.onSplash();
      }
    }
  }

  /**
   * Checks for collisions between the character and bottles in the level.
   *
   * If a bottle is not already collected and the character collides with it,
   * and the collected bottle count is less than 5, the bottle is added to the
   * collectedBottles array, marked as collected, a sound is played, and the
   * status bar is updated to reflect the new count.
   */
  collectBottles() {
    for (let i = 0; i < this.level.bottles.length; i++) {
      let bottle = this.level.bottles[i];
      if (
        !bottle.collected &&
        this.character.isColliding(bottle) &&
        this.collectedBottles.length < 5
      ) {
        this.playCollectBottleSound();
        this.collectedBottles.push(bottle);
        bottle.collected = true;
        this.StatusBarBottles.setPercentage(this.collectedBottles.length * 20);
      }
    }
  }

  /**
   * Plays the sound effect for collecting a bottle.
   *
   * The sound is played at a volume of 0.5 using the `collectBottle2` audio object.
   */
  playCollectBottleSound() {
    sounds.collectBottle2.play();
    sounds.collectBottle2.volume = 0.5;
  }

  /**
   * Checks for collisions between the character and coins.
   *
   * If a coin is collected:
   * - Plays a coin sound.
   * - Adds the coin to the `collectedCoins` array.
   * - Marks the coin as collected.
   * - Updates the coin status bar to reflect collection progress.
   */
  collectCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      let coin = this.level.coins[i];
      if (!coin.collected && this.character.isColliding(coin)) {
        sounds.coin.volume = 0.1;
        sounds.coin.play();
        this.collectedCoins.push(coin);
        coin.collected = true;
        this.StatusBarCoin.setPercentage(this.collectedCoins.length * 20);
      }
    }
  }

  /**
   * Checks if the character has reached the trigger point to activate the Endboss.
   *
   * If the character's x-position is beyond 2500 and the Endboss is not yet activated:
   * - Calls the `activate()` method on the Endboss.
   * - Sets the Endboss's `activated` flag to true to prevent reactivation.
   */
  checkEndbossActivation() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && this.character.x > 2500 && !endboss.activated) {
      endboss.activate();
      endboss.activated = true;
    }
  }
}
