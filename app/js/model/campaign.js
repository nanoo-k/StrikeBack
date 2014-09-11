'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Campaign = Backbone.Model.extend({

        initialize: function(options){
            this.campaign.id = options.id;
        },

        url: function(){
            // return "/api/users/" + this.get("Id");
            return "/api/campaigns/" + this.campaign.id;
            // return "/api/campaigns/3";
        },

        select: function(){
            this.set({selected: true});
            this.collection.selectPost(this);
        }
    });

    return Campaign;
});