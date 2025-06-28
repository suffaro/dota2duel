// Game settings state
let gamePhase = "loading"; // loading, draft, game
let settingsLocked = false;
let isHost = false;

// Listen for game state changes from server
GameEvents.Subscribe("game_phase_changed", function (data) {
  gamePhase = data.phase;

  if (data.phase === "draft_started") {
    // Send current settings when draft starts
    sendSettingsToServer();
    lockSettings();
  }
});


// Properly determine if player is host
function initializeHostStatus() {
  let localPlayerId = Players.GetLocalPlayer();
  isHost = (localPlayerId === 0);

  if (!isHost) {
    disableAllButtons();
    $("#SettingsTitle").text = "Game Settings (Host Only)";
  }
}

GameEvents.Subscribe("game_phase_changed", function (data) {
  gamePhase = data.phase;

  if (data.phase === "draft_started") {
    // ONLY HOST sends the final settings
    if (isHost) {
      $.Msg("Host sending final settings to server");
      sendSettingsToServer();
    }

    // Everyone locks their UI
    lockSettings();
  }
});


function disableAllButtons() {
  $("#RapierButton").enabled = false;
  $("#DivineRegaliaButton").enabled = false;
  $("#GemEffectButton").enabled = false;
  $("#EnchantsButton").enabled = false;
  $("#RunesSpawnButton").enabled = false;
  // Optionally add visual indication
  $("#SettingsTitle").text = "Game Settings (Host Only)";
}



let gameSettings = {
  rapier: true,
  divineRegalia: true,
  gemEffect: true,
  enchants: true,
  runesSpawn: true // Always true and disabled
};

function toggleRapier() {
  $.Msg("clicked RapierButton");
  gameSettings.rapier = !gameSettings.rapier;
  updateButtonState("RapierButton", gameSettings.rapier);
}

function toggleDivineRegalia() {
  $.Msg("clicked DivineRegaliaButton");
  gameSettings.divineRegalia = !gameSettings.divineRegalia;
  updateButtonState("DivineRegaliaButton", gameSettings.divineRegalia);
}

function toggleGemEffect() {
  $.Msg("clicked GemEffectButton");
  gameSettings.gemEffect = !gameSettings.gemEffect;
  updateButtonState("GemEffectButton", gameSettings.gemEffect);
}

function toggleEnchants() {
  $.Msg("clicked EnchantsButton");
  gameSettings.enchants = !gameSettings.enchants;
  updateButtonState("EnchantsButton", gameSettings.enchants);
}

function toggleRunesSpawn() {
  $.Msg("clicked RunesSpawnButton");
  gameSettings.runesSpawn = !gameSettings.runesSpawn; // Was: gameSettings.enchants
  updateButtonState("RunesButton", gameSettings.runesSpawn); // Was: gameSettings.enchants
}

function updateButtonState(buttonId, isEnabled) {
  let button = $("#" + buttonId);
  let label = button.GetChild(0); // Get first child (the Label)

  if (!label) {
    $.Msg("Warning: Could not find Label child for button " + buttonId);
    return;
  }

  if (isEnabled) {
    button.RemoveClass("false");
    label.text = "TRUE";
  } else {
    button.AddClass("false");
    label.text = "FALSE";
  }
}

function sendSettingsToServer() {
  let settingsData = {
    rapier: gameSettings.rapier,
    divineRegalia: gameSettings.divineRegalia,
    gemEffect: gameSettings.gemEffect,
    enchants: gameSettings.enchants,
    runesSpawn: gameSettings.runesSpawn
  };

  $.Msg("Sending final settings to server:", settingsData);
  GameEvents.SendCustomGameEventToServer("finalize_game_settings", settingsData);
}


(function () {
  checkIfHost();
});


$.Msg("Custom Loading Screen script loaded successfully.");