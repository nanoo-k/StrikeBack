'use strict';

define([
    'jquery',
    'underscore',
    'model/user',
    'text!/js/template/modals/sign-in.ejs',
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
            console.log('rendered');
        },

        template: _.template(Template)

    });

    return Modal ;

});