'use strict';

define([
    'backbone',
    'jquery',
    'underscore',
    'backbone-relational'
], function (Backbone, $, _) {

    var Campaign = Backbone.RelationalModel.extend({

        initialize: function(options){
            options = options || {};
            this.campaign = {};
            if (!_.isUndefined(options.id)) this.campaign.id = options.id;
        },

        url: function(){
            if (!_.isUndefined(this.id)) {
                return "/api/campaigns/" + this.id;

            } else {
                // If this is a new campaign, we're POSTing to this API
                return "/api/campaigns/";
            }            
        },

        relations: [{
            type: Backbone.HasMany,
            key: 'owners',
            relatedModel: 'User'
        }]

        // select: function(){
        //     this.set({selected: true});
        //     this.collection.selectPost(this);
        // }
    });

    return Campaign;
});