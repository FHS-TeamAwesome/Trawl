'use strict';

import AppKernel from 'core/kernel';
import IndexController from './controllers/index-controller';

export default class App extends AppKernel {
    constructor() {
        new IndexController();
        super();
    }
}
