heroesListAgility = ["npc_dota_hero_phantom_assassin",
  "npc_dota_hero_ember_spirit",
  "npc_dota_hero_weaver",
  "npc_dota_hero_kez",
  "npc_dota_hero_phantom_lancer",
  "npc_dota_hero_hoodwink",
  "npc_dota_hero_razor",
  "npc_dota_hero_lone_druid",
  "npc_dota_hero_terrorblade",
  "npc_dota_hero_templar_assassin",
  "npc_dota_hero_vengefulspirit",
  "npc_dota_hero_faceless_void",
  "npc_dota_hero_mirana",
  "npc_dota_hero_gyrocopter",
  "npc_dota_hero_meepo",
  "npc_dota_hero_slark",
  "npc_dota_hero_antimage",
  "npc_dota_hero_nevermore",
  "npc_dota_hero_sniper",
  "npc_dota_hero_juggernaut",
  "npc_dota_hero_clinkz",
  "npc_dota_hero_luna",
  "npc_dota_hero_viper",
  "npc_dota_hero_medusa",
  "npc_dota_hero_broodmother",
  "npc_dota_hero_drow_ranger",
  "npc_dota_hero_bounty_hunter",
  "npc_dota_hero_bloodseeker",
  "npc_dota_hero_riki",
  "npc_dota_hero_naga_siren",
  "npc_dota_hero_ursa",
  "npc_dota_hero_morphling",
  "npc_dota_hero_monkey_king",
  "npc_dota_hero_troll_warlord",];
heroesListStrength = ["npc_dota_hero_undying",
  "npc_dota_hero_pudge",
  "npc_dota_hero_skeleton_king",
  "npc_dota_hero_abyssal_underlord",
  "npc_dota_hero_huskar",
  "npc_dota_hero_alchemist",
  "npc_dota_hero_centaur",
  "npc_dota_hero_earth_spirit",
  "npc_dota_hero_elder_titan",
  "npc_dota_hero_night_stalker",
  "npc_dota_hero_earthshaker",
  "npc_dota_hero_life_stealer",
  "npc_dota_hero_dawnbreaker",
  "npc_dota_hero_legion_commander",
  "npc_dota_hero_kunkka",
  "npc_dota_hero_shredder",
  "npc_dota_hero_bristleback",
  "npc_dota_hero_chaos_knight",
  "npc_dota_hero_slardar",
  "npc_dota_hero_primal_beast",
  "npc_dota_hero_treant",
  "npc_dota_hero_omniknight",
  "npc_dota_hero_sven",
  "npc_dota_hero_mars",
  "npc_dota_hero_ogre_magi",
  "npc_dota_hero_tusk",
  "npc_dota_hero_rattletrap",
  "npc_dota_hero_lycan",
  "npc_dota_hero_axe",
  "npc_dota_hero_spirit_breaker",
  "npc_dota_hero_dragon_knight",
  "npc_dota_hero_tidehunter",
  "npc_dota_hero_tiny",
  "npc_dota_hero_doom_bringer",
  "npc_dota_hero_phoenix",];
heroesListIntelligence = ["npc_dota_hero_zuus",
  "npc_dota_hero_warlock",
  "npc_dota_hero_lion",
  "npc_dota_hero_jakiro",
  "npc_dota_hero_shadow_demon",
  "npc_dota_hero_queenofpain",
  "npc_dota_hero_chen",
  "npc_dota_hero_invoker",
  "npc_dota_hero_shadow_shaman",
  "npc_dota_hero_dark_seer",
  "npc_dota_hero_storm_spirit",
  "npc_dota_hero_lich",
  "npc_dota_hero_witch_doctor",
  "npc_dota_hero_silencer",
  "npc_dota_hero_puck",
  "npc_dota_hero_tinker",
  "npc_dota_hero_ancient_apparition",
  "npc_dota_hero_grimstroke",
  "npc_dota_hero_obsidian_destroyer",
  "npc_dota_hero_necrolyte",
  "npc_dota_hero_muerta",
  "npc_dota_hero_dark_willow",
  "npc_dota_hero_leshrac",
  "npc_dota_hero_enchantress",
  "npc_dota_hero_crystal_maiden",
  "npc_dota_hero_pugna",
  "npc_dota_hero_rubick",
  "npc_dota_hero_lina",
  "npc_dota_hero_ringmaster",
  "npc_dota_hero_keeper_of_the_light",
  "npc_dota_hero_disruptor",
  "npc_dota_hero_oracle",
  "npc_dota_hero_skywrath_mage",
  "npc_dota_hero_winter_wyvern",];
