import { Sensor } from './sensor.js';
import { NeuralNetwork } from './network.js';
import { Controls } from './controls.js';
import * as utils from './utils.js';
import jet from './../../assets/images/f-22.png'
import rock from './../../assets/images/boulder.png'

export class EntityRock {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.angle = 0;

    this.texture = new Image();
    this.texture.src = rock;
  }

  update(roadBorders, traffic) {
    this.polygon = this.#createPolygon();
  }


  #createPolygon () {
    const points = [];

    const radius = this.width/2;
    const angle = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - angle) * radius,
      y: this.y - Math.cos(this.angle - angle) * radius,
    }, {
      x: this.x - Math.sin(this.angle ) * radius,
      y: this.y - Math.cos(this.angle ) * radius,
    }, {
      x: this.x - Math.sin(this.angle + angle) * radius,
      y: this.y - Math.cos(this.angle + angle) * radius,
    }, {
      x: this.x - Math.sin(this.angle + angle*2.15) * radius,
      y: this.y - Math.cos(this.angle + angle*2.15) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle - angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - angle) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle + angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + angle) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle + angle*2.15) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + angle*2.15) * radius,
    })

    return points;
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      context.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    context.translate(this.x, this.y);
    context.drawImage(this.texture, -this.width, -this.height/2, this.width*2, this.height);
    context.restore();

  }
}