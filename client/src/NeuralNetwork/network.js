import * as utils from './utils.js';

export class NeuralNetwork {
  constructor (neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(
        neuronCounts[i], neuronCounts[i + 1]
      ))
    }
  }

  static feedForward (givenInputs, network) {
    let outputs = Level.feedForward(
      givenInputs, network.levels[0]
    );
    for (let i = 0; i < network.levels.length; i++) {
      outputs = Level.feedForward(
        outputs, network.levels[i]
      );
    }
    return outputs;
  }

  static mutate (network, amount = 1) {
    network.levels.forEach(level => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = utils.lerp(
          level.biases[i],
          Math.random() * 2 - 1,
          amount
        )
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = utils.lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          )
        }
      }
    })
    return network;
  }
}

class Level {
  constructor (inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];

    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize (level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      //Sigmoid

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }

    }
    return level.outputs
  }
}

function Sigmoid (sum, bias) {
  return 1 / (1 + Math.exp(-(sum + bias)));
}

function Tanh (sum, bias) {
  return 2 * sigmoid(2 * (sum + bias)) - 1;
}

function ReLu (sum, bias) {
  return (sum + bias) < 0 ? 0 : sum + bias;
}

function LeakyReLu (sum, bias) {
  return (sum + bias) < 0 ? (sum + bias) * 0.01 : (sum + bias);
}

function BinaryStep (sum, bias) {
  return (sum, bias) < 0 ? 0 : 1;
}

function Swish (sum, bias) {
  const x = sum + bias;
  return x * Sigmoid(x);
}

function ExponentialLinearUnit(sum, bias) {
  const x = sum + bias;
  return x >= 0 ? x : (Math.exp(x - 1));
}

function Linear (sum, bias) {
  return (sum + bias);
}