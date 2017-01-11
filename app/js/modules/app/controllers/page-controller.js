'use strict';

import Controller from 'core/controller';
import PageView from 'app/views/page-view';

let AboutTpl = require('app/templates/pages/about.html');
let ImprintTpl = require('app/templates/pages/imprint.html');

export default Controller.extend({
    routes: {
        'about': 'aboutAction',
        'imprint': 'imprintAction',
    },

    aboutAction() {
        this.setView(new PageView({ template: AboutTpl, currentRoute: 'about' }));
    },

    imprintAction() {
        this.setView(new PageView({ template: ImprintTpl, currentRoute: 'imprint' }));
    }
});
