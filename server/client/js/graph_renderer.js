'use strict';

// Class for managing the relationship graph renderer. Currently wraps around
// the Cytoscape library.
export class GraphRenderer {
  constructor(rootElement, peopleRepository) {
    this.peopleRepository = peopleRepository;
    this.rootElement = rootElement;

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
            'shape': 'cutrectangle', // barrel, cutrectangle, roundrectangle, rectangle
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
  }

  onNodeClick(callback) {
    this.cy.on('click', 'node', callback);
  }

  getNodes() { return this.cy.nodes() }

  // Creates person card.
  _createCard(person) {
    this.cy.add([
      {
        data: {
          id: person.id,
          name: `${person.firstName} ${person.lastName}`
        },
        // position: { x: 500, y: 200}
      }
    ]);
  }

  _removeCard(person) {
    this.cy.remove(`#${person.id}`);
  }
}
