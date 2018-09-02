'use strict';

// Person object
export class Person {
  constructor(
      fname, lname, dateOfBirth,
      {relationships = new Map(), id} = {}) {

    this.firstName = fname;
    this.lastName = lname;
    this.dateOfBirth = dateOfBirth;
    this._relationships = relationships;
    // If no ID is supplied, assign a unique ID to the person, so it
    // can be easily referenced.
    this.id = id || personIdGenerator.next().value;
  }

  addRelationship(relationship) {
    relationship.leftId = this.id;
    this._relationships[relationship.rightId] = relationship;
    return relationship;
  }

  get relationships() { return this._relationships.values(); }
}

// Stores relationships + pairs name
export class Relationship {
  constructor(
      kind, rightId,
      {leftId, metadata = new Map(), id} = {}) {
    this.kind = kind;
    this.leftId = leftId;
    this.rightId = rightId;
    this.metadata = metadata;
    // If no ID is supplied, assign a unique ID to the relationship,
    // so it can be easily referenced.
    this.id = id || relationshipIdGenerator.next().value;
  }
}

// Creates an incrementally decreasing ID starting at startIndex for
// each successive call of the generator.
function * idGenerator(startIndex) {
  while (true) yield startIndex--;
}

let relationshipIdGenerator = idGenerator(-1);
let personIdGenerator = idGenerator(-1);
