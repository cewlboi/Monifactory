/**
 * Custom recipes for the Iron Jetpacks mod
 */
ServerEvents.recipes(event => {
    // Thermal

    // Generate thermal thruster recipes
    const thermalThrusters = [
        ["leadstone", "lead", "lead", "steamdynamo:steam_dynamo"],
        ["hardened", "invar", "invar", "thermal:dynamo_magmatic"],
        ["reinforced", "aluminium", "electrum", "thermal:dynamo_compression"],
        ["resonant", "enderium", "enderium", "thermal:dynamo_numismatic"]
    ]

    thermalThrusters.forEach(([newTier, plate1, plate2, dynamo]) => {
        event.shaped(Item.of(`kubejs:${newTier}_thruster`), [
            "PCP",
            "MDM",
            "BBB"
        ], {
            P: `#forge:plates/${plate1}`,
            M: `#forge:plates/${plate2}`,
            C: "thermal:rf_coil",
            D: dynamo,
            B: "#forge:plates/red_alloy"
        }).id(`kubejs:ironjetpacks/thrusters/${newTier}`);
    })

    // Generate EnderIO thruster recipes
    const eioThrusters = [
        ["conductive_iron", "conductive_alloy", "1", "kubejs:resonating_crystal", "gtceu:red_alloy_plate"],
        ["electrical_steel", "electrical_steel", "1", "enderio:pulsating_crystal", Item.of("kubejs:conductive_iron_thruster").weakNBT()],
        ["energetic", "energetic_alloy", "2", "enderio:vibrant_crystal", Item.of("kubejs:electrical_steel_thruster").weakNBT()],
        ["vibrant", "vibrant_alloy", "3", "enderio:prescient_crystal", Item.of("kubejs:energetic_thruster").weakNBT()]
    ]

    eioThrusters.forEach(([newTier, plate, card, crystal, lastTier]) => {
        event.shaped(Item.of(`kubejs:${newTier}_thruster`), [
            "PCP",
            "PRP",
            "BTB"
        ], {
            P: `#forge:plates/${plate}`,
            C: `laserio:energy_overclocker_card_tier_${card}`,
            R: crystal,
            T: lastTier,
            B: "gtceu:red_alloy_plate"
        }).id(`kubejs:ironjetpacks/thrusters/${newTier}`);
    })

    // Special thrusters

    // Dark Soularium
    event.shaped(Item.of("kubejs:dark_soularium_thruster"), [
        "ICI",
        "IFI",
        "TTT"
    ], {
        I: "gtceu:dark_soularium_ingot",
        C: "laserio:energy_overclocker_card_tier_8",
        F: "kubejs:flight_control_unit",
        T: Item.of("kubejs:vibrant_thruster").weakNBT()
    }).id("kubejs:ironjetpacks/thrusters/dark_soularium");

    // Fluxed
    event.shaped(Item.of("kubejs:fluxed_thruster"), [
        " P ",
        "PGP",
        "STS"
    ], {
        P: "redstone_arsenal:flux_plating",
        G: "kubejs:glowstone_elevation_unit",
        S: "gtceu:signalum_plate",
        T: Item.of("kubejs:resonant_thruster").weakNBT()
    }).id("kubejs:ironjetpacks/thrusters/fluxed");

    //
    // Jetpacks
    //

    /**
     * Copies old jetpack nbt to the new jetpack
     * @param {Internal.ModifyRecipeCraftingGrid} grid
     * @param {Internal.ItemStack} result
     * @returns {Internal.ItemStack}
     */
    const copyOldJetpackData = (grid, result) => {
        let item = grid.find("ironjetpacks:jetpack")
        if (!item.nbt) {
            return result;
        }

        let nbt = {};
        if (item.nbt.Energy) {
            nbt.Energy = item.nbt.Energy
        }
        if (item.nbt.Engine) {
            nbt.Engine = item.nbt.Engine
        }
        if (item.nbt.Hover) {
            nbt.Hover = item.nbt.Hover
        }
        if (item.nbt.Throttle) {
            nbt.Throttle = item.nbt.Throttle
        }
        return result.withNBT(nbt);
    }

    /**
     * @type {Internal.Ingredient[][]}
     */
    const jetpackBase = [
        ["leadstone", "ironjetpacks:strap", "lead", "thermal:flux_capacitor"],
        ["conductive_iron", "ironjetpacks:strap", "conductive_alloy", "enderio:basic_capacitor"]
    ]

    /**
     * @type {Internal.Ingredient[][]}
     */
    const jetpackUpgrade = [
        ["hardened", "leadstone", "invar", Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:hardened"}').weakNBT()],
        ["reinforced", "hardened", "electrum", Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:reinforced"}').weakNBT()],
        ["resonant", "reinforced", "enderium", Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:resonant"}').weakNBT()],
        ["electrical_steel", "conductive_iron", "electrical_steel", "enderio:double_layer_capacitor"],
        ["energetic", "electrical_steel", "energetic_alloy", "enderio:octadic_capacitor"],
        ["vibrant", "energetic", "vibrant_alloy", "kubejs:compressed_octadic_capacitor"]
    ]

    jetpackBase.forEach(([newTier, middlePart, plate, energyCapacitor]) => {
        event.shaped(Item.of("ironjetpacks:jetpack", `{Id:"ironjetpacks:${newTier}"}`).strongNBT(), [
            "PEP",
            "PSP",
            "T T"
        ], {
            P: `#forge:plates/${plate}`,
            E: energyCapacitor,
            S: middlePart,
            T: Item.of(`kubejs:${newTier}_thruster`).weakNBT()
        }).id(`kubejs:ironjetpacks/base/${newTier}`);
    })

    jetpackUpgrade.forEach(([newTier, previousTier, plate, energyCapacitor]) => {
        event.shaped(Item.of("ironjetpacks:jetpack", `{Id:"ironjetpacks:${newTier}"}`).strongNBT(), [
            "PEP",
            "PSP",
            "T T"
        ], {
            P: `#forge:plates/${plate}`,
            E: energyCapacitor,
            S: Item.of("ironjetpacks:jetpack", `{Id:"ironjetpacks:${previousTier}"}`).weakNBT(),
            T: Item.of(`kubejs:${newTier}_thruster`).weakNBT()
        }).modifyResult(copyOldJetpackData).id(`kubejs:ironjetpacks/upgrade/${newTier}`);
    })

    event.recipes.gtceu.assembly_line("kubejs:ironjetpacks/upgrade/dark_soularium")
        .itemInputs(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:vibrant"}').weakNBT(), "gtceu:dark_soularium_block", "better_angel_ring:angel_ring", "2x enderio:ender_crystal", "kubejs:double_compressed_octadic_capacitor", "4x #gtceu:circuits/luv", Item.of("kubejs:dark_soularium_thruster", 2))
        .inputFluids("gtceu:soldering_alloy 1152")
        .itemOutputs(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:dark_soularium"}').strongNBT())
        .duration(3000)
        .EUt(30720)
        .stationResearch(b => b.researchStack(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:vibrant"}')).EUt(3686).CWUt(64))
        .modifyResult(copyOldJetpackData)

    event.recipes.gtceu.assembly_line("kubejs:ironjetpacks/upgrade/fluxed")
        .itemInputs(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:resonant"}').weakNBT(), "redstone_arsenal:flux_chestplate", "kubejs:cryotheum_coolant_unit", "better_angel_ring:angel_ring", "2x kubejs:compressed_octadic_capacitor", "3x #gtceu:circuits/luv", Item.of("kubejs:fluxed_thruster", 2))
        .inputFluids("gtceu:soldering_alloy 1152")
        .itemOutputs(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:fluxed"}').strongNBT())
        .duration(3000)
        .EUt(30720)
        .stationResearch(b => b
            .researchStack(Item.of("ironjetpacks:jetpack", '{Id:"ironjetpacks:resonant"}'))
            .EUt(3686)
            .CWUt(64))
        .modifyResult(copyOldJetpackData)

    //
    // Misc
    //
    event.shaped("kubejs:empty_fluxed_jetpack_unit", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "gtceu:electrum_flux_ingot",
        B: "gtceu:signalum_ingot",
        C: "enderio:fused_quartz"
    }).id("kubejs:ironjetpacks/misc/empty_fluxed_jetpack_unit");

    event.shaped("kubejs:empty_soularium_jetpack_unit", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "gtceu:dark_soularium_ingot",
        B: "gtceu:electrical_steel_ingot",
        C: "enderio:fused_quartz"
    }).id("kubejs:ironjetpacks/misc/empty_soularium_jetpack_unit");

    event.recipes.gtceu.canner("kubejs:ironjetpacks/misc/flight_control_unit")
        .itemInputs("kubejs:empty_soularium_jetpack_unit", "4x minecraft:ghast_tear")
        .itemOutputs("kubejs:flight_control_unit")
        .duration(100)
        .EUt(2000)

    event.recipes.gtceu.canner("kubejs:ironjetpacks/misc/glowstone_elevation_unit")
        .itemInputs("kubejs:empty_fluxed_jetpack_unit")
        .inputFluids("gtceu:glowstone 4032")
        .itemOutputs("kubejs:glowstone_elevation_unit")
        .duration(100)
        .EUt(2000)

    event.recipes.gtceu.canner("kubejs:ironjetpacks/misc/cyrotheum_coolant_unit")
        .itemInputs("kubejs:empty_fluxed_jetpack_unit")
        .inputFluids("kubejs:molten_cryotheum 6000")
        .itemOutputs("kubejs:cryotheum_coolant_unit")
        .duration(100)
        .EUt(2000)


    // Cells, thermal exp.
    event.shaped(Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:hardened"}').strongNBT(), [
        " A ",
        "BCB",
        "ADA"
    ], {
        A: "minecraft:redstone",
        B: "gtceu:invar_ingot",
        C: "thermal:flux_capacitor",
        D: "gtceu:tin_ingot"
    }).id("kubejs:ironjetpacks/cells/hardened");

    event.shaped(Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:reinforced"}').strongNBT(), [
        " A ",
        "BCB",
        "ADA"
    ], {
        A: "minecraft:redstone",
        B: "gtceu:electrum_ingot",
        C: Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:hardened"}').weakNBT(),
        D: "#enderio:fused_quartz"
    }).id("kubejs:ironjetpacks/cells/reinforced");

    event.shaped(Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:resonant"}').strongNBT(), [
        " A ",
        "BCB",
        "ADA"
    ], {
        A: "minecraft:redstone",
        B: "gtceu:enderium_ingot",
        C: Item.of("ironjetpacks:cell", '{Id:"ironjetpacks:reinforced"}').weakNBT(),
        D: "kubejs:pyrotheum_dust"
    }).id("kubejs:ironjetpacks/cells/resonant");
})
