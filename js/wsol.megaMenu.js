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

      // Handle interaction on top level items
      base.$items
        .on( 'mouseenter touchstart', base.overHandler )
        .on( 'mouseleave', function( evt ) {
          $(this).removeClass(base.options.hoverClass).blur();
        } );

      // Handle interaction on submenus
      base.$items
        .find( base.options.subMenuSelector )
        .find( base.options.subMenuItemSelector )
          .on('mouseenter', function ( evt ) {
            evt.stopImmediatePropagation();
            $(this).addClass(base.options.hoverClass);
          } )
          .on('mouseleave', function () {
            $(this).removeClass( base.options.hoverClass ).blur();
          })
          .on('touchstart', function ( evt ) {
            evt.stopImmediatePropagation();
            if ( $(this).hasClass( base.options.hoverClass )) {
              $(this).addClass( base.options.hoverClass );
            } else {
              $(this).removeClass( base.options.hoverClass ).blur();
            }
          } );

      // Add something to click/tap to expand responsive sub-menus/panels
      base.$items
        .find( base.options.subMenuSelector )
        .siblings('a')
        .wrap('<span class="expandable"></span>')
        .before('<span class="expand"><span class="plus">+</span><span class="minus">&ndash;</span></span>');

      base.$items
        .find( base.options.subSubMenuSelector )
        .siblings('a')
        .wrap('<span class="flyout-expandable"></span>')
        .before('<span class="flyout-expand"><span class="plus">+</span><span class="minus">&ndash;</span></span>')
        .parents( base.options.subMenuSelector ).addClass('has-flyout');

      // Handle click/tap on newly added +/-
      base.$items.find( ".expand" ).on( 'click' , function( evt ) {
        evt.stopPropagation();
        $(this).closest('li')
          .toggleClass( base.options.hoverTouchClass )
          .siblings()
            .removeClass( base.options.hoverTouchClass );
      } );

      base.$items.find( ".flyout-expand" ).on( 'click' , function( evt ) {
        evt.stopPropagation();
        $(this).closest('li')
          .toggleClass( base.options.hoverTouchClass )
          .siblings()
            .removeClass( base.options.hoverTouchClass );
      } );
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
    };

    base.destroy = function() {
      console.log(base);
      base.$items.removeClass( base.options.hoverClass ).removeClass( base.options.hoverTouchClass );
      base.$items.find( '.expand' ).remove();
      base.$items.find( '.expandable' ).children().unwrap();
      base.$items.find( '.flyout-expand' ).remove();
      base.$items.find( '.flyout-expandable' ).children().unwrap();

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
    // Custom config
    itemSelector: "> li",
    subMenuSelector: ".dropdown",
    subMenuItemSelector: ".dropdown-menu > li",
    subSubMenuSelector: ".dropdown-panel",
    subSubMenuColSelector: ".dropdown-panel-menu",
    hoverClass: "hover",
    hoverTouchClass: "active",
    revClass: "rev"
  };

  $.fn.wsol_megamenu = function(options) {
    return this.each(function() {
      new $.wsol.megamenu(this, options);
    });
  };

})(jQuery, window, document);
