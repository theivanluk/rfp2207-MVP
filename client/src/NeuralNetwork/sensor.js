import * as utils from './utils.js';

export class Sensor {
  constructor (car) {
    this.car = car;
    this.rayCount = 13;
    this.rayLength = 300;
    this.raySpread = 2 * Math.PI;

    this.rays = [];
    this.readings = [];
  }

  update (roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        this.#getReading(this.rays[i], roadBorders, traffic)
      );
    };
  }

  #getReading(ray, roadBorders, traffic){
    let touches=[];

    for(let i=0;i<roadBorders.length;i++){
        const touch=utils.getIntersection(
            ray[0],
            ray[1],
            roadBorders[i][0],
            roadBorders[i][1]
        );
        if(touch){
            touches.push(touch);
        }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = utils.getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1)%poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if(touches.length==0){
        return null;
    }else{
        const offsets=touches.map(e=>e.offset);
        const minOffset=Math.min(...offsets);
        return touches.find(e=>e.offset==minOffset);
    }
}

  #castRays () {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = utils.lerp (
        this.raySpread/2,
        -this.raySpread/2,
        i/(this.rayCount - 1)
      ) + this.car.angle;

      const factor = (i) => -0.02380952381 * (i ** 2) + i * 0.3095238095 + 1
      const start = {x: this.car.x, y: this.car.y};
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength * factor(i),
        y: this.car.y - Math.cos(rayAngle) * this.rayLength * factor(i)
      };
      this.rays.push([start, end])
    }
  }

  draw(context){
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
          end = this.readings[i];
      }

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "yellow";
      context.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y
      );
      context.lineTo(
        end.x,
        end.y
      );
      context.stroke();

      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = "blue";
      context.moveTo(
        end.x,
        end.y

      );
      context.lineTo(
        this.rays[i][1].x,
        this.rays[i][1].y
      );
      context.stroke();
    }
}
}