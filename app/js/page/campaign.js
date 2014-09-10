'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'model/campaign',
    'model/user',
    'text!/js/template/campaign.ejs',
    'marionette',
], function ( $, _, layout, Campaign, User, Template) {

    var TestView = Backbone.Marionette.ItemView.extend({
        template: _.template(Template),

        // Need to instantiate a campaign model
        initialize: function(options){
            this.model = new Campaign();
            this.model.fetch({
                success: $.proxy(function(){
                    // I'm setting them after the fact like this and not in the templates bcuz this page initializes and renders without a model set, so there's no template!
                    this.setAttrs();
                }, this)
            });
            
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
            var user = new User();
            user.set({
                'username' : this.$el.find('#email').val(),
                'email': this.$el.find('#email').val(),
                'phone': this.$el.find('#phone').val(),
                'password': this.$el.find('#password').val()
            });

            user.save({
                success: function(model){
                    console.log(model);
                }
            });
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