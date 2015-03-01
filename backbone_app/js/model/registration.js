'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Registration = Backbone.Model.extend({

        url: function(){
            return "/api/register";
        }
    });

    return Registration;
});