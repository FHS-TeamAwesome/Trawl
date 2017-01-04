'use strict';

import d3 from 'd3';
import cloud from 'd3-cloud';
import _ from 'underscore';
import View from 'core/view';

let TagsTpl = require('app/templates/partials/tags.html');

export default View.extend({
    initialize() {
        this.template = TagsTpl;

        this.DataManager = this.getService('DataManager');

        this.hashTags = this.DataManager.getHashTags();

        this.cloudLayout = null;
    },

    postRender() {
        this.EventDispatcher.on('provider:fetch:complete', this.addHashTagsHandler.bind(this));
    },

    postPlaceAt() {
        this.$container = this.$el.find('#tags-cloud');

        _.defer(this.createTagCloud.bind(this));

        window.addEventListener('resize', _.debounce(this.restartLayout.bind(this), 250), false);
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
                    text: entry.name, 
                    size: 10 + entry.count * 20 * window.innerWidth * 0.001
                };
            }))
            .padding(5)
            .rotate(function() { 
                return 0; 
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
        .enter().append('text')
            .style('font-size', function(word) { 
                return word.size + 'px'; 
            })
            .style('font-family', 'Source Sans Pro')
            .style('fill', '#fff')
            .attr('text-anchor', 'middle')
            .attr('transform', function(word) {
                return 'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')';
            })
        .text(function(word) { 
            return word.text; 
        });
    }
});
