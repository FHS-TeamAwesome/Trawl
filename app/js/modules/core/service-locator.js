'use strict';

export default {
    services: {},

    get(serviceName) {
        return this.services[serviceName] || null;
    },

    create(serviceName, service) {
        if (this.services[serviceName]) {
            throw new Error('Service already exists!');
        }

        this.services[serviceName] = new service();
    }
};
