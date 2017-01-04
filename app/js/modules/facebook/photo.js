import Model from 'core/model';

module.exports = Model.extend({

    defaults: {
        locationName: null,
        latitude: null,
        longitude: null,
        url: null,
        created_time: null
    },

    getCreateDate() {
        return this.get('created_time');
    }

});