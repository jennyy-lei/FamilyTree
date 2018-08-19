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
  constructor( kind, pair ) {
    this.kind = kind;
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
  changeSidebar();
}

expand_form_btn.onclick = function() {
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
  openEditScreen();
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
  var pairIndex = null;
  var exists = false;

  // 1. check for presence of pair -> make sure they exist -> if not show warning message
  for( var i = 0; i < people.length; i++ ){
    if(pair.toLowerCase() == people[i].fname.toLowerCase() + " " + people[i].lname.toLowerCase()) {
      pairIndex = i;
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

  // Get selected relationship
  var selectedType = '';
  var radio_btns = document.getElementsByName('type');
  for (var i = 0; i < radio_btns.length; i++) {
    if (radio_btns[i].checked) {
      selectedType = radio_btns[i].value;
    }
  }

  people[selected_card].relationships.push(new relationship);
  people[selected_card].relationships[relationships.length - 1].kind = selectedType;
  people[selected_card].relationships[relationships.length - 1].pair = pairIndex;

  // 4. find pair and add opposite relation to them
}

function oppositeRelation( kind ) {
  switch( kind ) {
    case 'parent': return 'child';
    case 'child': return 'parent';
  }
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
  console.log("arg");
  for (var i = 0; i < people.length; i++) {
    edit_btn[0].onclick = function() {
      console.log("open sesame");
      for (var j = 0; j < people.length; j++) {
        if (edit_btn[j] == this) selected_card = j;
      }
      document.getElementById('edit-container').style.top = '80px';
      fillSelectedInformation();
    }
  }
}

document.getElementById('save-edit').onclick = function() {
  setPersonInformation( selected_card, 1 );
  document.getElementById('saved-text').style.opacity = '1';
}

// Creates a new person object
function createPerson() {
  people.push(new person);

  var index = people.length;

  setPersonInformation( index - 1, 0 )
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

function fillSelectedInformation() {
  document.getElementsByName('fname')[1].value = people[selected_card].fname;
  document.getElementsByName('lname')[1].value = people[selected_card].lname;
  document.getElementsByName('born')[1].value = people[selected_card].born;
}

function setPersonInformation( index, x ) {
  people[index].fname = document.getElementsByName('fname')[x].value;
  people[index].lname = document.getElementsByName('lname')[x].value;
  people[index].born = document.getElementsByName('born')[x].value;
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
      <img src="res/edit.svg">\
    </div>\
    </div>'
}