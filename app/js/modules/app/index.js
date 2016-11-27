'use strict';

import AppKernel from 'core/kernel';
import ServiceLocator from 'core/service-locator';
import IndexController from 'app/controllers/index-controller';

export default class App extends AppKernel {
    constructor() {
        new IndexController();
        super();
    }
}


