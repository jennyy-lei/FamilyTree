import {PersonRepository} from "./person_repository.js";
import {Person} from "./models.js";
import {NodeCollection} from "cytoscape";

/// <reference path="../../node_modules/@types/cytoscape/index.d.ts" />

function nodeId(id: number) {
  return `node:${id}`
}

function edgeId(id1: number, id2: number) {
  return `edge:${id1}-${id2}`
}

// Class for managing the relationship graph renderer. Currently wraps around
// the Cytoscape library.
export class GraphRenderer {
  private readonly peopleRepository: PersonRepository;
  private readonly rootElement: HTMLElement;
  private _cachedNodes: Map<string, Person>;
  private cy!: cytoscape.Core;

  constructor(rootElement: HTMLElement, peopleRepository: PersonRepository) {
    this.peopleRepository = peopleRepository;
    this.rootElement = rootElement;

    // Cache of string node-id to nodes, allows us to do reverse lookups given
    // a formatted node ID.
    this._cachedNodes = new Map();

    this._setUpCytoscape();
    this._setUpListeners();
  }

  _setUpCytoscape(): void {
    // @ts-ignore
    this.cy = cytoscape({
      container: this.rootElement,

      elements: [],

      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(name)',
            'background-color': 'white',
            'text-halign': 'center',
            'text-valign': 'center',
            // barrel, cutrectangle, roundrectangle, rectangle
            'shape': 'cutrectangle',
            'width': 'label',
            'height': 'label',
            'border-width': '1px',
            'border-style': 'solid',
            'border-color': 'lightgrey',
            'font-family': 'Lato',
            'font-weight': '300',
            'font-size': '20',
            'padding': '15px'
          }
        }, {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      zoomingEnabled: false,
    });
  }

  _setUpListeners(): void {
    const _this = this;

    this.peopleRepository.addPeopleChangeListener(function (event) {
      // Add any new people as cards to the graph.
      event.added.forEach(_this._createCard.bind(_this));

      // Remove any removed people cards from the graph.
      event.removed.forEach(_this._removeCard.bind(_this));

      // Relayout.
      _this.cy
          .layout({
            name: 'circle'
          })
          .run();
    });

    this.peopleRepository.addRelationshipsChangeListener(function (event) {
      for (let added of event.added) {
        _this._createRelationship(added.leftId, added.rightId);
      }

      for (let removed of event.removed) {

      }
    });
  }

  onNodeClick(callback: (node: Person | undefined, y: any) => void): void {
    const _this = this;

    this.cy.on('click', 'node', function () {
      // @ts-ignore
      callback(_this._cachedNodes.get(this.id()), this);
    });
  }

  getNodes(): NodeCollection {
    return this.cy.nodes()
  }

  // Creates person card.
  _createCard(person: Person): void {
    const id = nodeId(person.id);

    this._cachedNodes.set(id, person);

    // @ts-ignore
    this.cy.add([
      {
        data: {
          id: id,
          name: `${person.firstName} ${person.lastName}`
        },
        // position: { x: 500, y: 200}
      }
    ]);
  }

  _removeCard(person: Person): void {
    const id = nodeId(person.id);

    this._cachedNodes.delete(id);

    this.cy.remove(`#${id}`);
  }

  // Links 2 person cards together for a relationship.
  _createRelationship(p1Id: number, p2Id: number): void {
    this.cy.add([
      {
        data: {
          id: edgeId(p1Id, p2Id),
          source: nodeId(p1Id),
          target: nodeId(p2Id)
        }
      }
    ]);
  }
}
