'use strict';

// Class for managing the relationship graph renderer. Currently wraps around
// the Cytoscape library.
export class GraphRenderer {
  constructor(rootElement, peopleRepository) {
    this.peopleRepository = peopleRepository;
    this.rootElement = rootElement;

    this.setUpCytoscape();
  }

  setUpCytoscape() {
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
            'shape': 'roundrectangle',
            'width': '50px',
            'height': '25px',
            'border-width': '1px',
            'border-style': 'solid',
            'border-color': 'lightgrey',
            'font-family': 'Lato',
            'font-weight': '300',
            'font-size': '20',
            'padding': '15'
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
    });
  }

  onNodeClick(callback) {
    this.cy.on('click', 'node', callback);
  }

  // Creates person card
  createCard(person) {
    this.cy.add([
      {
        data: {
          id: person.id,
          name: `${person.firstName} ${person.lastName}`
        },
        position: { x: 500, y: 200}
      }
    ]);
  }
}
