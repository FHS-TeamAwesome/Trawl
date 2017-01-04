'use strict';

import Model from 'core/model';

module.exports = Model.extend({

    initialize(activityEntities) {
        this.attributes.activities = this.createActivities(activityEntities);
    }

});
