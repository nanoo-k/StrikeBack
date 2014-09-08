'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'text!/js/template/test.ejs',
    'marionette',
], function ( $, _, layout, Template) {

    var TestView = Marionette.ItemView.extend({
        template: Template
    });

    return {
        title: 'Network',
        layout: layout,
        regions: {
            content: TestView
        }
    }

});