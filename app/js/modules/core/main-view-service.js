'use strict';

import $ from 'jquery';
import Backbone from 'backbone';
import ServiceLocator from 'core/service-locator';

ServiceLocator.create('MainViewService', Backbone.View.extend({
    view: null,

    setEl(el) {
        this.$el = $(el);
    },

    setView(view) {
        this.removeView();
        this.view = view;
        this.view.render().placeAt(this.$el);
    },

    removeView() {
        if (this.view) this.view.destroy();
        this.view = null;
    }
}));
