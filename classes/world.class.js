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
   * Initializes the game world by setting up the canvas context, keyboard controls,
   * and randomly generating bottles for the level. Also starts the main game loop.
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering the game.
   * @param {Object} keyboard - An object representing the current state of keyboard inputs.
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
   * Assigns the current world instance to the character for world interaction.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts a recurring game loop that checks for collisions and throwable object actions every 200ms.
   */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  /**
   * Handles the logic for throwing a bottle when the UP key is pressed,
   * with additional checks to ensure the character is facing right and not moving left.
   * Updates the throwable objects list and the bottle status bar,
   * and enforces a cooldown until the bottle splash animation completes.
   */
  checkThrowObjects() {
    if (
      this.keyboard.UP &&
      this.collectedBottles.length > 0 &&
      this.canThrowBottle &&
      !this.keyboard.LEFT &&
      !this.character.otherDirection
    ) {
      this.canThrowBottle = false;
      this.collectedBottles.pop();
      let thrownBottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      thrownBottle.onSplash = () => {
        this.canThrowBottle = true;
      };
      this.throwableObjects.push(thrownBottle);
      this.StatusBarBottles.setPercentage(this.collectedBottles.length * 20);
    }
  }

  /**
   * Clears the canvas and renders all game elements, including background objects,
   * status bars, and the main character. Schedules the next animation frame.
   */
  draw() {
    let self = this;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.renderAllObjects();
    this.ctx.translate(-this.camera_x, 0);

    this.renderStatusBars();
    this.scheduleNextFrame(self);
  }

  /**
   * Schedules the next frame of the game loop using requestAnimationFrame
   * to continuously render the game.
   *
   * @param {Object} self - Reference to the current instance for maintaining context.
   */
  scheduleNextFrame(self) {
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Renders all status bars (health, bottles, coins, endboss health) onto the canvas.
   */
  renderStatusBars() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.StatusBarBottles);
    this.addToMap(this.StatusBarCoin);
    this.addToMap(this.StatusBarEndbossHealth);
  }

  /**
   * Renders all game objects from the current level onto the canvas,
   * including background elements, clouds, collectibles, enemies, and throwable objects.
   */
  renderAllObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
  }

  /**
   * Adds a list of objects to the canvas, skipping any that have already been collected.
   *
   * @param {Object[]} objects - An array of game objects to render.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (!o.collected) {
        this.addToMap(o);
      }
    });
  }

  /**
   * Draws a single game object on the canvas, flipping its image if it's facing the opposite direction.
   *
   * @param {Object} mo - The movable game object to be drawn.
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
   * Flips the given object's image horizontally by modifying the canvas transformation.
   *
   * @param {Object} mo - The game object whose image should be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the object's original orientation and resets the canvas transformation after flipping.
   *
   * @param {Object} mo - The game object to revert after a horizontal flip.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Generates a specified number of bottle objects and returns them in an array.
   *
   * @param {number} count - The number of bottles to generate.
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
   * Checks and handles all relevant collision events in the game,
   * including character interactions with enemies, endboss, bottles, and coins.
   * Also filters out collected enemies from the level.
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
   * Checks for collisions between the character and enemies.
   * If the character is above an enemy, the enemy is defeated.
   * Otherwise, the character takes damage, and health is updated accordingly.
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
   * Checks for a collision between the character and the endboss.
   * If a collision occurs, the character takes damage and health is updated.
   * Triggers death animation if the character dies.
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
   * Handles appropriate responses such as damaging enemies or triggering hit effects.
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
   * Handles the effects of a bottle hitting the endboss, including reducing its energy,
   * updating health UI, triggering animations, and playing the bottle break sound.
   * Also triggers the bottle's splash callback if defined.
   *
   * @param {Endboss} endboss - The endboss instance that was hit.
   * @param {ThrowableObject} bottle - The bottle involved in the collision.
   */
  handleEndbossHit(endboss, bottle) {
    endboss.energy -= 20;
    this.updateEndbossHealthUI(endboss);
    this.checkAndAnimateEndboss(endboss);

    sounds.brokenBottle.volume = 0.1;
    sounds.brokenBottle.play();

    bottle.explodeAt();
    if (bottle.onSplash) {
      bottle.onSplash();
    }
  }

  /**
   * Updates the endboss health status bar based on its current energy level.
   * Ensures the energy value does not drop below zero.
   *
   * @param {Endboss} endboss - The endboss whose health UI should be updated.
   */
  updateEndbossHealthUI(endboss) {
    if (endboss.energy < 0) endboss.energy = 0;
    this.StatusBarEndbossHealth.setPercentage(endboss.energy);
  }

  /**
   * Triggers the appropriate animation for the endboss based on its energy level.
   * Plays death animation if defeated, otherwise shows hurt animation.
   *
   * @param {Endboss} endboss - The endboss whose animation should be handled.
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
   * If the enemy is alive, it is killed, the bottle break sound is played,
   * the bottle explodes, and the splash callback is triggered if defined.
   *
   * @param {Object} enemy - The enemy hit by the bottle.
   * @param {ThrowableObject} bottle - The bottle involved in the collision.
   */
  handleBottleEnemyCollision(enemy, bottle) {
    if (!enemy.isDead && bottle.isColliding(enemy)) {
      enemy.die();

      sounds.brokenBottle.volume = 0.1;
      sounds.brokenBottle.play();

      bottle.explodeAt();

      if (bottle.onSplash) {
        bottle.onSplash();
      }
    }
  }

  /**
   * Checks for collisions between the character and uncollected bottles.
   * Collects up to 5 bottles, marks them as collected, plays a sound,
   * and updates the bottle status bar accordingly.
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
   * Plays the sound effect for collecting a bottle and sets its volume to 50%.
   */
  playCollectBottleSound() {
    sounds.collectBottle2.play();
    sounds.collectBottle2.volume = 0.5;
  }

  /**
   * Checks for collisions between the character and uncollected coins.
   * Collects coins, plays a sound effect, marks them as collected,
   * and updates the coin status bar.
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
   * Activates the endboss when the character reaches a certain position (x > 2500)
   * and the endboss has not yet been activated.
   */
  checkEndbossActivation() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && this.character.x > 2500 && !endboss.activated) {
      endboss.activate();
      endboss.activated = true;
    }
  }
}
