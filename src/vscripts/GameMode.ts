import { reloadable } from "./lib/tstl-utils";
// import { HeroFacetsManager, HeroFacet, FacetUIData } from './FacetParser';
// import { HeroRepickManager } from './HeroRepickManager';

const heroSelectionTime = 15;
const buyingPhaseTime = 20;

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

interface PlayerRequestRepickEvent {
    hero: string;
    hero_facet: string;
    [key: string]: any;
}

interface NeutralItemCraftCustomPayload {
    item: string;
    enchantment: string;
    [key: string]: any;
}

@reloadable
export class GameMode {

    private currentRound: number = 0;
    private direWins: number = 0;
    private radiantWins: number = 0;
    private buyingPhase: boolean = true;
    private roundInProgress: boolean = false;
    private buyingPhaseTimer: string | undefined;
    private roundCheckTimer: string | undefined;
    private gameStarted: boolean = false; // Track if game has started

    public static Precache(this: void, context: CScriptPrecacheContext) {

        // const heroNames = ["npc_dota_hero_undying",
        //     "npc_dota_hero_pudge",
        //     "npc_dota_hero_skeleton_king",
        //     "npc_dota_hero_abyssal_underlord",
        //     "npc_dota_hero_huskar",
        //     "npc_dota_hero_alchemist",
        //     "npc_dota_hero_centaur",
        //     "npc_dota_hero_earth_spirit",
        //     "npc_dota_hero_elder_titan",
        //     "npc_dota_hero_night_stalker",
        //     "npc_dota_hero_earthshaker",
        //     "npc_dota_hero_life_stealer",
        //     "npc_dota_hero_dawnbreaker",
        //     "npc_dota_hero_legion_commander",
        //     "npc_dota_hero_kunkka",
        //     "npc_dota_hero_shredder",
        //     "npc_dota_hero_bristleback",
        //     "npc_dota_hero_chaos_knight",
        //     "npc_dota_hero_slardar",
        //     "npc_dota_hero_primal_beast",
        //     "npc_dota_hero_treant",
        //     "npc_dota_hero_omniknight",
        //     "npc_dota_hero_sven",
        //     "npc_dota_hero_mars",
        //     "npc_dota_hero_ogre_magi",
        //     "npc_dota_hero_tusk",
        //     "npc_dota_hero_rattletrap",
        //     "npc_dota_hero_lycan",
        //     "npc_dota_hero_axe",
        //     "npc_dota_hero_spirit_breaker",
        //     "npc_dota_hero_dragon_knight",
        //     "npc_dota_hero_tidehunter",
        //     "npc_dota_hero_tiny",
        //     "npc_dota_hero_doom_bringer",
        //     "npc_dota_hero_phoenix",
        //     "npc_dota_hero_brewmaster",
        //     "npc_dota_hero_nyx_assassin",
        //     "npc_dota_hero_abaddon",
        //     "npc_dota_hero_furion",
        //     "npc_dota_hero_beastmaster",
        //     "npc_dota_hero_magnataur",
        //     "npc_dota_hero_visage",
        //     "npc_dota_hero_sand_king",
        //     "npc_dota_hero_pangolier",
        //     "npc_dota_hero_venomancer",
        //     "npc_dota_hero_techies",
        //     "npc_dota_hero_marci",
        //     "npc_dota_hero_batrider",
        //     "npc_dota_hero_dazzle",
        //     "npc_dota_hero_enigma",
        //     "npc_dota_hero_void_spirit",
        //     "npc_dota_hero_death_prophet",
        //     "npc_dota_hero_bane",
        //     "npc_dota_hero_windrunner",
        //     "npc_dota_hero_spectre",
        //     "npc_dota_hero_arc_warden",
        //     "npc_dota_hero_wisp",
        //     "npc_dota_hero_snapfire",
        //     "npc_dota_hero_zuus",
        //     "npc_dota_hero_warlock",
        //     "npc_dota_hero_lion",
        //     "npc_dota_hero_jakiro",
        //     "npc_dota_hero_shadow_demon",
        //     "npc_dota_hero_queenofpain",
        //     "npc_dota_hero_chen",
        //     "npc_dota_hero_invoker",
        //     "npc_dota_hero_shadow_shaman",
        //     "npc_dota_hero_dark_seer",
        //     "npc_dota_hero_storm_spirit",
        //     "npc_dota_hero_lich",
        //     "npc_dota_hero_witch_doctor",
        //     "npc_dota_hero_silencer",
        //     "npc_dota_hero_puck",
        //     "npc_dota_hero_tinker",
        //     "npc_dota_hero_ancient_apparition",
        //     "npc_dota_hero_grimstroke",
        //     "npc_dota_hero_obsidian_destroyer",
        //     "npc_dota_hero_necrolyte",
        //     "npc_dota_hero_muerta",
        //     "npc_dota_hero_dark_willow",
        //     "npc_dota_hero_leshrac",
        //     "npc_dota_hero_enchantress",
        //     "npc_dota_hero_crystal_maiden",
        //     "npc_dota_hero_pugna",
        //     "npc_dota_hero_rubick",
        //     "npc_dota_hero_lina",
        //     "npc_dota_hero_ringmaster",
        //     "npc_dota_hero_keeper_of_the_light",
        //     "npc_dota_hero_disruptor",
        //     "npc_dota_hero_oracle",
        //     "npc_dota_hero_skywrath_mage",
        //     "npc_dota_hero_winter_wyvern",
        //     "npc_dota_hero_phantom_assassin",
        //     "npc_dota_hero_ember_spirit",
        //     "npc_dota_hero_weaver",
        //     "npc_dota_hero_kez",
        //     "npc_dota_hero_phantom_lancer",
        //     "npc_dota_hero_hoodwink",
        //     "npc_dota_hero_razor",
        //     "npc_dota_hero_lone_druid",
        //     "npc_dota_hero_terrorblade",
        //     "npc_dota_hero_templar_assassin",
        //     "npc_dota_hero_target_dummy",
        //     "npc_dota_hero_vengefulspirit",
        //     "npc_dota_hero_faceless_void",
        //     "npc_dota_hero_mirana",
        //     "npc_dota_hero_gyrocopter",
        //     "npc_dota_hero_meepo",
        //     "npc_dota_hero_slark",
        //     "npc_dota_hero_antimage",
        //     "npc_dota_hero_nevermore",
        //     "npc_dota_hero_sniper",
        //     "npc_dota_hero_juggernaut",
        //     "npc_dota_hero_clinkz",
        //     "npc_dota_hero_luna",
        //     "npc_dota_hero_viper",
        //     "npc_dota_hero_medusa",
        //     "npc_dota_hero_broodmother",
        //     "npc_dota_hero_drow_ranger",
        //     "npc_dota_hero_bounty_hunter",
        //     "npc_dota_hero_bloodseeker",
        //     "npc_dota_hero_riki",
        //     "npc_dota_hero_naga_siren",
        //     "npc_dota_hero_ursa",
        //     "npc_dota_hero_morphling",
        //     "npc_dota_hero_monkey_king",
        //     "npc_dota_hero_troll_warlord",
        // ]
        // for (const heroName of heroNames) {
        //     PrecacheUnitByNameSync(heroName, context);
        //     print(`Precached hero: ${heroName}`);
        // }

        PrecacheUnitByNameSync('npc_dota_hero_lina', context);
    }


