'use strict';

import $ from 'jquery';
import ServiceLocator from 'core/service-locator';
import core from 'core';
import ScrollMonitor from 'scrollmonitor';

var textillate = require('chemzqm-textillate');

ServiceLocator.create('ScrollManager', class ScrollManager {
    constructor() {
        this.scrollElements = [];
    }

    add(scrollElement, sectionName) {
        this.scrollElements[sectionName] = scrollElement;
        var elementWatcher = ScrollMonitor.create(scrollElement, {top: -200});

        elementWatcher.enterViewport(function() {
            if(sectionName == "MapsSection") {
                this.enterMapsSection();
            }
            if(sectionName == "TagsSection") {
                this.enterTagsSection();
            }
            if(sectionName == "HeaderSection") {
                this.enterHeaderSection();
            }
        }.bind(this));
    }

    enterMapsSection() {
        console.log("entered MapsSection");
        this.textillatePageDescription("MapsSection");
    }

    enterTagsSection() {
        console.log("entered TagsSection");
        this.textillatePageDescription("TagsSection");
    }

    enterHeaderSection() {
        console.log("entered HeaderSection");
        this.textillateIndexPageDescription("HeaderSection");
    }

    textillatePageDescription(sectionName) {
        textillate(this.scrollElements[sectionName].find('.page-section-description').get(0), {
            minDisplayTime: 500,
            in : {
                effect: 'flipInX',
                shuffle: true,
                delay: 10,
            }
        });
    }

    textillateIndexPageDescription(sectionName) {
        console.log(this.scrollElements[sectionName].find('.about-text').get(0));
        textillate(this.scrollElements[sectionName].find('.about-text').get(0), {
            minDisplayTime: 500,
            in : {
                effect: 'flipInX',
                shuffle: true,
                delay: 10,
            }
        });
    }

});
