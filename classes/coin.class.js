class Coins extends MovableObject {
  width = 70;
  height = 70;

  /**
   * Initializes a new coin (or collectible) object at a randomized position.
   *
   * This constructor:
   * - Loads a static coin image (`coin_2.png`).
   * - Sets a random horizontal `x` position between 250 and 1650.
   * - Sets a fixed vertical `y` position (270).
   * - Marks the coin as uncollected initially via `this.collected = false`.
   *
   * @constructor
   * @param {number} y - (Unused) Vertical position parameter; currently overridden by fixed value.
   */
  constructor(y) {
    super().loadImage("img/8_coin/coin_2.png");

    this.x = 250 + Math.random() * 1400;

    this.y = 270;
    this.collected = false;
  }
}
