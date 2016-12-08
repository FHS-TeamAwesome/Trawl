'use strict';

import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import EDWrapper from './event-dispatcher';

export default Backbone.Router.extend({
    getService: ServiceLocator.get,
    
    EventDispatcher: EDWrapper.EventDispatcher,

    setView(view) {
        this.getService('MainViewService')
            .setView(view);
    }
});
