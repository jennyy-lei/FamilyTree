import {
  ObservableMap,
  ObservableList,
  ObservableListener
} from './collections.js';
import {Person, Relationship} from "./models.js";

// Stores all people and relationships between those people within in the
// application. Provides convenience methods for managing relationships and
// doing lookups.
export class PersonRepository {
  private _people: ObservableMap<number, Person>;
  private relationships: ObservableList<Relationship>;

  constructor() {
    this._people = new ObservableMap();
    this.relationships = new ObservableList();
  }

  addPerson(person: Person) {
    if (this._people.has(person.id)) {
      console.log(`Could not add person, ID ${person.id} already exists`);
      return false;
    }

    this._people.set(person.id, person);
    return true;
  }

  addRelationship(relationship: Relationship) {
    if (!this._people.has(relationship.leftId)
        || !this._people.has(relationship.rightId)) {
      console.log(
          'Could not add relationship, left or right person ID does not exist');
      return false;
    }

    this.relationships.add(relationship);
    return true;
  }

  get people(): Iterable<Person> {
    return this._people.values;
  }

  getPeopleId(): Iterable<number> {
    return this._people.keys;
  }

  getPerson(id: number): Person | undefined {
    return this._people.get(id);
  }

  addPeopleChangeListener(listener: ObservableListener<Person>) {
    this._people.addListener(listener);
  }

  addRelationshipsChangeListener(listener: ObservableListener<Relationship>) {
    this.relationships.addListener(listener);
  }

  // Add convenience methods here:
  getChildrenOf(personId: number): Iterable<Person> {
    return [];
  }

  getParentsOf(personId: number): Iterable<Person> {
    return [];
  }

  getSiblingsOf(personId: number): Iterable<Person> {
    return [];
  }
}
