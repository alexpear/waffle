'use strict';

// Generator that outputs procedurally generated trees of WNodes (Waffle nodes).
// These trees represent games states, game elements, narrative elements, and similar concepts.

const fs = require('fs');

// TODO perhaps restructure so that WGenerator doesn't import any Battle20 files.
// Eg, perhaps CreatureTemplate should not be Battle20-specific?
const CreatureTemplate = require('../battle20/creaturetemplate.js');
const Util = require('../util/util.js');
const WNode = require('../wnode/wnode.js');

class WGenerator {
    // Constructor param will be either a birddecisions-format string or a filename.
    constructor (rawString, codexPath) {
        if (! typeof (rawString === 'string') || ! rawString.length) {
            return;
        }

        // Later the this.rawString field might not be necessary.
        this.rawString = rawString.trim();
        this.codexPath = codexPath;
        this.aliasTables = {};
        this.childTables = {};
        // Later, make this a pointer to a Glossary instance.
        // usage: glossary.getTemplate('naga');
        this.glossary = {};

        // TODO: Add support for ignorable comments in codex files
        const tableRaws = this.rawString.split('*');

        tableRaws.forEach(
            tableRaw => {
                tableRaw = tableRaw.trim();

                if (! tableRaw.length) {
                    return;
                }

                if (ChildTable.isAppropriateFor(tableRaw)) {
                    return this.addChildTable(tableRaw);
                }

                // Later, this could be neater and not involve a string literal.
                if (tableRaw.startsWith('template ')) {
                    return this.addTemplate(tableRaw);
                }

                // Default case.
                // Includes '* output'
                return this.addAliasTable(tableRaw);
            }
        );

        // Check that the output alias table exists
        if (! this.aliasTables.output) {
            throw new Error(`WGenerator constructor: output table not found. Object.keys(this.aliasTables).length is ${ Object.keys(this.aliasTables).length }`);
        }
    }

    addChildTable (tableRaw) {
        const childTable = new ChildTable(tableRaw, this);
        // TODO replace terminology: key -> templateName
        const key = childTable.templateName;

        if (key in this.childTables) {
            // Later perhaps also mention which file this is, or paste the content of the file
            throw new Error(`children table key '${ key }' appears twice`);
        }

        return this.childTables[key] = childTable;
    }

    addAliasTable (tableRaw) {
        const aliasTable = new AliasTable(tableRaw, this);
        const key = aliasTable.templateName;

        if (key in this.aliasTables) {
            throw new Error(`alias table key '${ key }' appears twice`);
        }

        return this.aliasTables[key] = aliasTable;
    }

    addTemplate (tableRaw) {
        const templateObj = parseTemplate(tableRaw);
        const key = templateObj.templateName;

        if (key in this.glossary) {
            throw new Error(`template key '${ key }' appears twice`);
        }

        return this.glossary[key] = templateObj;
    }

    // Returns WNode[]
    getOutputs (key) {
        return this.resolveString(key || '{output}');
    }

    resolveCommas (inputString) {
        return inputString.trim()
            .split(',')
            .reduce(
                (stringsSoFar, s) =>
                    stringsSoFar.concat(
                        this.maybeResolveAlias(s)
                    ),
                []
            );
    }

    // Returns WNode[]
    resolveString (inputString) {
        const nodes = this.resolveCommas(inputString)
            .map(contextString => this.makeSubtree(contextString));

        WNode.sortSubtrees(nodes);
        return nodes;
    }

    makeSubtree (cString) {
        // Util.log(`Top of makeSubtree( '${cString}' ), this.codexPath is ${this.codexPath}`, 'debug');

        return cString.path === this.codexPath ?
            this.makeLocalSubtree(cString) :
            WGenerator.makeExternalSubtree(cString);
    }

    makeLocalSubtree (cString) {
        // Later, read from the templates of the WGenerator specified by cString.path
        const node = new WNode(cString.name);

        // Util.log(`Middle of makeLocalSubtree(${cString}). Expression node.templateName is ${node.templateName}`, 'debug');

        this.applyTemplate(node, cString);
        return this.maybeAddChildren(node);
    }

