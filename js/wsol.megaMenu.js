/**
 * wsol.megamenu.js 2.0.0
 * http://github.com/websolutions/megamenu
 */

;(function ($, window, document, undefined) {
  if (!$.wsol) {
    $.wsol = {};
  }

  $.wsol.megamenu = function(el, options) {
    var base = this;

    base.$el = $(el);
    base.el = el;

    base.$el.data("wsol.megamenu", base);

    base.init = function() {
      base.options = $.extend({}, $.wsol.megamenu.defaultOptions, options);

      base.$items = base.$el.find(base.options.itemSelector);

      // Handle events
      base.$items.hoverIntent($.extend({}, base.options.hoverIntent, {
        over: base.overHandler,
        out: base.outHandler
      }));
      base.$items.find(base.options.subMenuSelector).find(base.options.subMenuItemSelector)
          .hoverIntent($.extend({}, base.options.hoverIntent, {
        over: function(event) { $(this).addClass(base.options.hoverClass); },
        out: function(event) { $(this).removeClass(base.options.hoverClass); }
      }));
    };

    base.overHandler = function() {
      var $target = $(this).closest(base.$items), $sub = $target.find(base.options.subMenuSelector),
          rowWidth = $sub.outerWidth(true),
          navWidth = base.$el.width();

      // If the sub-menu will extend beyond the menu, right align it
      var subRightAlign = ( navWidth - rowWidth ) < $target.position().left;
      $sub.css({
        'right': subRightAlign ? 0 : 'auto'
      }).toggleClass(base.options.revClass, subRightAlign);

      $target.addClass(base.options.hoverClass); // Add class after positioning to avoid jumping

      $sub.find(base.options.subSubMenuColSelector).closest(base.options.subSubMenuSelector).each(function () {  // for each row...
        var $subSub = $(this), colWidth = 0;

        $subSub.find(base.options.subSubMenuColSelector).each(function () { // For each column...
          colWidth += $(this).outerWidth(true); // Add each column's width together
        });

        // If the panel will extend beyond the menu, right align it
        var subsubRightAlign = ( $sub.position().left + $sub.width() + colWidth ) > navWidth;
        var border = parseInt( $sub.css('borderLeftWidth') ) + parseInt( $sub.css('borderRightWidth') );
        $subSub.css({
          'width': colWidth,
          'left': subsubRightAlign ? 'auto' : ( rowWidth - border ) + 'px',
          'right': subsubRightAlign ? ( rowWidth - border ) + 'px' : 'auto'
        }).toggleClass(base.options.revClass, subsubRightAlign);

        var subSubHeight = $subSub.height();
        var subHeight = $sub.height();

        // If the panel is shorter than the submenu, make them the same height
        if (subSubHeight < subHeight) {
          $subSub.css({ 'height': subHeight });
        }

      });

      if (base.options.over) {
        base.options.over.call(event.target, event, _);
      }
    };

    base.outHandler = function(event) {
      var $target = $(this).closest(base.$items);

      $target.removeClass(base.options.hoverClass);

      if (base.options.out) {
        base.options.out.call(event.target, event, _);
      }
    }

    base.destroy = function() {
      base.$items.removeClass(base.options.hoverClass);

      // Loop through submenus
      base.$items.find(base.options.subMenuSelector).each(function () {
        var $sub = $(this), $subItems = $sub.find(base.options.subMenuItemSelector);
            $subsub = $sub.find(base.options.subSubMenuSelector);

        $subItems.removeClass(base.options.hoverClass);
        $sub.add($subsub).removeClass(base.options.revClass).css({
          'width': '',
          'left': '',
          'right': '',
          'height': ''
        });
      });

      // Remove event handlers
      base.$items.off(".hoverIntent");
    };

    base.init();
  };

  $.wsol.megamenu.defaultOptions = {
    hoverIntent: {
      sensitivity: 2,
      interval: 10,
      timeout: 50
    },
    itemSelector: "> li",
    subMenuSelector: ".dropdown",
    subMenuItemSelector: ".dropdown-menu > li",
    subSubMenuSelector: ".dropdown-panel",
    subSubMenuColSelector: ".dropdown-panel-menu",
    hoverClass: "hover",
    revClass: "rev",
    over: null,
    out: null
  };

  $.fn.wsol_megamenu = function(options) {
    return this.each(function() {
      new $.wsol.megamenu(this, options);
    });
  };

})(jQuery, window, document);
