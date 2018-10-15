'use strict';

// Could extend a class Template if that simplifies anything.
// TODO: Move to its own file.
module.exports = class ActionTemplate {
    constructor () {

    }

    static example () {
        const template = new ActionTemplate();

        // Dwarven throwing axe
        template.tags = [
            TAG.Dwarf,
            TAG.Blade,
            TAG.Projectile
        ];

        // Range is in meters. It is okay to round it heavily.
        template.range = 10;
        template.hit = 4;
        template.damage = 1;

        return template;
    }
};