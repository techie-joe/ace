// let menuItemsUrl = 'https://api.sheety.co/phill/cluckerRestaurant/menuItems';
// let menuItemsUrl = 'https://api.sheety.co/ed6904a0d8a396880b2772c9bf093d33/restaurantMenu/menuItems';

let menuItemsUrl = 'http://localhost/ace/assets/js/menumakan/menuItems.json';
let settingsUrl = 'http://localhost/ace/assets/js/menumakan/settings.json';

function fetchJson(url) {
	return fetch(url).then((response) => response.json())
}

// try load from localStorage and only update when requested or at timed interval.
let fetchSettings = fetchJson(settingsUrl);
let fetchMenuItems = fetchJson(menuItemsUrl);

function contentLoaded(event) {

	// Create a Handlebars templates
	let headerTemplate = Handlebars.compile(document.getElementById('header-template').innerHTML);
	let menuTemplate = Handlebars.compile(document.getElementById('menu-template').innerHTML);

	// Get the container elements
	let header = document.getElementById('header');
	let menu = document.getElementById('menu');

	fetchSettings.then((json) => {

		// Group settings by their category
		let settings = _.indexBy(json.settings, 'key');

		console.log('Settings', settings);

		// Set the html content of the container element
		document.title = settings.title.value + ' | ' + document.title;
		header.innerHTML = headerTemplate(settings);

	});

	fetchMenuItems.then((json) => {

		// Group menu items by their category
		let menuItems = _.groupBy(json.menuItems, 'category');

		console.log('Menu', menuItems);

		// Set the html content of the container element
		menu.innerHTML = menuTemplate(menuItems);

	});

}

Handlebars.registerHelper('safe', function (text) {
	if (typeof text !== "string") return text;
	// Only allow certain tags, escape everything else
	const unescaped = Handlebars.escapeExpression(text)
		.replace(/&amp;/g, "&")
		.replace(/&lt;span&gt;(.*?)(&lt;\/span&gt;)/g,(match,t)=>'<span>'+t+'</span>')
		.replace(/&lt;b&gt;(.*?)(&lt;\/b&gt;)/g,(match,t)=>'<b>'+t+'</b>');
	return new Handlebars.SafeString(unescaped);
});

// Wait for page to load
document.addEventListener('DOMContentLoaded', contentLoaded);