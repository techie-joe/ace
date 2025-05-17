(() => {

  // can only be used on these domains
  const ALLOWED_DOMAINS = [
    'localhost',
    'techie-joe.github.io',
    'easy-menu.pages.dev',
  ];
  if (!(ALLOWED_DOMAINS.find(ends => window.location.host.endsWith(ends)))) { return }

  const
    w = window,
    d = document,
    c = console,
    h = Handlebars,
    eid = (id) => d.getElementById(id),
    hid = (id) => h.compile(eid(id).innerHTML),
    pathname = w.location.pathname;

  // =============================================================
  // get parameter values from URL
  // =============================================================
  const
    urlParams = new URLSearchParams(w.location.search),
    param = {
      protocol: urlParams.get('protocol'),
      p: urlParams.get('p'),
      ext: urlParams.get('ext'),
    };

  // =============================================================
  // determine parts of pathname
  // - homepath : paths where index.html is located,
  // - - expected to be in the root of the web server
  // - - or these special paths: /easymenu/open/ and /ace/easymenu/open/
  // - menupath : path to the menu to be fetched
  // - - user can specify a menupath in the URL
  // - - paths after homepath (require functioning url rewrite)
  // - - or use parameter ?p=(menupath)
  // =============================================================
  const
    homepath = [
      '/easymenu/open/',
      '/ace/easymenu/open/',
    ].find(front => pathname.startsWith(front)) || '',
    menupath = pathname.substring(homepath.length) || param.p || '',
    menuhost = menupath.substring(0, menupath.indexOf('/')),
    menuprotocol = [
      '127.0.0.1',
      'localhost',
    ].includes(menuhost) ? 'http://' : (param.protocol || 'https://'),
    menuextension = [
      'github.io', // github pages
    ].find(ends => menuhost.endsWith(ends)) ? '.json' : (param.ext || '');

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
      var menuLocationValue = menuLocation.value.trim();
      w.location.href = homepath + menuLocationValue;
    }
  }

  function locate(x) { if (x) { w.location.href = homepath + x; } }

  function renderSuggestions() {

    var hostpath = w.location.host + '/ace/easymenu';
    var host_url = homepath + ([
      'github.io', // github pages
    ].find(ends => w.location.host.endsWith(ends)) ? '?p=' + hostpath : hostpath);
    eid('suggestions').innerHTML = hid('suggestions-template')([
      {
        url: host_url,
        path: hostpath,
        title: '(Demo 1)',
        description: '&#128020; Your Brand! - Restaurant Menu.',
      },
      {
        url: host_url + '/menu_A',
        path: hostpath + '/menu_A',
        title: '(Demo 2)',
        description: '&#129412; Unique Shop! - Store Menu.',
      },
      {
        url: host_url + '/menu_C',
        path: hostpath + '/menu_C',
        title: '(Demo 3)',
        description: 'A simple menu.',
      },
    ]);

    
  }

  // =============================================================
  // fetch menu
  // =============================================================

  const
    path_ = {
      settings: menuprotocol + menupath + '/settings' + (menuextension || ''),
      menuItems: menuprotocol + menupath + '/menuItems' + (menuextension || ''),
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
        dom_main = eid('main'),
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
        dom_main.setAttribute('style', 'display:none !important;');
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
            const message = `There is nothing at : ${menupath}`;
            c.log(message);
            dom_menu.innerHTML = '';
            dom_main.setAttribute('style', '');
            eid('menuLocatorMessage').innerHTML = message;
            dom_menuLocation = eid('menuLocation');
            if (dom_menuLocation) {
              dom_menuLocation.value = menupath;
              dom_menuLocation.focus();
            }
            renderSuggestions();
          }
          else {

            if (json.settings) {

              // Index settings by their key
              const settings = _.indexBy(json.settings, 'key');

              // Set the html content of the container element
              d.title = settings.title.value + ' | ' + d.title;
              const header_style = `<style>#_body {
                border-top-color: ${settings['primary-color'].value};
                border-bottom-color: ${settings['secondary-color'].value};
              }
              #_header { background-color: #EEEEEE; }
              ._dark #_header { background-color: #282828; }
              #_header .logo {
                color: ${settings['header-primary-color'].value};
                text-shadow: 4px 4px 0px ${settings['header-secondary-color'].value}, 5px 5px 8px rgba(0, 0, 0, 0.6);
              }</style>`;
              dom_header.innerHTML = header_style + template_header(settings);

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

      eid('menuLocation').focus();

      renderSuggestions();

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