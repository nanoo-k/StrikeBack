'use strict';

define(['underscore', 'backbone', 'jquery'], function (_, Backbone, $) {

    'use strict';

    // Router
    var Router = Backbone.Router.extend({

        routes: {
            '' : 'index',
            'verify/:code': 'verify',
            'invite/:code' : 'invite',
            'reset/:code' : 'reset',
            'platform' : 'platform',
            'network/:section' : 'networkConfig',
            'solution/:id/:section' : 'solutionConfig',
            'solution/:id/:section/:sectionId' : 'solutionConfig',
            'content/:contentId' : 'contentEdit',
            'content/:contentId/property/:propertyId' : 'contentEdit',
            'content/:contentId/property/:propertyId/add' : 'contentAdd',
            'error': 'error',
            '*catchAll': 'catchAll'
        },

        navigate: function (fragment) {
            Backbone.history.navigate(fragment, {trigger: true});
            return this;
        },

        index: function() {
            window.location.href = "/network";
        },

        platform: function() {
            this.loadPage("/platform");
        },

        verify: function (code) {
            require(['page/verify'], function (obj) {
                var view = obj.regions.content;
                obj.layout.content.show(view)
                view.setCode(code);
            });
        },

        networkConfig: function(section) {
            this.loadPage("network", {Section: section});
        },

        solutionConfig: function(id, section, sectionId) {
            this.loadPage("solution-config", {Id: id, Section: section, SectionId: sectionId});
        },

        contentEdit: function(contentId, propertyId, action) {
            this.loadPage("content", {contentId: contentId, propertyId: propertyId, action: action});
        },

        contentAdd: function(contentId, propertyId, action) {
            this.loadPage("contentAdd", {contentId: contentId, propertyId: propertyId, action: action});
        },

        // nvVersion: function(id) {
        //      this.loadPage("solution-config", {Id: id, Section: section, SectionId: sectionId});
        // },

        invite: function(hash) {
            this.loadPage("invite", {hash: hash});
        },

        reset: function(infoHash) {
            this.loadPage("reset", {infoHash: infoHash});
        },

        catchAll: function () {
            this.loadPage(document.location.pathname);
        },

        error: function () {
        },

        loadPage: function (path, args) {
            if (path.charAt(0) != '/') path = '/' + path;
            var navigate = this.navigate;
            require(['page' + path], function(options) {
                if (_.isFunction(options))
                    options = options();

                if (_.isObject(options)) {
                    // if we have a page title set it on the layout
                    if (_.isFunction(options.layout.title)) {
                        options.layout.title(_.has(options, 'title') ? options.title : '');
                    }

                    // loop through our regions in our layout
                    for (var region in options.layout.regions) {
                        // if we have something to jam in the region
                        if (_.has(options.regions, region)) {
                            // jam it in
                            var v = options.regions[region];

                            // if we have a function...
                            if (_.isFunction(v)) {
                                // if its a view create a new instance
                                if (v.prototype instanceof Backbone.View)
                                    v = new v();
                                // otherwise call the closure
                                else
                                    v = v();
                            }

                            if (_.isObject(args) && _.isFunction(v.urlArgs)) v.urlArgs(args);
                            options.layout[region].show(v);
                        } else {
                            // otherwise close the region
                            options.layout[region].close();
                        }
                    }
                }
            }, function(error) {
                this.loadPage('error');
            });
        },

        nojs: function () {
        },


    });

    return Router;
});
