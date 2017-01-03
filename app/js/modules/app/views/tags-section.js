'use strict';

import _ from 'underscore';
import View from 'core/view';

let TagsTpl = require('app/templates/partials/tags.html');

export default View.extend({
    initialize() {
        this.template = TagsTpl;
    },

    postPlaceAt() {
        _.defer(this.createTagCloud.bind(this));
    },

    createTagCloud() {
        
    }
});
