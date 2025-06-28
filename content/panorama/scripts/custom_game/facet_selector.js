// Global variables
var g_CurrentHeroName = "";
var g_SelectedFacet = null;
var g_FacetData = null;

// Initialize the facet selection system
function InitializeFacetSelection() {
  // Register for custom game events
  GameEvents.Subscribe("show_facet_selection", OnShowFacetSelection);

  // Hide the UI initially
  var container = $("#FacetSelectionContainer");
  var overlay = $("#BackgroundOverlay");

  if (container) {
    container.AddClass("Hidden");
  }
  if (overlay) {
    overlay.AddClass("Hidden");
  }

  $.Msg("Facet Selection UI initialized");
}

// Called when the server sends facet data
function OnShowFacetSelection(data) {
  $.Msg("Received facet selection data:", data);

  g_CurrentHeroName = data.hero_name;
  g_FacetData = data.facets;
  g_SelectedFacet = null;

  // Update hero name in UI
  var heroLabel = $("#HeroNameLabel");
  if (heroLabel) {
    heroLabel.text = "Select Facet for " + g_CurrentHeroName;
  }

  // Clear existing facets
  ClearFacetsGrid();

  // Create facet cards
  CreateFacetCards(g_FacetData);

  // Show the UI
  ShowFacetSelectionUI();

  // Reset confirm button state
  UpdateConfirmButton();
}

// Clear the facets grid
function ClearFacetsGrid() {
  var grid = $("#FacetsGrid");
  if (grid) {
    grid.RemoveAndDeleteChildren();
  }
}

// Create facet cards dynamically
function CreateFacetCards(facets) {
  var grid = $("#FacetsGrid");
  if (!grid || !facets) return;

  for (var i = 0; i < facets.length; i++) {
    var facet = facets[i];
    CreateFacetCard(grid, facet, i);
  }
}

// Create a single facet card
function CreateFacetCard(parent, facet, index) {
  // Create main card panel
  var card = $.CreatePanel("Panel", parent, "FacetCard_" + index);
  card.AddClass("FacetCard");

  // Store facet data on the card
  card.facetData = facet;

  // Create header row for selection indicator
  var headerRow = $.CreatePanel("Panel", card, "HeaderRow_" + index);
  headerRow.AddClass("FacetCardHeader");

  // Create spacer to push indicator to the right
  var spacer = $.CreatePanel("Panel", headerRow, "Spacer_" + index);
  spacer.AddClass("FacetCardSpacer");

  // Create selection indicator (hidden by default)
  var selectionIndicator = $.CreatePanel("Panel", headerRow, "SelectionIndicator_" + index);
  selectionIndicator.AddClass("SelectionIndicator");
  selectionIndicator.AddClass("Hidden");

  // Create icon
  var icon = $.CreatePanel("Panel", card, "FacetIcon_" + index);
  icon.AddClass("FacetIcon");

  // Set icon image if available
  if (facet.icon && facet.icon !== "default") {
    icon.style.backgroundImage = 'url("file://{images}/custom_game/facet_icons/' + facet.icon + '.png")';
  } else {
    // Default icon styling
    icon.style.backgroundColor = "#555555";
  }

  // Create name label
  var nameLabel = $.CreatePanel("Label", card, "FacetName_" + index);
  nameLabel.AddClass("FacetName");
  nameLabel.text = facet.display_name;

  // Create color indicator
  var colorIndicator = $.CreatePanel("Panel", card, "FacetColor_" + index);
  colorIndicator.AddClass("FacetColor");

  // Set color based on facet data
  if (facet.color && facet.color !== "Unknown") {
    colorIndicator.style.backgroundColor = facet.color;
  } else {
    colorIndicator.style.backgroundColor = "#888888";
  }

  // Create gradient indicator if gradient ID is available
  if (facet.gradient_id && facet.gradient_id > 0) {
    var gradientIndicator = $.CreatePanel("Panel", card, "FacetGradient_" + index);
    gradientIndicator.AddClass("FacetGradient");

    // Apply gradient based on ID (you can customize these gradients)
    ApplyGradientStyle(gradientIndicator, facet.gradient_id);
  }

  // Add click handler
  card.SetPanelEvent("onactivate", function () {
    OnFacetCardClicked(card);
  });

  // Add hover sound effects
  card.SetPanelEvent("onmouseover", function () {
    Game.EmitSound("ui_generic_button_click");
  });
}

