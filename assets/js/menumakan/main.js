(() => {

  const
    w = window,
    d = document,
    c = console,
    eid = (id) => d.getElementById(id),
    hid = (id) => Handlebars.compile(eid(id).innerHTML);

  // =============================================================
  // resolve environment and menu location
  const
    pathname = w.location.pathname,
    envi = [
      '/menumakan/',
      '/ace/menumakan/',
    ].find(front => pathname.startsWith(front)) || '',
    path = pathname.substring(envi.length),
    path_ = (() => {
      if (path.substring(0, 'localhost'.length) == 'localhost') {
        return {
          protocol: 'http',
          host: 'localhost',
          settings: 'http://' + path + '/settings',
          menuItems: 'http://' + path + '/menuItems',
        }
      }
      else {
        return {
          settings: 'https://' + path + '/settings',
          menuItems: 'https://' + path + '/menuItems',
        };
      }
    })();

  // const
  //   urlParams = new URLSearchParams(w.location.search),
  //   param = urlParams.get('param') || 'value';

  c.log(`Envi : ${envi || '((root))'}`);
  c.log(`Path : ${path || '((none))'}`);

  // =============================================================
  // initialize functions

  function registerHandlebars() {

    Handlebars.registerHelper('safe', function (text) {
      if (typeof text !== "string") return text;
      // Only allow certain tags, escape everything else
      const unescaped = Handlebars.escapeExpression(text)
        .replace(/&amp;/g, "&")
        .replace(/&lt;span&gt;(.*?)(&lt;\/span&gt;)/g, (match, t) => '<span>' + t + '</span>')
        .replace(/&lt;b&gt;(.*?)(&lt;\/b&gt;)/g, (match, t) => '<b>' + t + '</b>');
      return new Handlebars.SafeString(unescaped);
    });

  }

  function findMenu(x) {
    if (!x) {
      var menuLocation = eid("menuLocation");
      if (menuLocation) {
        var menuLocationValue = menuLocation.value.toLowerCase();
        w.location.href = envi + menuLocationValue;
      }
    }
    else { w.location.href = envi + x; }
  }
  w.findMenu = findMenu;

  function fetchJson(url) {
    return fetch(url).then((response) => response.json())
  }

  // =============================================================
  // fetch menu

  const
    dom = {},
    template = {},
    handle = {},
    menu = {};
  var errors = [];

  if (path && path.length > 0) {

    c.log('Loading menu ...');

    handle.settings = fetchJson(path_.settings)
      .then((json) => {
        if (json.settings) { menu.settings = json.settings; }
        else { throw new Error('Invalid data.'); }
      })
      .catch(error => {
        errors.push(error);
        c.error("Error fetching settings. ", error.message);
      });

    handle.menuItems = fetchJson(path_.menuItems)
      .then((json) => {
        if (json.menuItems) { menu.menuItems = json.menuItems; }
        else { throw new Error('Invalid data.'); }
      })
      .catch(error => {
        errors.push(error);
        c.error("Error fetching menuItems. ", error.message);
      });

    d.addEventListener('DOMContentLoaded', (event) => {

      registerHandlebars();

      template.menuMessage = Handlebars.compile('<div class="_text_center _i" style="margin:10em auto">{{message}}</div>')
      template.header = hid('header-template');
      template.menu = hid('menu-template');

      dom.header = eid('_header');
      dom.menu = eid('menu');
      
      const fadeInViews = (() => {
        var
          _handle,
          _views = eid('_views'),
          vcss = 'transition:opacity 0.2s ease-in-out;opacity:';
        return function (delay) {
          _views.setAttribute('style', vcss + '0');
          _handle = setTimeout(() => {
            _views.setAttribute('style', vcss + '1');
          }, delay);
        }    
      })();

      fadeInViews(200);

      if (!menu.settings || !menu.menuItems) {
        dom.menu.innerHTML = template.menuMessage({ message: 'Loading menu ...' });
      }

      // =========================================================
      // Wait for menu to load; then render

      Promise.all([handle.settings, handle.menuItems])
        .then(() => {

          if (!menu.settings && !menu.menuItems) {
            const message = `There is no menu at : ${path}`;
            c.log(message);
            dom.menu.innerHTML = hid('intro-template')({ error: { message } });
            dom.menuLocation = eid('menuLocation');
            if (dom.menuLocation) {
              dom.menuLocation.value = path;
              dom.menuLocation.focus();
            }
          }
          else {
            
            c.log('Loading completed.');
            // c.log('menu', menu);
            // dom.menu.innerHTML = JSON.stringify(menu);
            
            if (menu.settings) {
              
              // Index settings by their key
              const settings = _.indexBy(menu.settings, 'key');
              
              // Set the html content of the container element
              d.title = settings.title.value + ' | ' + d.title;
              dom.header.innerHTML = template.header(settings);
              
            }
            else {
              c.log('Settings is missing.');
              // dom.header.innerHTML += template.menuMessage({ message: 'Settings is missing' });
            }
            
            if (menu.menuItems) {
              
              // Group menu items by their category
              const menuItems = _.groupBy(menu.menuItems, 'category');
              
              // Set the html content of the container element
              dom.menu.innerHTML = template.menu(menuItems);
              
            }
            else {
              dom.menu.innerHTML = template.menuMessage({ message: 'Menu is missing' });
            }

          }
          
        });
        
      });
      
    }
  else {

    c.log('No menu specified.');

    d.addEventListener('DOMContentLoaded', (event) => {

      registerHandlebars();

      eid('menu').innerHTML = hid('intro-template')();
      eid('menuLocation').focus();

    });

  }

})();