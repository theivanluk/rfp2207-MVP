import { Road } from './road.js';
import { Entity } from './Entity.js';
import { NeuralNetwork } from './network.js'
import { generateTerrain } from './generateTerrain.js';

import axios from 'axios';

export async function main (width, callback, saveState, setSaveState, mutate, setBrain) {

  let stopCounter = 0;
  let positionTracker = 0;
  let save = saveState;
  let stop;

  const laneCount = 11;
  const N = 50;

  const planeCanvas = document.getElementById("carCanvas");
  const planeContext = planeCanvas.getContext("2d");
  planeCanvas.width = width;

  const road = new Road(planeCanvas.width/2, planeCanvas.width/2, laneCount);

  const planes = generatePlanes(N)
  let bestIteration = planes[0];

  if (localStorage.getItem("bestBrain")) {
    for (let i =0; i < planes.length; i++) {
      planes[i].brain = JSON.parse(
        localStorage.getItem("bestBrain")
      );
      if (i !== 0) {
        NeuralNetwork.mutate(planes[i].brain, mutate);
      }
    }
  }

  const terrain = generateTerrain(-20000, road, laneCount)

  animate();

  function generatePlanes(N) {
    const planes = []
    for (let i = 0; i < N; i++) {
      planes.push(new Entity(road.getlaneCenter(5),100,43,50, "AI", 10))
    }
    return planes
  }

  function animate() {

    planeContext.save();


    for (let i = 0; i < terrain.length; i++) {
      terrain[i].update(road.borders);
    }

    for (let i = 0; i < planes.length; i++) {
      planes[i].update(road.borders, terrain);
    }

    bestIteration = planes.find(plane =>
      plane.y === Math.min(...planes.map(plane =>
        plane.y
      ))
    )

    planeCanvas.height = window.innerHeight;

    planeContext.translate(0, -bestIteration.y + planeCanvas.height * 0.8);


    if (save === true) {
      console.log(bestIteration.brain, 'Best Brain');
      localStorage.setItem("bestBrain", JSON.stringify(bestIteration.brain));
      setBrain(bestIteration.brain);
      save = false;
      cancelAnimationFrame(stop);
      setSaveState(false);
    }

    if (Math.abs(positionTracker - bestIteration.y) < 50) {
      stopCounter += 1;
      // console.log(stopCounter);
    } else {
      stopCounter = 0;
      positionTracker = bestIteration.y
    }

    if (stopCounter === 150 || bestIteration.y < -45000) {
      cancelAnimationFrame(stop);
      localStorage.setItem("bestBrain", JSON.stringify(bestIteration.brain));
      console.log(bestIteration.brain)
      callback(bestIteration.brain);
      return bestIteration.brain
    }

    road.draw(planeContext);


    planeContext.globalAlpha = 0.2;

    for (let i = 0; i < planes.length; i++) {
      planes[i].draw(planeContext);
    }

    planeContext.globalAlpha = 1;
    bestIteration.draw(planeContext)

    for (let i = 0; i < terrain.length; i++) {
      terrain[i].draw(planeContext);
    }

    stop = requestAnimationFrame(animate);

    planeContext.restore();
  }
}