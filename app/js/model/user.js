'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var User = Backbone.Model.extend({
        
        url: function(){
            // return "/api/users/" + this.get("Id");
            return "/api/users";
        }
    });

    return User;
});