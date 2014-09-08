'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'region/navigation',
    'region/modal',
    'text!/js/template/global.ejs',
    'less!/style/global.less',
    'marionette'
], function ($, _, Backbone, ActionBar, Modal, Template) {

    var GlobalLayout = Backbone.Marionette.Layout.extend({
        template: Template,

        el: 'body',

        regions: {
            content: "#content",
            actionBar: ActionBar,
            modal: Modal
        },

        onRender: function(){
        },

        title: function(title) {
            // this.actionbar.title(title);
            // document.title = "Workbench :: " + title;
        }
    });

    var layout = new GlobalLayout();
    layout.render();

    // new Nav({
    //     model: new Backbone.Model({
    //         pages: [
    //             {
    //                 name: "Dashboard",
    //                 // icon: '/images/icons/nav-icon-dashboard.png',
    //                 page: "dashboard"
    //             },
    //             {
    //                 name: "You",
    //                 // icon: '/images/icons/nav-icon-org.png',
    //                 page: "you"
    //             },
    //             {
    //                 name: "Campaign",
    //                 page: "campaign"
    //             }
    //         ]
    //     })
    // }).render();

    return layout;
});