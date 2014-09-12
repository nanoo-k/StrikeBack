'use strict';

define([
    'backbone',
    'jquery',
    'underscore',
    'model/campaign'
], function (Backbone, $, _, Campaign) {

    var Campaigns = Backbone.Collection.extend({

        model: Campaign,

        url: function(){
            // return "/api/users/" + this.get("Id");
            return "/api/campaigns";
        }

        // selectPost: function(post){
        //     this.vent.trigger("post:selected", post);
        // }
    });

    return Campaigns;
});