'use strict';

import Controller from 'core/controller';
import IndexView from 'app/views/index-view';

import Twitter from 'twitter';
import Instagram from 'instagram';

export default Controller.extend({
    routes: {
        '': 'indexAction'
    },

    initialize() {
        this.ProviderManager = this.getService('ProviderManager');
        this.ProviderManager
                .add('twitter', new Twitter())
                // .add('facebook', new Facebook())
                .add('instagram', new Instagram());
    },

    indexAction() {
        this.setView(new IndexView());
    }
});
