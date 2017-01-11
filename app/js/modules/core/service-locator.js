'use strict';

let services = {};

let ServiceLocator = {
    get(serviceName) {
        return services[serviceName] || null;
    },

    create(serviceName, service) {
        if (services[serviceName]) {
            throw new Error('Service already exists!');
        }

        services[serviceName] = new service();
    }
};

export default ServiceLocator;
