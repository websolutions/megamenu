# DEPRICATED
## Use https://github.com/vadikom/smartmenus instead.

# MegaMenu

Multi-level menu system displaying sub-levels on hover.

## Installation

Install via [Bower](http://bower.io):
```
$ bower install websolutions/megamenu --save
```

## Usage

The most basic example follows this DOM structure:
``` html
<ul class="site-nav-menu js-append-around js-megamenu">
  <li>
    <a href="#">Phasellus</a>
    <div class="dropdown clearfix">
      <ul class="dropdown-menu vlist">
        ...
        <li>
          <a href="#">Voluptate dolore</a>
          <div class="dropdown-panel clearfix">
            <ul class="dropdown-panel-menu vlist">
              <li>
                <a href="#">Exercitation</a>
              </li>
            </ul>
            <ul class="dropdown-panel-menu vlist">
              <li>
                <a href="#">Reprehenderit</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </li>
  <li>
    <a href="#">Ornare</a>
    <div class="dropdown clearfix">
      <ul class="dropdown-menu vlist">
        ...
      </ul>
    </div>
  </li>
  <li>
    <a href="#">Aliquam</a>
  </li>
  <li>
    <a href="#">Convallis</a>
    <div class="dropdown clearfix">
      <ul class="dropdown-menu vlist">
	    ...
      </ul>
    </div>
  </li>
</ul>
```

And is initialized like so:
``` javascript
$(".js-megamenu").wsol_megamenu();
```

Menus can be destroyed at any time:
``` javascript
$(".js-megamenu").data("wsol.megamenu").destroy();
```

### Configuring

In addition to [HoverIntent's options](https://github.com/briancherne/jquery-hoverIntent), the plugin can be configured as such:

Option                      | Type     | Description                                                          | Default
----------------------------|----------|----------------------------------------------------------------------|--------
`itemSelector`              | String   | Selector for top-level menu items                                    | `> li`
`subMenuSelector`           | String   | Selector for submenus                                                | `.dropdown`
`subMenuItemSelector`       | String   | Selector for submenu items                                           | `.dropdown-menu > li`
`subSubMenuSelector`        | String   | Selector for sub-submenus                                            | `.dropdown-panel`
`subSubMenuColSelector`     | String   | Selector for sub-submenu columns                                     | `.dropdown-panel-menu`
`hoverClass`                | String   | Class name to apply to hovered menu items                            | `hover`
`revClass`                  | String   | Class name to apply reversely-positioned (sub-)submenus              | `rev`
