'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'model/user',
    'text!/js/template/actionbar/actionbar.ejs',
    'less!/style/global.less',
    'marionette'
], function ($, _, Backbone, User, Template) {

    var ActionBarView = Backbone.Marionette.ItemView.extend({

        initialize: function(){
            this.setElement('#action-bar');
        },

        template: _.template(Template),

        events: {
            "click .sign-in" : "onSignIn",
            "click .sign-up" : "onSignUp"
        },

        onRender: function (argument) {
        },

        onSignUp: function(e){
            e.preventDefault();

            // Load modal popup that requests user to sign up
            // $('#buttonForModal').click(function() {
               // $('#myModal').reveal();
            // });
        },

        onSignIn: function(e){
            // Prevent the link from doing anything.
            e.preventDefault();

            // Load modal popup that requsts user to sign in
            // $('#buttonForModal').click(function() {
               // $('#myModal').reveal();
            // });
        }

    });

    return ActionBarView;
});