    applyTemplate (node, cString) {
        const template = this.glossary[cString.name];
        if (! template) {
            return;
        }

        for (let prop in template) {
            // Later there might be some properties that shouldn't be overwritten.
            node[prop] = template[prop];
        }
    }

    // Might modify node.children
    // Returns a WNode
    maybeAddChildren (node) {
        // Later make this case insensitive
        const table = this.childTables[node.templateName];

        if (table) {
            // Util.log(`End of maybeAddChildren(node of '${node.templateName}'). table exists.`, 'debug');

            return this.addChildren(node, table);
        }
        else {
            // Util.log(`End of maybeAddChildren(node of '${node.templateName}'). table not found.`, 'debug');

            return node;
        }
    }

    // Modifies node.children
    // Returns the modified WNode
    addChildren (node, table) {
        table.children.forEach(
            childString => {
                // Note that resolveString() always returns an array.
                const children = this.resolveString(childString);
                node.components = node.components.concat(children);
                children.forEach(
                    child => {
                        child.parent = node;
                    }
                );
            }
        );

        return node;
    }

    // Returns ContextString[]
    // No side effects.
    maybeResolveAlias (str) {
        str = str.trim();

        // Util.log(`Top of maybeResolveAlias( '${str}' )`, 'debug');

        if (str[0] === '{') {
            if (str[str.length - 1] !== '}') {
                throw new Error(`WGenerator.maybeResolveAlias(): Error parsing a string: ${ str }`);
            }

            const alias = str.slice(1, str.length - 1)
                .trim();

            // Slashes indicate pointers to external WGenerators.
            // Any slashpaths here will already have been made absolute during AliasTable setup.
            // Should we convert alias to a ContextString here?
            return Util.contains(alias, '/') ?
                WGenerator.resolveExternalAlias(alias) :
                this.resolveLocalAlias(alias);

            // TODO: resolveExternalAlias returns string[], without reference to which codex it is from. The originating codex must be checked because its ChildTables may be relevant.
            // One option would be for these funcs to return ContextString objs
        }
        else if (str === 'nothing') {
            return [];
        }
        else {
            const cString = new ContextString(str, this.codexPath);
            return [cString];
        }
    }

    resolveLocalAlias (tableName) {
        const table = this.aliasTables[tableName];

        if (! table) {
            throw new Error(`Could not find local alias table: ${ str }`);
        }

        return table.getOutputAndResolveIt();
    }

    makePathAbsolute (relativePathStr) {
        if (relativePathStr.startsWith('{')) {
            return this.getAbsoluteAlias(relativePathStr);
        }

        // Referring to a external template name.
        return this.getAbsolutePath(relativePathStr);
    }

    getAbsoluteAlias (relativePathAlias) {
        // One duplicate comparison. I dont think this will slow performance appreciably.
        if (relativePathAlias.startsWith('{')) {
            relativePathAlias = relativePathAlias.slice(1);
        }
        if (relativePathAlias.endsWith('}')) {
            relativePathAlias = relativePathAlias.slice(0, relativePathAlias.length - 1);
        }

        const absolutePath = this.getAbsolutePath(relativePathAlias);
        return `{${absolutePath}}`;
    }

    // Later i could return ContextString instead of a absolute path.
    getAbsolutePath (relativePathStr) {
        const relativePath = relativePathStr.trim()
            .split('/');

        // TODO codexPath is sometimes not initialized.
        let curPath = this.codexPath.split('/');

        while (curPath.length >= 0) {

            // Util.log(`In ChildTable.getAbsolutePath( '${relativePathStr}' ) loop. curPath is ${curPath}. curPath.length is ${curPath.length}. curPath[0] is ${curPath[0]}.`, 'debug');

            // TODO I may want to interpret the last term as a possible alias table name, but not as a childTable or glossary name.
            const genPath = WGenerator.interpretRelativePath(relativePath, curPath);

            if (genPath) {
                return genPath;
            }

            // do/while would be neater but whatever.
            if (curPath.length === 0) {
                break;
            }

            curPath.pop();
        }

        throw new Error(`Could not find codex path ${ relativePathStr }`);
    }

