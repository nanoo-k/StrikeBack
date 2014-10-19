define([
    'jquery',
    'underscore',
    'backbone',
    // 'js/views/actionbar/actionbar.js',
    'marionette'
], function ($, _, Backbone) {

    var ActionBar = Backbone.Marionette.Region.extend({
        el: "#action-bar",


        title: function(title) {
            // this.ensureEl();
            // this.$el.parent().find("#title").html(title);
        }

    });

    return ActionBar;

});