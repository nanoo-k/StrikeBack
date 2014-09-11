'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'collection/campaigns',
    'model/campaign',
    'text!/js/template/campaign.ejs',
    'marionette',
], function ( $, _, layout, Campaigns, Campaign, Template) {

    var Campaign = Backbone.Marionette.ItemView.extend({
        template: _.template('<li><a href="/campaigns/<%= id %>"><%= name %></a></li> ')
    });

    var Index = Backbone.Marionette.CollectionView.extend({
        template: _.template(Template),

        itemView: Campaign,
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

    });

    return {
        title: 'Strike Back',
        layout: layout,
        regions: {
            content: Index
        }
    }

});