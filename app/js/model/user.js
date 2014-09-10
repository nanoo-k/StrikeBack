'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Campaign = Backbone.Model.extend({

        defaults: {
            Description: ' '
        },

        url: function(){
            // return "/api/users/" + this.get("Id");
            return "/api/users";
        }
    });

    return Campaign;
});