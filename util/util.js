'use strict';

const moment = require('moment');

const Util = module.exports;

Util.DEFAULTS = {
    ROWCOUNT: 12,
    COLCOUNT: 12
};

Util.colors = {
    black: '1;37;40m',
    red: '1;37;41m',
    green: '1;30;42m',
    yellow: '1;37;43m',
    blue: '1;37;44m',
    purple: '1;37;45m',
    cyan: '1;30;46m',
    grey: '1;30;47m'
};

Util.NODE_TYPES = {
    region: 'region',
    location: 'location'  // deprecated
};

// TODO reconsider this weird function syntax. Maybe declare a class of functions, then assign the field props to it?
Util.default = function (input, defaultValue) {
    if (input === undefined) {
        return defaultValue;
    } else {
        return input;
    }
};

Util.contains = function (array, fugitive) {
    return array.indexOf(fugitive) >= 0;
};

Util.randomIntBetween = function (minInclusive, maxExclusive) {
    if (!minInclusive || !maxExclusive) {
        console.log('error: Util.randomIntBetween() called with missing parameters.');
        return -1;
    } else if (maxExclusive <= minInclusive) {
        console.log('error: Util.randomIntBetween() called with max <= min.');
        return -1;
    }

    return Math.floor( Math.random() * (maxExclusive - minInclusive) + minInclusive );
};

Util.randomUpTo = function (maxInclusive) {
    return Util.randomIntBetween(0, maxInclusive - 1);
};

Util.randomOf = function (array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

Util.newId = function () {
    // Later research the most performant way to run this.
    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ID_LENGTH = 50;

    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        const index = Math.floor( Math.random() * ALPHABET.length );
        id += ALPHABET[index];
    }

    return id;
};

Util.repeat = function (str, n) {
    let outStr = '';
    for (let i = 0; i < n; i++) {
        outStr += str;
    }

    return outStr;
};

Util.formatProp = function (object, propName) {
    if (! object[propName]) {
        return '';
    }

    // Later handle special and modification objects better.
    return `${ propName }: ${ object[propName] }`;
};

Util.isNumber = function (x) {
    return typeof x === 'number';
};

Util.isString = function (x) {
    return typeof x === 'string';
};

Util.isArray = function (x) {
    // Later make this more sophisticated, or use a library.
    return x &&
        typeof x.length === 'number' &&
        x.length >= 0 &&
        (x.length === 0 || x[0] !== undefined);
};

Util.stringify = function (x) {
    return JSON.stringify(
        x,
        undefined,
        '    '
    );
};

Util.log = function (input, tag) {
    // Later: Use chalk functions instead.
    // const TAG_COLORS = {
    //     error: 'red',
    //     warn: 'yellow',
    //     beacon: 'purple',
    //     event: 'blue',
    //     noisy: 'cyan',
    //     debug: 'green'
    // };

    tag = tag || 'event';
    const tagStr = tag.toUpperCase();
    // const tagColor = TAG_COLORS[tag.toLowerCase()] || TAG_COLORS['event'];
    // const tagStr = tagColor ?
    //     Util.colored(tag.toUpperCase(), tagColor) :
    //     tag;

    const dateTime = moment().format('YYYY MMM D hh:mm:ss.S');

    const info = Util.isString(input) ?
        input :
        Util.stringify(input);

    // Later: Red error and beacon text
    console.log(`  ${tagStr} (${ dateTime }) ${ info }\n`);
};

