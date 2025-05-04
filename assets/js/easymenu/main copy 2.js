(() => {

  const
    w = window,
    d = document,
    c = console,
    h = Handlebars,
    eid = (id) => d.getElementById(id),
    hid = (id) => h.compile(eid(id).innerHTML),
    pathname = w.location.pathname;

  // =============================================================
  // determine parts of pathname
  // - homepath : paths where index.html is located,
  // - - expected to be in the root of the web server
  // - - except for special cases:
  // - - localhost : /easymenu/ and /ace/easymenu/
  // - menupath : path to the menu to be fetched
  // =============================================================
  const
    homepath = (() => {
      const host = w.location.host;
      if (host == 'localhost') {
        return [
          '/easymenu/',
          '/ace/easymenu/',
        ].find(front => pathname.startsWith(front)) || '';
      }
      return '';
    })(),
    menupath = pathname.substring(homepath.length);

  // =============================================================
  // get parameter values from URL
  // =============================================================
  // const
  //   urlParams = new URLSearchParams(w.location.search),
  //   param = urlParams.get('param') || 'value';

  // =============================================================
  // initialize functions
  // =============================================================

  function registerHandlebars() {
    h.registerHelper('safe', function (text) {
      if (typeof text !== "string") return text;
      // Only allow certain tags, escape everything else
      const unescaped = h.escapeExpression(text)
        .replace(/&amp;/g, "&")
        .replace(/&lt;span&gt;(.*?)(&lt;\/span&gt;)/g, (match, t) => '<span>' + t + '</span>')
        .replace(/&lt;b&gt;(.*?)(&lt;\/b&gt;)/g, (match, t) => '<b>' + t + '</b>');
      return new h.SafeString(unescaped);
    });
  }

  function find() {
    var menuLocation = eid("menuLocation");
    if (menuLocation) {
      var menuLocationValue = menuLocation.value.toLowerCase();
      w.location.href = homepath + menuLocationValue;
    }
  }

  function locate(x) { if (x) { w.location.href = homepath + x; } }

  // =============================================================
  // fetch menu
  // =============================================================

  const
    menuhost = menupath.substring(0, menupath.indexOf('/')),
    menuprotocol = menuhost == 'localhost' ? 'http://' : 'https://',
    path_ = {
      settings: menuprotocol + menupath + '/settings',
      menuItems: menuprotocol + menupath + '/menuItems',
    },
    json = {},
    errors = [],
    fetchJson = (url) => {
      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        });
    },
    withError = (error) => {
      errors.push(error);
      c.error(error.message);
    };

  // only fetch when menupath exists
  if (menupath && menupath.length > 0) {

    c.log('Loading menu ...');

    const handle_settings = fetchJson(path_.settings)
      .then((_json) => {
        if (!_json.settings) { throw new Error('Invalid settings.'); }
        json.settings = _json.settings;
      })
      .catch(withError);

    const handle_menuItems = fetchJson(path_.menuItems)
      .then((_json) => {
        if (!_json.menuItems) { throw new Error('Invalid menuItems.'); }
        json.menuItems = _json.menuItems;
      })
      .catch(withError);

    d.addEventListener('DOMContentLoaded', (event) => {

      registerHandlebars();

      const
        template_menuMessage = h.compile('<div class="_text_center _i" style="margin:10em auto">{{message}}</div>'),
        template_header = hid('header-template'),
        template_menu = hid('menu-template'),
        dom_header = eid('_header'),
        dom_menu = eid('menu'),
        fadeInViews = (() => {
          var
            _views = eid('_views'),
            vcss = 'transition:opacity 0.2s ease-in-out;opacity:';
          return function (delay) {
            clearTimeout(fadeInViews.id);
            _views.setAttribute('style', vcss + '0');
            fadeInViews.id = setTimeout(() => {
              _views.setAttribute('style', vcss + '1');
            }, delay);
          }
        })(); // end of fadeInViews

      fadeInViews(200);

      // Display loading message if settings or menuItems are not loaded yet
      if (!json.settings || !json.menuItems) {
        dom_menu.innerHTML = template_menuMessage({ message: 'Loading menu ...' });
      }

      // =========================================================
      // Wait for all to load; then render
      // =========================================================

      Promise.all([handle_settings, handle_menuItems])
        .then(() => { // render menu

          c.log('Loading completed.');
          // c.log(json);
          // dom_menu.innerHTML = JSON.stringify(json, null, 2);

          if (!json.settings && !json.menuItems) {
            const message = `There is no menu at : ${menupath}`;
            c.log(message);
            dom_menu.innerHTML = hid('intro-template')({ error: { message } });
            dom_menuLocation = eid('menuLocation');
            if (dom_menuLocation) {
              dom_menuLocation.value = menupath;
              dom_menuLocation.focus();
            }
          }
          else {

            if (json.settings) {

              // Index settings by their key
              const settings = _.indexBy(json.settings, 'key');

              // Set the html content of the container element
              d.title = settings.title.value + ' | ' + d.title;
              dom_header.innerHTML = template_header(settings);

            }

            if (json.menuItems) {

              // Group menu items by their category
              const menuItems = _.groupBy(json.menuItems, 'category');

              // Set the html content of the container element
              dom_menu.innerHTML = template_menu(menuItems);

            }
            else {
              dom_menu.innerHTML = template_menuMessage({ message: 'Menu is missing' });
            }

          } // end of if no settings and menuItems

        }); // end of Promise.all loaded

    }); // end of DOMContentLoaded

  } // end of if menupath exists
  else {

    c.log('No menu specified.');

    d.addEventListener('DOMContentLoaded', (event) => {

      registerHandlebars();

      eid('menu').innerHTML = hid('intro-template')();
      eid('menuLocation').focus();

    }); // end of DOMContentLoaded

  } // end of else menupath exists

  // =============================================================
  // export menu functions
  // =============================================================

  w.menu = {
    homepath,
    menupath,
    menuhost,
    find,
    locate,
  }

})();