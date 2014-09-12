'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'model/campaign',
    'model/registration',
    'model/user',
    'text!/js/template/campaign.ejs',
    'marionette'
], function ( $, _, layout, Campaign, Registration, User, Template) {

    var CampaignView = Backbone.Marionette.ItemView.extend({
        template: _.template(Template),

        // Need to instantiate a campaign model using args passed thru the URL
        urlArgs: function(args){
            this.model = new Campaign({id: args.CampaignId});
            this.model.fetch({
                success: $.proxy(function(){
                    // I'm setting them after the fact like this and not in the templates bcuz this page initializes and renders without a model set, so there's no template!
                    this.setAttrs();
                }, this)
            });
        },

        initialize: function(options){
        },

        setAttrs: function(){
            this.$el.find('#name').html(this.model.get('name'));
            this.$el.find('#target').html(this.model.get('target'));
            this.$el.find('#callToAction').html(this.model.get('callToAction'));
        },

        events: {
            "click #join" : "onUserJoin"
        },

        onUserJoin: function(){

            // Create user and save it to DB
            this.user = new User();
            this.user.set({
                'username' : this.$el.find('#email').val(),
                'email': this.$el.find('#email').val(),
                'phone': this.$el.find('#phone').val(),
                'password': this.$el.find('#password').val()
            });

            this.user.save({}, {
                success: $.proxy(function(model, response){
                    console.log('User created.');
                    this.registerUser();
                }, this)
            });
        },

        registerUser: function(){
            // Create registration ticket and save it to DB
            this.registration = new Registration();
            this.registration.set({
                campaignId : this.model.get('id'),
                userId : this.user.get('id')
            });

            this.registration.save({}, {
                success: function(model, response){
                    console.log('User registered to campaign.');
                }
            });
        }


        // Need to instantiate a user model and call save on it
    });

    return {
        title: 'Campaign',
        layout: layout,
        regions: {
            content: CampaignView
        }
    }

});