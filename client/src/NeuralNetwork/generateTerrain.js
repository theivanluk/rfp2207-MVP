import { Entity } from './Entity.js';
import { EntityRock } from './EntityRock.js';
import { Road } from './road.js';

export function generateTerrain (courseLength, road, laneCount) {
  const course = []
  const incrementHeight = 250;
  const space = 2.5
  let j = 0;

  const randomizer = getRandomIntInclusive(2, 9);
  const randomizer2 = getRandomIntInclusive(2, 6);
  const randomizer3 = getRandomIntInclusive(15,20);

  for (let i = 0; i > courseLength; i-= incrementHeight) {

    let center = Math.floor(laneCount/2) + 1.25*Math.sin(i/50);
    let leftSpace = road.getlaneCenter(0);
    let rightSpace = road.getlaneCenter(10);

    let side = j % 2 === 0  ||  j % randomizer === 0? leftSpace :
    side = j % 2 === 1  ||  j % randomizer2 === 0? rightSpace : null;

    const width = 550 - 300 * Math.random()
    const height = 550 - 150 * Math.random()

    if(j % randomizer3 !== 0) {
      course.push(
        new EntityRock(side, i * 2, width, height),
      )
    }

    j++
  }
  return course;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
