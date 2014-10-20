'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
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