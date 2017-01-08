'use strict';

import ServiceLocator from 'core/service-locator';
import ScrollMonitor from 'scrollmonitor';

ServiceLocator.create('ScrollManager', class ScrollManager {
    add($element, fn) {
        let elementWatcher = ScrollMonitor.create($element, { top: -400 });

        elementWatcher.enterViewport(fn);
    }
});