heroesListUniversal = ["npc_dota_hero_brewmaster",
  "npc_dota_hero_nyx_assassin",
  "npc_dota_hero_abaddon",
  "npc_dota_hero_furion",
  "npc_dota_hero_beastmaster",
  "npc_dota_hero_magnataur",
  "npc_dota_hero_visage",
  "npc_dota_hero_sand_king",
  "npc_dota_hero_pangolier",
  "npc_dota_hero_venomancer",
  "npc_dota_hero_techies",
  "npc_dota_hero_marci",
  "npc_dota_hero_batrider",
  "npc_dota_hero_dazzle",
  "npc_dota_hero_enigma",
  "npc_dota_hero_void_spirit",
  "npc_dota_hero_death_prophet",
  "npc_dota_hero_bane",
  "npc_dota_hero_windrunner",
  "npc_dota_hero_spectre",
  "npc_dota_hero_arc_warden",
  "npc_dota_hero_wisp",
  "npc_dota_hero_snapfire",];

//   "npc_dota_hero_target_dummy"
let selectedHeroName = null;
let repickPanel = null;
let heroesAreLoaded = false;

function onOpenRepickMenu() {
  if (!repickPanel) {
    repickPanel = $("#RepickFormPanel");
  }

  if (repickPanel) {
    if (!heroesAreLoaded) {
      formingHeroesGrid();
      heroesAreLoaded = true;
    }
    repickPanel.style.visibility = "visible";
    ClearAllSelections();

    const hudRoot = $.GetContextPanel().GetParent().GetParent();
    const repickMenuButton = hudRoot.FindChildTraverse("RepickHeroButton");
    if (repickMenuButton) {
      repickMenuButton.style.visibility = "collapse";
    }
    $.Msg("Repick Menu: Visible");
  } else {
    $.Msg("ERROR: RepickFormPanel not found for opening.");
  }
}

function formingHeroesGrid() {
  if (!repickPanel) {
    $.Msg("ERROR: RepickFormPanel not found in formingHeroesGrid.");
    return;
  }

  const strengthGrid = repickPanel.FindChildTraverse("StrengthHeroGrid");
  const agilityGrid = repickPanel.FindChildTraverse("AgilityHeroGrid");
  const intelligenceGrid = repickPanel.FindChildTraverse("IntelligenceHeroGrid");
  const universalGrid = repickPanel.FindChildTraverse("UniversalHeroGrid");

  populateGrid(strengthGrid, heroesListStrength, "Strength");
  populateGrid(agilityGrid, heroesListAgility, "Agility");
  populateGrid(intelligenceGrid, heroesListIntelligence, "Intelligence");
  populateGrid(universalGrid, heroesListUniversal, "Universal");

  $.Msg("Hero grids populated.");
}

function populateGrid(gridPanel, heroArray, categoryName) {
  if (!gridPanel) {
    $.Msg("ERROR: Grid panel for " + categoryName + " not found.");
    return;
  }
  gridPanel.RemoveAndDeleteChildren();

  const displayableHeroes = heroArray.sort();


  displayableHeroes.forEach((heroName, index) => {
    const heroSlotOuter = $.CreatePanel("Panel", gridPanel, "");
    if (!heroSlotOuter) {
      $.Msg(`ERROR: populateGrid (${categoryName}): Failed to create HeroSlotOuter Panel for ${heroName}`);
      return;
    }
    heroSlotOuter.AddClass("HeroSlot");
    heroSlotOuter.SetAttributeString("data-heroname", heroName);

    const heroSlotInner = $.CreatePanel("Panel", heroSlotOuter, "");
    if (!heroSlotInner) {
      $.Msg(`ERROR: populateGrid (${categoryName}): Failed to create HeroSlotInner Panel for ${heroName}`);
      heroSlotOuter.DeleteAsync(0);
      return;
    }
    heroSlotInner.AddClass("HeroSlotInner");

    const heroImage = $.CreatePanel("DOTAHeroImage", heroSlotInner, "");
    if (!heroImage) {
      $.Msg(`ERROR: populateGrid (${categoryName}): Failed to create DOTAHeroImage Panel for ${heroName}`);
      heroSlotOuter.DeleteAsync(0);
      return;
    }
    heroImage.heroname = heroName;
    heroImage.heroimagestyle = "portrait";

    heroSlotOuter.SetPanelEvent("onactivate", function () {
      onHeroSlotClick(heroSlotOuter, heroName);
    });
  });
}

