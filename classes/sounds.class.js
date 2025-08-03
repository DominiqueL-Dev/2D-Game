let allSounds = null;

class Sounds {
  /**
   * Initializes all game sound effects and music tracks.
   *
   * This constructor:
   * - Creates `Audio` objects for each sound file used in the game,
   *   such as walking, jump, hurt, win, lose sounds, and more.
   * - Aggregates all sound objects into an `allSounds` array for bulk control.
   * - Initializes a `muted` flag to track the mute state.
   *
   * @constructor
   */
  constructor() {
    this.walking = new Audio("audio/walking.mp3");
    this.main = new Audio("audio/mainMusik.mp3");
    this.jump = new Audio("audio/jump.mp3");
    this.snore = new Audio("audio/snore.mp3");
    this.throwBottle = new Audio("audio/throwBottle.mp3");
    this.hurt = new Audio("audio/hurtSound.mp3");
    this.death = new Audio("audio/deathSound.mp3");
    this.lose = new Audio("audio/loseSound.mp3");
    this.lose2 = new Audio("audio/loseSound2.mp3");
    this.whistle = new Audio("audio/whistle.mp3");
    this.winning = new Audio("audio/winningSound.mp3");
    this.winning2 = new Audio("audio/winningSound2.mp3");
    this.coin = new Audio("audio/coin.mp3");
    this.brokenBottle = new Audio("audio/brokenBottle.mp3");
    this.endbossHurt = new Audio("audio/endbossHurtSound.mp3");
    this.endbossTime = new Audio("audio/endbossTimeSound.mp3");
    this.collectBottle = new Audio("audio/collectBottleSound.mp3");
    this.collectBottle2 = new Audio("audio/collectBottleSound2.mp3");
    this.squeeze = new Audio("audio/squeeze.mp3");

    this.allSounds = [
      this.walking,
      this.main,
      this.jump,
      this.snore,
      this.throwBottle,
      this.hurt,
      this.death,
      this.lose,
      this.lose2,
      this.whistle,
      this.winning,
      this.winning2,
      this.coin,
      this.brokenBottle,
      this.endbossHurt,
      this.endbossTime,
      this.collectBottle,
      this.collectBottle2,
      this.squeeze,
    ];

    this.muted = false;
  }

  /**
   * Toggles the global mute state for all game sounds.
   *
   * - Inverts the current mute status.
   * - Stores the updated mute state in `localStorage` under the key `"muted"`.
   * - Applies the mute setting to all audio elements in `this.allSounds`.
   * - Updates the sound icon in the UI to reflect the current mute state.
   */
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("muted", this.muted);

    this.allSounds.forEach((sound) => {
      sound.muted = this.muted;
    });
    this.updateSoundIcon();
  }

  /**
   * Updates the sound control icon based on the current mute state.
   *
   * This method:
   * - Retrieves the DOM element with ID `soundControl`.
   * - Changes the icon image source and CSS class depending on whether the sound is muted.
   *   - Shows a muted icon if `this.muted` is true.
   *   - Shows an unmuted icon if `this.muted` is false.
   *
   * @method updateSoundIcon
   */
  updateSoundIcon() {
    let icon = document.getElementById("soundControl");
    if (this.muted) {
      icon.src = "./img/icons/sound_off_icon.png";
      icon.classList.add("mute_icon");
    } else {
      icon.src = "./img/icons/sound_icon.png";
      icon.classList.remove("mute_icon");
    }
  }

  /**
   * Restores the global mute state from localStorage.
   *
   * - Reads the `"muted"` value from localStorage.
   * - If found, updates the `muted` flag accordingly.
   * - Applies the mute setting to all audio elements in `this.allSounds`.
   * - Updates the sound icon in the UI to reflect the restored mute state.
   */
  restoreMute() {
    let savedMute = localStorage.getItem("muted");

    if (savedMute !== null) {
      this.muted = savedMute === "true";
      this.allSounds.forEach((sound) => {
        sound.muted = this.muted;
      });
      this.updateSoundIcon();
    }
  }
}
