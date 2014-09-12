'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'collection/campaigns',
    'text!/js/template/index.ejs',
    'marionette'
], function ( $, _, layout, Campaigns, Template) {

    var CampaignView = Backbone.Marionette.ItemView.extend({
        template: _.template('<a href="/campaigns/<%= id %>"><%= name %></a>') ,
        tagName: "li"   
    });

    var Index = Backbone.Marionette.CompositeView.extend({
        template: _.template(Template),

        itemView: CampaignView,
        itemViewContainer: '#campaigns',

        // Need to instantiate a campaign model
        initialize: function(options){
            this.collection = new Campaigns();
            this.collection.fetch({
                success: $.proxy(function(){
                    console.log(this.collection);
                }, this)
            });
        }

        // events: {
        //     "click #add": "onAddCampaign"
        // },

        // onAddCampaign: function(){

        // }

    });

    return {
        title: 'Strike Back',
        layout: layout,
        regions: {
            content: Index
        }
    }

});