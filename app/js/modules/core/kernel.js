'use strict';

import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import EDWrapper from './event-dispatcher';
import MainViewService from './main-view-service';

export default class Kernel {
    constructor(options = {}) {
        this.getService = ServiceLocator.get;
        this.EventDispatcher = EDWrapper.EventDispatcher;

        this.getService('MainViewService')
            .setEl(options.el || 'body');
    }

    start() {
        Backbone.history.start({ pushState: true });
    }
}
