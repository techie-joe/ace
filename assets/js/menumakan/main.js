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

const _examples = [
  // 'api.sheety.co/phill/cluckerRestaurant',
  // 'api.sheety.co/ed6904a0d8a396880b2772c9bf093d33/restaurantMenu',
  'localhost/ace/assets/js/menumakan',
  'localhost/menumakan',
];

// Wait for page to load
document.addEventListener('DOMContentLoaded', (event) => {

  const
    w = window,
    d = document,
    eid = (id) => d.getElementById(id),
    dom = {
      loadingMsg: eid('loadingMsg'),
      header: eid('_header'),
      menu: eid('menu'),
    },
    path = (() => {
      var path = w.location.pathname;
      const devPath = '/ace/menumakan/';
      if (path.substring(0, devPath.length) == devPath) {
        path = path.substring(devPath.length);
      }
      return path;
    })(),
    lia = (menuPath) => {
      return `<div style="margin:.5em;"><a class="" href="${'http://localhost/ace/menumakan/'}${menuPath || ''}">${menuPath || 'Reset'}</a></div>`;
    };
  
  console.log(`Loading menu : (${path || '(none)'})`);

  if (path && path.length > 0) {

    // dom.menu.innerHTML = path || '(( none ))';

    const
      headerTemplate = Handlebars.compile(eid('header-template').innerHTML),
      menuTemplate = Handlebars.compile(eid('menu-template').innerHTML);

    const
      path_ = (() => {
        const path_ = {
          settings: 'https://' + path + '/settings',
          menuItems: 'https://' + path + '/menuItems',
        };
        if (path == 'localhost/ace/assets/js/menumakan') {
          path_.settings = 'http://' + path + '/settings.json';
          path_.menuItems = 'http://' + path + '/menuItems.json';
        }
        else if (path.substring(0, 'localhost'.length) == 'localhost') {
          path_.settings = 'http://' + path + '/settings';
          path_.menuItems = 'http://' + path + '/menuItems';
        }
        return path_;
      })();

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
        loadingMsg.innerHTML = [
          '<h3>Menu Not Found</h3>',
          `<div class="_tc_orange" style="margin-bottom:4em">Invalid menu entry, no data returned by : <br>${path}</div>`,
        ].join('');
        loadingMsg.innerHTML += [
          '<h3>Select your menu</h3>',
          '<div class="_mv_2 _i">',
          '<h6>Examples</h6>',
          lia(_examples[0]),
          lia(_examples[1]),
          // lia(_examples[2]),
          '</div>',
        ].join('');
      });

  }
  else {
    // console.error(`Menu Not Found > path is : (${path || '(none)'})`);
    loadingMsg.innerHTML = [
      '<h3>Select your menu</h3>',
      '<div class="_mv_2 _i">',
      '<h6>Examples</h6>',
      lia(_examples[0]),
      lia(_examples[1]),
      // lia(_examples[2]),
      '</div>',
    ].join('');
  }

  // const
  //   urlParams = new URLSearchParams(w.location.search),
  //   param = urlParams.get('param') || 'value';

});
