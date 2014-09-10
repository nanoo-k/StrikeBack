'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'model/campaign',
    'text!/js/template/campaign.ejs',
    'marionette',
], function ( $, _, layout, Campaign, Template) {

    var TestView = Backbone.Marionette.ItemView.extend({
        template: _.template(Template),

        // Need to instantiate a campaign model
        initialize: function(options){
            this.model = new Campaign();
            this.model.fetch({
                success: $.proxy(function(){
                    this.setAttrs();
                }, this)
            });
            
        },

        setAttrs: function(){
            this.$el.find('#name').html(this.model.get('name'));
            this.$el.find('#target').html(this.model.get('target'));
            this.$el.find('#callToAction').html(this.model.get('callToAction'));
        }


        // Need to instantiate a user model and call save on it
    });

    return {
        title: 'Campaign',
        layout: layout,
        regions: {
            content: TestView
        }
    }

});