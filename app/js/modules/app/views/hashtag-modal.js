'use strict';

import $ from 'jquery';
import _ from 'underscore';
import View from 'core/view';

let HashTagModalTpl = require('app/templates/partials/hashtag-modal.html');

export default View.extend({
    initialize() {
        this.template = HashTagModalTpl;
    },

    postPlaceAt() {
        this.$backdrop = $('<div class="modal-backdrop"/>');

        $('body').append(this.$backdrop);

        this.$el.on('click', '#modal-close', this.close.bind(this));
    },

    open(data) {
        this.render(data);
        
        _.delay(() => {
            this.$el.find('#modal-container').addClass('is-visible');
        }, 50);

        this.$backdrop.addClass('is-visible');
        $('body').addClass('no-scrolling');
    },

    close() {
        this.$el.find('#modal-container').removeClass('is-visible');
        this.$backdrop.removeClass('is-visible');
        $('body').removeClass('no-scrolling');
    }
});
