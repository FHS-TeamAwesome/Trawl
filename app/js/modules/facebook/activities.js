'use strict';

import Model from 'core/model';
import _ from 'underscore';

module.exports = Model.extend({
    initialize(activityEntities) {
        this.attributes.activities = this.createActivities(activityEntities);
    },

    createActivities(activityEntities) {
        let mergedActivities = [];

        for (let activityEntity of activityEntities) {
            let activity = activityEntity.getActivities();

            for (let data of activity) {
                mergedActivities.push(data);
            }
        }

        return (_.sortBy(mergedActivities, 'created_time'));
    }
});
