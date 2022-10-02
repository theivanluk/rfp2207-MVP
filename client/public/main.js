const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const carContext = carCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width * 0.9, 4);
// const car = new Car(road.getlaneCenter(1),100,25,50, "AI");
const N = 1000;
const cars = generateCars(N)
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i =0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(
      localStorage.getItem("bestBrain")
    );
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
  }
}

const terrain = [
  new Car(road.getlaneCenter(2), 100, 25, 50, "BOT", 4),
  new Car(road.getlaneCenter(1), -100, 25, 50, "BOT", 3),
  new Car(road.getlaneCenter(2), -200, 25, 50, "BOT", 2),
  new Car(road.getlaneCenter(3), -350, 25, 50, "BOT", 3),
  new Car(road.getlaneCenter(0), -400, 25, 50, "BOT", 3),
  new Car(road.getlaneCenter(3), -600, 25, 50, "BOT", 2),
  new Car(road.getlaneCenter(0), -700, 25, 50, "BOT", 3),
  new Car(road.getlaneCenter(1), -900, 25, 50, "BOT", 3),
]

let stop;

animate();

function save () {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard () {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = []
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getlaneCenter(0),100,25,50, "AI"))
  }
  return cars
}

function animate() {
  for (let i = 0; i < terrain.length; i++) {
    terrain[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, terrain);
  }

  bestCar = cars.find(car =>
    car.y === Math.min(...cars.map(car =>
      car.y
    ))
  )

  // car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;

  carContext.save();
  carContext.translate(0, -bestCar.y + carCanvas.height * 0.8);

  road.draw(carContext);
  for (let i = 0; i < terrain.length; i++) {
    terrain[i].draw(carContext);
  }

  carContext.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carContext);
  }


  carContext.globalAlpha = 1;
  bestCar.draw(carContext, true)
  // console.log(bestCar.brain)

  // car.draw(context);

  carContext.restore();

  stop = requestAnimationFrame(animate);
}