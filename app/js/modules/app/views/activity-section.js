'use strict';

import c3 from 'c3';
import _ from 'underscore';
import View from 'core/view';
import moment from 'moment';

let ChartTpl = require('app/templates/partials/chart.html');

export default View.extend({
    initialize() {
        this.template = ChartTpl;
        this.ProviderManager = this.getService('ProviderManager');
        this.DataManager = this.getService('DataManager');
    },

    postPlaceAt() {
        _.defer(this.createChart.bind(this));
    },

    createChart() {

        /**let myData = {};
        myData.columns = [];
        myData.xFormat = '%d/%m/%Y';
        myData.x = 'days';
        myData.y = 'frequency';
        myData.columns.push(['days','16/12/2016', '10/12/2016', '13/12/2016']);
        myData.columns.push(['frequency','1','2','3','4','5','6','7']);
**/
        let daysFormated = ['x'];
        let frequencyMapping = {};

        for (let day of this.getLastDays(300)) {
            daysFormated.push(day);
            frequencyMapping[day] = 0;
        }

        for (let activityDay of this.DataManager.getActivities().total) {
            let key = moment(activityDay.created_time).format('YYYY-MM-DD');

            if (frequencyMapping[key] !== undefined) {
                frequencyMapping[key]++;
            }
        };

        let x = Object.keys(frequencyMapping);
        let y = Object.values(frequencyMapping);

        x.unshift('x');
        y.unshift('data');

        console.log(x,y);
        let chart = c3.generate({
            bindto: '#chart',
            data: {
                x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                columns: [
                    x,
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
                    y
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            }
        });
    },

    getLastDays(days) {
        let passedDays = days;
        let today = 0;
        let passedDaysTotal = [];

        while( today < passedDays) {
            passedDaysTotal.push(moment().subtract(passedDays, 'days').format('YYYY-MM-DD'));
            passedDays--;
        }

        return passedDaysTotal;
    }
});
