let canvas;
let world;
let keyboard = new Keyboard();
let sounds;
let gameStarted = false;
sounds = new Sounds();

/**
 * Sets up an event listener that updates the sound icon when the window finishes loading.
 *
 * Ensures the correct sound control icon (muted or unmuted) is shown based on the current sound state.
 * This function should be called only once after all audio assets are initialized.
 */
window.addEventListener("load", () => {
  sounds.updateSoundIcon();
});

/**
 * Initializes the game by selecting the canvas element and creating a new instance of the game world.
 *
 * This function sets up the rendering context and links the canvas with the game logic and keyboard input.
 * It must be called once to start the game.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Starts the game by initializing the game world, updating the UI to hide the welcome screen,
 * and playing the background music in a loop.
 *
 * This function is typically triggered by a user action (e.g. button click) and sets the game state
 * to "started", initializes visual elements, and begins background audio.
 */
function startGame() {
  init();
  gameStarted = true;
  document.getElementById("helloScreen").classList.add("d-none");
  document.getElementById("startGame").classList.add("d-none");
  document.getElementById("buttonSection").classList.add("flexEnd");
  sounds.main.loop = true;
  sounds.main.play();
  sounds.main.volume = 0.1;
}

/**
 * Restarts the game by clearing all active intervals, reinitializing the level and world,
 * and resetting the main background sound.
 *
 * This function ensures that the game starts fresh from level 1 with default states and
 * user interface components reactivated. It also restarts the background music.
 */
function restartGame() {
  clearAllInterVals();
  initLevel1();
  init();
  activateGameUI();
  sounds.main.pause();
  sounds.main.currentTime = 0;
  sounds.main.loop = true;
  sounds.main.volume = 0.1;
  sounds.main.play();
}

/**
 * Activates the main game UI by hiding all overlay screens such as
 * the welcome, win, and game over screens, and showing the necessary
 * game interface elements like sound and control icons.
 *
 * This function prepares the UI for gameplay after a restart or game start.
 */
function activateGameUI() {
  document.getElementById("helloScreen").classList.add("d-none");
  document.getElementById("startGame").classList.add("d-none");
  document.getElementById("buttonSection").classList.add("flexEnd");
  document.getElementById("youWonScreen").classList.add("d-none");
  document.getElementById("restartGame").classList.add("d-none");
  document.getElementById("homeBTN").classList.add("d-none");
  document.getElementById("gameOverScreen").classList.add("d-none");
  document.getElementById("soundControl").classList.remove("d-none");
  document.getElementById("controlIcon").classList.remove("d-none");
}

/**
 * Displays the control overlay screen by showing the control instructions
 * and hiding unrelated UI elements such as the start button, sound control,
 * and control icon. Also ensures the close icon is visible to allow
 * the user to exit the control view.
 */
function openControl() {
  document.getElementById("controlOverlay").classList.remove("d-none");
  document.getElementById("startGame").classList.add("d-none");
  document.getElementById("soundControl").classList.add("d-none");
  document.getElementById("closeIcon").classList.remove("d-none");
  document.getElementById("controlIcon").classList.add("d-none");
}

/**
 * Displays the info overlay screen by revealing game information
 * and hiding unrelated UI elements such as the start button, sound control,
 * and control icon. Also ensures the close icon is shown to allow
 * the user to exit the info view.
 */
function openInfo() {
  document.getElementById("infoOverlay").classList.remove("d-none");
  document.getElementById("startGame").classList.add("d-none");
  document.getElementById("soundControl").classList.add("d-none");
  document.getElementById("controlIcon").classList.add("d-none");
  document.getElementById("closeIcon").classList.remove("d-none");
}

/**
 * Closes any open overlay elements such as the info or control overlay.
 * Hides the close icon and restores visibility of relevant UI components
 * like sound and control icons. If the game hasn't started yet,
 * it also re-displays the start button.
 */
function closeOverlay() {
  document.getElementById("infoOverlay").classList.add("d-none");
  document.getElementById("controlOverlay").classList.add("d-none");
  document.getElementById("closeIcon").classList.add("d-none");
  if (!gameStarted) {
    document.getElementById("startGame").classList.remove("d-none");
  }
  document.getElementById("soundControl").classList.remove("d-none");
  document.getElementById("controlIcon").classList.remove("d-none");
}

/**
 * Adds event listeners for keydown events and updates the `keyboard` state accordingly.
 * Maps specific key codes to movement and action flags used by the game:
 * - SPACE (32): Jump
 * - LEFT ARROW (37) or 'A' (65): Move left
 * - UP ARROW (38) or 'W' (87): Throw bottle
 * - RIGHT ARROW (39) or 'D' (68): Move right
 */
document.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38 || event.keyCode == 87) {
    keyboard.UP = true;
  }
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = true;
  }
});

/**
 * Adds event listeners for keyup events and updates the `keyboard` state accordingly.
 * Resets movement and action flags when keys are released:
 * - SPACE (32): Stop jumping
 * - LEFT ARROW (37) or 'A' (65): Stop moving left
 * - UP ARROW (38) or 'W' (87): Stop throwing
 * - RIGHT ARROW (39) or 'D' (68): Stop moving right
 */
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38 || event.keyCode == 87) {
    keyboard.UP = false;
  }
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = false;
  }
});

/**
 * Clears all running `setInterval()` timers by iterating over a large range of possible interval IDs.
 *
 * This method is useful for resetting the game state, stopping animations, or avoiding unintended
 * background processes. It assumes that no more than 9999 intervals have been created.
 *
 * ⚠️ Note: This approach clears *all* intervals on the page and may affect other scripts outside the game.
 */
function clearAllInterVals() {
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
}

/**
 * Reloads the current webpage.
 *
 * This function triggers a full page reload, reinitializing all scripts and resetting the game state.
 * It is equivalent to pressing the browser's refresh button.
 */
function reloadPage() {
  location.reload();
}

/**
 * Sets the state of a specific keyboard direction key.
 *
 * @param {string} direction - The direction key to update (e.g., 'LEFT', 'RIGHT', 'UP', 'SPACE').
 * @param {boolean} state - The new state of the key (true for pressed, false for released).
 */
function setKey(direction, state) {
  keyboard[direction] = state;
}

/**
 * Toggles the mute state of all game sounds when the sound control icon is clicked.
 *
 * Attaches an event listener to the sound control button. If the `sounds` object is defined,
 * it toggles the mute state via the `toggleMute` method.
 */
document.getElementById("soundControl").addEventListener("click", () => {
  if (sounds) {
    sounds.toggleMute();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const mobileButtons = document.querySelectorAll("#mobileButtonSection img");

  mobileButtons.forEach((btn) => {
    // Verhindert das Kontextmenü (z. B. „Bild speichern“)
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Verhindert Long-Press-Verhalten auf iOS
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault(); // wichtig, um langes Tippen zu blockieren
    });

    // Optional: Noch ein Fallback für iOS Safari, falls es auf das img-Level nicht greift
    btn.setAttribute("draggable", "false"); // verhindert Drag-and-Drop
  });
});
