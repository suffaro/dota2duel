// Global variables to track selections
var g_selectedItem = null;
var g_selectedEnchantment = null;

function OnCloseNeutralShopButtonClicked() {
  const neutralShop = $("#NeutralShopPanel");
  const hudRoot = $.GetContextPanel().GetParent().GetParent(); // Adjust based on your hierarchy

  const neutralShopButton = hudRoot.FindChildTraverse("NeutralItemsButton");
  if (neutralShop) {
    neutralShop.style.visibility = "collapse";
    ClearAllSelections();
    // No custom tooltip to hide anymore
    neutralShopButton.style.visibility = "visible"; // Ensure the button is visible when the shop is closed
    $.Msg("Neutral Shop: Collapsed");
  } else {
    $.Msg("ERROR: NeutralShopPanel not found.");
  }
}

function OnCraftItemButtonClicked() {
  if (g_selectedItem && g_selectedEnchantment) {
    $.Msg("Craft Item: Attempting to craft " + g_selectedItem + " with " + g_selectedEnchantment);

    GameEvents.SendCustomGameEventToServer("neutral_item_craft", { "item": g_selectedItem, "enchantment": g_selectedEnchantment });


  } else {
    $.Msg("Craft Item: Button clicked, but item or enchantment not selected.");
  }
  // $.Msg("Craft Item: Button clicked - functionality to be implemented"); // Original message
}

function SelectItem(itemName) {
  // Clear previous item selection
  if (g_selectedItem) {
    const prevItemSlot = $.GetContextPanel().FindChildTraverse("item_" + g_selectedItem);
    if (prevItemSlot) {
      prevItemSlot.RemoveClass("selected");
    }
  }

  // Set new selection
  g_selectedItem = itemName;
  const itemSlot = $.GetContextPanel().FindChildTraverse("item_" + itemName);

  if (itemSlot) {
    itemSlot.AddClass("selected");
    $.Msg("Item Selected: " + itemName);
    UpdateCraftButtonState();
  } else {
    $.Msg("ERROR: Item slot not found for " + itemName + " (ID: item_" + itemName + ")");
  }
}

function SelectEnchantment(enchantmentName) {
  // Clear previous enchantment selection
  if (g_selectedEnchantment) {
    // Assuming enchantmentName is the full item name like "item_enhancement_alert"
    // The ID in XML is "enchant_alert", so we need to derive it
    const prevEnchantId = g_selectedEnchantment.replace("item_enhancement_", "");
    const prevEnchantSlot = $.GetContextPanel().FindChildTraverse("enchant_" + prevEnchantId);
    if (prevEnchantSlot) {
      prevEnchantSlot.RemoveClass("selected");
    }
  }

  // Set new selection
  g_selectedEnchantment = enchantmentName;
  const enchantmentId = enchantmentName.replace("item_enhancement_", ""); // e.g., "alert" from "item_enhancement_alert"
  const enchantSlot = $.GetContextPanel().FindChildTraverse("enchant_" + enchantmentId);

  if (enchantSlot) {
    enchantSlot.AddClass("selected");
    $.Msg("Enchantment Selected: " + enchantmentName);
    UpdateCraftButtonState();
  } else {
    $.Msg("ERROR: Enchantment slot not found for " + enchantmentName + " (ID: enchant_" + enchantmentId + ")");
  }
}

// Helper function to update craft button state
function UpdateCraftButtonState() {
  const craftButton = $("#CraftItemButton"); // Direct child of context panel, or use FindChildTraverse if nested deeper
  if (!craftButton) {
    // If CraftItemButton is not a direct child of the panel this script is on, use FindChildTraverse
    const shopPanel = $("#NeutralShopPanel");
    if (shopPanel) {
      const button = shopPanel.FindChildTraverse("CraftItemButton");
      if (button) {
        if (g_selectedItem && g_selectedEnchantment) {
          button.RemoveClass("disabled");
          button.AddClass("enabled");
          button.enabled = true; // Make sure the button is interactable
          $.Msg("Craft button enabled - Ready to craft!");
        } else {
          button.RemoveClass("enabled");
          button.AddClass("disabled");
          button.enabled = false; // Make sure the button is not interactable
        }
      } else {
        $.Msg("ERROR: CraftItemButton not found for state update (traversed).");
      }
    } else {
      $.Msg("ERROR: NeutralShopPanel not found for CraftItemButton.");
    }
    return;
  }
  // This part might not be reached if the above more specific search is needed and works.
  if (g_selectedItem && g_selectedEnchantment) {
    craftButton.RemoveClass("disabled");
    craftButton.AddClass("enabled");
    craftButton.enabled = true;
    $.Msg("Craft button enabled - Ready to craft!");
  } else {
    craftButton.RemoveClass("enabled");
    craftButton.AddClass("disabled");
    craftButton.enabled = false;
  }
}

// Helper function to clear all selections
function ClearAllSelections() {
  if (g_selectedItem) {
    const itemSlot = $.GetContextPanel().FindChildTraverse("item_" + g_selectedItem);
    if (itemSlot) {
      itemSlot.RemoveClass("selected");
    }
    g_selectedItem = null;
  }

  if (g_selectedEnchantment) {
    const enchantmentId = g_selectedEnchantment.replace("item_enhancement_", "");
    const enchantSlot = $.GetContextPanel().FindChildTraverse("enchant_" + enchantmentId);
    if (enchantSlot) {
      enchantSlot.RemoveClass("selected");
    }
    g_selectedEnchantment = null;
  }
  UpdateCraftButtonState();
}

// Function to show the neutral shop (for external calling, e.g., from Lua)
function ShowNeutralShop() {
  const neutralShop = $("#NeutralShopPanel"); // Assuming NeutralShopPanel is a child of the context this script is on
  // Or use: $.GetContextPanel().FindChildTraverse("NeutralShopPanel");
  if (neutralShop) {
    neutralShop.style.visibility = "visible";
    ClearAllSelections(); // Clear selections when opening
    UpdateCraftButtonState(); // Ensure craft button is in correct disabled state
    $.Msg("Neutral Shop: Opened");
  } else {
    $.Msg("ERROR: NeutralShopPanel not found when trying to ShowNeutralShop.");
  }
}

// Initial setup
(function () {
  // Hide shop by default - This should be handled by the CSS 'visibility: collapse;' on #NeutralShopPanel
  // const neutralShop = $("#NeutralShopPanel");
  // if (neutralShop) {
  //   neutralShop.style.visibility = "collapse";
  // }
  // Set initial state for craft button (disabled)
  UpdateCraftButtonState();

  // For debugging:
  // ShowNeutralShop(); // Uncomment to show shop on load for testing
})();

// Removed ShowCustomTooltip and HideCustomTooltip functions