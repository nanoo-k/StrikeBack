'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'layout/global',
    'js/views/modals/sign-up.js',
    'js/views/modals/sign-in.js',
    'model/user',
    'text!/js/template/actionbar/actionbar.ejs',
    'less!/style/global.less',
    'marionette'
], function ($, _, Backbone, layout, SignUp_Modal, SignIn_Modal, User, Template) {

    var ActionBarView = Backbone.Marionette.ItemView.extend({

        initialize: function(){
            this.setElement('#action-bar');
        },

        template: _.template(Template),

        events: {
            "click .sign-in" : "onSignIn",
            "click .sign-up" : "onSignUp"
        },

        onSignUp: function(e){
            // e.preventDefault();

            layout.regions.modal( new SignUp_Modal().render() );
            // layout.modal.show( new SignUp_Modal() );
            // this.modal = new SignUp_Modal().render();
            $(document).foundation();

            // Load modal popup that requests user to sign up
            // this.modal.render();
            // layout.modal.show(this.modal);
            
            // $('#buttonForModal').click(function() {
               // $('#myModal').reveal();
            // });
        },

        onSignIn: function(e){
            // Prevent the link from doing anything.
            e.preventDefault();

            // Load modal popup that requests user to sign in            
            // this.modal = new SignIn_Modal().render();
            layout.modal.show( new SignIn_Modal() );
            $(document).foundation();


            // Load modal popup that requsts user to sign in
            // $('#buttonForModal').click(function() {
               // $('#myModal').reveal();
            // });
        }

    });

    return ActionBarView;
});