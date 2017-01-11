'use strict';

import _ from 'underscore';
import View from 'core/view';

let NavigationTpl = require('app/templates/partials/navigation.html');

export default View.extend({
    initialize(options) {
        this.options = options;

        this.template = options.template;
    },

    postRender() {
        this.$el.find('#navigation-container').append(_.template(NavigationTpl)
            ({ 
                currentRoute: this.options.currentRoute 
            })
        );
    }
});
