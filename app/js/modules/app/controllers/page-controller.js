'use strict';

import Controller from 'core/controller';
import PageView from 'app/views/page-view';

let AboutTpl = require('app/templates/about.html');
let ImprintTpl = require('app/templates/imprint.html');

export default Controller.extend({
    routes: {
        'about': 'aboutAction',
        'imprint': 'imprintAction',
    },

    aboutAction() {
        this.setView(new PageView({ template: AboutTpl }));
    },

    imprintAction() {
        this.setView(new PageView({ template: ImprintTpl }));
    }
});
