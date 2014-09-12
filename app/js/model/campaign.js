'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Campaign = Backbone.Model.extend({

        initialize: function(options){
            this.campaign = {};
            this.campaign.id = options.id;
        },

        url: function(){
            if (!_.isUndefined(this.id)) {
                return "/api/campaigns/" + this.id;

            } else {
                // If this is a new campaign, we're POSTing to this API
                return "/api/campaigns/";
            }            
        }

        // select: function(){
        //     this.set({selected: true});
        //     this.collection.selectPost(this);
        // }
    });

    return Campaign;
});