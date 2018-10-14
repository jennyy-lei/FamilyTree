import {Person, Relationship} from './models.js';
import {GraphRenderer} from './graph_renderer.js';
import {PersonRepository} from './person_repository.js';

// Deprecated, use personRepository instead.
const people = [];
const personRepository = new PersonRepository();
const graphRenderer = new GraphRenderer(
    document.getElementById('map-container'), personRepository);

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

let pair = [];

graphRenderer.onNodeClick(function (nodeData, nodeElement) {
  if (!toggleRelationship) {
    openEditScreen(nodeData.id);
  } else if (toggleRelationship && pair.length < 2) {
    selectCards(pair, nodeData, nodeElement);
  }
});

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
  closeForm();
}

// Opens create relation screen
addRelationBtn.onclick = function() {
  document.getElementsByClassName('relations')[0].style.opacity = 0;
  document.getElementsByClassName('relations')[0].style.visibility = 'hidden';

  document.getElementsByClassName('relations')[1].style.opacity = 1;
  document.getElementsByClassName('relations')[1].style.visibility = 'visible';
}

let createRelationBtn = document.querySelectorAll('input[value="CREATE"]')[0];

createRelationBtn.onclick = function() {
  let pair = document.getElementsByName('pair')[0].value;
  let pairIndex = null;
  let exists = false;

  // 1. check for presence of pair -> make sure they exist -> if not show
  // warning message
  for (let x of personRepository.getPeopleId()) {
    let person = personRepository.getPerson(x);
    if (`${person.firstName.toLowerCase()} ${person.lastName.toLowerCase()}` == pair.toLowerCase()) {
      pairIndex = x;
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

  // 2. check if this relation already exists -> dont show warning, but dont
  //    add either

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
  addRelation(pairIndex, oppositeRelation(selectedType), selectedCard);

  // 5. Exits create relations form
  document.getElementsByClassName('relations')[1].style.opacity = 0;
  document.getElementsByClassName('relations')[1].style.visibility = 'hidden';

  document.getElementsByClassName('relations')[0].style.opacity = 1;
  document.getElementsByClassName('relations')[0].style.visibility = 'visible';

  // 6. Refreshes relationships table
  // loadRelationsTable();
}

// function loadRelationsTable() {
//   let relationsLength = people[selectedCard].relationships.length;
//   let table = document.getElementById('relations-table');

//   for (let i = 0; i < relationsLength; i++) {
//     let pair = people[selectedCard].relationships[i].pair;

//     table.innerHTML = `<tr>
//         <td>Person:</td>
//         <td>Type:</td>
//       </tr>
//       <tr>
//         <td>${people[pair].firstName} ${people[pair].lastName}</td>
//         <td>${people[selectedCard].relationships.kind}</td>
//       <tr>`;
//   }
// }

function addRelation(card, selectedType, pairIndex) {
  const person = personRepository.getPerson(card);
  const newRelationship = person.addRelationship(
      new Relationship(selectedType, pairIndex));
  personRepository.addRelationship(newRelationship);
}

function oppositeRelation(kind) {
  switch (kind) {
    case 'parent': return 'child';
    case 'child': return 'parent';
    case 'partner': return 'partner';
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

function openEditScreen(id) {
  selectedCard = id;
  document.getElementById('edit-container').style.top = '80px';
  fillSelectedInformation(id);
  // loadRelationsTable();
}

// document.getElementById('save-edit').onclick = function() {
//   setPersonInformation(selectedCard, 1);
//   document.getElementById('saved-text').style.opacity = '1';
// }

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
      case 'number':
        inputs[i].value = '';
      }
  }
}

function fillSelectedInformation(id) {
  let person = personRepository.getPerson(id);
  document.getElementsByName('fname')[1].value = person.firstName;
  document.getElementsByName('lname')[1].value = person.lastName;
  document.getElementsByName('born')[1].value = person.dateOfBirth;
}

// function setPersonInformation(index, x) {
//   const personData = getPersonInformation(x);
//   people[index].firstName = personData.firstName;
//   people[index].lastName = personData.lastName;
//   people[index].dateOfBirth = personData.dateOfBirth;
// }

function getPersonInformation(x) {
  return {
    'firstName': document.getElementsByName('fname')[x].value,
    'lastName': document.getElementsByName('lname')[x].value,
    'dateOfBirth': document.getElementsByName('born')[x].value,
  };
}

let toggleRelationshipsBtn = document.getElementById('toggleRelationships');
let toggleRelationship = false;
let quickAdd = document.getElementById('quickAdd');
let quickAddBtn = document.getElementById('quickAddBtn');

toggleRelationships.onclick = function() {
  if(this.classList.contains('toggled')) {
    this.classList.remove('toggled');
    toggleRelationship = false;
    pair = [];
    graphRenderer.getNodes().style('border-color', 'lightgrey');
  } else {
    this.classList.add('toggled');
    toggleRelationship = true;
  }
}

function selectCards(arr, nodeData, nodeElement) {
  arr.push(nodeData.id);

  nodeElement.style('border-color', 'tomato');

  console.log(`${arr[0]}, ${arr[1]}`);

  if (arr.length >= 2) {
    console.log("MAKE RELATIONSHIP!");
    quickAdd.classList.add('open');

    document.getElementById('quickAddText').innerHTML = `
      <p>
        ${personRepository.getPerson(pair[0]).firstName}
        ${personRepository.getPerson(pair[0]).lastName} is the
        <select id="typeSelector" style="margin: 0 5px;">
          <option value="parent" selected>Parent</option>
          <option value="child">Child</option>
          <option value="partner">Partner</option>
        </select>
        of
        ${personRepository.getPerson(pair[1]).firstName}
        ${personRepository.getPerson(pair[1]).lastName}
      </p>
    `
  }
}

quickAddBtn.onclick = function() {
  let dropDown = document.getElementById('typeSelector');
  let type = dropDown.options[dropDown.selectedIndex].value;

  quickAdd.classList.remove('open');

  addRelation(pair[0], type, pair[1]);
  addRelation(pair[1], oppositeRelation(type), pair[0]);

  graphRenderer.getNodes().style('border-color', 'lightgrey');
  toggleRelationships.classList.remove('toggled');
  pair = [];
  toggleRelationship = false;
}

document.getElementById('cancelAddBtn').onclick = function() {
  toggleRelationships.classList.remove('toggled');
  quickAdd.classList.remove('open');

  graphRenderer.getNodes().style('border-color', 'lightgrey');
  toggleRelationship = false;
  pair = [];
}
