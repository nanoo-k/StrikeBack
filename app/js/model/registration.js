'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Registration = Backbone.Model.extend({

        defaults: {
            Description: ' '
        },

        url: function(){
            return "/api/register";
        }
    });

    return Registration;
});