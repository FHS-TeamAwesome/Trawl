'use strict';

import c3 from 'c3';
import _ from 'underscore';
import View from 'core/view';
import moment from 'moment';

let ChartTpl = require('app/templates/partials/chart.html');

export default View.extend({
    initialize() {
        this.template = ChartTpl;
        
        this.chart = null;

        this.ProviderManager = this.getService('ProviderManager');

        this.DataManager = this.getService('DataManager');

        this.ScrollManager = this.getService('ScrollManager');
    },

    postDestroy() {
        this.EventDispatcher.off('provider:fetch:complete', this.addSectionHandler.bind(this));
    },

    postPlaceAt() {
        _.defer(this.createChart.bind(this));

        this.EventDispatcher.on('provider:fetch:complete', this.reloadData.bind(this));
    },

    getActivityFrequency(days, activities) {
        let frequencyMapping = {};

        for (let day of this.getLastDays(days)) {
            frequencyMapping[day] = 0;
        }

        for (let activityDay of activities) {
            let key = moment(activityDay.created_time).format('YYYY-MM-DD');

            if (frequencyMapping[key] !== undefined) {
                frequencyMapping[key]++;
            }
        }

        return frequencyMapping;
    },

    reloadData() {
        if (this.chart) {
            this.chart.destroy();
        }

        this.createChart();
    },

    createChart() {
        let that = this;
        let timeline = Object.keys(this.getActivityFrequency(100, []));
        let facebookActivities = Object.values(this.getActivityFrequency(
            100, 
            this.DataManager.getActivities().facebook
        ));

        let twitterActivities = Object.values(this.getActivityFrequency(
            100, 
            this.DataManager.getActivities().twitter
        ));

        let instagramActivities = Object.values(this.getActivityFrequency(
            100, 
            this.DataManager.getActivities().instagram
        ));

        timeline.unshift('Time');
        facebookActivities.unshift('Facebook');
        twitterActivities.unshift('Twitter');
        instagramActivities.unshift('Instagram');

        this.chart = c3.generate({
            bindto: '#chart',
            data: {
                x: 'Time',
                type: 'spline',
                columns: [
                    timeline,
                    facebookActivities,
                    twitterActivities,
                    instagramActivities
                ],

                colors: {
                    'Facebook': '#3B5998',
                    'Twitter': '#55acee',
                    'Instagram': '#8a3ab9'
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m.%Y'
                    }
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },

            oninit: function() {
                let rect = this.main.append('rect')
                    .style('fill', '#333')
                    .attr('x', 0.5)
                    .attr('y', -0.5)
                    .attr('width', this.width)
                    .attr('height', this.height);

                that.ScrollManager.add(that.$el, function() {
                    that.getService('Textillate').shuffle(that.$el.find('.page-section-description'));

                    rect
                        .transition().duration(2000)
                        .attr('x', this.width)
                        .attr('width', 0)
                        .remove();
                }.bind(this));
            }
        });
    },

    getLastDays(days) {
        let passedDays = days;
        let today = 0;
        let passedDaysTotal = [];

        while (today < passedDays) {
            passedDaysTotal.push(moment().subtract(passedDays, 'days').format('YYYY-MM-DD'));
            passedDays--;
        }

        return passedDaysTotal;
    }
});
