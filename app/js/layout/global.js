'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'region/actionbar',
    'region/modal',
    'text!/js/template/global.ejs',
    'js/views/actionbar/actionbar.js',
    'less!/style/global.less',
    'marionette'
], function ($, _, Backbone, ActionBar, Modal, Template, ActionBarView) {

    var GlobalLayout = Backbone.Marionette.Layout.extend({
        template: _.template(Template),

        el: 'body',

        regions: {
            content: "#content",
            actionBar: ActionBar,
            modal: Modal
        },

        initialize: function(){
            // this.actionBar.show(new ActionBarView().reder());
        },

        onRender: function(){
            // this.actionBar.show(new ActionBarView().reder());
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