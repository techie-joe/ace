var sample_data = {
	"menuItems": [
		{
			"item": "Spicy Mixed Olives",
			"price": 3.25,
			"category": "Starters",
			"isVegetarian": true,
			"id": 2
		},
		{
			"item": "Peri-Peri Nuts",
			"price": 3.25,
			"category": "Starters",
			"isVegetarian": true,
			"id": 3
		},
		{
			"item": "Halloumi Sticks & Dip",
			"price": 3.45,
			"category": "Starters",
			"isVegetarian": true,
			"id": 4
		},
		{
			"item": "1/4 Chicken Leg",
			"price": 3.7,
			"category": "Mains",
			"isVegetarian": false,
			"id": 5
		},
		{
			"item": "1/2 Chicken",
			"price": 6.75,
			"category": "Mains",
			"isVegetarian": false,
			"id": 6
		},
		{
			"item": "Whole Chicken",
			"price": 12,
			"category": "Mains",
			"isVegetarian": false,
			"id": 7
		},
		{
			"item": "5 Chicken Wings",
			"price": 5.2,
			"category": "Mains",
			"isVegetarian": false,
			"id": 8
		},
		{
			"item": "10 Chicken Wings",
			"price": 9.6,
			"category": "Mains",
			"isVegetarian": false,
			"id": 9
		},
		{
			"item": "4 Boneless Chicken Thighs",
			"price": 6.95,
			"category": "Mains",
			"isVegetarian": false,
			"id": 10
		},
		{
			"item": "Chicken Butterfly",
			"price": 7.25,
			"category": "Mains",
			"isVegetarian": false,
			"id": 11
		},
		{
			"item": "Burger",
			"price": 5.9,
			"category": "Burgers, Pittas, Wraps",
			"isVegetarian": false,
			"id": 12
		},
		{
			"item": "Beanie Burger",
			"price": 5.9,
			"category": "Burgers, Pittas, Wraps",
			"isVegetarian": true,
			"id": 13
		},
		{
			"item": "Pitta",
			"price": 5.9,
			"category": "Burgers, Pittas, Wraps",
			"isVegetarian": false,
			"id": 14
		},
		{
			"item": "Wrap",
			"price": 5.9,
			"category": "Burgers, Pittas, Wraps",
			"isVegetarian": false,
			"id": 15
		},
		{
			"item": "Boneless Platter",
			"price": 20.3,
			"category": "Sharing",
			"isVegetarian": false,
			"id": 16
		},
		{
			"item": "Wing Platter",
			"price": 15.5,
			"category": "Sharing",
			"isVegetarian": false,
			"id": 17
		},
		{
			"item": "Family Platter",
			"price": 38.25,
			"category": "Sharing",
			"isVegetarian": false,
			"id": 18
		},
		{
			"item": "Spicy Rice",
			"price": 2.3,
			"category": "Sides",
			"isVegetarian": true,
			"id": 19
		},
		{
			"item": "Coleslaw",
			"price": 2.3,
			"category": "Sides",
			"isVegetarian": true,
			"id": 20
		},
		{
			"item": "Garlic Bread",
			"price": 2.3,
			"category": "Sides",
			"isVegetarian": true,
			"id": 21
		},
		{
			"item": "PERi-Salted Chips",
			"price": 2.3,
			"category": "Sides",
			"isVegetarian": true,
			"id": 22
		},
		{
			"item": "Long Stem Broccoli",
			"price": 2.3,
			"category": "Sides",
			"isVegetarian": true,
			"id": 23
		},
		{
			"item": "White Choc & Raspberry Cheesecake",
			"price": 4.15,
			"category": "Deserts",
			"isVegetarian": false,
			"id": 24
		},
		{
			"item": "Carrot Cake",
			"price": 4.15,
			"category": "Deserts",
			"isVegetarian": false,
			"id": 25
		},
		{
			"item": "Choc-A-Lot Cake",
			"price": 4.15,
			"category": "Deserts",
			"isVegetarian": false,
			"id": 26
		}
	]
};

let url = 'https://api.sheety.co/phill/cluckerRestaurant/menuItems';
// let url = 'https://api.sheety.co/ed6904a0d8a396880b2772c9bf093d33/restaurantMenu/menuItems';

// try load from localStorage and only update when requested or at timed interval.
// let response = fetch(url);

function renderData(json) {
	// Group menu items by their category
	let groupedMenu = _.groupBy(json.menuItems, 'category');
	// Create a Handlebars template to render items
	var template = Handlebars.compile(document.getElementById("menu-template").innerHTML);
	// Render items into Handlebars template, and set the html of the container element
	document.getElementById('menu').innerHTML = template(groupedMenu);
}

// Wait for page to load
document.addEventListener('DOMContentLoaded', function (event) {
	// response
	// .then((response) => response.json())
	// .then(renderData);
	renderData(sample_data);
});