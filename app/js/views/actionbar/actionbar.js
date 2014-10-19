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

        initialize: function(){
            this.setElement('#action-bar');
        },
        
        template: _.template(Template),

        events: {
            "click .sign-in" : "onSignIn"
        },

        onRender: function (argument) {
            // console.log();
        },

        onSignIn: function(e){
            e.preventDefault();
            console.log('sign in');
        }

    });

    return ActionBarView;
});