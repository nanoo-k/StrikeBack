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
        'backbone-forms': {
            deps: [
                'backbone'
            ]
        },
        'backbone-relational': {
            deps: [
                'backbone'
            ]
        },
        'jquery-ui': {
            deps: [
                'jquery'
            ]
        },
        'jquery-md5': {
            deps: [
                'jquery'
            ]
        },

        'tag-it': {
            deps: [
                   "jquery-ui",
                   "css!bower_components/tag-it/css/jquery.tagit.css",
                   "css!bower_components/tag-it/css/tagit.ui-zendesk.css",
                   "less!/style/tags.less"
            ]
        },

        'gritter': {
            deps: [
                'jquery',
                 "css!bower_components/gritter/css/jquery.gritter.css"
            ]
        },

        'bootstrap-tokenfield': {
            deps: [
                'jquery',
                "css!bower_components/bootstrap-tokenfield/bootstrap-tokenfield/bootstrap-tokenfield.css"
            ]
        },

        'dropzone' : {
            deps: [
                'jquery',
                'css!bower_components/dropzone/downloads/css/basic.css',
                'less!/style/dropzone.less'
            ]
        },

        'isotope' : {
            deps: [
                'jquery'
            ]
        },

        'jscrollpane' : {
            deps: [
                'jquery',
                'jquery-mousewheel',
                'css!bower_components/jscrollpane/style/jquery.jscrollpane.css'
            ]
        },

        'timeago' : {
            deps: [
                'jquery'
            ]
        },
        'd3' : {
            exports: 'd3'
        }

    },
    paths: {
        backbone: 'bower_components/backbone/backbone',
        'backbone-forms': 'bower_components/backbone-forms/distribution.amd/backbone-forms',
        'backbone-relational': 'bower_components/backbone-relational/backbone-relational',
        'jquery' : 'bower_components/jquery/jquery',
        'jquery-md5': 'bower_components/jquery-md5/jquery.md5',
        'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
        'underscore': 'bower_components/underscore/underscore',
        'text': 'bower_components/requirejs-text/text',
        'modernizr': 'bower_components/modernizr/modernizr',
        'less': 'bower_components/less/dist/less-1.5.0.js',
        require: 'bower_components/requirejs/require',
        'tag-it': 'bower_components/tag-it/js/tag-it',
        'marionette': 'bower_components/marionette/lib/backbone.marionette',
        'gritter': 'bower_components/gritter/js/jquery.gritter',
        'bootstrap-tokenfield' :   'bower_components/bootstrap-tokenfield/bootstrap-tokenfield/bootstrap-tokenfield',
        'dropzone' :   'bower_components/dropzone/downloads/dropzone-amd-module',
        'mqtt' : 'lib/mqttws31',
        'isotope' :   'bower_components/isotope/jquery.isotope',
        'jscrollpane' : 'bower_components/jscrollpane/script/jquery.jscrollpane',
        'jquery-mousewheel' : 'bower_components/jquery-mousewheel/jquery.mousewheel',
        'timeago' : 'bower_components/jquery-timeago/jquery.timeago',
        'numeral' : 'bower_components/numeraljs/min/numeral.min',
        'd3' : 'bower_components/d3/d3',
        'datejs': 'bower_components/datejs/build/date',
        'gridster' : 'bower_components/gridster/dist/jquery.gridster.with-extras.min'
    }

});


require(['backbone', 'router'], function (Backbone, Router) {
    window.less = { relativeUrls: true };
    window.router = new Router();
    Backbone.history.start({pushState: true});
});
