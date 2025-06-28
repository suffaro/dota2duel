// HeroRepickManager.ts - Fixed version

interface PlayerRequestRepickEvent {
  hero_name?: string; // Made optional to match your existing interface
  hero?: string; // Keep original property name as fallback
  hero_facet?: string;
  [key: string]: any;
}

export class HeroRepickManager {
  private isRepickingInProgress: boolean = false;
  private repickQueue: Array<{ playerId: PlayerID, heroName: string }> = [];
  private buyingPhase: boolean = true;

  constructor() {
    // Register the event listener here
    this.registerEventListeners();
  }

  private registerEventListeners(): void {
    CustomGameEventManager.RegisterListener<PlayerRequestRepickEvent>(
      "request_repick_hero",
      (userId: EntityIndex, eventData: PlayerRequestRepickEvent) => {
        // Handle both hero_name and hero for compatibility
        const heroName = eventData.hero_name || eventData.hero;
        const processedData = { ...eventData, hero_name: heroName };
        this.handleRepickRequest(userId, processedData);
      }
    );
  }

  public handleRepickRequest(userId: EntityIndex, eventData: PlayerRequestRepickEvent): void {
    if (!this.buyingPhase) {
      print(`[Server] Hero repick blocked - not in buying phase`);
      return;
    }

    // Handle both hero_name and hero properties for compatibility
    const heroName = eventData.hero_name || eventData.hero;
    if (!heroName || typeof heroName !== 'string' || heroName.length === 0) {
      print(`[Server] Invalid hero name in repick request`);
      return;
    }

    const playerId = userId as PlayerID;

    // Validate player exists
    if (!PlayerResource.IsValidPlayer(playerId)) {
      print(`[Server] Invalid player ID: ${playerId}`);
      return;
    }

    if (this.isRepickingInProgress) {
      print(`[Server] Queueing repick request for player ${playerId}`);
      this.repickQueue.push({ playerId, heroName });
      return;
    }

    this.performHeroRepick(playerId, heroName);
  }

  public setBuyingPhase(enabled: boolean): void {
    this.buyingPhase = enabled;
  }

  public canRepickHero(playerId: PlayerID): boolean {
    if (!this.buyingPhase) return false;
    if (this.isRepickingInProgress) return false;

    const gameState = GameRules.State_Get();
    return gameState <= 5; // DOTA_GAMERULES_STATE_PRE_GAME is typically 5
  }

  private performHeroRepick(playerId: PlayerID, heroName: string): void {
    this.isRepickingInProgress = true;

    print(`[Server] Starting hero repick for player ${playerId} -> ${heroName}`);

    // Try multiple methods to find the existing hero
    const existingHero = this.findPlayerHero(playerId);
    const playerTeam = PlayerResource.GetTeam(playerId);

    print(`[Server] Player ${playerId} is on team ${playerTeam}`);
    print(`[Server] Found existing hero: ${existingHero ? existingHero.GetUnitName() : 'none'}`);

    // Proceed with replacement even if no existing hero is found
    // This handles the case where the hero selection hasn't fully completed
    this.executeHeroReplacement(playerId, heroName, playerTeam, existingHero);
  }

  private findPlayerHero(playerId: PlayerID): CDOTA_BaseNPC_Hero | null {
    // Method 1: Try PlayerResource (most reliable when it works)
    let hero = PlayerResource.GetSelectedHeroEntity(playerId);
    if (hero && IsValidEntity(hero)) {
      return hero;
    }

    // Method 2: Search through all heroes by player ID
    let heroEntity: CDOTA_BaseNPC_Hero | null = null;

    // Find hero by iterating through all hero entities
    let currentHero = Entities.FindByClassname(undefined, "npc_dota_hero*") as CDOTA_BaseNPC_Hero;
    while (currentHero !== undefined) {
      if (IsValidEntity(currentHero) && currentHero.GetPlayerOwnerID() === playerId) {
        heroEntity = currentHero;
        break;
      }
      currentHero = Entities.FindByClassname(currentHero, "npc_dota_hero*") as CDOTA_BaseNPC_Hero;
    }

    if (heroEntity) {
      return heroEntity;
    }

    // Method 3: Try GetPlayerHeroEntityByPlayerID if available
    const playerController = PlayerResource.GetPlayer(playerId);
    if (playerController) {
      hero = playerController.GetAssignedHero();
      if (hero && IsValidEntity(hero)) {
        return hero;
      }
    }

    return null;
  }
  private executeHeroReplacement(playerId: PlayerID, heroName: string, playerTeam: number, existingHero: CDOTA_BaseNPC_Hero | null): void {
    // Store current stats
    let currentGold = PlayerResource.GetGold(playerId);
    let currentXP = 0;
    let currentLevel = 1;
    let heroPosition = this.getTeamSpawnLocation(playerTeam);

    if (existingHero && IsValidEntity(existingHero)) {
      currentXP = existingHero.GetCurrentXP();
      currentLevel = existingHero.GetLevel();
      heroPosition = existingHero.GetAbsOrigin();
      print(`[Server] Found existing hero with Level=${currentLevel}, XP=${currentXP}`);
    } else {
      print(`[Server] No existing hero found, creating new hero with defaults`);
    }

    print(`[Server] Replacing hero: Team=${playerTeam}, Gold=${currentGold}, Level=${currentLevel}`);

    // Method 1: Try the cleaner approach using game functions
    this.replaceHeroDirectly(playerId, heroName, playerTeam, currentGold, currentXP, currentLevel, heroPosition, existingHero);
  }

