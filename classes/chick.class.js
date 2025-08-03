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

   constructor() {
    super().loadImage(this.IMAGES_CHICK_WALKING[0]);
    this.loadImages(this.IMAGES_CHICK_WALKING);

    this.x = 500 + Math.random() * 1800;
    this.speed = 0.50 + Math.random() * 0.60;

    this.animate();
  }

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
