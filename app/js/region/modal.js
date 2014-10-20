define([
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function ($, _, Backbone) {

    var Modal = Backbone.Marionette.Region.extend({
        el: "#modal",

        initialize: function(){
            // console.log('modal  init');
        },

        onRender: function(){

            // console.log('modal  render');
        }
       
    });


    return Modal;

});