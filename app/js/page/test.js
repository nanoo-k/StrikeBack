'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'text!/js/template/test.ejs',
    'marionette',
], function ( $, _, layout, Template) {

    var TestView = Backbone.Marionette.ItemView.extend({
        template: Template
    });

    return {
        title: 'Test',
        layout: layout,
        regions: {
            content: TestView
        }
    }

});