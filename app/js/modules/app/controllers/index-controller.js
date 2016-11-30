'use strict';

import Controller from 'core/controller';

export default Controller.extend({
    routes: {
        '': 'indexAction'
    },

    initialize() {
        console.log('Hello');
    },

    indexAction() {
        console.log('index');
    }
});
