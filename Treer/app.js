// Person object
class person {
	constructor( fname, lname, born ) {
		this.fname = fname;
		this.lname = lname;
		this.born = born;
		this.relationships = [];
	}
}

// Stores relationships + pairs name
class relationship {
	constructor( type, pair ) {
		this.type = type;
		this.pair = pair
	}
}

const people = [];

var add_person_btn = document.getElementById('submit-person');

var expand_form_btn = document.getElementById('expand-form');
var close_form_btn = document.getElementById('close-form')
var add_person_container = document.getElementById('add-person-container');

var map_container = document.getElementById('map-container');
var map_card = document.getElementsByClassName('card');

var edit_btn = document.getElementsByClassName('edit-btn');
var selected_card = null;

var edit_sidebar_items = document.getElementsByClassName('edit-sidebar-items');
var edit_pages = document.getElementsByClassName('edit-area');

var add_relation_btn = document.getElementById('show-create-relations');

window.onload = function() {
	openEditScreen();
	changeSidebar();
}

expand_form_btn.onclick = function() {
	console.log("formfrom!");
	add_person_container.style.right = 0;
}

close_form_btn.onclick = function() {
	closeForm();
}

add_person_btn.onclick = function() {
	createPerson();
	clearForm();
	createCard();
	closeForm();
}

// Opens create relation screen
add_relation_btn.onclick = function() {
	console.log("open relations");
	document.getElementsByClassName('relations')[0].style.opacity = 0;
	document.getElementsByClassName('relations')[0].style.visibility = 'hidden';

	document.getElementsByClassName('relations')[1].style.opacity = 1;
	document.getElementsByClassName('relations')[1].style.visibility = 'visible';
}

var create_relation_btn = document.querySelectorAll('input[value="CREATE"]')[0];

create_relation_btn.onclick = function() {
	console.log("sakhg");
	var pair = document.getElementsByName('pair')[0].value;
	var exists = false;

	// 1. check for presence of pair -> make sure they exist -> if not show warning message
	for( var i = 0; i < people.length; i++ ){
		if(pair.toLowerCase() == people[i].fname.toLowerCase() + " " + people[i].lname.toLowerCase()) {
			console.log('found person!');
			exists = true;
			break;
		}
	}

	if(!exists) {
		document.getElementById('warning').style.opacity = 1;
		return;
	} else {
		document.getElementById('warning').style.opacity = 0;
	}
	// 2. check if this relation already exists -> dont show warning, but dont add either
	// 3. if present, add relation to relations list in person class

	// 4. find pair and add opposite relation to them
}

function changeSidebar() {
	for (var i = 0; i < edit_sidebar_items.length; i++) {
		edit_sidebar_items[i].onclick = function() {
	console.log("hello");
			
			for (var j = 0; j < edit_sidebar_items.length; j++) {
				edit_sidebar_items[j].style.fontWeight = "300";
				edit_pages[j].style.opacity = "0";
				edit_pages[j].style.visibility = "hidden";

				if (edit_sidebar_items[j] == this) var index = j;
			}

			this.style.fontWeight = "normal";
			edit_pages[index].style.opacity = "1";
			edit_pages[index].style.visibility = "visible";
		}
	}
}

function openEditScreen() {
	for (var i = 0; i < people.length; i++) {
		edit_btn[0].onclick = function() {
			console.log("open sesame");
			for (var j = 0; j < people.length; j++) {
				if (edit_btn[j] == this) selected_card = j;
			}
			document.getElementById('edit-container').style.top = '80px';
		}
	}
}

// Creates a new person object
function createPerson() {
	people.push(new person);

	var index = people.length;

	people[index - 1].fname = document.getElementsByName('fname')[0].value;
	people[index - 1].lname = document.getElementsByName('lname')[0].value;
	people[index - 1].born = document.getElementsByName('born')[0].value;
}

// Closes the Add Person tab
function closeForm() {
	add_person_container.style.right = '-20%';
}

// Clears previous information in form
function clearForm() {
	var inputs = document.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++) {
	    switch (inputs[i].type) {
	    case 'text':
	        inputs[i].value = '';
	        break;
	    case 'number':
	    	inputs[i].value = '';
	    }
	}
}


// Creates person card
function createCard() {
	var map_width = map_container.clientHeight;
	var map_height = map_container.clientHeight;
	var pos_x = map_width / 2 - 90;
	var pos_y = map_height / 2 - 40;


	map_container.innerHTML += '<div class="card" style="left:' + pos_x + 'px ; top:' + pos_y + 'px">\
		<p class="card-name">' + people[people.length - 1].fname + ' ' + people[people.length - 1].lname + '</p>\
		<p class="card-born">' + people[people.length - 1].born + '</p>\
		<div class="edit-btn">\
			<img src="edit.svg">\
		</div>\
		</div>'
}