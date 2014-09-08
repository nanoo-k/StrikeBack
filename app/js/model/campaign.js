'use strict';

define([
    'backbone',
    'jquery',
    'underscore'
], function (Backbone, $, _) {

    var Campaign = Backbone.Model.extend({

        defaults: {
            Description: ' '
        },

        // relations: [
        //     {
        //         type: Backbone.HasMany,
        //         key: 'Versions',
        //         relatedModel: Version,
        //         collectionType: VersionCollection,
        //         collectionOptions: function(application) {
        //            return {'application': application};
        //         }/*,
        //         reverseRelation: {
        //             key: "Application"
        //         } */
        //     }
        // ],

        // toJSON: function() {
        //     return _.extend({Icon: "/api/campaign/" + this.get("Id")}, NV.Model.prototype.toJSON.call(this));
        // }

        url: function(){
            // return "/api/users/" + this.get("Id");
            return "/api/users/1";
        }
    });

    return Campaign;
});