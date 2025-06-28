

GameEvents.Subscribe("hide_hud_elements", function (data) {
    const button = $("#NeutralItemsButton");
    button.style.visibility = "collapse";
});

GameEvents.Subscribe("show_hud_elements", function (data) {
    const button = $("#NeutralItemsButton");
    button.style.visibility = "visible";
});


function onNeutralButtonClicked() {
    $.Msg("Neutral Shop button clicked!");

    // Find the HUD root and search from there
    const hudRoot = $.GetContextPanel().GetParent().GetParent(); // Adjust based on your hierarchy
    const neutralShopPanel = hudRoot.FindChildTraverse("NeutralShopPanel");

    const neutralShopButton = hudRoot.FindChildTraverse("NeutralItemsButton");

    if (neutralShopPanel) {
        // Your visibility logic here
        if (neutralShopPanel.style.visibility === "visible") {
            neutralShopPanel.style.visibility = "collapse";
            $.Msg("Neutral Shop: Collapsed");
        } else {
            neutralShopPanel.style.visibility = "visible";
            neutralShopButton.style.visibility = "collapse"; // Ensure the button is visible when the shop is open
            $.Msg("Neutral Shop: Visible");
        }
    } else {
        $.Msg("ERROR: NeutralShopPanel not found.");
    }
}