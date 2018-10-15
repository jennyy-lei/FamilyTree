import {Person, RelationshipType} from './models.js';
// @ts-ignore
import {GraphRenderer} from './graph_renderer.js';
// @ts-ignore
import {PersonRepository} from './person_repository.js';

// Deprecated, use personRepository instead.
const people: Person[] = [];
const personRepository = new PersonRepository();
const graphRenderer = new GraphRenderer(
    document.getElementById('map-container')!, personRepository);

// For debug purposes.
// @ts-ignore
window['people'] = people;
// @ts-ignore
window['personRepository'] = personRepository;

const addPersonBtn = document.getElementById('submit-person')!;

const expandFormBtn = document.getElementById('expand-form')!;
const closeFormBtn = document.getElementById('close-form')!;
const addPersonContainer = document.getElementById('add-person-container')!;

let selectedCard: number | null;

const editSidebarItems = document.querySelectorAll<HTMLElement>(
    '.edit-sidebar-items');
const editPages = document.querySelectorAll<HTMLElement>('.edit-area');

const addRelationBtn = document.getElementById('show-create-relations')!;
const relationsEl = document.querySelectorAll<HTMLElement>('.relations');

let pair: number[] = [];

graphRenderer.onNodeClick(function (
    nodeData: Person | undefined,
    nodeElement: any) {
  if (!nodeData) return;

  if (!toggleRelationship) {
    openEditScreen(nodeData.id);
  } else if (toggleRelationship && pair.length < 2) {
    selectCards(pair, nodeData, nodeElement);
  }
});

window.onload = function () {
  changeSidebar();
};

expandFormBtn.onclick = function () {
  addPersonContainer.style.right = '0';
};

closeFormBtn.onclick = function () {
  closeForm();
};

addPersonBtn.onclick = function () {
  createPerson();
  clearForm();
  closeForm();
};

// Opens create relation screen
addRelationBtn.onclick = function () {
  relationsEl[0].style.opacity = '0';
  relationsEl[0].style.visibility = 'hidden';

  relationsEl[1].style.opacity = '1';
  relationsEl[1].style.visibility = 'visible';
};

let createRelationBtn = document.querySelector<HTMLElement>(
    'input[value="CREATE"]')!;

createRelationBtn.onclick = function () {
  let pair = document.querySelector<HTMLInputElement>('[name="pair"]')!.value;
  let pairIndex: number | undefined = undefined;
  let exists = false;

  // 1. check for presence of pair -> make sure they exist -> if not show
  // warning message
  for (let x of personRepository.getPeopleId()) {
    let person = personRepository.getPerson(x)!;
    if (`${person.firstName.toLowerCase()} ${person.lastName.toLowerCase()}` ==
        pair.toLowerCase()) {
      pairIndex = x;
      console.log('found person!');
      exists = true;
      break;
    }
  }

  if (!exists) {
    document.getElementById('warning')!.style.opacity = '1';
    return;
  } else {
    document.getElementById('warning')!.style.opacity = '0';
  }

  // 2. check if this relation already exists -> dont show warning, but dont
  //    add either

  // 3. if present, add relation to relations list in person class
  // Get selected relationship
  let selectedType = '';
  const radioBtns = document.querySelectorAll<HTMLInputElement>('[name="type"]');
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      selectedType = radioBtns[i].value;
    }
  }

  if (selectedCard && pairIndex != undefined) {
    addRelationFromDropdown(selectedCard, pairIndex, selectedType);
  }

  // 5. Exits create relations form
  relationsEl[1].style.opacity = '0';
  relationsEl[1].style.visibility = 'hidden';

  relationsEl[0].style.opacity = '1';
  relationsEl[0].style.visibility = 'visible';

  // 6. Refreshes relationships table
  // loadRelationsTable();
};

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

function addRelationFromDropdown(
    leftId: number,
    rightId: number,
    type: String) {
  switch (type) {
    case 'parent':
      addRelation({
        leftId: rightId,
        rightId: leftId,
        selectedType: RelationshipType.child
      });
      break;
    case 'child':
      addRelation({
        leftId: leftId,
        rightId: rightId,
        selectedType: RelationshipType.child
      });
      break;
    case 'partner':
      addRelation({
        leftId: leftId,
        rightId: rightId,
        selectedType: RelationshipType.partner
      });
      break;
  }
}

function addRelation({leftId, rightId, selectedType}: { leftId: number, rightId: number, selectedType: RelationshipType }) {
  const person: Person | undefined = personRepository.getPerson(leftId);
  if (!person) return;
  const newRelationship = person.addRelationToPerson({
    kind: selectedType,
    rightId: rightId
  });
  personRepository.addRelationship(newRelationship);
}