  private replaceHeroDirectly(
    playerId: PlayerID,
    heroName: string,
    playerTeam: number,
    gold: number,
    xp: number,
    level: number,
    position: Vector,
    existingHero: CDOTA_BaseNPC_Hero | null
  ): void {

    // Step 1: Safely remove existing hero if it exists
    if (existingHero && IsValidEntity(existingHero)) {
      print(`[Server] Removing existing hero: ${existingHero.GetUnitName()}`);

      // Stop all actions first
      existingHero.Stop();
      existingHero.Hold();

      // Remove from game
      existingHero.AddNoDraw(); // Hide the hero

      // Use a small delay before killing to ensure state is clean
      Timers.CreateTimer(0.1, () => {
        if (IsValidEntity(existingHero)) {
          existingHero.ForceKill(false);
          UTIL_Remove(existingHero);
        }
        return;
      });
    }

    // Step 2: Create new hero after cleanup
    const delay = existingHero ? 0.3 : 0.1; // Shorter delay if no existing hero
    Timers.CreateTimer(delay, () => {
      // Create hero at proper spawn location
      const spawnOrigin = this.getTeamSpawnLocation(playerTeam);

      print(`[Server] Creating new hero ${heroName} at ${spawnOrigin} for team ${playerTeam}`);

      const newHero = CreateUnitByName(
        heroName,
        spawnOrigin,
        true,
        undefined,
        undefined,
        playerTeam
      ) as CDOTA_BaseNPC_Hero;

      if (!newHero || !IsValidEntity(newHero)) {
        print(`[Server] Failed to create new hero: ${heroName}`);
        this.isRepickingInProgress = false;
        return;
      }

      print(`[Server] Successfully created hero: ${newHero.GetUnitName()}`);

      // Step 3: Set up the new hero properly
      this.configureNewHero(newHero, playerId, playerTeam, gold, xp, level);

      // Step 4: Update player resource mapping (commented out - method doesn't exist)
      // PlayerResource.SetHasSelectedHero(playerId, true);

      print(`[Server] Hero repick completed successfully`);

      // Complete the repick process
      this.finishRepick();

      return;
    });
  }

  private getTeamSpawnLocation(team: number): Vector {
    let spawnOrigin: Vector;

    if (team === 2) { // DOTA_TEAM_GOODGUYS
      const spawn = Entities.FindByClassname(undefined, "info_player_start_goodguys");
      spawnOrigin = spawn ? spawn.GetAbsOrigin() : Vector(-7000, -6500, 384);
    } else if (team === 3) { // DOTA_TEAM_BADGUYS
      const spawn = Entities.FindByClassname(undefined, "info_player_start_badguys");
      spawnOrigin = spawn ? spawn.GetAbsOrigin() : Vector(7000, 6500, 384);
    } else {
      // Fallback for other teams
      spawnOrigin = Vector(0, 0, 384);
    }

    return spawnOrigin;
  }

  private configureNewHero(
    hero: CDOTA_BaseNPC_Hero,
    playerId: PlayerID,
    playerTeam: number,
    gold: number,
    xp: number,
    level: number
  ): void {
    // Essential hero setup
    hero.SetPlayerID(playerId);
    hero.SetControllableByPlayer(playerId, true);

    // Set owner safely
    const playerController = PlayerResource.GetPlayer(playerId);
    if (playerController) {
      hero.SetOwner(playerController);
    }

    // Ensure correct team (this is crucial!)
    hero.SetTeam(playerTeam);

    // Make sure the hero is properly spawned
    hero.SetAbsOrigin(hero.GetAbsOrigin());
    hero.SetForwardVector(hero.GetForwardVector());

    // Restore resources
    if (gold > 0) {
      PlayerResource.SetGold(playerId, gold, false);
    }

    // Restore level and experience
    if (level > 1) {
      // Set level directly if possible
      for (let i = 1; i < level; i++) {
        hero.HeroLevelUp(false);
      }
    }

    if (xp > 0) {
      hero.AddExperience(xp, 0, false, true); // Use 0 instead of enum
    }

    // Set hero properties
    hero.SetIdleAcquire(true);
    hero.SetAcquisitionRange(800);

    // Make sure camera follows the new hero
    Timers.CreateTimer(0.1, () => {
      PlayerResource.SetCameraTarget(playerId, hero);
      return;
    });

    // Visual/audio feedback
    EmitGlobalSound("General.Ping");

    print(`[Server] New hero configured - Team: ${hero.GetTeamNumber()}, Owner: ${hero.GetPlayerOwnerID()}`);
  }

  private finishRepick(): void {
    this.isRepickingInProgress = false;

    // Process any queued repicks
    if (this.repickQueue.length > 0) {
      const nextRepick = this.repickQueue.shift();
      if (nextRepick) {
        print(`[Server] Processing queued repick for player ${nextRepick.playerId}`);
        Timers.CreateTimer(1.0, () => {
          this.performHeroRepick(nextRepick.playerId, nextRepick.heroName);
          return;
        });
      }
    }
  }
}

// Usage example:
// const heroRepickManager = new HeroRepickManager();
//
// // To disable repicking after buying phase:
// heroRepickManager.setBuyingPhase(false);