'use strict';

export class GraphRenderer {
  constructor(canvas, people) {
    let _this = this;
    this._canvas = canvas;
    this._people = people;

    window.addEventListener('resize', function () {
      _this.updateCanvasSize();
    });
    this.updateCanvasSize();
  }

  updateCanvasSize() {
    this._canvas.width = this._canvas.offsetWidth;
    this._canvas.height = this._canvas.offsetHeight;
    this.redraw();
  }

  redraw() {
    let ctx = this._canvas.getContext('2d');

    if (this._people.length == 0) return;

    for (let person of this._people) {

    }
  }
}
