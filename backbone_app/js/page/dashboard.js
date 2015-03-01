'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'model/campaign',
    'model/user',
    'text!/js/template/dashboard.ejs',
    'marionette',
], function ( $, _, layout, Campaign, User, Template) {

    var TestView = Backbone.Marionette.ItemView.extend({
        template: _.template(Template),

        // Need to instantiate a campaign model using args passed thru the URL
        urlArgs: function(args){
            if (args.isNew) {
                // If the user intends to create a new campaign, then just create an instance of the campaign model
                this.model = new Campaign();

            } else {
                // Else grab the campaign from the DB using the ID and represent it here.
                this.model = new Campaign({id: args.CampaignId});
                this.model.fetch({
                    success: $.proxy(function(){
                        // I'm setting them after the fact like this and not in the templates bcuz this page initializes and renders without a model set, so there's no template!
                        this.setAttrs();
                    }, this)
                });
            }
        },

        initialize: function(options){
        },

        events: {
            "click #save": "onSave"
        },

        onSave: function(){
            this.model.set({
                name: this.$el.find('#name').val(),
                target: this.$el.find('#target').val(),
                callToAction: this.$el.find('#callToAction').val()
            });
            this.model.save();
        },

        setAttrs: function(){
            this.$el.find('#name').val(this.model.get('name'));
            this.$el.find('#target').val(this.model.get('target'));
            this.$el.find('#callToAction').val(this.model.get('callToAction'));
        }


        // Need to instantiate a user model and call save on it
    });

    return {
        title: 'Dashboard',
        layout: layout,
        regions: {
            content: TestView
        }
    }

});