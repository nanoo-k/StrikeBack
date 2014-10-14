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
        // template: _.template('<a href="/campaign_link">Campaign</a>') ,
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
                data: $.param({
                    getAll: true,
                    limit: 20
                }),
                success: $.proxy(function(){
                    // Do something here once the collection is fetched?
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