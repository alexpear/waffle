'use strict';

var Coord = require('./Coord.js');
var Entity = require('./Entity.js');
var Factions = require('./Factions.js');
var Region = require('./Region.js');
var Templates = require('./Templates.js');
var Util = require('./Util.js');

var _ = require('underscore');

// TODO: Will eventually need to split WorldState.js

module.exports = class WorldState {
    constructor (rows, cols) {
        this.entities = [];

        // I'm not sure about the 2d array idea.
        this.space = this.makeGrid(rows, cols);
        this.rowCount = rows || Util.DEFAULTS.ROWCOUNT;
        this.colCount = cols || Util.DEFAULTS.COLCOUNT;
        this.stepCount = 0;
    }

    debugSetup () {
        this.create(Templates.evangelion, Factions.empire, new Coord(4,6));
        this.create(Templates.air, Factions.rebels, new Coord(8,6));
        this.create(Templates.air, Factions.rebels, new Coord(9,9));
    }

    // Probably deprecated.
    makeGrid (rowCount, colCount) {
        rowCount = rowCount || this.rowCount;
        colCount = colCount || this.colCount;

        var grid = [];
        for (var ri = 0; ri < rowCount; ri++) {
            grid.push([]);

            for (var ci = 0; ci < colCount; ci++) {
                grid[ri].push(null);  // TODO: Is there a better way?
            }
        }

        return grid;
    }

    // TODO: Could cache this
    asGrid () {
        var grid = this.makeGrid();
        this.entities.forEach(function(entity) {
            grid[entity.coord.r][entity.coord.c] = entity;
        });

        return grid;
    }

    at (coord) {
        // Runspeed is not currently a priority.
        return this.entities.find(function (entity) {
            return entity.coord.equals(coord);
        });
    }

    isInBounds (coord) {
        return 0 <= coord.r && coord.r < this.rowCount
            && 0 <= coord.c && coord.c < this.colCount;
    }

    create (template, faction, coord) {
      var newEntity = new Entity(template || Templates.infantry, faction, coord);
      this.entities.push(newEntity);
    }

    step () {
        var self = this;
        this.entities.forEach(function (entity) {
            self.visit(entity);
        });

        this.draw();
    }

    visit (entity) {
        // TODO encounters and interactions

        if (entity.stepsTillMove > 0) {
            entity.stepsTillMove--;
        } else {
            // TODO: Random action with weightings.
            var chosenAction = this.moveRandomly.bind(this);
            chosenAction(entity);
        }
    }

    moveAbsolute (entity, destination) {
        this.moveRelative(entity, destination.minus(entity.coord));
    }

    moveRelative (entity, relativeCoord) {
        if (2 <= relativeCoord.magnitude()) {
            // TODO: better error handling
            console.log('ERROR: move() called with oversized relative coord.');
            return;
        }

        var destination = entity.coord.plus(relativeCoord);
        if (! this.isInBounds(destination)) {
            console.log('ERROR: move() called with destination outside the bounds.');
            return;
        }

        if (!! this.at(destination)) {
            console.log('ERROR: move() cant move you to an occupied square.');
            return;
        }

        entity.coord = destination;
    }

    emptiesAdjacentTo (centralCoord) {
        var self = this;
        return Coord.relatives
            .map(function (relativeCoord) {
                return centralCoord.plus(relativeCoord);
            })
            .filter(function (neighbor) {
                return self.isInBounds(neighbor)
                    && ! self.at(neighbor);
            });
    }

    randomEmptyNeighbor (centralCoord) {
        return _.sample(this.emptiesAdjacentTo(centralCoord));
    }

    moveRandomly (entity) {
        this.moveAbsolute(entity, this.randomEmptyNeighbor(entity.coord));
    }

    randomEmptyCoord () {
        if (this.rowCount * this.colCount <= this.entities.length) {
            console.log('ERROR: Cant find an empty coord because there is already one entity per coord.');
            return new Coord();
        }

        do {
            // TODO: move randomCoord() to worldstate
            var coord = Coord.random(this.rowCount, this.colCount);
        } while (!! this.at(coord));

        return coord;
    }

    textImage () {
        // Candidate alg: function to assemble a 2d array representation
        // of the world, then render that in ascii.
        return this.asGrid().map(function (row) {
            return row.map(function (square) {
                return square ? square.sprite : '.';
            }).join(' ');
        }).join('\n');
    }

    draw () {
        console.log(this.textImage());
    }

    diagnostic () {
        for (var i = 0; i < this.entities.length; i++) {
            var entityOne = this.entities[i];
            // Check entity is in bounds
            if (! this.isInBounds(entityOne.coord)) {
                console.log('error: entity ' + entityOne.sprite + ' is out of bounds');
            }

            // Look for pairs of Entities that are in the same space
            for (var j = i+1; j < this.entities.length; j++) {
                var entityTwo = this.entities[j];
                if (entityOne.coord.equals(entityTwo.coord)) {
                    console.log('error: multiple entities are both occupying ' + entityOne.coord.toString());
                }
            }
        }

        console.log('diagnostic completed.')
    }
};
