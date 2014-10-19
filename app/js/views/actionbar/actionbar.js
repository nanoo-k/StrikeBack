'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/js/template/actionbar/actionbar.ejs',
    'less!/style/global.less',
    'marionette'
], function ($, _, Backbone, Template) {

    var ActionBarView = Backbone.Marionette.ItemView.extend({
        // el: "#thing",

        initialize: function(){
            this.setElement('#action-bar');
        },

        onRender: function (argument) {
            console.log();
        },

        template: _.template(Template)

    });

    return ActionBarView;
});