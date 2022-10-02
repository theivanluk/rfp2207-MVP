export class Controls {
  constructor (controlType) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.afterburner = false;
    this.brake = false;

    switch(controlType) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "BOT":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch(event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.afterburner = true;
          break;
        case " ":
          this.brake = true;
          break;
      }
      // console.table(this);
    }

    document.onkeyup = (event) => {
      switch(event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.afterburner = false;
          break;
        case " ":
          this.brake = false;
      }
      // console.table(this);
    }
  }
}