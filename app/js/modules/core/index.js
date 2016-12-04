'use strict';

import Backbone from 'backbone';
import View from './view';
import Model from './model';
import Collection from './collection';
import Controller from './controller';
import ServiceLocator from './service-locator';
import EDWrapper from './event-dispatcher';

export default { 
    Model, 
    Collection, 
    View, 
    Controller, 
    ServiceLocator,
    EventDispatcher: EDWrapper.EventDispatcher
};

