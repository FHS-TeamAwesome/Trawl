import MiniLightbox from 'mini-lightbox';

import ServiceLocator from 'core/service-locator';

ServiceLocator.create('MiniLightboxService', class MiniLightboxService {
    constructor() {
        new MiniLightbox({
            selector: "img.lightbox-target",
            // the common container where the images are appended
            delegation: "html"
        });
    }
});