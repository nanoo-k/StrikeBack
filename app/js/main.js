'use strict';

require.config({
    baseUrl: '/js',
    map: {
        '*': {
            less: 'bower_components/require-less/less',
            css: 'bower_components/require-css/css'

        }
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'backbone-relational': {
            deps: [
                'backbone'
            ]
        },

    },
    paths: {
        backbone: 'bower_components/backbone/backbone',
        'backbone-relational': 'bower_components/backbone-relational/backbone-relational',
        'jquery' : 'bower_components/jquery/jquery',
        'underscore': 'bower_components/underscore/underscore',
        'text': 'bower_components/requirejs-text/text',
        'modernizr': 'bower_components/modernizr/modernizr',
        'less': 'bower_components/less/dist/less-1.5.0.js',
        require: 'bower_components/requirejs/require',
        'tag-it': 'bower_components/tag-it/js/tag-it',
        'marionette': 'bower_components/marionette/lib/backbone.marionette'
    }

});


require(['backbone', 'router'], function (Backbone, Router) {
    window.less = { relativeUrls: true };
    window.router = new Router();
    Backbone.history.start({pushState: true});
});