    static exampleRaw () {
        const patrolRaw = require('../codices/halo/unsc/patrol.js');
        return patrolRaw;
    }

    // Example input: 'sunlight/warbands/warrior'
    static fromCodex (codexPath) {
        // Later, ignore leading slashes and trailing file extensions.
        const codexRaw = require(`${ WGenerator.codicesDir() }/${ codexPath }.js`);

        return new WGenerator(codexRaw, codexPath);
    }

    static fromFile (path) {
        const fileString = fs.readFileSync(path, 'utf8');
        return new WGenerator(fileString, codexPath);
    }

    static codicesDir () {
        return `${ __dirname }/../codices`;
    }

    static loadCodices () {
        // For now, this is hard coded to one fictional setting.
        WGenerator.loadHaloCodices();
    }

    static loadHaloCodices () {
        // Util.log(`Top of loadHaloCodices(), WGenerator.generators is ${WGenerator.generators}.`, 'debug');

        if (! WGenerator.generators) {
            WGenerator.generators = {};
        }
        else if (Util.exists( WGenerator.generators['halo/unsc/item'] )) {
            // WGenerator.generators already looks loaded.
            return;
        }

        // This awkward repeated-string-literal style is because browserify can only see require statements with string literals in them. Make this more beautiful later.
        WGenerator.addGenerator(
            require('../codices/halo/unsc/item'),
            'halo/unsc/item'
        );

        // Util.log(`Middle of loadHaloCodices(), item is loaded.`, 'debug');

        WGenerator.addGenerator(
            require('../codices/halo/unsc/individual'),
            'halo/unsc/individual'
        );

        // Util.log(`Middle of loadHaloCodices(), individual is loaded.`, 'debug');

        WGenerator.addGenerator(
            require('../codices/halo/unsc/squad'),
            'halo/unsc/squad'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/company'),
            'halo/unsc/company'
        );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/battalion'),
            'halo/unsc/battalion'
        );
        // WGenerator.addGenerator(
        //     require('../codices/halo/unsc/vehicle'),
        //     'halo/unsc/vehicle'
        // );
        // WGenerator.addGenerator(
        //     require('../codices/halo/unsc/ship'),
        //     'halo/unsc/ship'
        // );
        // WGenerator.addGenerator(
        //     require('../codices/halo/unsc/fleet'),
        //     'halo/unsc/fleet'
        // );
        WGenerator.addGenerator(
            require('../codices/halo/unsc/patrol'),
            'halo/unsc/patrol'
        );
    }

    static addGenerator (moduleContents, codexPath) {
        const gen = new WGenerator(moduleContents, codexPath);

        WGenerator.generators[codexPath] = gen;
    }

    // The path parameters are arrays of strings.
    // Returns a absolute path version of the relative path (as a string) if it finds one
    // Otherwise it returns undefined.
    static interpretRelativePath (relativePath, contextPath) {
        // console.log(`Top of WGenerator.interpretRelativePath([${relativePath}], [${contextPath}])`);

        // The last term of relativePath might refer to a file.
        const filePath = WGenerator.interpretRelativePathAsFile(relativePath, contextPath);

        if (filePath) {
            return filePath;
        }

        // Or the last term might refer to a name within a context path.
        return WGenerator.interpretRelativePathAsName(relativePath, contextPath);
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsFile (relativePath, contextPath) {
        // concat() has no side effects.
        const fullPath = contextPath.concat(relativePath);
        const fullPathStr = fullPath.join('/');
        if (WGenerator.generators[fullPathStr]) {
            return fullPathStr;
        }

        return;
    }

    // Path parameters are arrays of strings
    // Returns string or undefined
    static interpretRelativePathAsName (relativePath, contextPath) {
        if (relativePath.length < 2) {
            return;
        }

        const nameIndex = relativePath.length - 1;

        // Omit the name
        // concat() and slice() have no side effects.
        const genPath = contextPath.concat(relativePath.slice(0, nameIndex));
        const genPathStr = genPath.join('/');
        const gen = WGenerator.generators[genPathStr];

        if (gen) {
            const goalName = relativePath[nameIndex];
            return genPathStr + '/' + goalName;
        }

        return;
    }

    // The 'absolutePath' param might be the path to a codex or to a name within that codex.
    static findGenAndTable (absolutePath) {
        // First check if this refers to whole codex file instead of a table within it.
        let gen = WGenerator.generators[absolutePath];

        if (gen) {
            return {
                gen: gen,
                name: 'output'
            };
        }

        // Otherwise interpret the last term of absolutePath as the name of a table.
        // Later, functionize this string-splitting logic.
        const terms = absolutePath.split('/');
        const tableIndex = terms.length - 1;
        const genPath = terms.slice(0, tableIndex)
            .join('/');
        const tableName = terms[tableIndex];

        gen = WGenerator.generators[genPath];

        if (gen) {
            return {
                gen: gen,
                name: tableName
            };
        }

        throw new Error(`Could not find a WGenerator for this absolutePath: ${ absolutePath }`);
    }

    static resolveExternalAlias (absolutePath) {
        const findings = WGenerator.findGenAndTable(absolutePath);
        // Later, check if this throwing is redundant.
        if (! findings || ! findings.gen || ! findings.name) {
            throw new Error(`Did not find gen and/or name for absolutePath: ${absolutePath}`);
        }

        return findings.gen.resolveLocalAlias(findings.name);
    }

    // Returns WNode
    // References the appropriate WGenerator's ChildTables, templates, etc
    // The path was already made absolute during table construction (both AliasTable and ChildTable rows).
    static makeExternalSubtree (cString) {
        const gen = WGenerator.generators[cString.path];
        return gen.makeLocalSubtree(cString);
    }

    static run () {
        WGenerator.loadCodices();

        const codexPaths = Object.keys(WGenerator.generators || []).join('\n');
        console.log(`Loaded the following WGenerator codices:\n${ codexPaths }\n`);

        if (! process.argv ||
            ! process.argv[0] ||
            ! process.argv[0].endsWith('node') ||
            ! process.argv[1].endsWith('wgenerator.js')) {
            // The following logic is for command-line use only.
            return;
        }

        let output;

        if (process.argv.length > 2) {
            const wgen = WGenerator.fromCodex(process.argv[2]);
            output = wgen.getOutputs();
        }
        else {
            output = [];
        }

        WGenerator.debugPrint(output);
    }

    static debugPrint (output) {
        output.forEach(
            node => {
                console.log(node.toPrettyString());
                // Util.log(`There are ${node.components.length} components. The first one is ${node.components[0] && node.components[0].templateName}.`, 'debug');
            }
        );
    }

    static test () {
        console.log(`WGenerator.test(): \n\n`);

        const wgen = WGenerator.fromCodex('battle20/halo/unsc/group');

        return wgen.getOutputs();
    }
}


