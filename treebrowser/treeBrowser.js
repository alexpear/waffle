'use strict';

// TODO look up info about browserify and relative paths
const WGenerator = require('../generation/wgenerator.js');
const WNode = require('../wnode/wnode.js');
const Util = require('../util/util.js');

//

const TreeBrowser = module.exports = class TreeBrowser {
    constructor (curNode) {
        this.currentNode = curNode || this.exampleRoot();

        this.parentButton = document.getElementById('parentButton');
        if (!this.parentButton) {
            console.log('parentButton seems undefined :o :o');
        }
        else {
            console.log('all is well :)');
        }

        // this.fake.bad.foolish = {};


        this.currentNodeName = document.getElementById('currentNodeName');
        this.discardButton = document.getElementById('discardButton');
        this.propertiesDiv = document.getElementById('properties');
        // TODO this is turning out undefined for some reason
        this.componentsDiv = document.getElementById('components');

        this.updateUi(this.currentNode);
    }

    updateUi (newNode) {
        if (newNode) {
            // Update parent button
            if (newNode.parent) {
                this.parentButton.value = newNode.parent.toSimpleString();
            }
            else {
                this.parentButton.value = '(No parent)';
            }

            // Update current node
            // TODO newNode has a circular reference, according to JSON.stringify()
            this.currentNodeName.innerHTML = newNode.toSimpleString();

            // Update component buttons
            this.updateComponentButtons(newNode);
        }
    }

    updateComponentButtons (newNode) {
        this.clearDiv(this.componentsDiv);

        newNode.components.forEach((component, index) => {
            const button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', component.id);
            button.classList.add('iconButton');
            button.value = component.toSimpleString();

            this.componentsDiv.appendChild(button);

            button.onclick = function () {
                window.treeBrowser.goToChild(this.id);
            };
        });
    }

    clearDiv (div) {
        while(div && div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }

    goToNode (newNode) {
        this.currentNode = newNode;
        this.updateUi(newNode);
    }

    goUp () {
        if (! this.currentNode.parent) {
            // TODO: Friendlier notification.
            return alert('This node has no parent.');
        }

        this.goToNode(this.currentNode.parent);
    }

    goToChild (childId) {
        const child = this.currentNode.components.find(component => component.id === childId);

        if (! child) {
            // TODO: Friendlier notification.
            return alert(`Error: Could not find a child component with id ${ childId }. The number of child components is ${ this.currentNode.components.length }.`);
        }

        this.goToNode(child);
    }

    discard () {
        // TODO
        this.updateUi();
    }

    loadFile (fileName) {
        // Later
    }

    exampleRoot () {
        // TODO: fs doesnt play nice with browserify.
        // https://stackoverflow.com/questions/16640177/browserify-with-requirefs#comment74864880_23267470
        // const wgen = WGenerator.fromCodex('halo/unsc/patrol');
        const wgen = new WGenerator(WGenerator.exampleRaw());
        const outputs = wgen.getOutputs();
        return outputs[0];
    }
};

function init () {
    window.treeBrowser = new TreeBrowser();
}

init();
