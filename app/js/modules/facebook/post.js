'use strict';

import Model from 'core/model';

module.exports = Model.extend({

    defaults: {
        id: null,
        created_time: null,
        message: null,
        story: null
    },

    getHashTags() {
        let regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        let matches = [];
        let match;

        while ((match = regex.exec(this.get('message')))) {
            matches.push(match[1]);
        }

        return matches;
    },

    getCreateDate(){
        return this.get('created_time');
    }
});