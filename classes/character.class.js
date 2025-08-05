class Character extends MovableObject {
  width = 120;
  height = 300;
  y = 132.5;
  speed = 3;
  deathAnimationPlayed = false;
  wasFalling = false;
  lastActionTime = new Date().getTime();
  isIdle = false;
  world;
  hasPlayedLoseSound = false;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONGIDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Initializes the character by loading all necessary image assets,
   * applying gravity, starting animations, and enabling fall detection.
   */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    this.startFallingDetection();
  }

  /**
   * Starts a loop to detect whether the character is falling,
   * updating the `wasFalling` state approximately 60 times per second.
   */
  startFallingDetection() {
    setInterval(() => {
      this.wasFalling = this.speedY < 0;
    }, 1000 / 60);
  }

  /**
   * Starts the main animation loop for the character, handling movement, jumping,
   * and camera positioning. Also initiates the character's animation frame updates.
   */
  animate() {
    setInterval(() => {
      sounds.walking.pause();
      this.wasFalling = this.speedY < 0;
      let now = new Date().getTime();

      this.handleRightMovement(now);
      this.handleLeftMovement(now);
      this.handleJump(now);
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    this.startCharacterAnimationLoop();
  }

  /**
   * Runs the character's animation loop, updating the displayed sprite based on
   * the character's state (dead, hurt, jumping, idle, or walking) and idle time.
   */
  startCharacterAnimationLoop() {
    setInterval(() => {
      sounds.snore.pause();
      let now = new Date().getTime();
      let idleTime = (now - this.lastActionTime) / 1000;
      if (this.isDead()) {
        this.playLoseSoundOnce();
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSounds();
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        this.playIdleOrWalkAnimation(idleTime);
      }
    }, 100);
  }

  /**
   * Plays the lose sound once when the character dies,
   * ensuring it doesn't repeat by setting a flag.
   */
  playLoseSoundOnce() {
    if (!this.hasPlayedLoseSound) {
      this.playLoseSounds();
      this.hasPlayedLoseSound = true;
    }
  }

  /**
   * Determines and plays the appropriate animation based on keyboard input and idle time.
   * Plays walking animation if moving, long idle if idle for 10+ seconds,
   * otherwise plays standard idle animation and may trigger snore sound.
   *
   * @param {number} idleTime - Time in seconds since the last player action.
   */
  playIdleOrWalkAnimation(idleTime) {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (idleTime >= 10) {
      this.playAnimation(this.IMAGES_LONGIDLE);
      sounds.snore.volume = 0.1;
      sounds.snore.play();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Plays the character's hurt sound effect at reduced volume.
   */
  playHurtSounds() {
    sounds.hurt.play();
    sounds.hurt.volume = 0.1;
  }

  /**
   * Stops the endboss music and plays the lose sound effect at reduced volume.
   */
  playLoseSounds() {
    sounds.endbossTime.pause();
    sounds.lose.volume = 0.1;
    sounds.lose.play();
  }

  /**
   * Handles the character's jump action when the SPACE key is pressed
   * and the character is on the ground. Triggers jump sound and updates action time.
   *
   * @param {number} now - The current timestamp used to track the last action.
   */
  handleJump(now) {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.lastActionTime = now;
      sounds.jump.volume = 0.1;
      sounds.jump.play();
    }
  }

  /**
   * Handles character movement to the left when the LEFT key is pressed
   * and the character hasn't reached the movement boundary.
   * Updates direction, action time, and plays walking sound if on the ground.
   *
   * @param {number} now - The current timestamp used to track the last action.
   */
  handleLeftMovement(now) {
    if (this.world.keyboard.LEFT && this.x > -510) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastActionTime = now;
      if (!this.isAboveGround()) {
        sounds.walking.volume = 1;
        sounds.walking.play();
      }
    }
  }

  /**
   * Handles character movement to the right when the RIGHT key is pressed
   * and the character hasn't reached the level's end boundary.
   * Updates direction, action time, and plays walking sound if on the ground.
   *
   * @param {number} now - The current timestamp used to track the last action.
   */
  handleRightMovement(now) {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastActionTime = now;
      if (!this.isAboveGround()) {
        sounds.walking.volume = 1;
        sounds.walking.play();
      }
    }
  }

  /**
   * Determines whether the character is positioned above the enemy
   * in a way that could allow a jump attack. Checks vertical alignment,
   * horizontal overlap, and whether the character is falling.
   *
   * @param {Object} enemy - The enemy to compare positions with.
   * @returns {boolean} True if the character is above the enemy and falling.
   */
  isAbove(enemy) {
    let characterBottom = this.y + this.height;
    let enemyTop = enemy.y;
    let enemyHeadZone = enemyTop + enemy.height;
    let horizontalOverlap =
      this.x + this.width > enemy.x && this.x < enemy.x + enemy.width;
    let isAbove = characterBottom <= enemyHeadZone;
    let isFalling = this.speedY > 0 || this.wasFalling;
    let result = horizontalOverlap && isAbove && isFalling;
    return result;
  }

  /**
   * Plays the character's death animation by cycling through death images.
   * Ensures the animation plays only once, and triggers game end after completion.
   */
  playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    let i = 0;
    let interval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        let path = this.IMAGES_DEAD[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        this.endGameAfterDelay(interval);
      }
    }, 100);
  }

  /**
   * Ends the game after a short delay by stopping the death animation interval,
   * displaying the game over screen, hiding UI controls, and playing the lose sound.
   * Also resets the game world and pauses the main background music.
   *
   * @param {number} interval - The interval ID for the death animation loop to clear.
   */
  endGameAfterDelay(interval) {
    clearInterval(interval);

    setTimeout(() => {
      document.getElementById("gameOverScreen").classList.remove("d-none");
      document.getElementById("soundControl").classList.add("d-none");
      document.getElementById("controlIcon").classList.add("d-none");

      this.showEndButtonsWithDelay();
      world = null;
      sounds.lose2.volume = 0.1;
      sounds.lose2.play();
      sounds.main.pause();
    }, 500);
  }

  /**
   * Displays the restart and home buttons after a 2-second delay
   * to allow the game over screen to settle before showing options.
   */
  showEndButtonsWithDelay() {
    setTimeout(() => {
      document.getElementById("restartGame").classList.remove("d-none");
      document.getElementById("homeBTN").classList.remove("d-none");
    }, 2000);
  }
}