function onHeroSlotClick(clickedSlot, heroName) {
  if (!repickPanel) return;

  const allHeroSlots = repickPanel.FindChildrenWithClassTraverse("HeroSlot");
  allHeroSlots.forEach(slot => {
    slot.RemoveClass("selected");
  });

  clickedSlot.AddClass("selected");
  selectedHeroName = heroName;

  const selectButton = repickPanel.FindChildTraverse("SelectHeroButton");
  if (selectButton) {
    selectButton.RemoveClass("disabled");
    selectButton.AddClass("enabled");
    selectButton.enabled = true;
  }
  $.Msg("Selected hero: " + selectedHeroName);
}

function ClearAllSelections() {
  if (!repickPanel) return;

  selectedHeroName = null;
  const allHeroSlots = repickPanel.FindChildrenWithClassTraverse("HeroSlot");
  allHeroSlots.forEach(slot => {
    slot.RemoveClass("selected");
  });

  const selectButton = repickPanel.FindChildTraverse("SelectHeroButton");
  if (selectButton) {
    selectButton.RemoveClass("enabled");
    selectButton.AddClass("disabled");
    selectButton.enabled = false;
  }
}

function onCloseRepickMenu() {
  if (!repickPanel) {
    repickPanel = $("#RepickFormPanel");
    if (!repickPanel) {
      $.Msg("ERROR: RepickFormPanel not found for closing.");
      return;
    }
  }

  repickPanel.style.visibility = "collapse";
  ClearAllSelections();

  const hudRoot = $.GetContextPanel().GetParent().GetParent();
  const repickMenuButton = hudRoot.FindChildTraverse("RepickHeroButton");
  if (repickMenuButton) {
    repickMenuButton.style.visibility = "visible";
  }
  $.Msg("Repick Menu: Collapsed");
}

function onSelectHeroButtonPressed() {
  if (selectedHeroName) {
    $.Msg(" Requesting facets for hero: " + selectedHeroName);
    GameEvents.SendCustomGameEventToServer("request_repick_hero", { "playerId": Players.GetLocalPlayer(), "heroName": selectedHeroName });
    onCloseRepickMenu();
  } else {
    $.Msg("No hero selected to repick.");
  }
}

function onRandomHeroButtonPressed() {
  if (!repickPanel) return;

  const allHeroes = [].concat(heroesListStrength, heroesListAgility, heroesListIntelligence, heroesListUniversal);

  const pickableHeroes = allHeroes.filter(name =>
    name !== "npc_dota_hero_target_dummy" &&
    name !== "npc_dota_hero_kez" &&
    name !== "npc_dota_hero_ringmaster"
  );

  if (pickableHeroes.length > 0) {
    const randomIndex = Math.floor(Math.random() * pickableHeroes.length);
    const randomHeroName = pickableHeroes[randomIndex];

    const allHeroSlots = repickPanel.FindChildrenWithClassTraverse("HeroSlot");
    let foundSlot = null;
    allHeroSlots.forEach(slot => {
      if (slot.GetAttributeString("data-heroname", "") === randomHeroName) {
        foundSlot = slot;
      }
    });

    if (foundSlot) {
      onHeroSlotClick(foundSlot, randomHeroName);
      $.Msg("Randomly selected: " + randomHeroName + ". Click SELECT to confirm.");
    } else {
      $.Msg("Error: Could not find UI slot for randomly selected hero: " + randomHeroName);
      ClearAllSelections();
    }

  } else {
    $.Msg("No pickable heroes available for random selection.");
  }
}

(function () {
  repickPanel = $("#RepickFormPanel");
  if (repickPanel) {
    const randomButton = repickPanel.FindChildTraverse("RandomHeroButton");
    if (randomButton) {
      randomButton.enabled = true;
    }
  }

  onOpenRepickMenu();
  $.Msg("Repick Menu JS Loaded and Initialized.");
})();