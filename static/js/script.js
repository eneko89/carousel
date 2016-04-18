/*!
 * Copyright © 2016 Eneko Sanz <contact@eneko.me>
 * File distributed under the MIT license.
 * 
 * Description:
 * Entry point of the client side app.
 */

/**
 * Block model. Represents each of the carousel's element's data.
 *
 * @constructor
 *
 * @param  {String}    title   Title of the carousel block.
 *
 * @param  {[String]}  images  Set of image URLs.
 */
var Block = Backbone.Model.extend({

  /**
   * Initializes each Block model on construction (when 'new Block()' is
   * invoked).
   *
   * @param  {Object}  attrs  Block model attributes (title and images).
   */
  initialize: function(attrs) {
    var images = [];
    for (var i = 1; i < 5; i++) {
      this.set('img' + i, randomImg(attrs.images));
    }

    /**
     * Get a random image URL from the 'images' array.
     *
     * @private
     * 
     * @param   {[String]}  images  An array of image URLs.
     * 
     * @return  {String}            A random element from the 'images'
     *                              array.
     */
    function randomImg(images) {
      var index = Math.floor(Math.random() * images.length);
      return images[index];
    }
  }
});

/**
 * Block collection model. Retrieves Block models from the server.
 *
 * @constructor
 */
var BlockCollection = Backbone.Collection.extend({
  model: Block,
  url: '/blocks'
});

/**
 * Renders each block into HTML markup using '#block-template'.
 * 
 * @constructor
 * 
 * @param  {Block}  model  The Block model to render.
 */
var BlockView = Backbone.View.extend({
  tagName: 'li',

  template: _.template($('#block-template').html()),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

/**
 * Renders our beautiful carousel.
 *
 * @constructor
 */
var Carousel = Backbone.View.extend({
  el: '.blocks',

  /**
   * Initializes the Carousel.
   * 
   * Instantiates a BlockCollection, which fetches blocks from the server
   * and automagically creates Block models for each of them.
   * 
   * It also initializes currentBlock to zero and attaches event handlers.
   */
  initialize: function() {

    // Create our block collection.
    this.blocks = new BlockCollection();

    // Fetch blocks from the server, and then, render the view.
    this.blocks.fetch({ success: _.bind(this.render, this)});

    // Cache '.prev' and '.next' jQuery objects to use them later.
    this.$prev = $('.carousel .prev');
    this.$next = $('.carousel .next');

    // Make this object capable of triggering and listening to events.
    _.extend(this, Backbone.Events);

    // Generate 'nextBlock' and 'prevBlock' events and increase/decrease
    // 'currentBlock' when '.prev' and '.next' navigation elements are
    // clicked.    
    this.$prev.on('click', _.bind(this.triggerNavEvents, this));
    this.$next.on('click', _.bind(this.triggerNavEvents, this));

    // We'll use this to track which carousel block is beeing displayed.
    this.currentBlock = 0;

    // As we are initially on the zero block, we disable '.prev' elem.
    this.$prev.prop('disabled', true);

    // Listen to 'nextBlock' and 'prevBlock' and call this.blockChange().
    this.on('prevBlock nextBlock', _.bind(this.blockChange, this))

    // Listen to windows resize events and call this.windowResize().
    $(window).on('resize', _.bind(this.windowResize, this));
  },

  /**
   * Renders each Block model in our BlockCollection (this.blocks) with
   * BlockViews.
   * 
   * @return  {View}  Returns this View, a common practice just to make this
   *                  this function call chainable.
   */
  render: function() {

    // We instantiate a BlockView for each Block. As we are rendering blocks
    // only once, there is no problem in doing it here instead of caching.
    this.blocks.each(function(block) {
      var blockView = new BlockView({
        model: block
      });

      // Set some styles to blocks and the '.blocks' container so each
      // one fits the carousel viewport beautifully.
      this.$el.css('width', (100 * this.blocks.length) + '%');
      blockView.render();
      blockView.$el.css('width', (100 / this.blocks.length) + '%');

      // Append the rendered element to the '.blocks' container.
      this.$el.append(blockView.el);
    }.bind(this));

    return this;
  },

  /**
   * Triggers 'nextBlock' and 'prevBlock' events when navigation controls
   * are clicked and increases/decreases currentBlock.
   * 
   * If currentBlock === 0 it doesn't decrement it and trigger 'prevBlock'.
   * Same when currentBlock === last, it doesn't increment currentBlock and
   * doesn't trigger 'nextBlock'.
   * 
   * @param  {Event}  event  jQuery Event object.
   */
  triggerNavEvents: function(event) {
    var elemClass = event.target.className;

    if (this.currentBlock > 0 && elemClass === 'prev') {
      this.currentBlock--;
      this.trigger('prevBlock', this.currentBlock);
    } else {
      if (this.currentBlock < this.blocks.length - 1
          && elemClass === 'next') {
        this.currentBlock++;
        this.trigger('nextBlock', this.currentBlock);
      }
    }
  },

  /**
   * Relocate the '.blocks' container horizontally adjusting it's 'left'
   * css property according to the 'currentBlock' with a css transition
   * animation.
   *
   * @param  {Number}  currentBlock  Current block index.
   */
  blockChange: function(currentBlock) {
    this.$el.css('transition', 'left 800ms ' 
                                 + 'cubic-bezier(0.165, 0.84, '
                                                 + '0.44, 1)');
    if (currentBlock === this.blocks.length - 1) {
      this.$next.prop('disabled', true);
    } else {
      this.$next.prop('disabled', false);

      if (currentBlock === 0) {
        this.$prev.prop('disabled', true);
      } else {
        this.$prev.prop('disabled', false);
      }
    }
    this._relocate(currentBlock);
  },

  /**
   * Relocate the '.blocks' container horizontally adjusting it's 'left'
   * css property when the window size changes. It's exactly like a
   * blockChange(), but without transition animation.
   *
   * @param  {Number}  currentBlock  Current block index.
   */
  windowResize: function(currentBlock) {
    this.$el.css('transition', 'initial');
    this._relocate(currentBlock);
  },

  /**
   * Relocates '.blocks' container, adjusting it's 'left' css property
   * according to the 'currentBlock'.
   * 
   * @private
   *
   * @param  {Number}  currentBlock  Current block index.
   */
  _relocate: function(currentBlock) {
    var blockWidth = this.$el.width() / this.blocks.length;
    this.$el.css('left', (-blockWidth * currentBlock) + 'px');
  }
});

// Kickstart the awesome!
new Carousel();