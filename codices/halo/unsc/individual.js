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
flakHelmet
flakArmor
{halo/unsc/item/giWeapon}
{halo/unsc/item}

* childrenof officer
{halo/unsc/item/smallWeapon}
{halo/unsc/item/commandGear}

* childrenof odst
visrHelmet
odstArmor
{halo/unsc/item/veteranWeapon}
{halo/unsc/item/smallWeapon}
{halo/unsc/item/anyGear}
fragGrenade

* childrenof spartan
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyWeapon}
{halo/unsc/item/anyGear}
fragGrenade
fragGrenade

`;
