'use strict';

// TODO look up info about browserify and relative paths
const WGenerator = require('../generation/wgenerator.js');
const WNode = require('../wnode/wnode.js');
const Util = require('../util/util.js');

const Hotkeys = require('hotkeys-js');

//

const TreeBrowser = module.exports = class TreeBrowser {
    constructor (curNode) {
        this.currentNode = curNode || this.exampleRoot();

        this.parentButton = document.getElementById('parentButton');
        if (!this.parentButton) {
            console.log('parentButton seems undefined :o :o');
        }

        Hotkeys('q', (event, handler) => {
            this.parentButton.click();
        });

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

            const numberString = (index + 1).toString();
            Hotkeys(numberString, (event, handler) => {
                button.click();
                console.log(`Detected keyboard shortcut ${numberString} and going to ${button.value}`);
            });

            this.componentsDiv.appendChild(button);

            button.onclick = function () {
                window.treeBrowser.goToChild(this.id);
            };
        });
    }

    clearComponentShortcuts () {
        for (let i = 1; i <= this.componentsDiv.childElementCount; i++) {
            Hotkeys.unbind(i.toString());
            // console.log(`Cleared hotkey ${i}`);
        }
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
            console.log('Cannot go up to parent because this node has no parent.');
            return;
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
        const wgen = new WGenerator(WGenerator.exampleRaw());
        const outputs = wgen.getOutputs();
        return outputs[0];
    }
};

function init () {
    window.treeBrowser = new TreeBrowser();
}

init();
