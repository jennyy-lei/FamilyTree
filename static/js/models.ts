// Person object
export class Person {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: number;
  private readonly _relationships: Map<number, Relationship>;

  constructor(
      fname: string, lname: string, dateOfBirth: number,
      {relationships = new Map(), id}:
          {relationships?: Map<number, Relationship>, id?: number} = {}) {

    this.firstName = fname;
    this.lastName = lname;
    this.dateOfBirth = dateOfBirth;
    this._relationships = relationships;
    // If no ID is supplied, assign a unique ID to the person, so it can be
    // easily referenced.
    this.id = id || personIdGenerator.next().value;
  }

  addRelationToPerson(
      {rightId, kind, metadata}:
          {rightId: number, kind: RelationshipType, metadata?: Map<any, any>}): Relationship {
    return this.addRelationship(
        new Relationship(
            kind, {leftId: this.id, rightId: rightId, metadata: metadata}));
  }

  addRelationship(relationship: Relationship): Relationship {
    this._relationships.set(relationship.rightId, relationship);
    return relationship;
  }

  get relationships() : Iterator<Relationship> {
    return this._relationships.values();
  }
}

// Most fundamental types of relationships. All other relationships can be
// derived from the type, sex, and transitive relationships. E.g. siblings can
// be derived by checking if 2 people share the same parent.
export enum RelationshipType {
  // Person 1 (left) is the child of person 2 (right).
  child,
  // Partners can be qualified with further metadata. For example, the start
  // of the partnership, the status of the partnership (e.g. divorced, married,
  // engaged, etc).
  partner
}

// Stores relationships + pairs name
export class Relationship {
  readonly kind: RelationshipType;
  readonly leftId: number;
  readonly rightId: number;
  readonly metadata: Map<any, any>;
  readonly id: number;

  constructor(
      kind: RelationshipType,
      {leftId, rightId, metadata = new Map(), id}:
          {leftId: number, rightId: number, metadata?: Map<any, any>, id?: number}) {
    this.kind = kind;
    this.leftId = leftId;
    this.rightId = rightId;
    this.metadata = metadata || new Map();
    // If no ID is supplied, assign a unique ID to the relationship, so it can
    // be easily referenced.
    this.id = id || relationshipIdGenerator.next().value;
  }
}

// Creates an incrementally decreasing ID starting at startIndex for each
// successive call of the generator.
function * idGenerator(startIndex: number): Iterator<number> {
  while (true) yield startIndex--;
}

const relationshipIdGenerator = idGenerator(-1);
const personIdGenerator = idGenerator(-1);
