class StatusBarHealth extends DrawableObject {
  percentage = 100;

  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Initializes the health bar UI element.
   *
   * This constructor:
   * - Calls the parent class constructor.
   * - Loads the health bar images from `IMAGES_HEALTH`.
   * - Sets the initial position (`x = 30`, `y = 10`) and size (`width = 200`, `height = 50`).
   * - Sets the initial health percentage to 100 via `setPercentage(100)`.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.x = 30;
    this.y = 10;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the current health percentage and updates the health bar image accordingly.
   *
   * This method:
   * - Updates the internal `percentage` property.
   * - Determines the correct image index by calling `resolveImageIndex()`.
   * - Updates the displayed image (`this.img`) from the cached health images (`IMAGES_HEALTH`).
   *
   * @method setPercentage
   * @param {number} percentage - The current health percentage (typically 0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    let path = this.IMAGES_HEALTH[index];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the current percentage.
   *
   * This method maps the percentage value to discrete image indices to represent
   * different states of the health bar.
   *
   * The mapping is:
   * - 100% or more: index 5
   * - 80% to less than 100%: index 4
   * - 60% to less than 80%: index 3
   * - 40% to less than 60%: index 2
   * - 20% to less than 40%: index 1
   * - Less than 20%: index 0
   *
   * @method resolveImageIndex
   * @returns {number} The image index corresponding to the current percentage.
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