class AliasTable {
    constructor (rawString, generator) {
        // The parent pointer is used when resolving slash path aliases.
        this.generator = generator;
        this.outputs = [];

        const lines = rawString.trim()
            .split('\n')
            .map(line => line.trim());

        // Later we could complain if the first line's name contains whitespace.
        this.templateName = AliasTable.withoutTheStarter(lines[0]);

        for (let li = 1; li < lines.length; li++) {
            // Later probably functionize this part.
            const line = lines[li];

            if (line === '') {
                continue;
            }

            const parts = line.split(/\s/);

            // Later i want to also support some sort of simple no-weights format, like Perchance does.
            if (parts.length <= 1) {
                throw new Error(`AliasTable could not parse line: ${parts.join(' ')}`);
            }

            const weightStr = parts[0];
            const weight = parseInt(weightStr);

            if (weight === 0) {
                continue;
            }
            else if (typeof weight !== 'number') {
                throw new Error(`AliasTable could not parse weight: ${ weightStr }`);
            }

            // Everything after the weight prefix.
            let alias = line.slice(weightStr.length)
                .trim();

            // During WGenerator construction, Interpret keys with slashes as external pointers.
            if (Util.contains(alias, '/')) {
                alias = this.generator.makePathAbsolute(alias);
            }

            // Replicated outputs. We assume memory is plentiful but time is scarce.
            for (let wi = 0; wi < weight; wi++) {
                this.outputs.push(alias);
            }
        }
    }

