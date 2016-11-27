'use strict';

import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import { EventDispatcher } from './event-dispatcher';

export default class Kernel {
    constructor() {
        this.getService = ServiceLocator.get;
        this.EventDispatcher = EventDispatcher;
    }

    start() {
        Backbone.history.start({ pushState: true });
    }
}
