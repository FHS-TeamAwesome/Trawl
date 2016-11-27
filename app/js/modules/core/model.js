'use strict';

import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import { EventDispatcher } from './event-dispatcher';

export default Backbone.Model.extend({
    getService: ServiceLocator.get,
    EventDispatcher: EventDispatcher
});