    // Returns string
    getOutput () {
        return Util.randomOf(this.outputs);
    }

    getOutputAndResolveIt () {
        const outputStr = this.getOutput();

        return this.generator.resolveCommas(outputStr);
    }

    // TODO this logic is needed by ChildTable too. Move it to WGenerator (ie parent).

    static isAppropriateFor (tableString) {
        const t = tableString.trim()
            .toLowerCase();

        if (
            AliasTable.STARTERS.some(
                starter => t.startsWith(starter)
            )
        ) {
            return true;
        }

        return t.startsWith('output');
    }


    static withoutTheStarter (rawString) {
        const s = rawString.trim();
        const sLow = s.toLowerCase();

        for (let starter of AliasTable.STARTERS) {
            if (sLow.startsWith(starter)) {
                return s.slice(starter.length)
                    .trim();
            }
        }

        return s;
    }
}

AliasTable.STARTERS = [
    'alias'
];

class ChildTable {
    constructor (rawString, generator) {
        this.generator = generator;

        const lines = rawString.trim()
            .split('\n')
            .map(child => child.trim());

        this.templateName = ChildTable.withoutTheStarter(lines[0]);
        this.children = lines.slice(1)
            .map(
                line => {
                    if (Util.contains(line, '/')) {
                        // Util.log(`In ChildTable constructor. line is ${line}`, 'debug');

                        line = this.generator.makePathAbsolute(line);
                    }

                    return line;
                }
            );
    }

    static isAppropriateFor (tableString) {
        const t = tableString.trim()
            .toLowerCase();

        return ChildTable.STARTERS.some(
            starter => t.startsWith(starter)
        );
    }

    static withoutTheStarter (rawString) {
        const s = rawString.trim();
        const sLow = s.toLowerCase();

        for (let starter of ChildTable.STARTERS) {
            if (sLow.startsWith(starter)) {
                return s.slice(starter.length)
                    .trim();
            }
        }

        return s;
    }
}

ChildTable.STARTERS = [
    'children of',
    'childrenof'
    // 'childrenOf' is implied by the call to toLowerCase()
];

// Intermediate representation used during parsing and generation. Represents a name (of a template or of a alias) with a codex path for context.
// Alternate names: CodexString, PathName, PathString, ContextName, ContextString
class ContextString {
    // Example:
    // {
    //     name: 'civilian',
    //     codexPath: 'halo/unsc/individual'
    // }
    constructor (name, path) {
        if (Util.contains(name, '/')) {
            const findings = WGenerator.findGenAndTable(name);
            this.name = findings.name;
            this.path = findings.gen.codexPath;
        }
        else {
            this.name = name;
            // TODO: guarantee that this is always a absolute path.
            this.path = path;
        }
    }

    toString () {
        return `{name:${this.name}, path:${this.path}}`;
    }
}

// TODO put this in class Template and template.js or something.
// This will probably become or call a constructor
// and store the first line in this.templateName
function parseTemplate (tableRaw) {
    const templateObj = new CreatureTemplate();

    tableRaw.split('\n')
        .slice(1)
        .map(
            line => {
                const parsed = parseTemplateLine(line);
                const key = parsed.key;

                if (
                    key in templateObj &&
                    ! ['tags', 'actions', 'resistance'].includes(key)
                ) {
                    throw new Error(`parseTemplate(): duplicate key '${ key }' in line '${ line }'. Full template is as follows:\n${ tableRaw }`);
                }

                templateObj[key] = parsed.value;

                // Util.log(`in parseTemplate(). Just wrote key/value pair {${key}: ${parsed.value}}`, 'debug');
            }
        );

    // templateObj.key = templateKey(tableRaw);
    templateObj.templateName = templateKey(tableRaw);
    templateObj.setUpAction();

    // Later: at some point, detect whether it is a ActionTemplate or CreatureTemplate.
    // Probably mark templateObj.type, or instantiate the appropriate class, or something.

    return templateObj;
}

