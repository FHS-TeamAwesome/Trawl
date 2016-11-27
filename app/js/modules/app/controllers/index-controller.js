'use strict';

import Controller from 'core/controller';
import HomeView from 'app/views/home-view';

export default Controller.extend({
    routes: {
        '': 'indexAction'
    },

    initialize() {
        console.log('Hello');
    },

    indexAction() {
        console.log('index');
        new HomeView();
    }
});
