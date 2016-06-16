'use strict';

var Util = require('./Util.js');

module.exports = class Coord {
    constructor (r,c) {
        this.r = r || -1;
        this.c = c || -1;
    }

    equals (other) {
        return this.r === other.r && this.c === other.c;
    }

    is (other) { return this.equals(other); }

    plus (other) {
        return new Coord(
            this.r + other.r,
            this.c + other.c
        );
    }

    minus (other) {
        return new Coord(
            this.r - other.r,
            this.c - other.c
        );
    }

    distanceTo (other) {
        return Math.sqrt(
            Math.pow(this.r - other.r, 2) +
            Math.pow(this.c - other.c, 2)
        );
    }

    magnitude () {
        return this.distanceTo(new Coord(0,0));
    }

    isAdjacentTo (other) {
        var distance = this.distanceTo(other);

        // ODDITY: i made the bounds approximate for some reason.
        return 0.9 < distance && distance < 1.5;
    }

    toString () {
        return '[' + this.r + ',' + this.c + ']';
    }

    static random (rCount, cCount) {
        if (!rCount || !cCount) {
            console.log('error: Coord.random() called with no arguments');
            return new Coord(-1,-1);
            // TODO throw exception, make supervisor reboot, et cetera.
        }

        return new Coord(
            Util.randomUpTo(rCount-1),
            Util.randomUpTo(cCount-1)
        );
    }

    static get relatives () {
        return [
            new Coord(-1,-1), new Coord(-1,0), new Coord(-1,1),
            new Coord( 0,-1),                  new Coord( 0,1),
            new Coord( 1,-1), new Coord( 1,0), new Coord( 1,1)
        ];
    }

    static randomDirection () {
        return Util.randomOf(coord.relatives);
    }

    randomAdjacent () {
        do {
            var candidateNeighbor = Coord.randomDirection().plus(this);
        } while (! candidateNeighbor.isInBounds());

        return candidateNeighbor;
    }
};

// Coord.ne = new Coord(-1, 1);
