'use strict';

import View from 'core/view';

export default View.extend({
    initialize(options) {
        this.template = options.template;
        console.log('Page View...');
    }
});
