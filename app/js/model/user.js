'use strict';

define([
    'backbone',
    'jquery',
    'underscore',
    'backbone-relational'
], function (Backbone, $, _) {

    var User = Backbone.RelationalModel.extend({
        
        url: function(){
            if (!_.isUndefined(this.id)) {
                return "/api/users/" + this.id;

            } else {
                // If this is a new user, we're POSTing to this API
                return "/api/users/";
            }  
        },

        relations: [{
            type: Backbone.HasMany,
            key: 'RegisteredTo',
            relatedModel: 'Registration'
        },{
            type: Backbone.HasMany,
            key: 'Owns',
            relatedModel: 'CampaignOwner'
        }]
    });

    return User;
});