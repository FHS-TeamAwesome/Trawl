'use strict';

import $ from 'jquery';
import View from 'core/view';

let MapsTpl = require('app/templates/partials/maps.html');

export default View.extend({
    initialize() {
        this.template = MapsTpl;
    },

    postRender() {
    },

    postPlaceAt() {
    }
});