// Apply gradient style based on gradient ID
function ApplyGradientStyle(panel, gradientID) {
  switch (gradientID) {
    case 1:
      panel.style.background = "linear-gradient(90deg, #ff6b6b, #4ecdc4)";
      break;
    case 2:
      panel.style.background = "linear-gradient(90deg, #a8e6cf, #ffd93d)";
      break;
    case 3:
      panel.style.background = "linear-gradient(90deg, #74b9ff, #0984e3)";
      break;
    case 4:
      panel.style.background = "linear-gradient(90deg, #fd79a8, #fdcb6e)";
      break;
    case 5:
      panel.style.background = "linear-gradient(90deg, #6c5ce7, #a29bfe)";
      break;
    default:
      panel.style.background = "linear-gradient(90deg, #636e72, #b2bec3)";
      break;
  }
}

// Handle facet card click
function OnFacetCardClicked(card) {
  if (!card || !card.facetData) return;

  // Remove selection from all cards
  var grid = $("#FacetsGrid");
  if (grid) {
    var cards = grid.FindChildrenWithClassTraverse("FacetCard");
    for (var i = 0; i < cards.length; i++) {
      cards[i].RemoveClass("Selected");
      // Hide all selection indicators
      var indicator = cards[i].FindChild("SelectionIndicator_" + i);
      if (indicator) {
        indicator.AddClass("Hidden");
      }
    }
  }

  // Add selection to clicked card
  card.AddClass("Selected");

  // Show selection indicator for clicked card
  var cardIndex = card.id.split("_")[1];
  var indicator = card.FindChild("SelectionIndicator_" + cardIndex);
  if (indicator) {
    indicator.RemoveClass("Hidden");
  }

  // Store selected facet
  g_SelectedFacet = card.facetData;

  // Update confirm button
  UpdateConfirmButton();

  // Play selection sound
  Game.EmitSound("ui_generic_button_click");

  $.Msg("Selected facet:", g_SelectedFacet.name);
}

// Update confirm button state
function UpdateConfirmButton() {
  var confirmButton = $("#ConfirmButton");
  if (!confirmButton) return;

  if (g_SelectedFacet) {
    confirmButton.RemoveClass("Disabled");
  } else {
    confirmButton.AddClass("Disabled");
  }
}

// Show the facet selection UI
function ShowFacetSelectionUI() {
  var container = $("#FacetSelectionContainer");
  var overlay = $("#BackgroundOverlay");

  if (container) {
    container.RemoveClass("Hidden");
  }
  if (overlay) {
    overlay.RemoveClass("Hidden");
  }

  // Play UI open sound
  Game.EmitSound("ui_generic_button_click");
}

// Hide the facet selection UI
function HideFacetSelectionUI() {
  var container = $("#FacetSelectionContainer");
  var overlay = $("#BackgroundOverlay");

  if (container) {
    container.AddClass("Hidden");
  }
  if (overlay) {
    overlay.AddClass("Hidden");
  }

  // Clear selection
  g_SelectedFacet = null;
  g_CurrentHeroName = "";
  g_FacetData = null;
}

// Close facet selection UI
function CloseFacetSelection() {
  HideFacetSelectionUI();
  Game.EmitSound("ui_generic_button_click");
}

// Confirm facet selection
function ConfirmFacetSelection() {
  if (!g_SelectedFacet) {
    $.Msg("No facet selected");
    return;
  }

  // Send selection to server
  var eventData = {
    PlayerID: Players.GetLocalPlayer(),
    hero_name: g_CurrentHeroName,
    selected_facet: g_SelectedFacet.name
  };

  GameEvents.SendCustomGameEventToServer("facet_selection_confirmed", eventData);

  $.Msg("Facet selection confirmed:", g_SelectedFacet.name);

  // Hide UI
  HideFacetSelectionUI();

  // Play confirmation sound
  Game.EmitSound("ui_generic_button_click");
}

// Handle ESC key to close UI
function OnEscapePressed() {
  var container = $("#FacetSelectionContainer");
  if (container && !container.HasClass("Hidden")) {
    CloseFacetSelection();
    return true; // Consume the event
  }
  return false; // Don't consume the event
}

// Initialize when the script loads
(function () {
  InitializeFacetSelection();

  // Register ESC key handler
  Game.AddCommand("ToggleFacetSelection", OnEscapePressed, "", 0);
})();