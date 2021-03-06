module.exports = `* output
10 {anyWeapon}
10 {anyGear}
3 {component}

* alias anyWeapon
10 {smallWeapon}
0 gi means General Issue
20 {giWeapon}
0 {specialInfantryWeapon}
0 {highWeightWeapon}
0 {alienWeapon}

* alias smallWeapon
10 reachPistol
4 heavyPistol
4 silencedPistol
3 lightPistol
2 gunfighterPistol
1 machinePistol
3 smg
1 smgBayonet
3 combatKnife

* alias giWeapon
4 smg
4 assaultRifle
4 br
3 dmr
1 shotgun
0 generate attachments and weapon traits

* alias specialInfantryWeapon
4 shotgun
4 saw
4 sniperRifle
4 hydra
4 grenadeLauncher
4 rocketLauncher
4 laser
3 turret
3 flamethrower
4 {smallWeapon}, {smallWeapon}

* alias veteranWeapon
10 {giWeapon}
10 {specialInfantryWeapon}

* alias highWeightWeapon
6 {warthogTurret}
3 binaryRifle
2 plasmaTurret
2 incinerationCannon
2 gravityHammer
2 oniChaingun
1 splinterTurret

* alias anyGear
4 targetDesignator
4 secureDatapad
4 medkit
4 demolitionCharges
4 {giGear}
4 {commandGear}
4 {smallWeapon}
4 jetpack
2 emp
2 plasmaRifle

* alias giGear
4 fragGrenade
4 {smallWeapon}
4 portableTent
4 extraAmmo
4 extraRations
4 camoCloak
3 smokeGrenade
3 trenchShovel
3 radiationPills
2 flashBangGrenade
2 deployableCover
2 caffeinePills
1 medkit

* alias commandGear
4 targetLocator
4 secureDatapad
4 oneTimePad
4 microwaveAntenna
3 emp
2 telescope
2 binoculars
0 {alienWeapon}
0 {alienGrenade}
1 paperMap
1 bubbleShield

* alias component
4 2xScope
3 4xScope
3 10xScope
4 morphScope
4 hybridScope
4 cogScope
3 visrScopeForGun
3 kineticBolts
3 stabilizationJetsForGun
4 titaniumBayonet
4 energyBayonet
3 extendedMagazine
3 laserSight
4 silencer
1 longBarrel
1 soundDampener
4 threatMarker
3 knightBlade
0 etc

* alias airComponent
4 missilePod
2 targetDesignator
2 gaussTurret
2 laser
1 needleTurret

* alias warthogTurret
6 chaingun
2 gaussTurret
1 missilePod
1 vespinTurret
1 needleTurret

* alias spartanMod
3 spartanIIAugmentations
4 spartanIIIAugmentations
4 spartanIVAugmentations

* alias spartanArmor
4 mjolnirArmor
4 spiArmor
3 infiltrationSuit

* template mjolnirArmor
weight: 454

* alias armorMod
4 armorLock
4 dropShield
5 activeCamo
4 hologram
5 thrusterPack
4 emp
3 autoSentry
3 regenField
4 prometheanVision
4 hardlightShield

* alias alienWeapon
0 {cov/item/smallWeapon}
0 {forerunner/item/smallWeapon}

* alias alienGrenade
0 {banished/item/grenade}
0 {forerunner/item/grenade}

* template flakArmor
defense: 6
resistance: fire 1, piercing 1
tags: armor

* template smg
tags: action bullet fullAuto
range: 20
hit: 3
damage: 1

* template assaultRifle
tags: action bullet fullAuto
range: 30
hit: 3
damage: 1

* template battleRifle
tags: action bullet
range: 50
hit: 3
damage: 1

* template dmr
tags: action bullet
range: 60
hit: 3
damage: 1

* template shotgun
tags: action bullet
range: 5
hit: 5
damage: 2

`;