function parseTemplateLine (line) {
    line = line.trim();

    const colonIndex = line.indexOf(':');

    if (colonIndex < 0) {
        throw new Error(`parseTemplateLine(): No colon found in ${ line }`);
    }

    const key = line.slice(0, colonIndex)
        .trim();
    const rest = line.slice(colonIndex + 1)
        .trim();

    let value;
    if (key === 'tags') {
        value = rest.split(/\s/);
    }
    else if (key === 'resistance') {
        value = {};

        const entries = rest.split(',');

        entries.forEach(
            e => {
                const parts = e.trim()
                    .split(/\s/);
                const resistanceKey = parts[0];
                const modifier = Number(parts[1]);

                value[resistanceKey] = modifier;
            }
        );
    }
    else if (rest === 'true') {
        value = true;
    }
    else if (rest === 'false') {
        value = false;
    }
    else {
        // number case.
        const parsed = Number(rest);

        value = Util.exists(parsed) ?
            parsed :
            rest;

        // Util.log(`in parseTemplateLine( '${line}' ). value is ${value}.`, 'debug');
    }

    return {
        key: key,
        value: value
    };
}

function templateKey (tableRaw) {
    const START = 'template ';
    const startIndex = tableRaw.indexOf(START);
    const endIndex = tableRaw.indexOf('\n');

    return tableRaw.slice(startIndex + START.length, endIndex)
        .trim();
}

module.exports = WGenerator;



// Run
WGenerator.run();




/*
{output}
v
parse
v
resolveAlias('output')
v
{leaders}, {troops}
v
parse
v
resolveAlias('leaders') and resolveAlias('troops')
v
'officer' and 'officer' and 'regular'
v
new WNode('officer') etc
v
maybeAddChildren(node)
v
addChildren(node, node.templateName)

So maybe strings go to parse(), which ultimately resolves to WNode[]
And calls maybeAddChildren on those.

2018 September 20:
parse() or resolveString() takes any string and returns WNode[]
it calls resolveCommas(), resolveAlias(), new WNode(), and maybeAddChildren()
(or replace resolveAlias() with maybeResolveAlias(), whichever looks clearer.)

resolveAlias() now returns string[], which contains no aliases.

maybeAddChildren(node) looks up the strings representing children, calls parse() on them (this is recursion), and appends the nodes parse() returns to node.components as a side effect. No return value necessary, i think.

More code in black notebook.



In the longer term, would be nice if the syntax could specify the generation of a grid.
Then you could generate a fleet of spaceships and also some basic floor plans of their bridges and cargo bays.
Or island maps.
But i guess that each square is so relevant to the contents of its neighbors that this reductionist generation might not produce very good results.
Everything in each square appears at a random part of the island with uniform probability, right?
I guess you could alias the squares as ForestSquare, DesertSquare, etc ....
But still, how would you make sure the ForestSquares are adjacent to each other?
I think perhaps the grid generation is best done by another module.
That module could call WGenerator, which outputs a tree describing one square.
Similarly, WGenerator could describe a spaceship and one of the leaves can be of template frigateFloorPlan.
Outside WGenerator, frigateFloorPlan can call some grid generation program.
That grid generation program can call WGenerator on each square, with inputs like 'squareBesideWall' and 'storageSquare'.
So the final output will be a Waffle tree with grids in the middle. A tree containing grids of subtrees.
Waffle will ideally support this.
The ship node will have a grid node (representing the cargo bay) in its .components, or similar.


exampleRaw

|
v

exampleOutput:
  - marine:
    has:
      - flakArmor
      - battleRifle
  - marine:
    has:
      - flakArmor
      - smg
  - warthog



I may eventually want to combine the file of the children and alias tables with the file of template definitions.
Didn't i call this the codex / templates split in the warbands project?
Counterargument: I may want to have a template called 'dropship'. 'dropship' may have both children (soldiers) and stats.
Is that a blocker?
No.
Entries would look like:
* children of dropship
* dropship [meaning the template's chassis, stats, variations from the chassis, whatever]
There couldn't be a alias named dropship
but maybe * dropshipSquad or something

The above plan might require tagging alias tables like:
* alias dropshipSquad

...

Parsing external pointers
localThing
{localThing}
halo/unsc/item/externalThing
{halo/unsc/item/externalThing}




*/
