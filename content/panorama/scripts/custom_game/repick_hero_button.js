"use strict";
$.Msg("repick hero manifest loaded");


GameEvents.Subscribe("hide_hud_elements", function (data) {
  const button = $("#RepickHeroButton");
  button.style.visibility = "collapse";
});

GameEvents.Subscribe("show_hud_elements", function (data) {
  const button = $("#RepickHeroButton");
  button.style.visibility = "visible";
});


// $.DispatchEvent('DOTAHeroFacetPickerFacetSelected', panel, {
//   facet_id: selectedFacetId,
//   hero_id: heroId,
//   // other required parameters
// });



function openRepickMenu() {
  $.Msg("Repick Menu clicked!");

  // Find the HUD root and search from there
  const hudRoot = $.GetContextPanel().GetParent().GetParent(); // Adjust based on your hierarchy
  const repickHeroPanel = hudRoot.FindChildTraverse("RepickFormPanel");

  const repickHeroButton = hudRoot.FindChildTraverse("RepickHeroButton");


  if (repickHeroPanel) {
    // Your visibility logic here
    if (repickHeroPanel.style.visibility === "visible") {
      repickHeroPanel.style.visibility = "collapse";
      $.Msg("Neutral Shop: Collapsed");
    } else {
      repickHeroPanel.style.visibility = "visible";
      repickHeroButton.style.visibility = "collapse"; // Ensure the button is visible when the shop is open
      $.Msg("Neutral Shop: Visible");
    }
  } else {
    $.Msg("ERROR: NeutralShopPanel not found.");
  }
}