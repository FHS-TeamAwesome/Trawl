'use strict';

import $ from 'jquery';
import Controller from 'core/controller';
import IndexView from 'app/views/index-view';

import Twitter from 'twitter';
import Facebook from 'facebook';
import Instagram from 'instagram';

export default Controller.extend({
    routes: {
        '': 'indexAction'
    },

    initialize() {
        this.triedFetching = false;

        this.ProviderManager = this.getService('ProviderManager');
        this.ProviderManager
                .add('twitter', new Twitter())
                .add('facebook', new Facebook())
                .add('instagram', new Instagram());
    },

    indexAction() {
        if (this.triedFetching) {
            this.triedFetching = true;

            this.setView(new IndexView());
            
            return;
        }

        $.whenAll(
            this.ProviderManager.fetchAuth('twitter'),
            this.ProviderManager.fetchAuth('facebook'),
            this.ProviderManager.fetchAuth('instagram')
        ).always(function() {
            this.setView(new IndexView());
        }.bind(this));
    }
});
