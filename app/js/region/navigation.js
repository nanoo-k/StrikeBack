define([
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function ($, _, Backbone) {

    var ActionBar = Backbone.Marionette.Region.extend({
        el: "#navigation",

        title: function(title) {
            // this.ensureEl();
            // this.$el.parent().find("#title").html(title);
        }

    });

    return ActionBar;

});