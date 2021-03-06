// UNSC combat patrol of a few squads/units.

module.exports = `* output
1 patrol

* children of patrol
{squad}
{squad}
{squad}

* alias squad
10 {infantrySquad}
10 {vehicleSquad}
9 {support}
1 friendlyHuragok

* alias infantrySquad
4 marineSquad
1 {rareInfantry}

* alias rareInfantry
6 odstSquad
1 spartanSquad
1 spartan

* children of marineSquad
{specialSoldier}
marines

* children of marines
{basicWeapon}
{giGear}

* alias basicWeapon
4 smg
4 ar
4 br
3 dmr
1 shotgun

* alias specialSoldier
4 veteranMarine
3 officer

* children of veteranMarine
{gender}
{anyWeapon}
{smallWeapon}
{item/anyGear}

* alias anyWeapon
4 {basicWeapon}
4 {specialWeapon}
0 TODO split some of these item things out into separate files. So long as each usable table is still accessible.

* alias specialWeapon
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

* alias alienItem
4 {alienGrenade}
0 TODO

* alias alienWeapon
4 boltshot
0 TODO

* alias hardToCarryItem
4 chaingun
3 missilePod
3 binaryRifle
2 incinerationCannon

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

* alias hiddenAnyGear
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
0 TODO traits table like muscular, clever, tireless, paranoid, blackBelt, injured, prostheticArm, xenolinguistics, homeworldDestroyed, exhausted, etc.

* children of officer
{gender}
{smallWeapon}
{commandGear}

* alias smallWeapon
4 lightPistol
4 pistol
3 heavyPistol
3 smg
1 smgBayonet
3 combatKnife

* alias gender
4 male
4 female
1 postgender

* alias commandGear
4 targetLocator
4 secureDatapad
4 oneTimePad
4 microwaveAntenna
3 emp
2 telescope
2 binoculars
1 plasmaPistol
1 boltShot
4 {alienGrenade}
1 paperMap
1 bubbleShield

* alias alienGrenade
4 plasmaGrenade
4 spikeGrenade
3 fireGrenade
3 pulseGrenade
3 splinterGrenade

* children of odstSquad
veteranMarine
odsts

* children of odsts
{basicWeapon}
{giGear}

* children of spartanSquad
{spartanMod}
{spartanArmor}
{basicWeapon}
{giGear}

* children of spartan
{gender}
{spartanMod}
{spartanArmor}
{anyWeapon}
{smallWeapon}
{item/anyGear}
{armorMod}

* alias spartanMod
3 spartanIIAugmentations
4 spartanIIIAugmentations
4 spartanIVAugmentations

* alias spartanArmor
4 mjolnirArmor
4 spiArmor
3 infiltrationSuit

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

* alias vehicleSquad
3 mongooseSquad
1 gungooseSquad
6 {warthog}
5 {aircraft}
3 scorpion
2 elephant

* alias warthog
2 scoutWarthog
2 transportWarthog
4 turretWarthog

* children of mongooseSquad
{infantrySquad}

* children of gungooseSquad
{infantrySquad}

* children of scorpion
{driver}
marineSquad

* alias driver
8 combatEngineer
1 spartan

* children of combatEngineer
{gender}
{smallWeapon}
{item/anyGear}

* children of transportWarthog
{infantrySquad}

* children of falcon
{infantrySquad}

* children of hornet
{infantrySquad}

* children of wasp
{driver}
chaingun
{airModule}

* alias airModule
4 missilePod
2 targetDesignator
2 gaussTurret
2 laser
1 needleTurret

* children of scoutWarthog
{infantrySquad}

* children of turretWarthog
{warthogTurret}
{infantrySquad}

* alias warthogTurret
6 chaingun
2 gaussTurret
1 missilePod
1 vespinTurret
1 needleTurret

* alias aircraft
4 falcon
4 hornet
4 wasp
4 pelican

* children of pelican
chaingun
{infantrySquad}

* children of elephant
{infantrySquad}

* alias support
4 artillerySupport
4 airSupport
4 orbitalSupport
4 aiSupport

* children of artillerySupport
{artillery}

* alias artillery
4 scorpionBattery
4 longRangeMissiles
4 tacticalMac

* children of airSupport
{airMission}
{aircraft}

* alias airMission
4 carpetBombing
4 precisionBombing
4 resupply
4 strafingRun
4 reconFlyover
4 reserves

* children of orbitalSupport
{orbital}

* alias orbital
4 frigate
4 mac
4 odstSquad
2 spartanSquad
1 eliteCruiser

* children of aiSupport
{gender}
{aiCoverage}

* alias aiCoverage
4 targeting
4 intel
4 fireMissions
4 psyOps
4 classified
4 predictiveModeling`;
