'use strict';

import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import { EventDispatcher } from './event-dispatcher';

export default Backbone.Collection.extend({
    initialize() {
        this.getService = ServiceLocator.get;
        this.EventDispatcher = EventDispatcher;
    }
});
