'use strict';

import _ from 'underscore';
import Backbone from 'backbone';

export default { 
    EventDispatcher: _.extend({}, Backbone.Events)
};
