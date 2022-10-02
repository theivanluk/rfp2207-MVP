import { Sensor } from './sensor.js';
import { NeuralNetwork } from './network.js';
import { Controls } from './controls.js';
import * as utils from './utils.js';
import jet from './../../assets/images/f-22.png'
import rock from './../../assets/images/boulder.png'

export class Entity {
  constructor (x, y, width, height, controlType, cruiseSpeed = 4) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.5;
    this.cruiseSpeed = cruiseSpeed;
    this.afterburner = 1.75 * cruiseSpeed;
    this.maxSpeed = cruiseSpeed;
    this.friction = 0.005;
    this.angle = 0;
    this.damaged = false;

    this.controlType = controlType;
    this.useBrain = controlType === "AI";

    this.texture = new Image();

    this.sensor = new Sensor(this);
    this.brain = new NeuralNetwork(
      [this.sensor.rayCount, 20, 20, 5]
    )
    this.texture.src = jet

    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    // if(this.damaged) { this.speed !== 0 ? this.speed = -this.speed : null}
    if (!this.damaged) {
      this.#move();

      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(s =>
        s === null ? 0 : 1 - s.offset
      )
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.afterburner = outputs[3];
        this.controls.brake = outputs[4];
      }
    }
  }

  #assessDamage (roadBorders, traffic) {
    for (let i =0; i < roadBorders.length; i++) {
      if (utils.polysIntersection(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i =0; i < traffic.length; i++) {
      if (utils.polysIntersection(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon () {
    const points = [];
    const radius = Math.hypot(this.width, this.height)/2;
    const angle = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - angle) * radius,
      y: this.y - Math.cos(this.angle - angle) * radius,
    }, {
      x: this.x - Math.sin(this.angle + angle) * radius,
      y: this.y - Math.cos(this.angle + angle) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle - angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - angle) * radius,
    }, {
      x: this.x - Math.sin(Math.PI + this.angle + angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + angle) * radius,
    })

    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration
    }

    if(this.controls.afterburner) {
      this.maxSpeed = this.afterburner;
    } else {
      this.maxSpeed = this.cruiseSpeed;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.cruiseSpeed/2) {
      this.speed = -this.cruiseSpeed/2
    }

    this.speed > 0 ? this.speed -= this.friction :
    this.speed < 0 ? this.speed += this.friction : null;

    this.speed > 0 && this.controls.brake ? this.speed -= 5 * this.friction :
    this.speed < 0 && this.controls.brake ? this.speed += 5 * this.friction : null;

    Math.abs(this.speed) < this.friction ? this.speed = 0 : null

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.05 * flip;
      }

      if (this.controls.right) {
        this.angle -= 0.05 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(context, drawSensor = false) {
    context.save();

    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.drawImage(this.texture, -this.width/2, -this.height/2, this.width, this.height);

    context.fill();
    context.restore();

    if (this.sensor && drawSensor) {
      this.sensor.draw(context);
    }
  }
}