'use strict';

import $ from 'jquery';
import d3 from 'd3';
import cloud from 'd3-cloud';
import _ from 'underscore';
import View from 'core/view';
import HashTagModal from 'app/views/hashtag-modal';

let TagsTpl = require('app/templates/partials/tags.html');

export default View.extend({
    initialize() {
        this.template = TagsTpl;

        this.DataManager = this.getService('DataManager');

        this.ScrollManager = this.getService('ScrollManager');

        this.hashTags = this.DataManager.getHashTags();

        this.cloudLayout = null;

        this.modal = null;
    },

    postRender() {
        this.EventDispatcher.on('provider:fetch:complete', this.addHashTagsHandler.bind(this));
    },

    postPlaceAt() {
        this.$container = this.$el.find('#tags-cloud');

        _.defer(this.createTagCloud.bind(this));

        window.addEventListener('resize', _.debounce(this.restartLayout.bind(this), 250), false);
        this.$container.on('click', 'svg text', this.onTagClickHandler.bind(this));

        this.ScrollManager.add(this.$el, this.onScrollEnter.bind(this));
    },

    onTagClickHandler(event) {
        let { ids, provider, text } = event.target.__data__;
        let relatedData = this.DataManager.getHashTagContent(ids, provider);
        
        this.openModal(relatedData, provider, text);
    },

    openModal(data, providerName, hashTagName) {
        if (!this.modal) {
            this.modal = this.createModal();
        }

        this.modal.open({
            data, 
            providerName,
            hashTagName
        });
    },

    createModal() {
        let modal = new HashTagModal();

        // violates the view encapsulation rule
        // but this is an exception for. Could be replaced 
        // by a global modal view using the event dispatcher
        modal.placeAt('body');

        return modal;
    },

    onScrollEnter() {
        this.$container.addClass('is-presented');

        this.getService('Textillate').shuffle(this.$el.find('.page-section-description'));
    },

    addHashTagsHandler() {
        this.hashTags = this.DataManager.getHashTags();

        this.restartLayout();
    },

    restartLayout() {
        if (!this.cloudLayout) return;

        this.cloudLayout.stop();
        this.$container.empty();

        this.createTagCloud();
    },

    createTagCloud() {
        this.cloudLayout = cloud()
            .size([this.$container.width(), this.$container.height()])
            .words(this.hashTags.total.map(function(entry) {
                return {
                    ids: entry.ids,
                    text: entry.name, 
                    size: 10 + entry.count * 20 * window.innerWidth * 0.001,
                    provider: entry.provider
                };
            }))
            .padding(5)
            .rotate(function() { 
                return ~~(Math.random() * 2) * 90;
            })
            .font('Source Sans Pro')
            .fontSize(function(word) { 
                return word.size; 
            })
            .on('end', this.drawD3.bind(this));

        this.cloudLayout.start();
    },

    drawD3(words) {
        let fill = d3.scale.category20();

        d3.select(this.$el.find('#tags-cloud').get(0)).append('svg')
            .attr('width', this.cloudLayout.size()[0])
            .attr('height', this.cloudLayout.size()[1])
        .append('g')
            .attr('transform', 'translate(' + this.cloudLayout.size()[0] / 2 + ',' + this.cloudLayout.size()[1] / 2 + ')')
        .selectAll('text')
            .data(words)
        .enter()
            .append('g')
            .attr('transform', function(word) {
                return 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')';
            })
            .append('text')
            .style('font-size', function(word) { 
                return word.size + 'px'; 
            })
            .style('font-weight', '300')
            .style('font-family', 'Source Sans Pro')
            .style('fill', function(d, i) { 
                return fill(i); 
            })
            .attr('text-anchor', 'middle')
        .text(function(word) { 
            return word.text; 
        });
    }
});
