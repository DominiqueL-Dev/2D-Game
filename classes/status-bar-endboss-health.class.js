class StatusBarEndbossHealth extends DrawableObject {
  percentage = 100;

  IMAGES_ENDBOSS_HEALTH = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Initializes the endboss health bar UI element.
   *
   * This constructor:
   * - Calls the parent class constructor.
   * - Preloads the health bar images from `IMAGES_ENDBOSS_HEALTH`.
   * - Sets the initial position (`x = 400`, `y = 10`) and size (`width = 200`, `height = 50`).
   * - Sets the initial health percentage to 100 via `setPercentage(100)`.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS_HEALTH);
    this.x = 400;
    this.y = 10;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the current health percentage of the endboss health bar and updates the displayed image.
   *
   * This method:
   * - Updates the internal `percentage` property.
   * - Determines the appropriate image index via `resolveImageIndex()`.
   * - Sets the displayed image (`this.img`) from the cached endboss health images (`IMAGES_ENDBOSS_HEALTH`).
   *
   * @method setPercentage
   * @param {number} percentage - The health percentage to display (typically 0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    let path = this.IMAGES_ENDBOSS_HEALTH[index];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   *
   * This method maps the `percentage` to a discrete index, selecting the appropriate
   * image from the health bar images to visually represent the current health state.
   *
   * The mapping is as follows:
   * - 100% or more: index 5
   * - 80% to less than 100%: index 4
   * - 60% to less than 80%: index 3
   * - 40% to less than 60%: index 2
   * - 20% to less than 40%: index 1
   * - Less than 20%: index 0
   *
   * @method resolveImageIndex
   * @returns {number} The index of the image to display for the current percentage.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
