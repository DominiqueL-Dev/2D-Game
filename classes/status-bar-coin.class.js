class StatusBarCoin extends DrawableObject {
  percentage = 0;

  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  /**
   * Initializes the CoinBar UI element.
   *
   * This constructor:
   * - Calls the parent class constructor.
   * - Preloads the coin bar images from `IMAGES_COINS`.
   * - Sets the initial position (`x = 30`, `y = 50`) and size (`width = 200`, `height = 50`).
   * - Initializes the bar fill percentage to 0 using `setPercentage(0)`.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 30;
    this.y = 50;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Sets the current fill percentage of the coin bar and updates the displayed image.
   *
   * This method:
   * - Updates the internal `percentage` property.
   * - Determines the corresponding image index by calling `resolveImageIndex()`.
   * - Updates the displayed image (`this.img`) from the cached coin images (`IMAGES_COINS`).
   *
   * @method setPercentage
   * @param {number} percentage - The fill percentage to display (typically 0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    let path = this.IMAGES_COINS[index];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index to use based on the current fill percentage.
   *
   * This method maps the `percentage` value to a discrete index, selecting
   * the appropriate image from the bar's image set to visually represent
   * the current fill state.
   *
   * Mapping:
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
