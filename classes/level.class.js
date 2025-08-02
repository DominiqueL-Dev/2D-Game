class Level {
  enemies;
  clouds;
  bottles;
  coins;
  backgroundObjects;
  level_end_x = 2250;

  /**
   * Creates a new Level instance containing various game entities and background elements.
   *
   * @constructor
   * @param {Array<Object>} enemies - Array of enemy objects present in the level.
   * @param {Array<Object>} clouds - Array of cloud objects for background effects.
   * @param {Array<Object>} bottles - Array of collectible bottle objects.
   * @param {Array<Object>} coins - Array of collectible coin objects.
   * @param {Array<Object>} backgroundObjects - Array of background objects (e.g., scenery layers).
   */
  constructor(enemies, clouds, bottles, coins, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    this.coins = coins;
    this.backgroundObjects = backgroundObjects;
  }
}
