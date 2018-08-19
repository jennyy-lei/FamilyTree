'use strict';

// Person object
export class Person {
  constructor(fname, lname, born) {
    this.fname = fname;
    this.lname = lname;
    this.born = born;
    this.relationships = [];
  }
}

// Stores relationships + pairs name
export class Relationship {
  constructor(kind, pair) {
    this.kind = type;
    this.pair = pair
  }
}
