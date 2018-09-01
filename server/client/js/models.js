'use strict';

// Person object
export class Person {
  constructor(fname, lname, dateOfBirth, {relationships = [], id}) {
    this.firstName = fname;
    this.lastName = lname;
    this.dateOfBirth = dateOfBirth;
    this.relationships = relationships;
    // If no ID is supplied, assign a unique ID to the person, so it
    // can be easily referenced.
    this.id = id || personIdGenerator.next().value;
  }

  addRelationship(relationship) {
    this.relationships.push(relationship);
  }
}

// Stores relationships + pairs name
export class Relationship {
  constructor(kind, leftId, rightId, {metadata = {}, id}) {
    this.kind = kind;
    this.children = children;
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

let relationshipIdGenerator = idGenerator(0);
let personIdGenerator = idGenerator(0);
