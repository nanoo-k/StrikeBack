define([
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function ($, _, Backbone) {

    var Modal = Backbone.Marionette.Region.extend({
        el: "#modal",

        initialize: function(){

        },

        onRender: function(){
            
        }
       
    });


    return Modal;

});