'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'region/actionbar',
    'region/modal',
    'text!/js/template/global.ejs',
    '/js/views/actionbar/actionbar.js',
    'less!/style/global.less',
    'css!/js/bower_components/foundation/css/foundation.css',
    '/js/bower_components/foundation/js/foundation/foundation.js',
    '/js/bower_components/foundation/js/foundation/foundation.reveal.js',
    'marionette'
], function ($, _, Backbone, ActionBar, Modal, Template, ActionBarView) {

    var GlobalLayout = Backbone.Marionette.Layout.extend({
        template: _.template(Template),

        el: 'body',

        regions: {
            content: "#content",
            // actionBar: '#action-bar',
            actionBar: ActionBar,
            modal: Modal
        },

        onRender: function(){
            // Load foundation
            $(document).foundation();
        },

        title: function(title) {
            // this.actionbar.title(title);
            // document.title = "Workbench :: " + title;
        }
    });

    var layout = new GlobalLayout();
    layout.render();


    return layout;
});