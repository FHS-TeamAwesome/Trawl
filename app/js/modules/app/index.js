'use strict';

import AppKernel from 'core/kernel';
import IndexController from 'app/controllers/index-controller';
import PageController from 'app/controllers/page-controller';
import Services from 'app/services';

export default class App extends AppKernel {
    constructor(options) {
        let indexController = new IndexController();
        let pageController = new PageController();
        super(options);
    }
}


