import {Person, Relationship} from './models.js';
import {GraphRenderer} from './graph_renderer.js';
import {PersonRepository} from './person_repository.js';

// Deprecated, use personRepository instead.
const people = [];
const personRepository = new PersonRepository();

// For debug purposes.
window.people = people;
window.personRepository = personRepository;

let addPersonBtn = document.getElementById('submit-person');

let expandFormBtn = document.getElementById('expand-form');
let closeFormBtn = document.getElementById('close-form')
let addPersonContainer = document.getElementById('add-person-container');

let mapContainer = document.getElementById('map-container');
let mapCard = document.getElementsByClassName('card');

let editBtn = document.getElementsByClassName('edit-btn');
let selectedCard = null;
let selectedPerson = undefined;

let editSidebarItems = document.getElementsByClassName('edit-sidebar-items');
let editPages = document.getElementsByClassName('edit-area');

let addRelationBtn = document.getElementById('show-create-relations');

let cy = cytoscape({
  container: document.getElementById('map-container'),

  elements: [
    // {data:{id:'a'}},
    // {data:{id:'b'}}
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

expandFormBtn.onclick = function() {
  addPersonContainer.style.right = 0;
}

closeFormBtn.onclick = function() {
  closeForm();
}

addPersonBtn.onclick = function() {
  const createdPerson = createPerson();
  clearForm();
  createCard(createdPerson);
  closeForm();
  // openEditScreen();
}

// Opens create relation screen
addRelationBtn.onclick = function() {
  console.log("open relations");
  document.getElementsByClassName('relations')[0].style.opacity = 0;
  document.getElementsByClassName('relations')[0].style.visibility = 'hidden';

  document.getElementsByClassName('relations')[1].style.opacity = 1;
  document.getElementsByClassName('relations')[1].style.visibility = 'visible';
}

let createRelationBtn = document.querySelectorAll('input[value="CREATE"]')[0];

createRelationBtn.onclick = function() {
  console.log("sakhg");
  let pair = document.getElementsByName('pair')[0].value;
  let pairIndex = null;
  let exists = false;

  // 1. check for presence of pair -> make sure they exist -> if not show warning message
  for (let i = 0; i < people.length; i++){
    if (pair.toLowerCase() == people[i].firstName.toLowerCase() + " " + people[i].lastName.toLowerCase()) {
      pairIndex = i;
      console.log('found person!');
      exists = true;
      break;
    }
  }

  if (!exists) {
    document.getElementById('warning').style.opacity = 1;
    return;
  } else {
    document.getElementById('warning').style.opacity = 0;
  }
  // 2. check if this relation already exists -> dont show warning, but dont add either
  // 3. if present, add relation to relations list in person class

  // Get selected relationship
  let selectedType = '';
  let radioBtns = document.getElementsByName('type');
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      selectedType = radioBtns[i].value;
    }
  }

  addRelation(selectedCard, selectedType, pairIndex);

  // 4. find pair and add opposite relation to them
  addRelation(pairIndex, oppositeRelation(selectedType), selected_card);

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
      <tr>`;
  }
}

function addRelation(card, selectedType, pairIndex) {
  const person = people[card];
  const newRelationship = person.addRelationship(
      new Relationship(selectedType, pairIndex));
  personRepository.addRelationship(newRelationship);
}

function oppositeRelation(kind) {
  switch (kind) {
    case 'parent': return 'child';
    case 'child': return 'parent';
  }
}

function changeSidebar() {
  for (let i = 0; i < editSidebarItems.length; i++) {
    editSidebarItems[i].onclick = function() {
      console.log("hello");

      let index = -1;

      for (let j = 0; j < editSidebarItems.length; j++) {
        editSidebarItems[j].style.fontWeight = "300";
        editPages[j].style.opacity = "0";
        editPages[j].style.visibility = "hidden";

        if (editSidebarItems[j] == this) index = j;
      }

      this.style.fontWeight = "normal";
      editPages[index].style.opacity = "1";
      editPages[index].style.visibility = "visible";
    }
  }
}

function openEditScreen() {
  for (let i = 0; i < people.length; i++) {
    editBtn[i].onclick = function() {
      console.log("open sesame");
      for (let j = 0; j < people.length; j++) {
        if (editBtn[j] == this) selectedCard = j;
      }
      selectedPerson = people.find(function (person) {
        return
      });
      document.getElementById('edit-container').style.top = '80px';
      fillSelectedInformation();
      loadRelationsTable();
    }
  }
}

document.getElementById('save-edit').onclick = function() {
  setPersonInformation(selectedCard, 1);
  document.getElementById('saved-text').style.opacity = '1';
}

document.getElementById('close-edit').onclick = function() {
  document.getElementById('edit-container').style.top = '100%';
  document.getElementById('saved-text').style.opacity = 0;
  document.getElementById('warning').style.opacity = 0;
}

// Creates a new person object
function createPerson() {
  const personData = getPersonInformation(0);
  const person = new Person(
      personData.firstName,
      personData.lastName,
      personData.dateOfBirth);
  personRepository.addPerson(person);
  return person;
}

// Closes the Add Person tab
function closeForm() {
  addPersonContainer.style.right = '-20%';
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
  document.getElementsByName('fname')[1].value = people[selectedCard].firstName;
  document.getElementsByName('lname')[1].value = people[selectedCard].lastName;
  document.getElementsByName('born')[1].value = people[selectedCard].born;
}

function setPersonInformation(index, x) {
  const personData = getPersonInformation(x);
  people[index].firstName = personData.firstName;
  people[index].lastName = personData.lastName;
  people[index].dateOfBirth = personData.dateOfBirth;
}

function getPersonInformation(x) {
  return {
    'firstName': document.getElementsByName('fname')[x].value,
    'lastName': document.getElementsByName('lname')[x].value,
    'dateOfBirth': document.getElementsByName('born')[x].value,
  };
}

// Creates person card
function createCard(person) {
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

  cy.add([
      {
        data: {
          id: person.id,
          name: person.firstName
        },
        position: { x: 500, y: 200}
      }
    ])
}
