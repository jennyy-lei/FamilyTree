'use strict';

function nodeId(id) { return `node:${id}` }
function edgeId(id1, id2) { return `edge:${id1}-${id2}` }

// Class for managing the relationship graph renderer. Currently wraps around
// the Cytoscape library.
export class GraphRenderer {
  constructor(rootElement, peopleRepository) {
    this.peopleRepository = peopleRepository;
    this.rootElement = rootElement;

    // Cache of string node-id to nodes, allows us to do reverse lookups given
    // a formatted node ID.
    this._cachedNodes = new Map();

    this._setUpCytoscape();
    this._setUpListeners();
  }

  _setUpCytoscape() {
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

  _setUpListeners() {
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

  onNodeClick(callback) {
    const _this = this;

    this.cy.on('click', 'node', function () {
      callback(_this._cachedNodes.get(this.id()), this);
    });
  }

  getNodes() { return this.cy.nodes() }

  // Creates person card.
  _createCard(person) {
    const id = nodeId(person.id);

    this._cachedNodes.set(id, person);

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

  _removeCard(person) {
    const id = nodeId(person.id);

    this._cachedNodes.delete(id);

    this.cy.remove(`#${id}`);
  }

  // Links 2 person cards together for a relationship.
  _createRelationship(p1Id, p2Id) {
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