    // fix issue with entities (brewmaster as an example)
    //Cannot create an entity because entity class is NULL -1
    // Cannot create an entity because entity class is NULL -1
    // Cannot create an entity because entity class is NULL -1
    // Cannot create an entity because entity class is NULL -1

    public static Activate(this: void) {
        GameRules.SetTimeOfDay(0.5);
        GameRules.SetStrategyTime(0);
        GameRules.SetCustomGameSetupTimeout(15);
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
        // const heroRepickManager = new HeroRepickManager();

        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("entity_killed", event => this.OnEntityKilled(event), undefined);

        CustomGameEventManager.RegisterListener<NeutralItemCraftCustomPayload>(
            "neutral_item_craft",
            (userId: EntityIndex, eventData) => {
                // Only allow crafting during buying phase
                if (!this.buyingPhase) {
                    print(`[Server] Item crafting blocked - not in buying phase`);
                    return;
                }

                const actualPlayerID = eventData.PlayerID;
                const itemNameToCraft = eventData.item;
                const enchantmentNameToApply = eventData.enchantment;

                print(`[Server] Event 'neutral_item_craft' received.`);
                print(`  Source EntityIndex (userId): ${userId}`);
                print(`  PlayerID from eventData: ${actualPlayerID}`);
                print(`  Item to craft: ${itemNameToCraft}`);
                print(`  Enchantment to use: ${enchantmentNameToApply}`);

                const hero = PlayerResource.GetSelectedHeroEntity(actualPlayerID);

                if (!hero) {
                    print(`[Server] ERROR: Could not find hero for PlayerID ${actualPlayerID}. Cannot give items.`);
                    return;
                }

                if (!itemNameToCraft || itemNameToCraft.length === 0) {
                    print(`[Server] ERROR: Invalid item name received for crafting: '${itemNameToCraft}'.`);
                    return;
                }

                if (!enchantmentNameToApply || enchantmentNameToApply.length === 0) {
                    print(`[Server] WARNING: Invalid enchantment name received: '${enchantmentNameToApply}'. This might be okay if enchantments are modifiers.`);
                }

                // Remove existing neutral item
                const neutralSlotItem = hero.GetItemInSlot(16);
                if (neutralSlotItem) {
                    print(`[Server] Hero has existing neutral item: ${neutralSlotItem.GetAbilityName()}. Removing it.`);
                    hero.RemoveItem(neutralSlotItem);
                }

                const previousEnchantement = hero.GetItemInSlot(17);
                if (previousEnchantement) {
                    print(`[Server] Hero has existing neutral item: ${previousEnchantement.GetAbilityName()}. Removing it.`);
                    hero.RemoveItem(previousEnchantement);
                }

                const fullItemScriptName = "item_" + itemNameToCraft;
                print(`[Server] Attempting to give item '${fullItemScriptName}' to hero of PlayerID ${actualPlayerID}.`);
                const createdItem = hero.AddItemByName(fullItemScriptName);

                if (createdItem !== undefined) {
                    print(`[Server] Successfully gave item '${fullItemScriptName}' to hero of PlayerID ${actualPlayerID}.`);

                    if (enchantmentNameToApply && enchantmentNameToApply.length > 0) {
                        print(`[Server] Attempting to apply enchantment modifier '${enchantmentNameToApply}' to item '${createdItem.GetAbilityName()}' or hero.`);
                        hero.AddItemByName(enchantmentNameToApply);
                        print(`[Server] Applied modifier '${enchantmentNameToApply}' to hero.`);
                    } else {
                        print(`[Server] No valid enchantment name provided or enchantment logic not implemented as modifier.`);
                    }
                } else {
                    print(`[Server] FAILED to give item '${fullItemScriptName}' to hero of PlayerID ${actualPlayerID}. (Invalid item name or inventory issue?)`);
                }
            }
        );

        // CustomGameEventManager.RegisterListener<PlayerRequestRepickEvent>(
        //     "request_repick_hero",
        //     (userId: EntityIndex, eventData: PlayerRequestRepickEvent) => {
        //         if (!this.buyingPhase) {
        //             print(`[Server] Hero repick blocked - not in buying phase`);
        //             return;
        //         }

        //         if (!eventData || typeof eventData.hero_name !== 'string' || eventData.hero_name.length === 0) {
        //             print(`[Server] Invalid or missing hero_name in request_repick_hero event. Data: ${JSON.stringify(eventData)}`);
        //             return;
        //         }

        //         const heroesKV = LoadKeyValues("scripts/npc/npc_heroes.txt") as any;

        //         if (heroesKV && heroesKV[eventData.hero_name]) {
        //             const heroData = heroesKV[eventData.hero_name];
        //             print("--- Iterating through hero's data ---");
        //             this.printTable(heroData);

        //             const playerId = userId as PlayerID;
        //             const playerEntity = PlayerResource.GetPlayer(playerId);

        //             if (!playerEntity) {
        //                 print(`[Server] Could not find player entity for userId ${userId}`);
        //                 return;
        //             }

        //             const playerTeam = PlayerResource.GetTeam(playerId);
        //             print(`[Server] Player ${playerId} is on team ${playerTeam}`);

        //             // Get current hero's gold and XP before replacement
        //             const existingHero = PlayerResource.GetSelectedHeroEntity(playerId);
        //             let currentGold = 0;
        //             let currentXP = 0;

        //             if (existingHero && IsValidEntity(existingHero)) {
        //                 currentGold = PlayerResource.GetGold(playerId);
        //                 currentXP = existingHero.GetCurrentXP();
        //                 print(`[Server] Storing hero stats - Gold: ${currentGold}, XP: ${currentXP}`);
        //             }

        //             // Method 1: Use ReplaceHeroWith (Recommended - handles cleanup automatically)
        //             try {
        //                 print(`[Server] Replacing hero ${eventData.hero_name} for player ${playerId}`);
        //                 PlayerResource.ReplaceHeroWith(playerId, eventData.hero_name, currentGold, currentXP);

        //                 // Wait a frame to ensure hero is created, then set up properties
        //                 Timers.CreateTimer(0.03, () => {
        //                     const newHero = PlayerResource.GetSelectedHeroEntity(playerId);
        //                     if (newHero && IsValidEntity(newHero)) {
        //                         print(`[Server] Hero replacement successful`);

        //                         // Ensure proper team assignment
        //                         if (newHero.GetTeamNumber() !== playerTeam) {
        //                             newHero.SetTeam(playerTeam);
        //                             print(`[Server] Corrected hero team to ${playerTeam}`);
        //                         }

        //                         // Set hero properties
        //                         newHero.SetIdleAcquire(true);
        //                         newHero.SetAcquisitionRange(800);

        //                         // Move camera to new hero
        //                         PlayerResource.SetCameraTarget(playerId, newHero);

        //                         print(`[Server] Hero setup completed for ${eventData.hero_name}`);
        //                         print(`[Server] Hero team: ${newHero.GetTeamNumber()}, Player team: ${playerTeam}`);
        //                     } else {
        //                         print(`[Server] Failed to get new hero after replacement`);
        //                         // Fallback to manual creation if ReplaceHeroWith fails
        //                         this.createHeroManually(playerId, eventData.hero_name, playerTeam, currentGold, currentXP);
        //                     }
        //                     return;
        //                 });

        //             } catch (error) {
        //                 print(`[Server] ReplaceHeroWith failed: ${error}`);
        //                 // Fallback to manual creation
        //                 this.createHeroManually(playerId, eventData.hero_name, playerTeam, currentGold, currentXP);
        //             }

        //             EmitGlobalSound("UI.Button.Pressed");
        //         } else {
        //             print(`[Server] Hero data not found for ${eventData.hero_name}`);
        //         }
        //     }
        // );


        // CustomGameEventManager.RegisterListener<PlayerRequestRepickEvent>(
        //     "request_repick_hero",
        //     (userId: EntityIndex, eventData: PlayerRequestRepickEvent) => {
        //         // Use the hero repick manager to handle the request
        //         // heroRepickManager.handleRepickRequest(userId, eventData);

        //         // GameRules.state
        //     }
        // );

        DebugCreateHeroWithVariant

        CustomGameEventManager.RegisterListener<PlayerRequestRepickEvent>(
            "request_repick_hero",
            (userId: EntityIndex, eventData: PlayerRequestRepickEvent) => {
                const heroName = eventData.heroName || eventData.hero;
                const playerId = eventData.playerId;

                if (!this.buyingPhase || !heroName || playerId === undefined) {
                    return;
                }


                // Async precache then replace hero
                PrecacheUnitByNameAsync(heroName, () => {
                    // ReplaceHeroWith(playerId, heroName, gold, lumber)
                    const newHero = PlayerResource.ReplaceHeroWith(playerId, heroName, 99999, 0); // maximum gold
                    newHero.GetHeroFacetID();
                }, 0);

            });
    }


