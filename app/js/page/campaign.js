'use strict';

define([
    'jquery',
    'underscore',
    'layout/global',
    'model/campaign',
    'text!/js/template/test.ejs',
    'marionette',
], function ( $, _, layout, Campaign, Template) {

    var TestView = Backbone.Marionette.ItemView.extend({
        template: _.template(Template),

        // Need to instantiate a campaign model
        initialize: function(options){
            this.model = new Campaign();
            this.model.fetch({
                success: $.proxy(function(){
                    console.log(this.model);
                }, this)
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