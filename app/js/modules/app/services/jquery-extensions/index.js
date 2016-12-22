'use strict';

import $ from 'jquery';
import whenAll from 'app/services/jquery-extensions/when-all';
import ServiceLocator from 'core/service-locator';

ServiceLocator.create('JqueryExtensions', class JqueryExtensions {
    constructor() {
        $.whenAll = whenAll;
    }
});
