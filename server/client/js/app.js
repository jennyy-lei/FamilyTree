import {Person, Relationship} from "./models.js";

const people = [];

window.people = people;

let add_person_btn = document.getElementById('submit-person');

let expand_form_btn = document.getElementById('expand-form');
let close_form_btn = document.getElementById('close-form')
let add_person_container = document.getElementById('add-person-container');

let map_container = document.getElementById('map-container');
let map_card = document.getElementsByClassName('card');

let edit_btn = document.getElementsByClassName('edit-btn');
let selected_card = null;

let edit_sidebar_items = document.getElementsByClassName('edit-sidebar-items');
let edit_pages = document.getElementsByClassName('edit-area');

let add_relation_btn = document.getElementById('show-create-relations');

let cy = cytoscape({
  container: document.getElementById('map-container'),

  elements: [
  //   {data:{id:'a'}},
  //   {data:{id:'b'}}
  ],

  style: [
  {
    selector: 'node',
    style: {
      'content': 'data(name)',
      'background-color': 'white',
      'text-halign': 'center',
      'text-valign': 'center',
      'shape': 'roundrectangle',
      'width': '50px',
      'height': '25px',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': 'lightgrey',
      'font-family': 'Lato',
      'font-weight': '300',
      'font-size': '20',
      'padding': '15'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle'
    }
  }
  ],
})

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
  // openEditScreen();
}

// Opens create relation screen
add_relation_btn.onclick = function() {
  console.log("open relations");
  document.getElementsByClassName('relations')[0].style.opacity = 0;
  document.getElementsByClassName('relations')[0].style.visibility = 'hidden';

  document.getElementsByClassName('relations')[1].style.opacity = 1;
  document.getElementsByClassName('relations')[1].style.visibility = 'visible';
}

let create_relation_btn = document.querySelectorAll('input[value="CREATE"]')[0];

create_relation_btn.onclick = function() {
  console.log("sakhg");
  let pair = document.getElementsByName('pair')[0].value;
  let pairIndex = null;
  let exists = false;

  // 1. check for presence of pair -> make sure they exist -> if not show warning message
  for( let i = 0; i < people.length; i++ ){
    if(pair.toLowerCase() == people[i].firstName.toLowerCase() + " " + people[i].lastName.toLowerCase()) {
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
  let selectedType = '';
  let radio_btns = document.getElementsByName('type');
  for (let i = 0; i < radio_btns.length; i++) {
    if (radio_btns[i].checked) {
      selectedType = radio_btns[i].value;
    }
  }

  addRelation( selected_card, selectedType, pairIndex );

  // 4. find pair and add opposite relation to them
  addRelation( pairIndex, oppositeRelation(selectedType), selected_card )

  // 5. Exits create relations form
  document.getElementsByClassName('relations')[1].style.opacity = 0;
  document.getElementsByClassName('relations')[1].style.visibility = 'hidden';

  document.getElementsByClassName('relations')[0].style.opacity = 1;
  document.getElementsByClassName('relations')[0].style.visibility = 'visible';

  // 6. Refreshes relationships table
  loadRelationsTable();
}

function loadRelationsTable() {
  let relationsLength = people[selected_card].relationships.length;
  let table = document.getElementById('relations-table');

  for (let i = 0; i < relationsLength; i++) {
    let pair = people[selected_card].relationships[i].pair;
    
    table.innerHTML = `<tr>
        <td>Person:</td>
        <td>Type:</td>
      </tr>
      <tr>
        <td>${people[pair].firstName} ${people[pair].lastName}</td>
        <td>${people[selected_card].relationships.kind}</td>
      <tr>`
  }
}

function addRelation( card, selectedType, pairIndex ) {
  people[card].relationships.push(new Relationship);
  let numOfRelations = people[card].relationships.length;

  people[card].relationships[numOfRelations - 1].kind = selectedType;
  people[card].relationships[numOfRelations - 1].pair = pairIndex;
}

function oppositeRelation( kind ) {
  switch( kind ) {
    case 'parent': return 'child';
    case 'child': return 'parent';
  }
}

function changeSidebar() {
  for (let i = 0; i < edit_sidebar_items.length; i++) {
    edit_sidebar_items[i].onclick = function() {
      console.log("hello");

      let index = -1;

      for (let j = 0; j < edit_sidebar_items.length; j++) {
        edit_sidebar_items[j].style.fontWeight = "300";
        edit_pages[j].style.opacity = "0";
        edit_pages[j].style.visibility = "hidden";

        if (edit_sidebar_items[j] == this) index = j;
      }

      this.style.fontWeight = "normal";
      edit_pages[index].style.opacity = "1";
      edit_pages[index].style.visibility = "visible";
    }
  }
}

function openEditScreen() {
  for (let i = 0; i < people.length; i++) {
    edit_btn[i].onclick = function() {
      console.log("open sesame");
      for (let j = 0; j < people.length; j++) {
        if (edit_btn[j] == this) selected_card = j;
      }
      document.getElementById('edit-container').style.top = '80px';
      fillSelectedInformation();
      loadRelationsTable();
    }
  }
}

document.getElementById('save-edit').onclick = function() {
  setPersonInformation( selected_card, 1 );
  document.getElementById('saved-text').style.opacity = '1';
}

document.getElementById('close-edit').onclick = function() {
  document.getElementById('edit-container').style.top = '100%';
  document.getElementById('saved-text').style.opacity = 0;
  document.getElementById('warning').style.opacity = 0;
}

// Creates a new person object
function createPerson() {
  people.push(new Person);

  let index = people.length;

  setPersonInformation( index - 1, 0 )
}

// Closes the Add Person tab
function closeForm() {
  add_person_container.style.right = '-20%';
}

// Clears previous information in form
function clearForm() {
  let inputs = document.getElementsByTagName('input');

  for (let i = 0; i < inputs.length; i++) {
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
  document.getElementsByName('fname')[1].value = people[selected_card].firstName;
  document.getElementsByName('lname')[1].value = people[selected_card].lastName;
  document.getElementsByName('born')[1].value = people[selected_card].born;
}

function setPersonInformation( index, x ) {
  people[index].firstName = document.getElementsByName('fname')[x].value;
  people[index].lastName = document.getElementsByName('lname')[x].value;
  people[index].dateOfBirth = document.getElementsByName('born')[x].value;
}


// Creates person card
function createCard() {
  // let map_width = map_container.clientHeight;
  // let map_height = map_container.clientHeight;
  // // let pos_x = map_width / 2 - 90;
  // // let pos_y = map_height / 2 - 40;
  // let pos_x = Math.random() * window.innerWidth;
  // let pos_y = Math.random() * window.innerHeight;


  // map_container.innerHTML += '<div class="card" style="left:' + pos_x + 'px ; top:' + pos_y + 'px">\
  //   <p class="card-name">' + people[people.length - 1].firstName + ' ' + people[people.length - 1].lastName + '</p>\
  //   <p class="card-born">' + people[people.length - 1].born + '</p>\
  //   <div class="edit-btn">\
  //     <img src="res/edit.svg">\
  //   </div>\
  //   </div>'

console.log(people[people.length - 1].firstName);
  cy.add([
      {
        data: {
          id: people.length,
          name: people[people.length - 1].firstName
        },
        position: { x: 500, y: 500}
      }
    ])
}

