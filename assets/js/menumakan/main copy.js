(() => {

  const
    w = window,
    d = document,
    eid = (id) => d.getElementById(id),
    hid = (id) => Handlebars.compile(eid(id).innerHTML),
    pathname = w.location.pathname,
    envi = [
      '/menumakan/',
      '/ace/menumakan/',
    ].find(front => pathname.startsWith(front)) || '',
    path = pathname.substring(envi.length);
  
  function fetchJson(url) {
    return fetch(url).then((response) => response.json())
  }
  
  Handlebars.registerHelper('safe', function (text) {
    if (typeof text !== "string") return text;
    // Only allow certain tags, escape everything else
    const unescaped = Handlebars.escapeExpression(text)
      .replace(/&amp;/g, "&")
      .replace(/&lt;span&gt;(.*?)(&lt;\/span&gt;)/g, (match, t) => '<span>' + t + '</span>')
      .replace(/&lt;b&gt;(.*?)(&lt;\/b&gt;)/g, (match, t) => '<b>' + t + '</b>');
    return new Handlebars.SafeString(unescaped);
  });

  // Wait for page to load
  document.addEventListener('DOMContentLoaded', (event) => {

    const
      dom = {
        footer: eid('_footer'),
        header: eid('_header'),
        menu: eid('menu'),
      };
    
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

    console.log(`Path : ${envi || '((root))'}`);
    console.log(`Menu : ${path || '((none))'}`);
    
    if (path && path.length > 0) {

      // dom.menu.innerHTML = path || '(( none ))';

      const
        footerTemplate = hid('footer-template'),
        headerTemplate = hid('header-template'),
        menuTemplate = hid('menu-template');
      
      dom.footer.innerHTML = footerTemplate({envi});

      const
        path_ = (() => {
          const path_ = {
            settings: 'https://' + path + '/settings',
            menuItems: 'https://' + path + '/menuItems',
          };
          if (path.substring(0, 'localhost'.length) == 'localhost') {
            path_.settings = 'http://' + path + '/settings';
            path_.menuItems = 'http://' + path + '/menuItems';
          }
          return path_;
        })();
      
      var status = 'loading';

      fetchJson(path_.settings)
        .then((json) => {

          // Group settings by their category
          let settings = _.indexBy(json.settings, 'key');

          // console.log('Settings', settings);

          // Set the html content of the container element
          d.title = settings.title.value + ' | ' + d.title;
          dom.header.innerHTML = headerTemplate(settings);

        });

      fetchJson(path_.menuItems)
        .then((json) => {

          // menu.innerHTML = JSON.stringify(json);

          // Group menu items by their category
          let menuItems = _.groupBy(json.menuItems, 'category');

          // console.log('Menu', menuItems);

          // Set the html content of the container element
          menu.innerHTML = menuTemplate(menuItems);

        })
        .catch(error => {
          console.error("Fetch error:", error.message); // Handle errors here
          menu.innerHTML = [
            hid('intro-template')({
              error: { message: `No menu found at : ${path}` }
            }),
          ].join('');
          eid('menuLocation').focus();
        })
        .finally(() => {
          status = 'complete';
        });
      
      setTimeout(() => {
        if (status != 'complete') {
          menu.innerHTML = '<div class="_text_center _i" style="margin:10em auto">Loading menu ...</div>';
        }
      }, 500);

    }
    else {
      // console.error(`Menu Not Found > path is : (${path || '(none)'})`);
      menu.innerHTML = hid('intro-template')();
      eid('menuLocation').focus();
    }

    // const
    //   urlParams = new URLSearchParams(w.location.search),
    //   param = urlParams.get('param') || 'value';

  });
  
})();