    public ExtractAllHeroFacets() {
        print("=== Extracting All Hero Facets ===");

        // Load the npc_heroes.txt file
        const heroesData = LoadKeyValues("scripts/npc/npc_heroes.txt") as { [key: string]: any };

        if (!heroesData) {
            print("ERROR: Could not load npc_heroes.txt");
            return;
        }

        const facetDictionary: { [heroName: string]: { [facetKey: string]: any } } = {};

        // Iterate through each hero in the file
        for (const heroName in heroesData) {
            const heroData = heroesData[heroName];

            // Skip if not a hero entry or if it's a comment/metadata
            if (!heroData || typeof heroData !== 'object') {
                continue;
            }

            // Check if this hero has facets
            if (heroData.Facets) {
                print(`\n--- ${heroName} ---`);
                facetDictionary[heroName] = {};

                // Iterate through each facet of this hero
                for (const facetKey in heroData.Facets) {
                    const facetData = heroData.Facets[facetKey];

                    print(`  Facet: ${facetKey}`);
                    if (facetData && typeof facetData === 'object') {
                        // Print facet details
                        for (const property in facetData) {
                            print(`    ${property}: ${facetData[property]}`);
                        }
                    }

                    // Store in dictionary
                    facetDictionary[heroName][facetKey] = facetData;
                }
            }
        }

        // Print summary
        print("\n=== SUMMARY ===");
        const heroesWithFacets = Object.keys(facetDictionary);
        print(`Total heroes with facets: ${heroesWithFacets.length}`);

        for (const heroName of heroesWithFacets) {
            const facetCount = Object.keys(facetDictionary[heroName]).length;
            print(`${heroName}: ${facetCount} facets`);
        }

        print("\n=== FACET DICTIONARY COMPLETE ===");

        // Return the dictionary for further use
        return facetDictionary;
    }


    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5);
        GameRules.SetHeroRespawnEnabled(false);
        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
        GameRules.SetUseUniversalShopMode(true);
        GameRules.SetSameHeroSelectionEnabled(true);
    }


    private createHeroManually(playerId: PlayerID, heroName: string, playerTeam: number, gold: number, xp: number): void {
        print(`[Server] Using manual hero creation for ${heroName}`);

        // Get spawn location for the team
        let spawnOrigin: Vector;
        if (playerTeam === 2) { // DOTA_TEAM_GOODGUYS
            const spawn = Entities.FindByClassname(undefined, "info_player_start_goodguys");
            spawnOrigin = spawn ? spawn.GetAbsOrigin() : Vector(-7000, -6500, 512);
        } else { // DOTA_TEAM_BADGUYS (3)
            const spawn = Entities.FindByClassname(undefined, "info_player_start_badguys");
            spawnOrigin = spawn ? spawn.GetAbsOrigin() : Vector(7000, 6500, 512);
        }

        // Remove existing hero properly
        const existingHero = PlayerResource.GetSelectedHeroEntity(playerId);
        if (existingHero && IsValidEntity(existingHero)) {
            print(`[Server] Removing existing hero for player ${playerId}`);

            // Don't issue orders to dead/invalid units
            if (existingHero.IsAlive()) {
                ExecuteOrderFromTable({
                    UnitIndex: existingHero.entindex(),
                    OrderType: 1, // DOTA_UNIT_ORDER_STOP
                    Queue: false
                });
            }

            // Proper hero removal
            Timers.CreateTimer(0.03, () => {
                if (IsValidEntity(existingHero)) {
                    existingHero.AddNoDraw();
                    existingHero.ForceKill(false);
                    existingHero.RemoveSelf();
                }
                return;
            });
        }

        // Create new hero after cleanup
        Timers.CreateTimer(0.1, () => {
            print(`[Server] Creating new hero ${heroName} for player ${playerId} on team ${playerTeam}`);

            // Create hero with proper team assignment
            const newHero = CreateUnitByName(
                heroName,
                spawnOrigin,
                true,           // findClearSpace
                undefined,      // owner
                undefined,      // spawnEntity  
                playerTeam      // team - this is crucial!
            ) as CDOTA_BaseNPC_Hero;

            if (newHero && IsValidEntity(newHero)) {
                print(`[Server] Hero ${heroName} created successfully`);

                // Critical: Set player ownership BEFORE team assignment
                newHero.SetPlayerID(playerId);
                newHero.SetControllableByPlayer(playerId, true);

                // Force correct team assignment
                newHero.SetTeam(playerTeam);

                // Set up hero-player relationship (PlayerResource doesn't have SetSelectedHeroEntity)
                // The ReplaceHeroWith method should handle this automatically
                // If using manual creation, the hero should already be linked via SetPlayerID

                // Restore stats
                if (gold > 0) {
                    PlayerResource.SetGold(playerId, gold, false);
                }
                if (xp > 0) {
                    newHero.AddExperience(xp, 0, false, true); // 0 = DOTA_ModifyXP_Unspecified
                }

                // Set hero properties
                newHero.SetIdleAcquire(true);
                newHero.SetAcquisitionRange(800);

                // Move camera to new hero
                PlayerResource.SetCameraTarget(playerId, newHero);

                print(`[Server] Manual hero setup completed for ${heroName}`);
                print(`[Server] Hero team: ${newHero.GetTeamNumber()}, Player team: ${playerTeam}`);
                print(`[Server] Hero controlled by player: ${newHero.GetPlayerOwnerID()}`);

            } else {
                print(`[Server] Failed to create hero ${heroName} manually`);
            }

            return;
        });
    }

    public printTable(obj: any, indent: string = ""): void {
        for (const key in obj) {
            const value = obj[key];

            if (typeof value === 'object' && value !== null) {
                print(`${indent}${tostring(key)}: [Table]`);
                this.printTable(value, indent + "----");
            } else {
                print(`${indent}${tostring(key)}: ${tostring(value)}`);
            }
        }
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
        //     for (let i = 0; i < 2; i++) {
        //         Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
        //     }
        // }

        // const heroNameAxe = "npc_dota_hero_axe";
        // const heroesKV = LoadKeyValues("scripts/npc/npc_heroes.txt") as any; // Or npc_heroes_custom.txt

        // if (heroesKV && heroesKV[heroNameAxe]) {
        //     const axeData = heroesKV[heroNameAxe]; // This is the table for Axe's specific data

        //     print("--- Iterating through Axe's data ---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //     this.printTable(axeData, 'Facets');
        // }


        if (state === GameState.CUSTOM_GAME_SETUP) {
            if (IsInToolsMode()) {
                Timers.CreateTimer(1, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }

        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("Game starting!");
        this.gameStarted = true;
        this.StartBuyingPhase();
        const heroName = "npc_dota_hero_lina"; // Example hero name, replace with actual logic
    }

    private StartBuyingPhase(): void {
        this.currentRound++;
        this.buyingPhase = true;
        this.roundInProgress = false;

        print(`[Server] Starting buying phase for Round ${this.currentRound
            }`);

        // Show HUD elements for buying phase
        this.ShowHUDElements();

        // Resurrect and heal all heroes, teleport them to spawn
        this.PrepareHeroesForRound();

        // Stun all heroes
        this.StunAllHeroes();

        // Enable buying
        GameRules.SetUseUniversalShopMode(true);

        // Send message to all players
        GameRules.SendCustomMessage(`Buying Phase - Round ${this.currentRound} !You have ${buyingPhaseTime} seconds to prepare.`, 0, 0);

        // Start timer for buying phase
        this.buyingPhaseTimer = Timers.CreateTimer(buyingPhaseTime, () => {
            this.StartRound();
            return undefined;
        });
    }

    private StartRound(): void {
        this.buyingPhase = false;
        this.roundInProgress = true;

        print(`[Server] Starting Round ${this.currentRound} `);

        // Hide HUD elements during round
        this.HideHUDElements();

        // Unstun all heroes
        this.UnstunAllHeroes();

        // Disable buying
        GameRules.SetUseUniversalShopMode(false);

        // Send message to all players
        GameRules.SendCustomMessage(`Round ${this.currentRound} Started!`, 0, 0);

        // Start checking for round end
        this.StartRoundCheck();
    }

    private StartRoundCheck(): void {
        this.roundCheckTimer = Timers.CreateTimer(1, () => {
            if (this.roundInProgress) {
                const radiantAlive = this.CountAliveHeroes(DotaTeam.GOODGUYS);
                const direAlive = this.CountAliveHeroes(DotaTeam.BADGUYS);

                if (radiantAlive === 0) {
                    this.EndRound(DotaTeam.BADGUYS);
                    return undefined;
                } else if (direAlive === 0) {
                    this.EndRound(DotaTeam.GOODGUYS);
                    return undefined;
                }

                return 1; // Continue checking every second
            }
            return undefined;
        });
    }

    private EndRound(winningTeam: DotaTeam): void {
        this.roundInProgress = false;

        if (this.roundCheckTimer) {
            Timers.RemoveTimer(this.roundCheckTimer);
            this.roundCheckTimer = undefined;
        }

        if (winningTeam === DotaTeam.GOODGUYS) {
            this.radiantWins++;
            GameRules.SendCustomMessage(`Radiant wins Round ${this.currentRound} !Score: Radiant ${this.radiantWins} - ${this.direWins} Dire`, 0, 0);
        } else {
            this.direWins++;
            GameRules.SendCustomMessage(`Dire wins Round ${this.currentRound} !Score: Radiant ${this.radiantWins} - ${this.direWins} Dire`, 0, 0);
        }

        print(`[Server] Round ${this.currentRound} ended.Winner: ${winningTeam === DotaTeam.GOODGUYS ? "Radiant" : "Dire"} `);

        // Start next buying phase after a short delay
        Timers.CreateTimer(3, () => {
            this.StartBuyingPhase();
            return undefined;
        });
    }

    private CountAliveHeroes(team: DotaTeam): number {
        let aliveCount = 0;

        for (let playerId = 0; playerId < 24; playerId++) {
            if (PlayerResource.IsValidPlayerID(playerId) && PlayerResource.GetTeam(playerId) === team) {
                const hero = PlayerResource.GetSelectedHeroEntity(playerId);
                if (hero && hero.IsAlive()) {
                    aliveCount++;
                }
            }
        }

        return aliveCount;
    }

    private StunAllHeroes(): void {
        for (let playerId = 0; playerId < 24; playerId++) {
            if (PlayerResource.IsValidPlayerID(playerId)) {
                const hero = PlayerResource.GetSelectedHeroEntity(playerId);
                if (hero) {

                    // Remove existing stun first to avoid stacking
                    hero.RemoveModifierByName("modifier_stunned");
                    // Add new infinite stun
                    hero.AddNewModifier(hero, undefined, "modifier_stunned", { duration: -1 });
                    print(`[Server] Stunned hero: ${hero.GetUnitName()} `);
                }
            }
        }
    }

    private UnstunAllHeroes(): void {
        for (let playerId = 0; playerId < 24; playerId++) {
            if (PlayerResource.IsValidPlayerID(playerId)) {
                const hero = PlayerResource.GetSelectedHeroEntity(playerId);
                if (hero) {
                    hero.RemoveAllModifiers(1, true, false, true);
                    print(`[Server] Unstunned hero: ${hero.GetUnitName()} `);
                }
            }
        }
    }

    private PrepareHeroesForRound(): void {
        // Find spawn entities for both teams
        const radiantPlayerStartEntity = Entities.FindByClassname(undefined, "info_player_start_goodguys") as CBaseEntity;
        const direPlayerStartEntity = Entities.FindByClassname(undefined, "info_player_start_badguys") as CBaseEntity;

        if (!radiantPlayerStartEntity) {
            print("[Server] ERROR: Could not find info_player_start_goodguys entity!");
            return;
        }

        if (!direPlayerStartEntity) {
            print("[Server] ERROR: Could not find info_player_start_badguys entity!");
            return;
        }

        const radiantSpawnLocation = radiantPlayerStartEntity.GetAbsOrigin();
        const direSpawnLocation = direPlayerStartEntity.GetAbsOrigin();

        for (let playerId = 0; playerId < 24; playerId++) {
            if (PlayerResource.IsValidPlayerID(playerId)) {
                const hero = PlayerResource.GetSelectedHeroEntity(playerId);
                if (hero) {
                    const playerTeam = PlayerResource.GetTeam(playerId);

                    // Resurrect hero if dead
                    if (!hero.IsAlive()) {
                        hero.RespawnHero(false, false);
                        print(`[Server] Resurrected hero: ${hero.GetUnitName()} `);
                    }

                    // remove cooldown modifiers
                    this.RemoveCooldowns(hero as CDOTA_BaseNPC_Hero);

                    // Teleport to appropriate spawn location
                    if (playerTeam === DotaTeam.GOODGUYS) {
                        hero.SetAbsOrigin(radiantSpawnLocation);
                        FindClearSpaceForUnit(hero, radiantSpawnLocation, false);
                        print(`[Server] Teleported ${hero.GetUnitName()} to Radiant spawn`);
                    } else if (playerTeam === DotaTeam.BADGUYS) {
                        hero.SetAbsOrigin(direSpawnLocation);
                        FindClearSpaceForUnit(hero, direSpawnLocation, false);
                        print(`[Server] Teleported ${hero.GetUnitName()} to Dire spawn`);
                    }

                    // Heal hero to full
                    hero.SetHealth(hero.GetMaxHealth());
                    hero.SetMana(hero.GetMaxMana());
                }
            }
        }
    }

    private RemoveCooldowns(hero: CDOTA_BaseNPC_Hero): void {
        for (let i = 0; i < hero.GetAbilityCount(); i++) {
            const ability = hero.GetAbilityByIndex(i);
            if (ability && ability.IsCooldownReady && !ability.IsCooldownReady()) {
                ability.EndCooldown();
                ability.RefreshCharges();
            }
        }

        // Refresh items
        for (let i = 0; i < 18; i++) {
            const item = hero.GetItemInSlot(i);
            if (item && item.IsCooldownReady && !item.IsCooldownReady()) {
                item.EndCooldown();
            }
        }
    }

    private ShowHUDElements(): void {
        // Send custom game event to show HUD elements
        const eventData = {};
        (CustomGameEventManager.Send_ServerToAllClients as any)("show_hud_elements", eventData);
    }

    private HideHUDElements(): void {
        // Send custom game event to hide specific HUD elements
        const eventData = {
            elements: ["repick_hero_button.xml", "neutral_items_button.xml"]
        };
        (CustomGameEventManager.Send_ServerToAllClients as any)("hide_hud_elements", eventData);
    }

    private OnEntityKilled(event: EntityKilledEvent): void {
        const killedUnit = EntIndexToHScript(event.entindex_killed) as CDOTA_BaseNPC;

        if (killedUnit && killedUnit.IsRealHero() && this.roundInProgress) {
            print(`[Server] Hero killed: ${killedUnit.GetUnitName()} `);
            // The round check timer will handle checking if all heroes of a team are dead
        }
    }

    public Reload() {
        print("Script reloaded!");

        // Clean up timers on reload
        if (this.buyingPhaseTimer) {
            Timers.RemoveTimer(this.buyingPhaseTimer);
            this.buyingPhaseTimer = undefined;
        }

        if (this.roundCheckTimer) {
            Timers.RemoveTimer(this.roundCheckTimer);
            this.roundCheckTimer = undefined;
        }
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        if (unit.IsRealHero()) {
            unit.AddExperience(100000, 8, false, true);
            unit.SetGold(200000, false);
            this.UpgradeRegularAbilities(unit);
            this.UpgradeTalentsWithUI(unit);
            unit.AddNewModifier(unit, undefined, "modifier_item_aghanims_shard", {});

            if (this.currentRound === 1) {
                Timers.CreateTimer(0.1, () => {
                    this.ClearHeroInventory(unit as CDOTA_BaseNPC_Hero);
                    return undefined;
                });
            }

            this.AddMoonShardBuff(unit);

            // Stun hero if game has started and we're in buying phase
            if (this.gameStarted && this.buyingPhase) {
                Timers.CreateTimer(0.2, () => {
                    if (unit && unit.IsAlive()) {
                        unit.AddNewModifier(unit, undefined, "modifier_stunned", { duration: -1 });
                        print(`[Server] Stunned newly spawned hero: ${unit.GetUnitName()} `);
                    }
                    return undefined;
                });
            }
        }
    }

    private ClearHeroInventory(hero: CDOTA_BaseNPC_Hero) {
        for (let slot = 0; slot < 9; slot++) {
            const item = hero.GetItemInSlot(slot);
            if (item) {
                hero.RemoveItem(item);
            }
        }

        for (let slot = 9; slot <= 17; slot++) {
            const item = hero.GetItemInSlot(slot);
            if (item) {
                const itemName = item.GetAbilityName();
                hero.RemoveItem(item);
                print(`Removed ${itemName} from stash`);
            }
        }

        print(`Cleared inventory for ${hero.GetUnitName()}`);
    }

    private AddMoonShardBuff(hero: CDOTA_BaseNPC_Hero) {
        hero.AddNewModifier(hero, undefined, "modifier_item_moon_shard_consumed", {});
    }

    private UpgradeRegularAbilities(hero: CDOTA_BaseNPC_Hero) {
        const abilities = hero.GetAbilityCount();

        for (let i = 0; i < abilities; i++) {
            const ability = hero.GetAbilityByIndex(i);
            if (ability) {
                const abilityName = ability.GetAbilityName();

                if (!abilityName.includes("special_bonus") &&
                    !abilityName.includes("generic_hidden") &&
                    !abilityName.includes("special_bonus_attributes") &&
                    !abilityName.includes("ability_capture") &&
                    !abilityName.includes("portal_warp") &&
                    !abilityName.includes("ability_lamp_use") &&
                    !abilityName.includes("release")) {

                    ability.SetLevel(8);
                    print(`Set ${abilityName} to level 4`);
                }
            }
        }
    }

    private UpgradeTalentsWithUI(hero: CDOTA_BaseNPC_Hero) {
        const abilities = hero.GetAbilityCount();

        for (let i = 0; i < abilities; i++) {
            const ability = hero.GetAbilityByIndex(i);
            if (ability && ability.GetAbilityName().includes("special_bonus")) {
                const abilityName = ability.GetAbilityName();

                if (ability.GetLevel() === 0) {
                    ability.SetLevel(1);

                    try {
                        hero.UpgradeAbility(ability as any);
                    } catch (e) {
                        print(`UpgradeAbility failed for ${abilityName}, using SetLevel instead`);
                    }

                    print(`Upgraded talent: ${abilityName} to level ${ability.GetLevel()} `);
                }
            }
        }

        hero.CalculateStatBonus(true);
    }
}