module.exports = `* output
1 {squad}

* alias squad
10 {infantrySquad}
10 {vehicleSquad}

* alias infantrySquad
4 marineSquad
1 {rareInfantrySquad}

* childrenof marineSquad
marineFireteam
marineFireteam

* childrenof marineFireteam
{halo/unsc/individual/squadLeader}
halo/unsc/individual/marinePrivate
halo/unsc/individual/marinePrivate
halo/unsc/individual/marinePrivate

* alias rareInfantrySquad
6 odstSquad
0 odstJetpackSquad
2 spartanSquad

* childrenof odstSquad
odstFireteam
odstFireteam

* childrenof odstFireteam
halo/unsc/individual/odst
halo/unsc/individual/odst
halo/unsc/individual/odst
halo/unsc/individual/odst

* childrenof spartanSquad
spartanFireteam
spartanFireteam

* childrenof spartanFireteam
halo/unsc/individual/spartan
halo/unsc/individual/spartan
halo/unsc/individual/spartan
halo/unsc/individual/spartan

* alias infantryFireteam
20 marineFireteam
5 odstFireteam
2 crewFireteam
1 spartanFireteam

* childrenof crewFireteam
halo/unsc/individual/crewMember
halo/unsc/individual/crewMember
halo/unsc/individual/crewMember
halo/unsc/individual/crewMember

* alias vehicleSquad
3 mongooseSquad
1 gungooseSquad
6 {warthog}
5 {aircraft}
3 scorpion
2 elephant
1 mammoth

* alias warthog
2 scoutWarthog
2 transportWarthog
4 turretWarthog

* childrenof mongooseSquad
mongoose
mongoose

* childrenof mongoose
{halo/unsc/individual/driver}
{halo/unsc/individual}

* childrenof gungooseSquad
gungoose
gungoose

* childrenof gungoose
{halo/unsc/individual/driver}

* childrenof scorpion
{halo/unsc/individual/driver}
marineFireteam

* childrenof transportWarthog
{infantryFireteam}

* childrenof falcon
{infantryFireteam}
{airModule}

* children of hornet
{halo/unsc/individual/driver}
{halo/unsc/individual}
{halo/unsc/individual}
{airModule}

* children of wasp
{halo/unsc/individual/driver}
chaingun
{airModule}

* alias airModule
6 {turret}
1 targetDesignator
1 laser

* children of scoutWarthog
{halo/unsc/individual/driver}
{halo/unsc/individual}

* children of turretWarthog
{turret}
{halo/unsc/individual/driver}
{halo/unsc/individual}
{halo/unsc/individual}

* alias turret
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
1 longsword
1 saber
1 sparrowhawk

* children of pelican
{airModule}
{infantrySquad}

* children of elephant
{infantrySquad}
{turret}
{turret}

* children of mammoth
{infantrySquad}
{turret}
{turret}
{turret}
{turret}

* alias airSpeedSquad
4 {aircraft}

* alias fastSquad
6 {warthog}
3 mongooseSquad
2 gungooseSquad

* alias fastCompatibleSquad
4 {fastSquad}
2 {airSpeedSquad}

* alias slowSquad
20 {infantrySquad}
10 scorpion
2 elephant
1 mammoth

* alias slowCompatibleSquad
4 {slowSquad}
1 {fastSquad}
1 {airSpeedSquad}

* alias staticSquad
4 fortifiedInfantrySquad
2 bunker
1 {bigGun}

* alias staticCompatibleSquad
10 {staticSquad}
3 {slowSquad}
2 {fastSquad}
1 {airSpeedSquad}

* childrenof fortifiedInfantrySquad
{infantryFireteam}
{infantryFireteam}
{turret}
{turret}

* childrenof bunker
{infantrySquad}

* alias bigGun
4 aaGun
1 missileSilo
1 tacticalMac

* childrenof aaGun
crewFireteam

* childrenof missileSilo
crewFireteam

* childrenof tacticalMac
crewFireteam

`;
