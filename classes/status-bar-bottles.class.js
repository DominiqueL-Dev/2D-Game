class StatusBarBottles extends DrawableObject {
  percentage = 0;

  IMAGES_BOTTLES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  /**
   * Initializes the BottleBar UI element.
   *
   * This constructor:
   * - Calls the parent class constructor.
   * - Preloads the bottle bar images from `IMAGES_BOTTLES`.
   * - Sets the initial position (`x = 30`, `y = 90`) and size (`width = 200`, `height = 50`).
   * - Initializes the bar percentage to 0 via `setPercentage(0)`.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES);
    this.x = 30;
    this.y = 90;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Sets the current fill percentage of the bottle bar and updates the displayed image accordingly.
   *
   * This method:
   * - Stores the provided `percentage`.
   * - Determines the appropriate image index by calling `resolveImageIndex()`.
   * - Updates the displayed image (`this.img`) to the corresponding frame from `IMAGES_BOTTLES`.
   *
   * @method setPercentage
   * @param {number} percentage - The fill percentage to set (typically 0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    let path = this.IMAGES_BOTTLES[index];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the appropriate image index based on the current fill percentage.
   *
   * This method maps the `percentage` value to a discrete index used to select
   * the corresponding image from `IMAGES_BOTTLES`.
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
