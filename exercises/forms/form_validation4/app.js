let form = {
  addInputErrorDisplay(input) {
    let $span = $(input).nextAll("span");

    if (input.validity.patternMismatch) {
      $span.text(this.errorMessages[input.name]); 
    } else if (input.validity.valueMissing) {
      $span.text("Value is required.");
    } else {
      $span.text(input.validationMessage); 
    }

    input.classList.add("error");
  },

  bindEvents() {
    this.$inputs.on("focus", this.handleInputFocus.bind(this));
    this.$inputs.on("blur", this.handleInputBlur.bind(this));
    this.$form.on(
      "keypress", 
      "[name='credit_card']",
      this.handleCreditCardKeypress.bind(this));
    this.$form.on(
      "keyup",
      "[name='credit_card']",
      this.tabForward.bind(this));
    this.$form.on(
      "keypress",
      "[name$='name']",
      this.handleNameKeypress.bind(this));
    this.$form.on("submit", this.handleFormSubmit.bind(this));
  },
  
  getErrorMessages() {
    return {
      first_name: "Name can contain only letters, spaces, and apostrophes.",
      last_name: "Name can contain only letters, spaces, and apostrophes.",
      phone: "Phone must be in format 999-999-9999.",
      email: "Email must be in form name@domain.",
      password: "Password must contain at least 10 characters.",
      credit_card: "Credit card must contain 4 4-digit numbers.",
    };
  },

  handleCreditCardKeypress(event) {
    if (!/\d/.test(event.key)) {
      event.preventDefault();
    } 
  },

  handleFormSubmit(event) {
    event.preventDefault();
    let areAllInputsValid = true;

    this.$inputs.each((_, input) => {
      if(this.isInputValid(input)) {
        this.removeInputErrorDisplay(input);
      } else {
        this.addInputErrorDisplay(input);
        areAllInputsValid = false;
      }
    });
    
    if (areAllInputsValid) {
      this.toggleFormErrorMessage(false); 
      this.sendDataToServer(this.$form.serializeArray());
      //this.$form.get(0).reset();
    } else {
      this.toggleFormErrorMessage(true);
    }
  },

  handleInputFocus(event) {
    this.removeInputErrorDisplay(event.target); 
  },

  handleInputBlur(event) {
    let input = event.target;

    if (!this.isInputValid(input)) {
      this.addInputErrorDisplay(input);
    }
  },

  handleNameKeypress(event) {
    if (!/[A-Za-z'\s]/.test(event.key)) {
     event.preventDefault();
    }
  },

  init() {
    this.$form = $("form");
    this.$inputs = $("input[type!='submit']");
    this.errorMessages = this.getErrorMessages();
    this.bindEvents();
  },
  
  isInputValid(input) {
    return input.validity.valid;
  },

  removeInputErrorDisplay(input) {
    input.classList.remove("error");
    $(input).nextAll("span").text("");
  },
  
  sendDataToServer(serializedArr) {
    let data = {};
   
    // combine inputs that share the same name, e.g. credit_card
    serializedArr.forEach(obj => {
      data[obj.name] = data[obj.name] || "";
      data[obj.name] += obj.value;
    });

    let encodedStrings = Object.entries(data).map(pair => {
      return `${encodeURIComponent(pair[0])}=${encodeURIComponent(pair[1])}`;
    });

    $("#form_data").text(encodedStrings.join("&"));
  },

  tabForward(event) {
    if (event.key === "Shift" || event.key === "Tab") return; 

    let $input = $(event.target);
    let val = $input.val();
    let max = $input.attr("maxlength");
    let index = $input.index();

    if (val.length === +max && index < $input.siblings("input").length) {
      $input.nextAll("input").get(0).focus();
    }
  },

  toggleFormErrorMessage(display) {
    let $errorMsg = $("p.error");
    
    if (display && $errorMsg.length === 0) {
      let p = document.createElement("p");
      p.textContent = "Please correct errors before submitting form.";
      p.classList.add("error");
      $("main").prepend(p); 
    } else if (!display && $errorMsg.length === 1) {
      $errorMsg.remove();
    }
  },
};

$(form.init.bind(form));


