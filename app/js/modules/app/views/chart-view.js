'use strict';

import c3 from 'c3';
import _ from 'underscore';
import View from 'core/view';

let ChartTpl = require('app/templates/partials/chart.html');

export default View.extend({
    initialize() {
        this.template = ChartTpl;
    },

    postPlaceAt() {
        _.defer(this.createChart.bind(this));
    },

    createChart() {
        let chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
        });
    }
});
