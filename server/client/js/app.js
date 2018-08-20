import {Person, Relationship} from "./models.js";

const people = [];

window.people = people;

let addPersonBtn = document.getElementById('submit-person');

let expandFormBtn = document.getElementById('expand-form');
let closeFormBtn = document.getElementById('close-form')
let addPersonContainer = document.getElementById('add-person-container');

let mapContainer = document.getElementById('map-container');
let mapCard = document.getElementsByClassName('card');

let editBtn = document.getElementsByClassName('edit-btn');
let selectedCard = null;

let editSidebarItems = document.getElementsByClassName('edit-sidebar-items');
let editPages = document.getElementsByClassName('edit-area');

let addRelationBtn = document.getElementById('show-create-relations');

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
  createPerson();
  clearForm();
  createCard();
  closeForm();
  openEditScreen();
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
  addRelation(pairIndex, oppositeRelation(selectedType), selectedCard)
}

function addRelation(card, selectedType, pairIndex) {
  people[card].relationships.push(new Relationship);
  let numOfRelations = people[card].relationships.length;

  people[card].relationships[numOfRelations - 1].kind = selectedType;
  people[card].relationships[numOfRelations - 1].pair = pairIndex;
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
  console.log("arg");
  for (let i = 0; i < people.length; i++) {
    editBtn[0].onclick = function() {
      console.log("open sesame");
      for (let j = 0; j < people.length; j++) {
        if (editBtn[j] == this) selectedCard = j;
      }
      document.getElementById('edit-container').style.top = '80px';
      fillSelectedInformation();
    }
  }
}

document.getElementById('save-edit').onclick = function() {
  setPersonInformation(selectedCard, 1);
  document.getElementById('saved-text').style.opacity = '1';
}

// Creates a new person object
function createPerson() {
  people.push(new Person);
  setPersonInformation(people.length - 1, 0);
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
  people[index].firstName = document.getElementsByName('fname')[x].value;
  people[index].lastName = document.getElementsByName('lname')[x].value;
  people[index].born = document.getElementsByName('born')[x].value;
}


// Creates person card
function createCard() {
  let mapWidth = mapContainer.clientHeight;
  let mapHeight = mapContainer.clientHeight;
  let posX = mapWidth / 2 - 90;
  let posY = mapHeight / 2 - 40;

  mapContainer.innerHTML += `<div class="card" style="left:${posX}px;top:${posY}px">
        <p class="card-name">
          ${people[people.length - 1].firstName} ${people[people.length - 1].lastName}
        </p>
        <p class="card-born">
          ${people[people.length - 1].born}
        </p>
        <div class="edit-btn">
          <img src="res/edit.svg">
        </div>
      </div>`;
}