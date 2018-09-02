'use strict';

// Stores all people and relationships between those people within
// in the application. Provides convenience methods for managing
// relationships and doing lookups.
export class PersonRepository {
  constructor() {
    this._people = new Map();
    this.relationships = [];
  }

  addPerson(person) {
    if (this._people.has(person.id)) {
      console.log(
          `Could not add person, ID ${person.id} already exists`);
      return false;
    }

    this._people[person.id] = person;
    return true;
  }

  addRelationship(relationship) {
    if (!this._people.has(relationship.leftId)
        || !this._people.has(relationship.rightId)) {
      console.log(
          'Could not add relationship, left or right person ' +
              'ID does not exist');
      return false;
    }

    this.relationships.push(relationship);
    return true;
  }

  get people() { return this._people.values(); }

  getPerson(id) { return this._people[id]; }

  // Add convenience methods here:
  getChildrenOf(personId) { return null; }
  getParentsOf(personId) { return null; }
  getSiblingsOf(personId) { return null; }
}
