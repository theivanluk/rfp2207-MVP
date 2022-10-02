import React, { useEffect, useState } from 'react';
import { main } from './NeuralNetwork/main.js';



function App() {

  const [reload, setReload] = useState(true);
  const [brain, setBrain] = useState();
  const [save, setSave] = useState(false);
  const [activationFn, setActivationFn] = useState("BinaryStep");
  const [change, setChange] = useState(0)

  function handleReload () {
    setReload(!reload);
  }

  function getCurrentBrain() {
    console.log(brain)
  }

  let test = {x: 0};

  useEffect(() => {
    main(1000, setBrain, save, setSave, change, setBrain)
    .then((res) => console.log(res))
    .catch(err => console.log(err));
  }, [reload, save])

  function handleSaveBrain () {
    setSave(!save);
  }

  function handleChange(e) {
    switch (e.target.name) {
      case "activationFn":
        setActivationFn(e.target.value)
        break;
      case "change":
        setChange(e.target.value)
        console.log(change);
        break;
    }
  }

  function handleDeleteBest () {

  }

  return (
    <div className="App">
      <div className="interactive">
        <button onClick = {handleReload}>Reload</button>
        <button onClick = {getCurrentBrain}>See Brain</button>
        <button onClick = {handleSaveBrain}>Save Best Brain {String(save)}</button>
        <label htmlFor="activationFn">Acitvation Function:</label>
        <select name="activationFn" onChange={handleChange}>
          <option default name="BinaryStep">BinaryStep</option>
          <option name="Sigmoid">Sigmoid</option>
          <option name="Tanh">Tanh</option>
          <option name="ReLu">ReLu</option>
          <option name="LeakyReLu">LeakyReLu</option>
          <option name="Swish">Swish</option>
          <option name="ExponentialLinearUnit">Exponential Linear Unit</option>
          <option name="Linear">Linear</option>
        </select>
        <label htmlFor="change">Change</label>
        <input value={change} type="range" name="change" min="0" max="1" step="0.01" onChange={handleChange}/>
      </div>
      <div className="view" >
        <canvas id="carCanvas"></canvas>
      </div>
    </div>
  );
}

export default App;
