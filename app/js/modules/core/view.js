'use strict';

import $ from 'jQuery';
import _ from 'underscore';
import Backbone from 'backbone';
import ServiceLocator from './service-locator';
import EDWrapper from './event-dispatcher';

export default Backbone.View.extend({
    getService: ServiceLocator.get,
    
    EventDispatcher: EDWrapper.EventDispatcher,

    // All views get a default `template` property that is an empty div; your
    // views should override this property with a template appropriate for the
    // view, but if they don't, your views will get a div as their template.
    template: '<div></div>',

    render() {
        var tpl = _.template(this.template);
        var data = this.serialize();

        this.$el.html(tpl(data));
        this.postRender();

        return this;
    },

    // The `serialize` method is responsible for taking the view's data and
    // preparing it to be used by the view's template. You can override or
    // extend this method as required in your individual view. By default, it
    // will use the model or collection assigned to the view as its data,
    // serializing it using the `toJSON` method; if your view does not have
    // a model or collection, it will just return the view object itself.
    serialize() {
        if (this.model || this.collection) {
            return (this.model || this.collection).toJSON();
        }

        return this;
    },

    // Once the view has been rendered, it still needs to be placed in the
    // document. The `placeAt` method allows you to specify a destination for
    // the view; this destination can either be a jQuery object, a DOM node, or
    // a selector. The `placeAt` method also optionally takes a position
    // argument, which determines how the object will be placed in the
    // destination node: as the first, last, or only child.
    placeAt(node, position) {
        position = position || 'last';

        var method = {
            'first' :     'prepend',
            'last' :      'append',
            'only' :      'html'
        }[position] || 'append';

        $(node)[method](this.$el);

        this.postPlaceAt();
        return this;
    },

    // The `destroy` method unbinds all handlers that were bound using
    // `bindTo`, and also calls the default `remove` method.
    destroy() {
        this.unbind();
        this.remove();

        this.postDestroy();
    },

    // Lifecycle Methods
    //
    // These methods are stubs for implementation by your views. These methods
    // fire after their respective methods are complete.

    // `postRender` fires just before the view's `render` method returns. Do
    // things here that require the view's basic markup to be in place, but
    // that do NOT require the view to be placed in the document
    postRender() { },

    // `postPlaceAt` fires just before the view's `placeAt` method returns. Do
    // things here that require the view to be placed in the document, such as
    // operations that require knowing the dimensions of the view.
    postPlaceAt() { },

    // `postDestroy` fires just before the view's `destroy` method returns. Do
    // things here that are needed to cleanup the view, such as removing 
    // event bindings which are not handled by the destroy method itself.
    postDestroy() { }
});
