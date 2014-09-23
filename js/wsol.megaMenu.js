/**
 * wsol.megaMenu.js 1.1.0
 * http://github.com/websolutions/megamenu
 */

;(function ($, window, document, undefined) {

  var defaults = {
    // HoverIntent config
    sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
    interval: 10, // number = milliseconds for onMouseOver polling interval
    over: null, // function = onMouseOver callback (REQUIRED)
    timeout: 50, // number = milliseconds delay before onMouseOut
    out: null, // function = onMouseOut callback (REQUIRED)

    // Custom config
    itemSelector: "> li",
    subMenuSelector: ".dropdown",
    subMenuItemSelector: ".dropdown-menu > li",
    subSubMenuSelector: ".dropdown-panel",
    subSubMenuColSelector: ".dropdown-panel-menu",
    hoverClass: "hover",
    revClass: "rev"
  };

  function MegaMenu(element, options) {
    this.$menu = $(element);

    this.overHandler = $.proxy(this.overHandler, this);
    this.outHandler = $.proxy(this.outHandler, this);

    this.settings = $.extend({}, defaults, options);

    this.init();
  }

  MegaMenu.prototype.init = function() {
    var _ = this;

    _.$items = _.$menu.find(_.settings.itemSelector);

    // Handle events
    _.$items.hoverIntent($.extend({}, _.settings, {
      over: _.overHandler,
      out: _.outHandler
    }));
    _.$items.find(_.settings.subMenuSelector).find(_.settings.subMenuItemSelector)
        .hoverIntent($.extend({}, _.settings, {
      over: function(event) { $(this).addClass(_.settings.hoverClass); },
      out: function(event) { $(this).removeClass(_.settings.hoverClass); }
    }));
  };

  MegaMenu.prototype.overHandler = function(event) {
    var _ = this,
        $target = $(event.target).closest(_.$items), $sub = $target.find(_.settings.subMenuSelector),
        rowWidth = $sub.outerWidth(true),
        navWidth = this.$menu.width();

    // If the sub-menu will extend beyond the menu, right align it
    var subRightAlign = ( navWidth - rowWidth ) < $target.position().left;
    $sub.css({
      'right': subRightAlign ? 0 : 'auto'
    }).toggleClass(_.settings.revClass, subRightAlign);

    $target.addClass(_.settings.hoverClass); // Add class after positioning to avoid jumping

    $sub.find(_.settings.subSubMenuColSelector).closest(_.settings.subSubMenuSelector).each(function () {  // for each row...
      var $subSub = $(this), colWidth = 0;

      $subSub.find(_.settings.subSubMenuColSelector).each(function () { // For each column...
        colWidth += $(this).outerWidth(true); // Add each column's width together
      });

      // If the panel will extend beyond the menu, right align it
      var subsubRightAlign = ( $sub.position().left + $sub.width() + colWidth ) > navWidth;
      var border = parseInt( $sub.css('borderLeftWidth') ) + parseInt( $sub.css('borderRightWidth') );
      $subSub.css({
        'width': colWidth,
        'left': subsubRightAlign ? 'auto' : ( rowWidth - border ) + 'px',
        'right': subsubRightAlign ? ( rowWidth - border ) + 'px' : 'auto'
      }).toggleClass(_.settings.revClass, subsubRightAlign);

      var subSubHeight = $subSub.height();
      var subHeight = $sub.height();

      // If the panel is shorter than the submenu, make them the same height
      if (subSubHeight < subHeight) {
        $subSub.css({ 'height': subHeight });
      }

    });

    if (_.settings.over) {
      _.settings.over.call(event.target, event, _);
    }
  };

  MegaMenu.prototype.outHandler = function(event) {
    var _ = this,
        $target = $(event.target).closest(_.$items);

    $target.removeClass(_.settings.hoverClass);

    if (_.settings.out) {
      _.settings.out.call(event.target, event, _);
    }
  };

  MegaMenu.prototype.destroy = function() {
    var _ = this;

    _.$items.removeClass(_.settings.hoverClass);

    // Loop through submenus
    _.$items.find(_.settings.subMenuSelector).each(function () {
      var $sub = $(this), $subItems = $sub.find(_.settings.subMenuItemSelector);
          $subsub = $sub.find(_.settings.subSubMenuSelector);

      $subItems.removeClass(_.settings.hoverClass);
      $sub.add($subsub).removeClass(_.settings.revClass).css({
        'width': '',
        'left': '',
        'right': '',
        'height': ''
      });
    });

    // Remove event handlers
    _.$items.off(".hoverIntent");
  };

  $.fn.megaMenu = function(options) {
    return this.each(function(index, element) {
      element.megaMenu = new MegaMenu(element, options);
    });
  };

  $.fn.unmegaMenu = function() {
    return this.each(function(index, element) {
      if (element.megaMenu) {
        element.megaMenu.destroy();
      }
    });
  };

})(jQuery, window, document);
