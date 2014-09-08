define([
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function ($, _, Backbone) {

    var Modal = Backbone.Marionette.Region.extend({
        el: "#modal"
        // el: "#modal",

        // onShow: function(view) {
        //     this.$bg = $('<div id="modal-bg"></div>').insertBefore(this.$el);

        //     // set up our close logic
        //     this.$bg.click($.proxy(this.close,this));
        //     // $('<div><img src="/images/icons/close-green.png"></div>').css({float: 'right', margin: 5}).click($.proxy(this.close, this)).prependTo(this.$el);
        //     view.on('close', this.close, this);


        //     // deal with positioning both now and in case of a window resize
        //     $(window).on('resize', $.proxy(this.positionModal, this));
        //     this.$el.on("DOMNodeInserted", $.proxy(this.positionModal, this));
        //     this.positionModal();


        //     // reveal ourselves
        //     this.$el.show();
        // },

        // positionModal: function() {
        //     // If the workbench is expanded, don't include it's width when calculating modal position. If the workbench width is small (80), offset by the workbench's width.
        //     // var workbenchWidth = ($('#workbench').width() <= 80) ? $('#workbench').width() : 0;
        //     var workbenchWidth = 80;
        //     this.$el.css({
        //         // left: $(window).width()/2 - this.$el.outerWidth()/2,
        //         // Above centers in the whole window. Below centers in the content-area.
        //         left: ($(window).width()/2 - this.$el.outerWidth()/2) + workbenchWidth,
        //         top: $(window).height()/2 - this.$el.outerHeight()/2
        //     })
        // },

        // onClose: function(view) {
        //     this.$el.hide();
        //     this.$bg.remove();
        //     $(window).off('resize', this.positionModal);
        //     this.$el.off("DOMNodeInserted", this.positionModal);
        // }
    });


    return Modal;

});