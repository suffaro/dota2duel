export interface HeroFacet {
  name: string;
  displayName: string;
  color: string;
  gradientID: number;
  icon: string;
  abilities?: any;
}

export interface FacetUIData {
  heroName: string;
  facets: HeroFacet[];
}

// Interface for custom game event data
export interface FacetSelectionEventData {
  PlayerID: PlayerID;
  hero_name: string;
  selected_facet: string;
}

export class HeroFacetsManager {

  /**
   * Retrieves all available facets for a specific hero
   */
  public getHeroFacets(heroName: string): HeroFacet[] {
    // Add this check at the very beginning
    if (typeof heroName !== 'string' || heroName.length === 0) {
      // Using Error() might be better for logs if your logger supports it, otherwise print.
      print(`Error: getHeroFacets was called with an invalid heroName (value: ${heroName}). Returning empty array.`);
      return [];
    }

    const heroesKV = LoadKeyValues("scripts/npc/npc_heroes.txt") as any;

    if (!heroesKV || !heroesKV[heroName]) {
      // Now, heroName is guaranteed to be a non-empty string here,
      // so the concatenation will not fail due to a nil value.
      print(`Hero ${heroName} not found in heroes data (or heroesKV failed to load).`);
      return [];
    }

    const heroData = heroesKV[heroName];

    // Check if hero has facets
    if (!heroData.Facets || typeof heroData.Facets !== 'object') {
      print(`No facets found for hero ${heroName}`);
      return [];
    }

    const facetsData = heroData.Facets;
    const facets: HeroFacet[] = [];

    // Iterate through each facet
    for (const facetKey in facetsData) {
      const facetData = facetsData[facetKey];

      if (typeof facetData === 'object' && facetData !== null) {
        const displayName = this.convertFacetNameToDisplay(facetKey);

        const facet: HeroFacet = {
          name: facetKey,
          displayName: displayName,
          color: facetData.Color || "Unknown",
          gradientID: facetData.GradientID || 0,
          icon: facetData.Icon || "default",
          abilities: facetData.Abilities || null
        };

        facets.push(facet);
      }
    }
    return facets;
  }

  /**
   * Convert internal facet name to display name
   * e.g., "axe_one_man_army" -> "One Man Army"
   */
  private convertFacetNameToDisplay(facetName: string): string {
    // Remove hero prefix (e.g., "axe_")
    let displayName = facetName.replace("^%l+_", '');

    // Replace underscores with spaces and capitalize each word
    displayName = displayName.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return displayName;
  }

  /**
   * Get facet UI data ready for CustomUI
   */
  public getFacetUIData(heroName: string): FacetUIData {
    const facets = this.getHeroFacets(heroName);

    return {
      heroName: heroName,
      facets: facets
    };
  }

  /**
   * Create dynamic UI for facet selection
   */
  public createFacetSelectionUI(playerID: PlayerID, heroName: string): void {
    const facetData = this.getFacetUIData(heroName);

    if (facetData.facets.length === 0) {
      print(`No facets available for ${heroName}`);
      return;
    }

    // Create the UI data structure for CustomUI
    const uiData: Record<string, any> = {
      hero_name: heroName,
      facets: facetData.facets.map(facet => ({
        name: facet.name,
        display_name: facet.displayName,
        color: facet.color,
        icon: facet.icon,
        gradient_id: facet.gradientID
      }))
    };

    // Send to panorama UI
    const player = PlayerResource.GetPlayer(playerID);
    if (player) {
      CustomGameEventManager.Send_ServerToPlayer(
        player,
        "show_facet_selection",
        uiData as never
      );
    }
  }

  /**
   * Debug function to print all facets for a hero
   */
  public debugPrintHeroFacets(heroName: string): void {
    const facets = this.getHeroFacets(heroName);

    print(`=== FACETS FOR ${heroName} ===`);
    for (const facet of facets) {
      print(`Facet: ${facet.displayName}`);
      print(`  Internal Name: ${facet.name}`);
      print(`  Color: ${facet.color}`);
      print(`  Icon: ${facet.icon}`);
      print(`  Gradient ID: ${facet.gradientID}`);
      if (facet.abilities) {
        print(`  Has Special Abilities: Yes`);
      }
      print("---");
    }
  }

  /**
   * Handle facet selection from client
   */
  public handleFacetSelection(playerID: PlayerID, heroName: string, selectedFacet: string): void {
    // Validate the facet exists
    const availableFacets = this.getHeroFacets(heroName);
    const facet = availableFacets.find(f => f.name === selectedFacet);

    if (!facet) {
      print(`Invalid facet ${selectedFacet} for hero ${heroName}`);
      return;
    }

    print(`Player ${playerID} selected facet ${facet.displayName} for hero ${heroName}`);

    // Your hero swapping logic here
    this.swapHeroWithFacet(playerID, heroName, selectedFacet);
  }

  /**
   * Swap hero with selected facet
   */
  private swapHeroWithFacet(playerID: PlayerID, heroName: string, facetName: string): void {
    const player = PlayerResource.GetPlayer(playerID);
    if (!player) return;

    const oldHero = player.GetAssignedHero();
    if (oldHero !== undefined) {
      // Store hero position and other relevant data
      const position = oldHero.GetAbsOrigin();
      const level = oldHero.GetLevel();
      const gold = PlayerResource.GetGold(playerID);

      // Remove old hero
      oldHero.RemoveSelf();

      // Create new hero with facet
      const newHero = PlayerResource.ReplaceHeroWith(playerID, heroName, gold, 0);
      if (newHero !== undefined) {
        // Set position and level
        newHero.SetAbsOrigin(position);
        // Note: Setting facet might require additional API calls depending on your Dota version

        print(`Hero swapped successfully for player ${playerID}`);
      }
    }
  }
}