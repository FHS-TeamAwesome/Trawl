'use strict';

import $ from 'jquery';
import Backbone from 'backbone';
import ServiceLocator from 'core/service-locator';

ServiceLocator.create('LinkHandler', Backbone.Router.extend({
    initialize() {
        this.bindDOMEvents();
    },

    bindDOMEvents() {
        $(document).on('click', 'a', this.openLinkHandler.bind(this));
    },

    openLinkHandler(event) {
        let $el = $(event.currentTarget);

        event.preventDefault();

        if ($el.get(0).host === window.location.host) {
            this.navigate($el.attr('href'), { trigger: true });
        }
    }
}));
