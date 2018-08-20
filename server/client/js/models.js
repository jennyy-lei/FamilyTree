'use strict';

// Person object
export class Person {
  constructor(fname, lname, dateOfBirth, relationships = []) {
    this.firstName = fname;
    this.lastName = lname;
    this.dateOfBirth = dateOfBirth;
    this.relationships = relationships;
  }
}

// Stores relationships + pairs name
export class Relationship {
  constructor(kind, children, metadata = {}) {
    this.kind = kind;
    this.children = children;
    this.metadata = metadata;
  }
}
