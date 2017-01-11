'use strict';

import ServiceLocator from 'core/service-locator';
import textillate from 'chemzqm-textillate';

ServiceLocator.create('Textillate', class Textillate {
    shuffle($element) {
        textillate($element.get(0), {
            minDisplayTime: 500,
            in: {
                effect: 'fade-in',
                shuffle: true,
                delay: 10,
            }
        });
    }
});
