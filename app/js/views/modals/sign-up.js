'use strict';

define([
    'jquery',
    'underscore',
    'model/user',
    'text!/js/template/modals/sign-up.ejs',
    'marionette'
], function ( $, _, User, Template){

    var Modal = Backbone.Marionette.ItemView.extend({

        // Need to instantiate a campaign model
        initialize: function(options){
            // this.setElement("#modal");

            // this.collection = new Campaigns();
            // this.collection.fetch({
            //     data: $.param({
            //         getAll: true,
            //         limit: 20
            //     }),
            //     success: $.proxy(function(){
            //         // Do something here once the collection is fetched?
            //     }, this)
            // }); 
        },

        onRender: function(){
            // this.$el.find('#join').on('click', $.proxy(this.onJoin, this));
        },

        events: {
            'click #join': 'onJoin',
            'click .me': 'onJoin'
        },

        template: _.template(Template),

        onJoin: function(e){
            // Get all the params needed for making a user
                // username option, email, phone, pass
            console.log();
        }

    });

    return Modal;

});