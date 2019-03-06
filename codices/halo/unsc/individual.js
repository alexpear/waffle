module.exports = `
* output
5 civilian
7 crewMember
10 marinePrivate
7 officer
5 odst
1 spartan

* childrenof crewMember
{halo/unsc/item}

* childrenof marinePrivate
{halo/unsc/item/giWeapon}
{halo/unsc/item}
flakHelmet
flakArmor

* alias squadLeader
4 marinePrivate
4 marineSpecialist
1 officer
1 odst

* childrenof marineSpecialist
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item}
flakHelmet
flakArmor

* childrenof officer
{halo/unsc/item/smallWeapon}
{halo/unsc/item/commandGear}

* childrenof odst
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item/anyGear}
visrHelmet
odstArmor
fragGrenade

* childrenof spartan
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyGear}
fragGrenade
fragGrenade

* alias driver
8 marinePrivate
10 crewMember
4 odst
1 spartan
`;