function changeSidebar() {
  editSidebarItems.forEach(function (item) {
    item.onclick = function () {
      let index = -1;

      for (let j = 0; j < editSidebarItems.length; j++) {
        editSidebarItems[j].style.fontWeight = "300";
        editPages[j].style.opacity = "0";
        editPages[j].style.visibility = "hidden";

        if (editSidebarItems[j] == this) index = j;
      }

      item.style.fontWeight = "normal";
      editPages[index].style.opacity = "1";
      editPages[index].style.visibility = "visible";
    }
  });
}

function openEditScreen(id: number) {
  selectedCard = id;
  document.getElementById('edit-container')!.style.top = '80px';
  fillSelectedInformation(id);
  // loadRelationsTable();
}

// document.getElementById('save-edit').onclick = function() {
//   setPersonInformation(selectedCard, 1);
//   document.getElementById('saved-text').style.opacity = '1';
// }

document.getElementById('close-edit')!.onclick = function () {
  document.getElementById('edit-container')!.style.top = '100%';
  document.getElementById('saved-text')!.style.opacity = '0';
  document.getElementById('warning')!.style.opacity = '0';
};

// Creates a new person object
function createPerson() {
  const personData = getPersonInformation(0);
  const person = new Person(
      personData.firstName,
      personData.lastName,
      parseInt(personData.dateOfBirth));
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

function fillSelectedInformation(id: number) {
  const person = personRepository.getPerson(id);
  if (!person) return;

  document.querySelectorAll<HTMLInputElement>('[name="fname"]')[1].value =
      person.firstName;
  document.querySelectorAll<HTMLInputElement>('[name="lname"]')[1].value =
      person.lastName;
  document.querySelectorAll<HTMLInputElement>('[name="born"]')[1].value =
      person.dateOfBirth.toString();
}

// function setPersonInformation(index, x) {
//   const personData = getPersonInformation(x);
//   people[index].firstName = personData.firstName;
//   people[index].lastName = personData.lastName;
//   people[index].dateOfBirth = personData.dateOfBirth;
// }

function getPersonInformation(x: number) {
  return {
    'firstName': document.querySelectorAll<HTMLInputElement>('[name="fname"]')[x].value,
    'lastName': document.querySelectorAll<HTMLInputElement>('[name="lname"]')[x].value,
    'dateOfBirth': document.querySelectorAll<HTMLInputElement>('[name="born"]')[x].value,
  };
}

let toggleRelationshipsBtn = document.getElementById('toggleRelationships')!;
let toggleRelationship = false;
let quickAdd = document.getElementById('quickAdd')!;
let quickAddBtn = document.getElementById('quickAddBtn')!;

toggleRelationshipsBtn.onclick = function () {
  if (toggleRelationshipsBtn.classList.contains('toggled')) {
    toggleRelationshipsBtn.classList.remove('toggled');
    toggleRelationship = false;
    pair = [];
    graphRenderer.getNodes().style('border-color', 'lightgrey');
  } else {
    toggleRelationshipsBtn.classList.add('toggled');
    toggleRelationship = true;
  }
};

function selectCards(arr: number[], nodeData: Person, nodeElement: any) {
  arr.push(nodeData.id);

  nodeElement.style('border-color', 'tomato');

  console.log(`${arr[0]}, ${arr[1]}`);

  if (arr.length >= 2) {
    console.log("MAKE RELATIONSHIP!");
    quickAdd.classList.add('open');

    const leftPerson = personRepository.getPerson(pair[0]);
    const rightPerson = personRepository.getPerson(pair[1]);

    if (!leftPerson || !rightPerson) return;

    document.getElementById('quickAddText')!.innerHTML = `
      <p>
        ${leftPerson.firstName} ${leftPerson.lastName} is the
        <select id="typeSelector" style="margin: 0 5px;">
          <option value="parent" selected>Parent</option>
          <option value="child">Child</option>
          <option value="partner">Partner</option>
        </select>
        of ${rightPerson.firstName} ${rightPerson.lastName}
      </p>
    `
  }
}

quickAddBtn.onclick = function () {
  let dropDown = document.querySelector<HTMLSelectElement>('#typeSelector')!;
  let type = dropDown.options[dropDown.selectedIndex].value;

  quickAdd.classList.remove('open');

  addRelationFromDropdown(pair[0], pair[1], type);

  graphRenderer.getNodes().style('border-color', 'lightgrey');
  toggleRelationshipsBtn.classList.remove('toggled');
  pair = [];
  toggleRelationship = false;
};


document.getElementById('cancelAddBtn')!.onclick = function () {
  toggleRelationshipsBtn.classList.remove('toggled');
  quickAdd.classList.remove('open');

  graphRenderer.getNodes().style('border-color', 'lightgrey');
  toggleRelationship = false;
  pair = [];
};
