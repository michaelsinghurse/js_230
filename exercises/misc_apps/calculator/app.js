let Calculator = {
  bindEvents() {
    $("#keypad").on("click", "button", this.handleKeyPadClick.bind(this));
  },
  
  calculateResult() {
    this.operation += " " + this.entry;
    
    let operationArray = this.operation.split(" ").map(token => {
      if (/\d/.test(token)) {
        return Number(token);
      } else {
        return token;
      }
    });
    
    return operationArray.reduce((result, token, index, array) => {
      switch (token) {
        case "+":
          result += array[index + 1];  
          break;
        case "-":
          result -= array[index + 1]; 
          break;
        case "*":
          result *= array[index + 1]; 
          break;
        case "/":
          result /= array[index + 1]; 
          break;
        case "%":
          result = result % array[index + 1];
          break;
      }

      return result;
    });
  },

  decimalKeyPress() {
    console.log(this.awaitingNewNumber);
    if (this.awaitingNewNumber) {
      this.entry = "0.";
      this.awaitingNewNumber = false;
    } else if (!this.entry.includes(".")) {
      this.entry += ".";
    }

    this.renderDisplay();
  },

  handleKeyPadClick(event) {
    let key = $(event.target).text();
    if (/\d/.test(key)) {
      this.numberKeyPress(key);
    } else if (key === ".") {
      this.decimalKeyPress();
    } else {
      this.operationKeyPress(key); 
    }
  },

  init() {
    this.awaitingNewNumber = true;
    this.operation = "";
    this.entry = "0";
    this.result = null;

    this.bindEvents();
    this.renderDisplay();
  },
  
  numberKeyPress(key) {
    if (this.awaitingNewNumber) {
      this.entry = key;
    } else { 
      this.entry += key;
    }
    
    this.awaitingNewNumber = false;
    this.renderDisplay();
  },

  operationKeyPress(key) {
    switch(key) {
      case "C":
        this.operation = "";
        this.entry = "0";
        this.awaitingNewNumber = true;
        break;
      case "CE":
        this.entry = "0";
        this.awaitingNewNumber = true;
        break;
      case "NEG":
        this.entry = String(-1 * Number(this.entry));
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
        if (this.operation) {
          this.operation = `${this.operation} ${this.entry} ${key}`;
        } else {
          this.operation = `${this.entry} ${key}`;
        }
        this.awaitingNewNumber = true;
        break;
      case "=":
        let result = this.calculateResult();
        this.operation = "";
        this.entry = String(result);
        this.awaitingNewNumber = true;
        break;
    }
    
    this.renderDisplay();
  },

  renderDisplay() {
    const MAX_LENGTH = 15;
    $("#operation").text(this.operation);
    $("#entry").text(this.entry.slice(0, MAX_LENGTH));
  },
};

$(Calculator.init.bind(Calculator));
